import { SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import React, { useState, forwardRef, useEffect } from "react";
import { keccak256 } from "ethers";
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';

const SellTicketQRComponent = ({ ticket, onVerified }, ref) => {
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticket) {
      const scope = import.meta.env.VITE_SELF_SCOPE;
      const endpoint = import.meta.env.VITE_SELF_ENDPOINT;

      if (!scope || !endpoint) {
        setError("VITE_SELF_SCOPE or VITE_SELF_ENDPOINT is not defined.");
        return;
      }

      if (!ticket.sellerWallet) {
        setError("Ticket is missing a 'sellerWallet' property.");
        return;
      }

      const hash = keccak256(
        new TextEncoder().encode(`${ticket.airline}-${ticket.id}-${ticket.date}`)
      );

      const builder = new SelfAppBuilder({
        version: 2,
        appName: "SeatSwap",
        scope: scope,
        endpoint: endpoint,
        endpointType: "staging_https",
        logoBase64: "",
        userId: uuidv4(),
        userIdType: "uuid",
        userDefinedData: hash.slice(2).padEnd(128, "0"),
        disclosures: {
          minimumAge: 18,
          excludedCountries: ['PRK'],
          name: true
        },
      }).build();

      setApp(builder);
    }
  }, [ticket]);

  if (error) {
    return <p className="text-sm text-red-500 p-4 bg-red-50 rounded-md">{error}</p>;
  }

  if (!app) {
    return <div ref={ref}><p className="text-muted-foreground p-4">Loading verification...</p></div>;
  }

  return (
    <div ref={ref}>
      <SelfQRcodeWrapper
        selfApp={app}
        onSuccess={() => {
          console.log("onSuccess from SelfQRcodeWrapper received and ignored.");
        }}
        onError={(e) => {
          toast.error(`Verification failed: ${e.message}`);
        }}
      />
    </div>
  );
}

export const SellTicketQR = forwardRef(SellTicketQRComponent); 