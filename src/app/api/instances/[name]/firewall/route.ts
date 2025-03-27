import { NextResponse } from "next/server";
import { getInstanceFirewallRules } from "../../../../../utils/AWS/Security-Groups/getInstanceSGRules";
import { FirewallRule } from "@/types/firewall";

// Typing for the params object that contains the instance name
interface Params {
  instanceName: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const { instanceName } = params;

  try {
    // Delegate to getInstanceFirewallRules to fetch the firewall rules
    const firewallRules: FirewallRule[] = await getInstanceFirewallRules(instanceName);

    // Return the firewall rules as the response
    return NextResponse.json(firewallRules);
  } catch (error) {
    console.error("Error fetching firewall rules:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}


export async function POST(req: Request, { params }: { params: { name: string } }) {
  const { name } = params;

}