import { NextResponse } from "next/server";
import { getInstanceSGRules } from "@/utils/AWS/Security-Groups/getInstanceSGRules";
import { getInstanceAvailabilityZone } from "@/utils/AWS/EC2/getInstanceAvailabilityZone";

interface Params {
  instanceName: string;
}

export async function GET({ params }: { params: Params }) {
  const { instanceName } = params;

  try {
    const region = await getInstanceAvailabilityZone(instanceName); // FIX - IF REGION PASSING CHANGES
    const instanceSGRules = await getInstanceSGRules(instanceName, region);

    console.log(instanceSGRules);
    console.log(NextResponse.json(instanceSGRules));
    // return NextResponse.json(instanceSGRules);
  } catch (error) {
    console.error("Error fetching firewall rules:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


// export async function POST(req: Request, { params }: { params: { name: string } }) {
//   const { name } = params;

// }

