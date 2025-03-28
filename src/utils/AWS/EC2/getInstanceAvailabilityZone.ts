import { EC2Client } from "@aws-sdk/client-ec2";
import { fetchInstance } from "../EC2/fetchInstance";

export async function getInstanceAvailabilityZone(instanceName: string, ec2Client: EC2Client): Promise<string | null> {
  try {
    const instance = await fetchInstance(instanceName, ec2Client);

    if (!instance) {
      throw new Error(`Instance with name '${instanceName}' not found.`);
    }

    const availabilityZone = instance.Placement?.AvailabilityZone;

    if (!availabilityZone) {
      throw new Error(`Availability zone for instance '${instanceName}' is not available.`);
    }

    return availabilityZone;
  } catch (error) {
    console.error(`Error retrieving availability zone for instance '${instanceName}':`, error);
    throw error;
  }
}