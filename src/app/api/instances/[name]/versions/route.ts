import { EC2Client } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
import { fetchInstance } from "@/utils/AWS/EC2/fetchInstance";
import axios from "axios";

const ec2Client = new EC2Client({ region: process.env.REGION });

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: instanceName } = await params;

  const instance = await fetchInstance(instanceName, ec2Client);
  if (!instance) {
    return NextResponse.json(
      { message: `No instance found with name: ${instanceName}` },
      { status: 404 },
    );
  }
  const publicDns = instance.PublicDnsName;

  if (!publicDns) {
    return NextResponse.json(
      { message: "Instance not ready yet! Try again later!" },
      { status: 404 },
    );
  }

  //TODO: need to get username and password from dynamodb
  const username = "blackfries";
  const password = "blackfries";
  try {
    const rabbitUrl = `http://${publicDns}:15672/api/overview`;
    const response = await axios.get(rabbitUrl, {
      auth: {
        username,
        password,
      },
    });
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json(
      { message: "Error fetching versions", error: String(error) },
      { status: 500 },
    );
  }
}
