import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import TicketCard from './TicketCard'
import SellTicketModal from './SellTicketModal'
import PriceInputModal from './PriceInputModal'
import SuccessModal from './SuccessModal'
import SummaryModal from './SummaryModal'
import MintingSuccessModal from './MintingSuccessModal'
import { marketplaceAddress, marketplaceAbi } from '@/contract-config'
import { toast } from 'sonner'

const MyTickets = ({ userTickets }) => {
  const location = useLocation()
  const [tickets, setTickets] = useState(userTickets)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [isMintingSuccessModalOpen, setIsMintingSuccessModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [listingPrice, setListingPrice] = useState(null)
  const [transactionHash, setTransactionHash] = useState(null)

  useEffect(() => {
    if (location.state?.foundTicket) {
      // Add the found ticket to the list of tickets
      setTickets(prevTickets => [...prevTickets, location.state.foundTicket])
    }
  }, [location.state])

  const handleResellClick = (ticket) => {
    setSelectedTicket(ticket)
    setIsPriceModalOpen(true)
  }

  const handlePriceSubmit = (price) => {
    setListingPrice(price)
    setIsPriceModalOpen(false)
    setIsSummaryModalOpen(true)
  }

  const handleConfirmListing = async () => {
    setIsSummaryModalOpen(false)
    toast.info("Minting ticket as an NFT... Please confirm in your wallet.")

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const marketplaceContract = new ethers.Contract(marketplaceAddress, marketplaceAbi, signer)

      // We need a PNR for the mint function. Let's create one from the ticket details.
      const pnr = `${selectedTicket.airline.slice(0, 3).toUpperCase()}-${selectedTicket.id}`
      
      const tx = await marketplaceContract.mintTicket(signer.address, pnr)
      
      toast.loading("Waiting for transaction confirmation...")
      const receipt = await tx.wait()

      setTransactionHash(receipt.hash)
      setIsMintingSuccessModalOpen(true)

      // You might want to update the ticket status here
      // e.g., by calling a function passed from App.jsx
    } catch (error) {
      console.error("NFT Minting failed:", error)
      toast.error("NFT Minting failed. Please check the console for details.")
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">My Tickets - Sell Ticket</h2>
        <p className="text-muted-foreground">View and manage your flight tickets. Import tickets to sell them.</p>
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
              showResellButton={ticket.status === 'Redeemable' || ticket.status === 'Registered'}
              onResell={() => handleResellClick(ticket)}
            />
          ))}
        </div>
      )}

      <SellTicketModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onConfirm={() => {}}
        ticket={selectedTicket}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onComplete={() => {}}
      />

      {selectedTicket && (
        <PriceInputModal
          isOpen={isPriceModalOpen}
          onClose={() => setIsPriceModalOpen(false)}
          onSubmit={handlePriceSubmit}
          ticket={selectedTicket}
        />
      )}

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        onConfirm={handleConfirmListing}
        payout={listingPrice || 0}
      />

      <MintingSuccessModal
        isOpen={isMintingSuccessModalOpen}
        onClose={() => setIsMintingSuccessModalOpen(false)}
        transactionHash={transactionHash}
      />
    </div>
  )
}

export default MyTickets

