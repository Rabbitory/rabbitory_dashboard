import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";

const client = new EC2Client({ region: "us-east-1" });

interface Params {
  name: string;
}

async function getInstanceType(instanceId: string) {
  const command = new DescribeInstancesCommand({
    InstanceIds: [instanceId],
  });

  try {
    const response = await client.send(command);

    if (
      response.Reservations &&
      response.Reservations.length > 0 &&
      response.Reservations[0].Instances &&
      response.Reservations[0].Instances.length > 0
    ) {
      const instance = response.Reservations[0].Instances[0];
      console.log("Instance type:", instance.InstanceType);
      return instance.InstanceType;
    } else {
      console.error("No instance information found.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching instance details:", error);
    return null;
  }
}

export default async function HardwarePage({ params }: { params: Params }) {
  const { name } = await params;

  return (
    <div>
      <h1>Hardware</h1>
      <p>This is the hardware page for instance {name}.</p>
    </div>
  );
}
