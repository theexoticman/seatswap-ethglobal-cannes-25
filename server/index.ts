// server/index.ts
import express from "express";
import dotenv  from "dotenv";

import {
  SelfBackendVerifier, AllIds,
  DefaultConfigStore, VerificationConfig
} from "@selfxyz/core";

dotenv.config();

/* 1. static rules */
const rules: VerificationConfig = { minimumAge: 18, excludedCountries: [], ofac: false };
const cfgStore = new DefaultConfigStore(rules);

/* 2. verifier (mockPassport = true ⇒ Alfajores) */
const verifier = new SelfBackendVerifier(
  process.env.SELF_SCOPE ?? "seatswap",
  process.env.PUBLIC_URL ?? "http://localhost:4000/verify",
  true,          // mockPassport
  AllIds,
  cfgStore,
  "hex"
);

/* 3. nullifier replay-guard */
const used = new Set<string>();

const app = express();
app.use(express.json());

app.post("/verify", async (req, res) => {
  const { attestationId, proof, publicSignals, userContextData } = req.body;

  try {
    const out = await verifier.verify(attestationId, proof, publicSignals, userContextData);

    if (!out.isValidDetails.isValid)
      return res.status(400).json({ verified: false });

    if (used.has(out.discloseOutput.nullifier))
      return res.status(400).json({ verified: false, msg: "reused" });

    used.add(out.discloseOutput.nullifier);
    res.json({ verified: true, nationality: out.discloseOutput.nationality });
  } catch (e: any) {
    res.status(400).json({ verified: false, error: e.message });
  }
});

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => console.log(`Self verifier up on :${PORT}`));
