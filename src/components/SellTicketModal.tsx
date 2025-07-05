import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface SellTicketModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (payout: number) => void
}

const SellTicketModal = ({ isOpen, onClose, onSubmit }: SellTicketModalProps) => {
  const [payout, setPayout] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePayoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (isNaN(value) || value <= 0) {
      setError('Payout must be greater than €0')
    } else {
      setError(null)
    }
    setPayout(value)
  }

  const handleSubmit = () => {
    if (payout && payout > 0) {
      onSubmit(payout)
    } else {
      setError('Payout must be greater than €0')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sell My Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="payout">Desired Payout (€)</Label>
            <Input
              id="payout"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter desired payout"
              onChange={handlePayoutChange}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Continue</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SellTicketModal 