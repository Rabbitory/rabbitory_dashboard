import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
const ec2Client = new EC2Client({ region: process.env.REGION });

export const GET = async () => {
  const params = {
    Filters: [
      {
        Name: "tag:Publisher",
        Values: ["Rabbitory"],
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
      name: instance.Tags.find((tag) => tag.Key === "Name")?.Value || "No name",
      id: instance.InstanceId,
    };
  });

  return NextResponse.json(formattedInstances);
};
