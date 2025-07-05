export const SEATSWAP_MARKETPLACE = {
  address: '0xYourMarketplaceAddress', // Replace with the actual marketplace address
  abi: [
    // Replace with the actual ABI of the marketplace contract
    {
      "constant": false,
      "inputs": [
        { "name": "payout", "type": "uint256" },
        { "name": "airlineFee", "type": "uint256" },
        { "name": "platformFee", "type": "uint256" },
        { "name": "totalPrice", "type": "uint256" },
        { "name": "pnr", "type": "string" },
        { "name": "passengerName", "type": "string" },
        { "name": "walletAddress", "type": "address" }
      ],
      "name": "mintTicket",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} 