import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
import createInstance from "@/utils/AWS/EC2/createBrokerInstance";
const ec2Client = new EC2Client({ region: process.env.REGION });

export const GET = async () => {
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

  const command = new DescribeInstancesCommand(params);
  const response = await ec2Client.send(command);

  if (!response.Reservations) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "No instances found" }),
    };
  }

  const instances = response.Reservations.flatMap(
    (reservation) => reservation.Instances,
  );

  const formattedInstances = instances.map((instance) => {
    if (!instance || !instance.Tags) {
      console.error("Instance or tags not found");
      return null;
    }

    return {
      name: instance.Tags.find((tag) => tag.Key === "Name")?.Value || "",
      id: instance.InstanceId,
    };
  });

  return NextResponse.json(formattedInstances);
};

export const POST = async (request: Request) => {
  const body = await request.json();
  if (!body) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const { region, instanceName, instanceType, username, password } = body;
  const createInstanceResult = await createInstance(
    region,
    instanceName,
    instanceType,
    username,
    password,
  );

  if (!createInstanceResult) {
    return NextResponse.json(
      { message: "Error creating instance" },
      { status: 500 },
    );
  }

  const { instanceId } = createInstanceResult;
  return NextResponse.json({
    name: instanceName,
    id: instanceId,
  });
};
