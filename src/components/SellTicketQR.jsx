import { SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import React, { useState, forwardRef, useEffect } from "react";
import { keccak256 } from "ethers";
import { toast } from 'sonner'

const SellTicketQRComponent = ({ ticket, onVerified }, ref) => {
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ticket && !app && !error) {
      const scope = import.meta.env.VITE_SELF_SCOPE;
      const endpoint = import.meta.env.VITE_SELF_ENDPOINT;

      if (!scope || !endpoint) {
          const errorMessage = "VITE_SELF_SCOPE or VITE_SELF_ENDPOINT is not defined. Please check your .env.local file and restart the server.";
          setError(errorMessage);
          return;
      }
      
      if (!ticket.sellerWallet) {
          const errorMessage = "Ticket is missing a 'sellerWallet' property.";
          setError(errorMessage);
          return;
      }

      const hash = keccak256(
        new TextEncoder().encode(`${ticket.airline}-${ticket.id}-${ticket.date}`)
      );
      const builder = new SelfAppBuilder({
        version: 2,
        appName: "SeatSwap",
        scope:    scope,
        endpoint: endpoint,
        endpointType: "staging_https",
        logoBase64: "",
        userId:   ticket.sellerWallet,
        userIdType: "hex",
        userDefinedData: hash.slice(2).padEnd(128, "0"),
        disclosures: { minimumAge: 18 }
      }).build();
      setApp(builder);
    }
  }, [ticket, app, error]);

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
          toast.success("Identity verified ✔");
          onVerified(true);
        }}
        onError={(e) => toast.error(`Verification failed: ${e.message}`)}
      />
    </div>
  );
}

export const SellTicketQR = forwardRef(SellTicketQRComponent); 