import { EC2Client, DescribeSecurityGroupsCommand, SecurityGroup as AwsSecurityGroup } from "@aws-sdk/client-ec2";
import { fetchInstance } from "../EC2/fetchInstance";

interface SecurityGroup {
  GroupId?: string;
  GroupName?: string;
  Description?: string;
  VpcId?: string;
  IpPermissions?: AwsSecurityGroup['IpPermissions'];
  IpPermissionsEgress?: AwsSecurityGroup['IpPermissionsEgress'];
  Tags?: AwsSecurityGroup['Tags'];
}

export async function getInstanceSGRules(instanceName: string, region: string): Promise<SecurityGroup | null> {
  const ec2Client = new EC2Client({ region });

  try {
    const instance = await fetchInstance(instanceName, ec2Client);

    if (!instance || !instance.SecurityGroups || instance.SecurityGroups.length === 0) {
      throw new Error("No security groups found for the instance.");
    }

    const securityGroupIds = instance.SecurityGroups
      .map((sg) => sg.GroupId)
      .filter((id): id is string => id !== undefined); // Ensure that we only have strings

    const describeSecurityGroupsCommand = new DescribeSecurityGroupsCommand({
      GroupIds: securityGroupIds,
    });

    const securityGroupResponse = await ec2Client.send(describeSecurityGroupsCommand);
    const securityGroup = securityGroupResponse.SecurityGroups?.[0];

    if (!securityGroup) {
      throw new Error("No security group details found.");
    }

    return securityGroup;
  } catch (error) {
    throw error;
  }
}