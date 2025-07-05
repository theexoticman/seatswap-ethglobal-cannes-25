import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { CheckCircle } from 'lucide-react'

const SuccessModal = ({ isOpen, onClose, onComplete }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onComplete()
      }, 5000) // 5-second timer

      // Clear the timer if the component unmounts or isOpen changes
      return () => clearTimeout(timer)
    }
  }, [isOpen, onComplete])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {/* These are for screen readers and are visually hidden */}
        <DialogTitle className="sr-only">Verification Successful</DialogTitle>
        <DialogDescription className="sr-only">Your identity has been confirmed and the next step will begin shortly.</DialogDescription>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
          <CheckCircle className="w-24 h-24 text-green-500" />
          <h2 className="text-2xl font-bold">Identity Confirmed</h2>
          <p className="text-muted-foreground">Your identity has been confirmed. You own this ticket.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal 