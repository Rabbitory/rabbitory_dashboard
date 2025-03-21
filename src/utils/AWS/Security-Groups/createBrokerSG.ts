import {
  EC2Client,
  DescribeVpcsCommand,
  DescribeSecurityGroupsCommand,
  CreateSecurityGroupCommand,
  AuthorizeSecurityGroupIngressCommand,
} from "@aws-sdk/client-ec2";

const ipPermissions = [
  {
    IpProtocol: "tcp",
    FromPort: 5672,
    ToPort: 5672,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 15672,
    ToPort: 15672,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 80,
    ToPort: 80,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 443,
    ToPort: 443,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
  {
    IpProtocol: "tcp",
    FromPort: 22,
    ToPort: 22,
    IpRanges: [{ CidrIp: "0.0.0.0/0" }],
  },
];

async function getSecurityGroupId(
  groupName: string,
  vpcId: string | undefined,
  client: EC2Client
) {
  // First, check if the security group exists in the specified VPC.
  const describeParams = {
    Filters: [
      {
        Name: "group-name",
        Values: [groupName],
      },
      {
        Name: "vpc-id",
        Values: vpcId ? [vpcId] : undefined,
      },
    ],
  };
  const describeCommand = new DescribeSecurityGroupsCommand(describeParams);
  const result = await client.send(describeCommand);

  if (result.SecurityGroups && result.SecurityGroups.length > 0) {
    console.log(`Security group "${groupName}" already exists.`);
    return result.SecurityGroups[0].GroupId; // Return the existing group details.
  } else {
    return undefined;
  }
}

async function authorizeSecurityGroupIngress(
  client: EC2Client,
  securityGroupId: string | undefined
) {
  if (!securityGroupId) {
    throw new Error("No security group ID found");
  }

  const command = new AuthorizeSecurityGroupIngressCommand({
    GroupId: securityGroupId,
    IpPermissions: ipPermissions,
  });

  try {
    const { SecurityGroupRules } = await client.send(command);
    console.log(JSON.stringify(SecurityGroupRules, null, 2));
  } catch (caught) {
    if (caught instanceof Error && caught.name === "InvalidGroupId.Malformed") {
      console.warn(`${caught.message}. Please provide a valid GroupId.`);
    } else {
      throw caught;
    }
  }
}

export async function getDefaultVpcId(
  client: EC2Client
): Promise<string | undefined> {
  const command = new DescribeVpcsCommand({
    Filters: [
      {
        Name: "isDefault",
        Values: ["true"],
      },
    ],
  });

  const response = await client.send(command);
  if (response.Vpcs && response.Vpcs.length > 0) {
    return response.Vpcs[0].VpcId;
  } else {
    throw new Error("No default VPC found");
  }
}

export async function createSecurityGroup(
  client: EC2Client,
  vpcId: string | undefined
): Promise<string | undefined> {
  const securityGroupName = "BrokerSecurityGroup";
  const description = "Security group for RabbitMQ EC2 instance";

  const securityGroupId = await getSecurityGroupId(
    securityGroupName,
    vpcId,
    client
  );

  if (securityGroupId) {
    return securityGroupId;
  }
  const command = new CreateSecurityGroupCommand({
    Description: description,
    GroupName: securityGroupName,
    VpcId: vpcId,
  });
  try {
    const response = await client.send(command);
    await authorizeSecurityGroupIngress(client, response.GroupId);
    console.log("Security group created:", response.GroupId);
    return response.GroupId;
  } catch (err) {
    console.error("Error creating security group:", err);
  }
}
