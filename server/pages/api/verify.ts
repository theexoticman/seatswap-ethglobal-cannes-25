import { NextApiRequest, NextApiResponse } from 'next';
import {
  IConfigStorage,
  SelfBackendVerifier,
  AllIds,
  VerificationConfig,
  DefaultConfigStore,
} from "@selfxyz/core";



export class KVConfigStore implements IConfigStorage {


  async getActionId(userIdentifier: string, data: string): Promise<string> {
    return userIdentifier;
  }

  async setConfig(id: string, config: VerificationConfig): Promise<boolean> {
    return true;
  }

  async getConfig(id: string): Promise<VerificationConfig> {
    const config = {
      minimumAge: 18,
      excludedCountries: ['PRK'],
      name: true
    } as VerificationConfig;
    return config;
  }
}


// Use the built-in DefaultConfigStore. It provides the same 'rules' for every check.
const configStore = new KVConfigStore();

// Initialize the verifier with our static configuration store.
const verifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE ?? "SeatSwap",
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