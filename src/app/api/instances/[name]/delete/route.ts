import { EC2Client } from "@aws-sdk/client-ec2";
import { fetchInstance } from "@/utils/AWS/EC2/fetchInstace";
import { NextResponse } from "next/server";
import { deleteBroker } from "@/utils/AWS/EC2/deleteBrokerInstance";

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
  deleteBroker(instanceId, ec2Client);
}
