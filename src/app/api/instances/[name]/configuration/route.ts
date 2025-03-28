import { EC2Client } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";
import { fetchInstance } from "@/utils/AWS/EC2/fetchInstance";
import {
  SSMClient,
  SendCommandCommand,
  GetCommandInvocationCommand,
} from "@aws-sdk/client-ssm";
import parseConfig from "@/utils/parseConfig";

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
  const instanceId = instance.InstanceId;

  const ssmClient = new SSMClient({ region: process.env.REGION });
  const sendCmd = new SendCommandCommand({
    InstanceIds: instanceId ? [instanceId] : undefined,
    DocumentName: "AWS-RunShellScript",
    Parameters: {
      commands: ["cat /etc/rabbitmq/rabbitmq.conf"],
    },
  });

  try {
    const response = await ssmClient.send(sendCmd);
    const commandId = response.Command?.CommandId;
    if (!commandId) {
      return NextResponse.json(
        { message: "Error sending command to instance" },
        { status: 500 },
      );
    }

    //poll for command status
    let invocationRes;
    let status = "InProgress";
    while (status === "InProgress") {
      await new Promise((r) => setTimeout(r, 500));
      invocationRes = await ssmClient.send(
        new GetCommandInvocationCommand({
          CommandId: commandId,
          InstanceId: instanceId,
        }),
      );
      status = invocationRes.Status || "InProgress";
    }

    if (status !== "Success" || !invocationRes?.StandardOutputContent) {
      return NextResponse.json(
        {
          message: "Failed to fetch config file",
          error: invocationRes ? String(invocationRes) : status,
        },
        { status: 500 },
      );
    }

    const fileContent = invocationRes.StandardOutputContent;
    const config = {};
    parseConfig(config, fileContent);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching versions:", error);
    return NextResponse.json(
      { message: "Error fetching versions", error: String(error) },
      { status: 500 },
    );
  }
}
