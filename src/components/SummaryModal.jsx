import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const SummaryModal = ({ isOpen, onClose, payout, onConfirm }) => {
  const airlineFee = 50
  const platformFee = payout * 0.025
  const totalBuyerPays = payout + airlineFee + platformFee

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Listing</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>You receive</span>
              <span>€{payout.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Airline fee</span>
              <span>€{airlineFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform fee</span>
              <span>€{platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Buyer pays total</span>
              <span>€{totalBuyerPays.toFixed(2)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Airline fee covers mandatory name change. Platform fee covers SeatSwap operations.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Edit
            </Button>
            <Button onClick={onConfirm}>Confirm Listing</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SummaryModal 