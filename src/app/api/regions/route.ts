import type { NextApiRequest, NextApiResponse } from "next";
import { getEC2Regions } from "../../../utils/AWS/EC2/fetchEC2Regions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const regions = await getEC2Regions();
        return res.status(200).json({ regions });
    } catch (error) {
        console.error("API Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}