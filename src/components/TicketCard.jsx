import React from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Plane, ArrowRight, Calendar, DollarSign } from 'lucide-react'
import StatusBadge from './StatusBadge'

const TicketCard = ({ 
  ticket, 
  showResellButton = false, 
  onBuy, 
  onResell,
  showBuyButton = false 
}) => {
  const {
    airline,
    departure,
    arrival,
    date,
    price,
    status,
    currentBid,
    ticketType = 'Economy',
    isRefundable = false
  } = ticket

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
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header with Airline and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Plane className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">{airline}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Flight Route */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{departure.code}</div>
          <div className="text-sm text-muted-foreground">{departure.city}</div>
          <div className="text-xs text-muted-foreground">{formatTime(departure.time)}</div>
        </div>
        
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="h-px bg-border flex-1"></div>
            <ArrowRight className="w-4 h-4" />
            <div className="h-px bg-border flex-1"></div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">{arrival.code}</div>
          <div className="text-sm text-muted-foreground">{arrival.city}</div>
          <div className="text-xs text-muted-foreground">{formatTime(arrival.time)}</div>
        </div>
      </div>

      {/* Date */}
      <div className="flex items-center space-x-2 mb-4 text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span className="text-sm">{formatDate(date)}</span>
      </div>

      {/* Ticket Type and Options */}
      <div className="flex items-center space-x-2 mb-4 text-muted-foreground">
        <span className="text-sm">{ticketType}</span>
        {!isRefundable && (
          <span className="text-sm text-green-500">• Transferable</span>
        )}
      </div>

      {/* Price and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <div>
            {status === 'Bidding' && currentBid ? (
              <div>
                <span className="text-lg font-bold text-foreground">{currentBid}</span>
                <span className="text-sm text-muted-foreground ml-1">(current bid)</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-foreground">{price}</span>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {showBuyButton && (
            <Button 
              onClick={() => onBuy && onBuy(ticket)}
              className="bg-primary hover:bg-primary/90"
            >
              {status === 'Bidding' ? 'Place Bid' : 'Buy Now'}
            </Button>
          )}
          {showResellButton && (
            <Button 
              variant="outline" 
              onClick={() => onResell && onResell(ticket)}
            >
              Resell
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketCard

