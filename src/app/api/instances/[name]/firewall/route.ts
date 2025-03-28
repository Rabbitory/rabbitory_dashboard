import { NextResponse } from "next/server";
import { getInstanceSGRules } from "../../../../../utils/AWS/Security-Groups/getInstanceSGRules";
// import { FirewallRule } from "@/types/firewall";

interface Params {
  instanceName: string;
}

const REGION = 'us-east-1';

export async function GET({ params }: { params: Params }) {
  const { instanceName } = params;

  try {
    const instanceSGRules = await getInstanceSGRules(instanceName, REGION);
    return NextResponse.json(instanceSGRules);
  } catch (error) {
    console.error("Error fetching firewall rules:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


// export async function POST(req: Request, { params }: { params: { name: string } }) {
//   const { name } = params;

// }