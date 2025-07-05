import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const PriceInputModal = ({ isOpen, onClose, onSubmit }) => {
  const [payout, setPayout] = useState(null)
  const [error, setError] = useState(null)

  const handlePayoutChange = (e) => {
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
      const errorMessage = 'Payout must be greater than €0'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Your Price</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="payout">Desired Payout (€)</Label>
            <Input
              id="payout"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter desired payout"
              onChange={handlePayoutChange}
              className={error ? 'border-destructive' : ''}
            />
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <div className="flex justify-end space-x-2 pt-4">
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

export default PriceInputModal 