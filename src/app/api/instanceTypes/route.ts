import { NextResponse } from "next/server";
import { getEC2InstanceTypes } from "@/utils/AWS/EC2/getEC2InstanceTypes";

export async function GET() {
  try {
    const instanceTypes = await getEC2InstanceTypes();
    return NextResponse.json({ instanceTypes });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}