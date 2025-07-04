import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog.jsx'
import { CheckCircle, AlertCircle, XCircle, Plane, DollarSign, Calendar, MapPin } from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  type, 
  ticket, 
  isLoading = false 
}) => {
  const getModalConfig = () => {
    switch (type) {
      case 'buy':
        return {
          title: 'Confirm Purchase',
          description: 'Are you sure you want to buy this ticket?',
          icon: <DollarSign className="w-6 h-6 text-primary" />,
          confirmText: 'Buy Now',
          confirmVariant: 'default'
        }
      case 'bid':
        return {
          title: 'Place Bid',
          description: 'Are you sure you want to place a bid on this ticket?',
          icon: <DollarSign className="w-6 h-6 text-accent" />,
          confirmText: 'Place Bid',
          confirmVariant: 'default'
        }
      case 'sell':
        return {
          title: 'List Ticket for Sale',
          description: 'Are you sure you want to list this ticket for sale?',
          icon: <Plane className="w-6 h-6 text-primary" />,
          confirmText: 'List for Sale',
          confirmVariant: 'default'
        }
      case 'success':
        return {
          title: 'Success!',
          description: 'Your transaction has been completed successfully.',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          confirmText: 'Continue',
          confirmVariant: 'default'
        }
      case 'error':
        return {
          title: 'Transaction Failed',
          description: 'There was an error processing your transaction. Please try again.',
          icon: <XCircle className="w-6 h-6 text-destructive" />,
          confirmText: 'Try Again',
          confirmVariant: 'destructive'
        }
      default:
        return {
          title: 'Confirm Action',
          description: 'Are you sure you want to proceed?',
          icon: <AlertCircle className="w-6 h-6 text-primary" />,
          confirmText: 'Confirm',
          confirmVariant: 'default'
        }
    }
  }

  const config = getModalConfig()

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {config.icon}
            <span>{config.title}</span>
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {ticket && (type === 'buy' || type === 'bid' || type === 'sell') && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{ticket.airline}</span>
              <span className="text-sm text-muted-foreground">
                {ticket.status === 'Bidding' ? `Current bid: $${ticket.currentBid}` : `$${ticket.price}`}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{ticket.departure.code} → {ticket.arrival.code}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{formatDate(ticket.date)}</span>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {ticket.departure.city} ({formatTime(ticket.departure.time)}) → {ticket.arrival.city} ({formatTime(ticket.arrival.time)})
            </div>
          </div>
        )}

        <DialogFooter className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className={config.confirmVariant === 'default' ? 'bg-primary hover:bg-primary/90' : ''}
          >
            {isLoading ? 'Processing...' : config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal

