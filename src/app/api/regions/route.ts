import { NextResponse } from "next/server";
import { getEC2Regions } from "../../../utils/AWS/EC2/getEC2Regions";

export async function GET() {
  try {
      const regions = await getEC2Regions();
      return NextResponse.json({ regions });
  } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}