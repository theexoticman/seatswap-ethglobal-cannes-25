import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SellTicketQR } from './SellTicketQR'

const SellTicketModal = ({ isOpen, onClose, onConfirm, ticket }) => {
  const handleVerified = (verified) => {
    if (verified) {
      // Immediately call the onConfirm prop to trigger the next modal
      onConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription className="text-muted-foreground text-center pt-2">
            Please scan the QR code with the Self mobile app to verify you own this ticket.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <SellTicketQR ticket={ticket} onVerified={handleVerified} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellTicketModal; 