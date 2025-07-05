import { SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode";
import React, { useState, forwardRef, useEffect } from "react";
import { keccak256 } from "js-sha3";
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';

const SellTicketQRComponent = forwardRef(
  ({ ticket, onScanned, onVerified, onVerificationFailed }, ref) => {
    const [selfApp, setSelfApp] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
      const scope = import.meta.env.VITE_SELF_SCOPE;
      const endpoint = import.meta.env.VITE_SELF_ENDPOINT;

      const hash = keccak256(
        new TextEncoder().encode(`${ticket.airline}-${ticket.id}-${ticket.date}`)
      );

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

      const builder = new SelfAppBuilder(
        scope,
        endpoint,
        hash,
        "hex"
      );

      builder.requestName();
      builder.requestPassportNumber();
      builder.requestExpiryDate();

      setSelfApp(builder.build());
    }, [ticket]);

    if (error) {
      return <p className="text-sm text-red-500 p-4 bg-red-50 rounded-md">{error}</p>;
    }

    if (!selfApp) {
      return <div ref={ref}><p className="text-muted-foreground p-4">Loading verification...</p></div>;
    }

    return (
      <div ref={ref}>
        <SelfQRcodeWrapper
          selfApp={selfApp}
          onSuccess={() => {
            toast.success("Identity verified ✔");
            onVerified(true);
          }}
          onError={(e) => toast.error(`Verification failed: ${e.message}`)}
        />
      </div>
    );
  }
);

export const SellTicketQR = SellTicketQRComponent; 