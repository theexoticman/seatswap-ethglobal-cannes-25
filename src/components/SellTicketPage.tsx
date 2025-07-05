import React, { useState } from 'react'
import SellTicketModal from './SellTicketModal'
import SummaryModal from './SummaryModal'

const SellTicketPage = () => {
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false)
  const [payout, setPayout] = useState<number | null>(null)

  const handleSellTicket = () => {
    setIsSellModalOpen(true)
  }

  const handlePayoutSubmit = (payout: number) => {
    setPayout(payout)
    setIsSellModalOpen(false)
    setIsSummaryModalOpen(true)
  }

  const handleConfirmListing = () => {
    // Mock API call to mint the NFT
    console.log('Minting NFT with payout:', payout)
    setIsSummaryModalOpen(false)
  }

  return (
    <div>
      <Button onClick={handleSellTicket}>Sell My Ticket</Button>
      <SellTicketModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmit={handlePayoutSubmit}
      />
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        payout={payout || 0}
        onConfirm={handleConfirmListing}
      />
    </div>
  )
}

export default SellTicketPage 