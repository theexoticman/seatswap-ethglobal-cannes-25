import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ethers } from 'ethers'
import TicketCard from './TicketCard'
import SellTicketModal from './SellTicketModal'
import PriceInputModal from './PriceInputModal'
import SuccessModal from './SuccessModal'
import SummaryModal from './SummaryModal'
import MintingSuccessModal from './MintingSuccessModal'
import { userTickets } from '@/data/sampleTickets'
import { marketplaceAddress, marketplaceAbi } from '@/contract-config'
import { toast } from 'sonner'

const MyTickets = ({ walletAddress }) => {
  const location = useLocation()
  const [tickets, setTickets] = useState([])
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [isMintingSuccessModalOpen, setIsMintingSuccessModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [payout, setPayout] = useState(null)
  const [mintingTxHash, setMintingTxHash] = useState(null)

  useEffect(() => {
    if (walletAddress) {
      // Mock: Show all user tickets when wallet is connected
      setTickets(userTickets)
    } else {
      setTickets([])
    }
  }, [walletAddress])

  useEffect(() => {
    if (location.state?.foundTicket) {
      // Add the found ticket to the list of tickets
      setTickets(prevTickets => [...prevTickets, location.state.foundTicket])
    }
  }, [location.state])

  const handleResellTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsVerificationModalOpen(true)
  }

  const handleVerificationConfirm = () => {
    setIsVerificationModalOpen(false)
    setIsSuccessModalOpen(true)
  }

  const handleSuccessComplete = () => {
    setIsSuccessModalOpen(false)
    setIsPriceModalOpen(true)
  }

  const handlePriceSubmit = (payout) => {
    setPayout(payout)
    setIsPriceModalOpen(false)
    setIsSummaryModalOpen(true)
  }

  const handleConfirmListing = async () => {
    if (!walletAddress || !selectedTicket) {
      toast.error("Wallet not connected or no ticket selected.");
      return;
    }
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask to use this feature.");
      return;
    }

    setIsSummaryModalOpen(false);
    const toastId = toast.loading("Minting your ticket NFT... Please wait.");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        marketplaceAbi,
        signer
      );
      
      const pnr = `PNR-${selectedTicket.id}-${Date.now()}`; // Create a unique PNR
      
      const tx = await marketplaceContract.mintTicket(walletAddress, pnr);
      await tx.wait();
      
      toast.dismiss(toastId);
      setMintingTxHash(tx.hash);
      setIsMintingSuccessModalOpen(true);

    } catch (error) {
      console.error('Error minting ticket:', error);
      toast.error("Minting Failed", {
        id: toastId,
        description: error.reason || "An unexpected error occurred.",
      });
    }
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
              showResellButton={ticket.status === 'Redeemable' || ticket.status === 'Registered'}
              onResell={() => handleResellTicket(ticket)}
            />
          ))}
        </div>
      )}

      <SellTicketModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onConfirm={handleVerificationConfirm}
        ticket={selectedTicket}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onComplete={handleSuccessComplete}
      />

      <PriceInputModal
        isOpen={isPriceModalOpen}
        onClose={() => setIsPriceModalOpen(false)}
        onSubmit={handlePriceSubmit}
      />

      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        payout={payout || 0}
        onConfirm={handleConfirmListing}
      />

      <MintingSuccessModal
        isOpen={isMintingSuccessModalOpen}
        onClose={() => setIsMintingSuccessModalOpen(false)}
        txHash={mintingTxHash}
      />
    </div>
  )
}

export default MyTickets

