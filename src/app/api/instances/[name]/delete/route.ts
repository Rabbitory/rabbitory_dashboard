import { EC2, EC2Client, TerminateInstancesCommand } from "@aws-sdk/client-ec2";
import { fetchInstance } from "@/utils/AWS/EC2/fetchInstace";
import { NextResponse } from "next/server";

const ec2Client = new EC2Client({ region: process.env.REGION });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const instance = await fetchInstance(name, ec2Client);
  const instanceId = instance?.InstanceId;
  if (instanceId === undefined) {
    return NextResponse.json(
      { message: `No instance found with name: ${name}` },
      { status: 404 }
    );
  }

  const terminateParams = {
    InstanceIds: [instanceId]
  }

  try {
    const command = new TerminateInstancesCommand(terminateParams);
    await ec2Client.send(command);
    console.log(`Successfully deleted instance: ${name}`);
    return NextResponse.json(
      { message: `Successfully deleted instance: ${name}` },
      { status: 200 }
    )
  } catch (err) {
    console.log("Error deleting instance '${name}':", err);
    return NextResponse.json(
      { message: "Error deleting instance '${name}:'", err },
      { status: 500 }
    )
  }
  return NextResponse.json({ message: `${name}!` });
}
