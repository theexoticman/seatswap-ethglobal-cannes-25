import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SellTicketQR } from './SellTicketQR'
import { Button } from '@/components/ui/button'

const SellTicketModal = ({ isOpen, onClose, onConfirm, ticket }) => {
  const [isVerified, setIsVerified] = useState(false)

  // Reset verification status when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setIsVerified(true), 3000) // Reset after closing animation
    }
  }, [isOpen])

  const handleConfirmClick = () => {
    if (isVerified) {
      onConfirm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <p className="text-muted-foreground">Please scan to verify your identity with Self.xyz</p>
          <SellTicketQR ticket={ticket} onVerified={() => setIsVerified(true)} />
          <Button
            onClick={handleConfirmClick}
            disabled={!isVerified}
            className="mt-4 w-1/2"
          >
            {isVerified ? 'Confirmed! Click to Continue' : 'Awaiting Verification...'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SellTicketModal 