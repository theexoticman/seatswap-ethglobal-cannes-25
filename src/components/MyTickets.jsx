import React, { useState } from 'react'
import TicketCard from './TicketCard'
import { userTickets } from '../data/sampleTickets'

const MyTickets = () => {
  const [tickets] = useState(userTickets)

  const handleResellTicket = (ticket) => {
    console.log('Resell ticket:', ticket)
    // This will trigger navigation to sell ticket page or modal in a later phase
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">My Tickets</h2>
        <p className="text-muted-foreground">View and manage your flight tickets.</p>
      </div>
      
      {tickets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No tickets yet</h3>
          <p className="text-muted-foreground">You haven't purchased any tickets yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              showResellButton={ticket.status === 'Redeemable' || ticket.status === 'Available'}
              onResell={handleResellTicket}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MyTickets

