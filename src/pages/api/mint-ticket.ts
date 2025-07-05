import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { payout, airlineFee, platformFee, totalPrice, pnr, passengerName, walletAddress } = req.body

    // Mock response for now
    res.status(200).json({ success: true, message: 'Ticket listed successfully' })
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' })
  }
} 