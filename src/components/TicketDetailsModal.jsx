import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import TicketCard from './TicketCard'
import { marketplaceTickets } from '@/data/sampleTickets'

const TicketDetailsModal = ({ 
  isOpen, 
  onClose, 
  onSell,
  ticket 
}) => {
  // Use sample ticket if no specific ticket is provided
  const displayTicket = ticket || marketplaceTickets[0]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reservation Details</DialogTitle>
        </DialogHeader>
        
        {displayTicket && (
          <div className="mt-4">
            <TicketCard 
              ticket={displayTicket} 
              showBuyButton={false} 
              showResellButton={false}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
          <Button 
            onClick={onSell}
          >
            Verify Identity with Self.xyz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TicketDetailsModal 