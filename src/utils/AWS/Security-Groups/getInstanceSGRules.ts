import { EC2Client, DescribeSecurityGroupsCommand } from "@aws-sdk/client-ec2";
import { fetchInstance } from "../EC2/fetchInstace"; // your existing fetchInstance function
import { NextResponse } from "next/server";

const ec2Client = new EC2Client({ region: "us-east-1" }); // specify your region here

// Example function to get firewall rules for an EC2 instance
export async function getInstanceFirewallRules(instanceName: string) {
  const ec2Client = new EC2Client({ region: "us-east-1" }); // specify your region here

      const instance = await fetchInstance(instanceName, ec2Client);
  
      if (!instance) {
        return NextResponse.json({ message: "Instance not found" }, { status: 404 });
      }

  // Assume instance has a security group ID, and we fetch its inbound rules
  const securityGroupId = instance.SecurityGroups?.[0].GroupId;

  if (!securityGroupId) {
    throw new Error("Instance has no associated security group.");
  }

  const describeParams = {
    GroupIds: [securityGroupId],
  };

  try {
    const command = new DescribeSecurityGroupsCommand(describeParams);
    const response = await ec2Client.send(command);

    if (response.SecurityGroups && response.SecurityGroups.length > 0) {
      return response.SecurityGroups[0].IpPermissions; // This returns the firewall rules for the security group
    }

    return [];
  } catch (error) {
    console.error("Error fetching firewall rules:", error);
    throw new Error("Failed to fetch firewall rules.");
  }
}
