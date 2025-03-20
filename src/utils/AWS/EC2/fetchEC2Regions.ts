import { EC2Client, DescribeRegionsCommand } from "@aws-sdk/client-ec2";

export const getEC2Regions = async () => {
    const client = new EC2Client({ region: "us-east-1" });
    
    try {
      const command = new DescribeRegionsCommand({});
      const response = await client.send(command);

      response.Regions?.forEach(region => {
          console.log(`- ${region.RegionName}`);
      });
    } catch (error) {
        console.error("Error fetching regions:", error);
    }
};