import { getVolumeSize } from "@/utils/AWS/EC2/getVolumeSize";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const volumeId = searchParams.get("volumeId");
    const region = searchParams.get("region");

    if (!volumeId || !region) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    const size = await getVolumeSize(volumeId, region);

    // Will have server side events with notifications eventually

    return NextResponse.json({ size }, { status: 200 });
  } catch (error) {
    console.error("Error getting size:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
