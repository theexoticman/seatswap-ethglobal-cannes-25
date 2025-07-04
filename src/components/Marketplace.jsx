import React, { useState } from 'react'
import TicketCard from './TicketCard'
import ConfirmationModal from './ConfirmationModal'
import { marketplaceTickets } from '../data/sampleTickets'

const Marketplace = () => {
  const [tickets] = useState(marketplaceTickets)
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    ticket: null,
    isLoading: false
  })

  const handleBuyTicket = (ticket) => {
    const modalType = ticket.status === 'Bidding' ? 'bid' : 'buy'
    setModalState({
      isOpen: true,
      type: modalType,
      ticket: ticket,
      isLoading: false
    })
  }

  const handleConfirmPurchase = async () => {
    setModalState(prev => ({ ...prev, isLoading: true }))
    
    // Simulate API call
    setTimeout(() => {
      setModalState({
        isOpen: true,
        type: 'success',
        ticket: modalState.ticket,
        isLoading: false
      })
    }, 2000)
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      type: null,
      ticket: null,
      isLoading: false
    })
  }

  const handleSuccessConfirm = () => {
    handleCloseModal()
    // Here you could redirect to My Tickets or refresh the marketplace
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Marketplace</h2>
        <p className="text-muted-foreground">Browse available flight tickets for resale.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            showBuyButton={ticket.status !== 'Redeemed'}
            onBuy={handleBuyTicket}
          />
        ))}
      </div>

      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onConfirm={modalState.type === 'success' ? handleSuccessConfirm : handleConfirmPurchase}
        type={modalState.type}
        ticket={modalState.ticket}
        isLoading={modalState.isLoading}
      />
    </div>
  )
}

export default Marketplace

