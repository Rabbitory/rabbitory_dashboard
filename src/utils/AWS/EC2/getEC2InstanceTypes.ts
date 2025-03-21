import { EC2Client, DescribeInstanceTypesCommand } from "@aws-sdk/client-ec2";

const ec2Client = new EC2Client({});

export async function getEC2InstanceTypes() {
  try {
    const command = new DescribeInstanceTypesCommand({
      Filters: [{ Name: "instance-type", Values: ["m8g.*", "c7gn.*"] }],
    });
    const response = await ec2Client.send(command);

    console.log(
      response.InstanceTypes?.[0],
      "/n",
      response.InstanceTypes?.length
    );
  } catch (error) {
    console.error("Error fetching instance types:", error);
  }
}