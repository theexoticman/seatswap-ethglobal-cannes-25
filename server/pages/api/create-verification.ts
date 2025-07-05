import { NextApiRequest, NextApiResponse } from "next";
import { configStore } from "../../lib/config-store";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const disclosures = req.body.disclosures;
    if (!disclosures) {
      return res.status(400).json({ message: "Disclosures object is required" });
    }

    const configId = uuidv4();
    await configStore.setConfig(configId, disclosures);

    console.log(`[${new Date().toISOString()}] Created and stored config for id: ${configId}`);

    return res.status(200).json({ configId });
  } catch (error) {
    console.error("Error creating verification config:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
} 