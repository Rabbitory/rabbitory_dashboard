import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";

const ec2Client = new EC2Client({ region: process.env.REGION });

// Use NextRequest type and properly handle params
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name: instanceName } = await params;

  const describeParams = {
    Filters: [
      {
        Name: "tag:Name",
        Values: [instanceName],
      },
      {
        Name: "tag:Publisher",
        Values: ["Rabbitory"],
      },
    ],
  };

  try {
    const command = new DescribeInstancesCommand(describeParams);
    const response = await ec2Client.send(command);

    if (
      !response.Reservations ||
      response.Reservations.length === 0 ||
      !response.Reservations[0].Instances ||
      response.Reservations[0].Instances.length === 0
    ) {
      return NextResponse.json(
        { message: `No instance found with name: ${instanceName}` },
        { status: 404 }
      );
    }

    const instance = response.Reservations[0].Instances[0];

    // Format the instance data
    const formattedInstance = {
      id: instance.InstanceId,
      name:
        instance.Tags?.find((tag) => tag.Key === "Name")?.Value || "No name",
      state: instance.State?.Name,
      type: instance.InstanceType,
      publicDns: instance.PublicDnsName || "N/A",
      publicIp: instance.PublicIpAddress || "N/A",
      launchTime: instance.LaunchTime,
    };

    return NextResponse.json(formattedInstance);
  } catch (error) {
    console.error("Error fetching instance details:", error);
    return NextResponse.json(
      { message: "Error fetching instance details", error: String(error) },
      { status: 500 }
    );
  }
}
