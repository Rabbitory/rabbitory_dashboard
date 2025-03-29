import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
import { pollRabbitMQServerStatus } from "@/utils/RabbitMQ/serverStatus";
import createInstance from "@/utils/AWS/EC2/createBrokerInstance";
import { getEC2Regions } from "@/utils/AWS/EC2/getEC2Regions";


export const GET = async () => {
  const regions = await getEC2Regions();
  if (!regions) {
    return new NextResponse("Failed to fetch regions", { status: 500 });
  }

  const allInstances = [];

  for (const region of regions) {
    const ec2Client = new EC2Client({ region });

    const params = {
      Filters: [
        {
          Name: "tag:Publisher",
          Values: ["Rabbitory"],
        },
        {
          Name: "instance-state-name",
          Values: ["pending", "running", "stopping", "stopped", "shutting-down"],
        },
      ],
    };

    try {
      const command = new DescribeInstancesCommand(params);
      const response = await ec2Client.send(command);

      if (response.Reservations) {
        const instances = response.Reservations.flatMap(
          (reservation) => reservation.Instances,
        );

        const formattedInstances = instances.map((instance) => (instance && {
          name: instance.Tags?.find((tag) => tag.Key === "Name")?.Value || "",
          id: instance.InstanceId,
          state: instance.State?.Name,
          region: region, // Include region information
        }));

        allInstances.push(...formattedInstances);
      }
    } catch (error) {
      console.error(`Error fetching instances from region ${region}:`, error);
    }
  }

  if (allInstances.length === 0) {
    return new NextResponse("No instances found", { status: 404 });
  }

  return NextResponse.json(allInstances);
};

export const POST = async (request: Request) => {
  const body = await request.json();
  if (!body) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const {
    region,
    instanceName,
    instanceType,
    username,
    password,
    storageSize,
  } = body;
  const createInstanceResult = await createInstance(
    region,
    instanceName,
    instanceType,
    username,
    password,
    storageSize,
  );

  if (!createInstanceResult) {
    return NextResponse.json(
      { message: "Error creating instance" },
      { status: 500 },
    );
  }

  const { instanceId } = createInstanceResult;

  pollRabbitMQServerStatus(
    instanceId,
    instanceName,
    username,
    password,
    region,
  );
  return NextResponse.json({
    name: instanceName,
    id: instanceId,
  });
};
