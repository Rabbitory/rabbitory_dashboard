import { EC2Client, TerminateInstancesCommand } from "@aws-sdk/client-ec2";
import { NextResponse } from "next/server";

export const deleteBroker = async (id: string, client: EC2Client) => {
  const terminateParams = {
    InstanceIds: [id]
  }

  try {
    const command = new TerminateInstancesCommand(terminateParams);
    await client.send(command);
    console.log(`Successfully deleted instance: ${id}`);
    return NextResponse.json(
      { message: `Successfully deleted instance: ${id}` },
      { status: 200 }
    )
  } catch (err) {
    console.log("Error deleting instance '${id}':", err);
    return NextResponse.json(
      { message: "Error deleting instance '${id}:'", err },
      { status: 500 }
    )
  }
}
