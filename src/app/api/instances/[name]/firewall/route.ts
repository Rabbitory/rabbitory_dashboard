import { NextResponse } from "next/server";
import { getInstanceSGRules } from "@/utils/AWS/Security-Groups/getInstanceSGRules";
import { getInstanceAvailabilityZone } from "@/utils/AWS/EC2/getInstanceAvailabilityZone";

// export async function GET(_request: Request, { params }: { params: Promise<{name: string}>}) {
//   const { name } = await params;
//   console.log(name);
// }

export async function GET( _request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  try {
    const instanceName = name;
    const region = await getInstanceAvailabilityZone(instanceName); // FIX - IF REGION PASSING CHANGES
    const instanceSGRules = await getInstanceSGRules(instanceName, region);

    console.log(instanceSGRules);
    const firewallDetails = {
      description: instanceSGRules?.Description,
      ipPermissions: instanceSGRules?.IpPermissions,
      
    }

    return NextResponse.json(instanceSGRules);
  } catch (error) {
    console.error("Error fetching firewall rules:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


// export async function POST(req: Request, { params }: { params: { name: string } }) {
//   const { name } = params;

// }

