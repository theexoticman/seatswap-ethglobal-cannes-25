import { NextApiRequest, NextApiResponse } from 'next';
import { SelfBackendVerifier } from "@selfxyz/core";

const verifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE ?? "seatswap",
  process.env.PUBLIC_URL!,
  "uuid",
  true // mockPassport
);

verifier.setMinimumAge(18);
verifier.requestName();
verifier.requestPassportNumber();
verifier.requestExpiryDate();

const usedNullifiers = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[${new Date().toISOString()}] Received request to /api/verify`);

  if (req.method !== 'POST') {
    console.log(`[${new Date().toISOString()}] Rejected request with method ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log(`[${new Date().toISOString()}] Request body:`, req.body);
  const { proof, publicSignals } = req.body;
  
  if (!proof || !publicSignals) {
    console.log(`[${new Date().toISOString()}] Rejected request due to missing proof or publicSignals.`);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Attempting to verify proof...`);
    const result = await verifier.verify(proof, publicSignals);
    console.log(`[${new Date().toISOString()}] Verification result:`, result);

    if (usedNullifiers.has(result.nullifier)) {
        console.warn(`[${new Date().toISOString()}] Verification failed: Reused nullifier detected.`, { nullifier: result.nullifier });
        return res.status(400).json({ status: 'error', verified: false, message: 'Proof has already been used' });
    }

    if (result.isValid) {
      usedNullifiers.add(result.nullifier);
      console.log(`[${new Date().toISOString()}] Verification successful. Nullifier stored.`, { nullifier: result.nullifier });
      return res.status(200).json({
        status: "success",
        verified: true,
        credentialSubject: result.credentialSubject,
      });
    } else {
      console.warn(`[${new Date().toISOString()}] Verification failed: Proof considered invalid.`, { result });
      return res.status(400).json({
        status: "error",
        verified: false,
        message: "Verification failed",
      });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] An unexpected error occurred during proof verification:`, error);
    return res.status(500).json({
      status: "error",
      verified: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}