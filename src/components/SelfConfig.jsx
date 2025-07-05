import { SelfAppBuilder } from "@selfxyz/qrcode";

const selfApp = new SelfAppBuilder({
  version: 2,                       // V2 protocol
  appName:  "Travel Companion",     // Label shown in mobile app
  scope:    "travelco-demo",        // MUST match backend
  endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT!, // e.g. https://xxxx.ngrok.io/api/verify
  endpointType: "staging_https",    // “staging” = testnet + relayer
  logoBase64:  logoDataURL,         // optional
  userId:      wallet.address,      // seller’s wallet
  userIdType:  "hex",
  userDefinedData: ticketHashHex,   // optional context (≤ 64 bytes hex)
  disclosures: {                    // verification rules
    minimumAge: 18
  }
}).build();
