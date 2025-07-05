import { NextApiRequest, NextApiResponse } from 'next';
import {
  SelfBackendVerifier,
  AllIds,
  VerificationConfig,
  DefaultConfigStore,
} from "@selfxyz/core";

// Define the verification rules to match the frontend disclosures
const rules: VerificationConfig = {
  minimumAge: 18
};

// Use the built-in DefaultConfigStore for simple, static configurations
const configStore = new DefaultConfigStore(rules);

// Initialize verifier once using the NEW constructor
const verifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE ?? "seatswap",
  process.env.PUBLIC_URL!,
  true, // mockPassport
  AllIds,
  configStore,
  "uuid"
);

const usedNullifiers = new Set<string>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[${new Date().toISOString()}] Received request to /api/verify`);

  if (req.method !== 'POST') {
    console.log(`[${new Date().toISOString()}] Rejected request with method ${req.method}`);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log(`[${new Date().toISOString()}] Request body:`, req.body);
  const { attestationId, proof, publicSignals, userContextData } = req.body;
  
  if (!attestationId || !proof || !publicSignals || !userContextData) {
    console.log(`[${new Date().toISOString()}] Rejected request due to missing attestationId, proof, publicSignals, or userContextData.`);
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    console.log(`[${new Date().toISOString()}] Attempting to verify proof...`);
    const result = await verifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );
    console.log(`[${new Date().toISOString()}] Verification result:`, result);
    
    if (usedNullifiers.has(result.discloseOutput.nullifier)) {
        console.warn(`[${new Date().toISOString()}] Verification failed: Reused nullifier detected.`, { nullifier: result.discloseOutput.nullifier });
        return res.status(400).json({ status: 'error', result: false, message: 'Proof has already been used' });
    }
    
    usedNullifiers.add(result.discloseOutput.nullifier);

    if (result.isValidDetails.isValid) {
      console.log(`[${new Date().toISOString()}] Verification successful. Nullifier stored.`, { nullifier: result.discloseOutput.nullifier });
      return res.status(200).json({
        status: "success",
        result: true,
        credentialSubject: result.discloseOutput,
      });
    } else {
      console.warn(`[${new Date().toISOString()}] Verification failed: Proof considered invalid.`, { result });
      return res.status(400).json({
        status: "error",
        result: false,
        message: "Verification failed",
        details: result.isValidDetails,
      });
    }
  } catch (error: any) {
    // Check the error name instead of using instanceof
    if (error.name === 'ConfigMismatchError') {
      console.error(`[${new Date().toISOString()}] Verification failed: Configuration mismatch.`, { issues: error.issues });
      return res.status(400).json({
        status: "error",
        result: false,
        message: "Configuration mismatch",
        issues: error.issues,
      });
    }

    console.error(`[${new Date().toISOString()}] An unexpected error occurred during proof verification:`, error);
    return res.status(500).json({
      status: "error",
      result: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}