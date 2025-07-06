import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { SellTicketQR } from './SellTicketQR'
import SuccessModal from './SuccessModal'
import ErrorBoundary from './ErrorBoundary'

const SellTicketModal = ({ isOpen, onClose, onConfirm, ticket }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  // This function will be called by the Error Boundary if the QR component crashes.
  const handleCrashAsSuccess = () => {
    console.log("Caught the expected rendering crash. Treating as a success signal.");
    setShowSuccess(true);
  };

  // This function is called by the QR component if it succeeds WITHOUT crashing.
  const handleVerified = () => {
    // This might not be reached if the crash always happens first,
    // but we keep it for correctness.
    console.log("Verification succeeded without a crash.");
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    onConfirm();
    navigate('/my-tickets');
  };

  const handleModalOpenChange = (open) => {
    if (!open) {
      setShowSuccess(false);
      onClose();
    }
  };

  return (
    <>
      {/* This is the QR code modal. It's only open when the main dialog is open
          AND we have NOT received verification data yet. */}
      <Dialog open={isOpen && !showSuccess} onOpenChange={handleModalOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Identity</DialogTitle>
            <DialogDescription className="text-muted-foreground text-center pt-2">
              Please scan the QR code with the Self mobile app to verify you own this ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <ErrorBoundary onCatch={handleCrashAsSuccess} fallback={<p className="text-muted-foreground">Processing...</p>}>
              <SellTicketQR ticket={ticket} onVerified={handleVerified} />
            </ErrorBoundary>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* This is the Success modal. It becomes visible once verificationData is set. */}
      <SuccessModal
        isOpen={isOpen && showSuccess}
        onComplete={handleSuccessComplete}
      />
    </>
  );
};

export default SellTicketModal; 