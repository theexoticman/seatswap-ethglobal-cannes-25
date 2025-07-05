# SeatSwap - A Decentralized Flight Ticket Marketplace

SeatSwap is a decentralized application that reimagines the flight ticket resale market. By leveraging Zero-Knowledge (ZK) proofs and representing tickets as NFTs, SeatSwap unlocks new liquidity for a traditionally illiquid asset. It enables a robust secondary market where tickets can be resold through various models, including auctions.

A key innovation of this model is its approach to privacy and compliance. NFT acquisition and resale on the secondary market can happen in a permissionless manner. Only the final ticket holder who intends to travel must provide their KYC data directly to the airline for redemption, dramatically reducing friction for traders and speculators.

This project was built for ETHGlobal, integrating a React frontend, a Next.js backend for identity verification, and Solidity smart contracts for on-chain logic.


## ✨ Features

### Core Functionality
- **Decentralized Identity**: Uses the Self.xyz SDK to verify ticket ownership, wihtout storing PII information, using ZK proofs, ensuring user privacy and compliance.
- **NFT-Based Tickets**: Converts verified flight reservations into liquid asset represented as NFTs on the blockchain.
- **Marketplace**: Browse and manage tickets represented as unique on-chain assets. Helps defines predetermined fees on the NFT acquisition and/or Bid for the Airlines and for SeatSwap.
- **Wallet Integration**: Connects with browser wallets like MetaMask to manage NFT Minting on the SeatSwap Marketplace.

### Ticket Management
- **Secure Import Flow**: A multi-step process to find, import, and cryptographically verify ownership of a ticket.
- **On-Chain Selling**: A streamlined flow to set a price and mint a verified ticket as an NFT for listing.
- **Status Tracking**: Clear visual indicators for ticket states (e.g., Redeemable, Registered).

## 🛠 Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend (ID Verification)**: Self.xyz SDK using Next.js
- **Blockchain**: Celo, Sepolia, Ethers.js, Solidity, 
- **Identity**: Self.xyz SDK for Zero-Knowledge Proofs
- **Development**: `concurrently` for running multiple services at the same time from within the same project, `npm` for package management

## 📁 Project Structure

The project is structured as a monorepo with three distinct parts: a frontend, a backend for verification (server), and the on-chain contracts (onchain).

```
seatswap/
├── src (frontend - react)/
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── Marketplace.jsx     # Marketplace page
├── server
│   ├── verification
├── onchain
│   ├── contracts

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (highly recommended)
- [ngrok](https://ngrok.com/) (for exposing the local backend to the Self.xyz service)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/seatswap.git
    cd seatswap
    ```

2.  **Install root dependencies** (for running services concurrently)
    ```bash
    pnpm install
    ```

3.  **Install backend dependencies**
    ```bash
    cd server
    pnpm install
    cd ..
    ```

### Environment Setup

This project requires environment variables for both the frontend and backend to communicate with the Self.xyz identity service. Template files are provided in the root and `server` directories.

1.  **Backend Server Environment**
    Create a file at `server/.env.local`. Copy the contents of `server/.env_template` and fill in the values. The `PUBLIC_URL` must be your public-facing ngrok URL.
    
    `server/.env.local`:
    ```
    # Port for the backend service (Next.js defaults to 3001 if not specified)
    PORT=3001
    
    # URL from ngrok to expose your local URL publicly for Self
    PUBLIC_URL="https://your-ngrok-url.ngrok-free.app/api/verify"
    ```

2.  **Frontend Environment**
    Create a file at the project root (`.`) named `.env.local`. Copy the contents of `.env_template` and fill in the values.
    
    `.env.local`:
    ```
    # Your Self.xyz application scope name
    VITE_SELF_SCOPE="your-app-scope"

    # URL from ngrok to expose your local URL publicly for Self
    VITE_SELF_ENDPOINT="https://your-ngrok-url.ngrok-free.app/api/verify"
    ```

### Running the Application

1.  **Expose your backend server** using ngrok. The `PORT` must match what you defined in `server/.env.local` (e.g., `3001`).
    ```bash
    ngrok http 3001
    ```
    Copy the public HTTPS URL provided by ngrok and update it in your two `.env.local` files.

2.  **Start all services** from the root directory. This will launch the React frontend and the Next.js backend concurrently.
    ```bash
    pnpm run dev
    ```

3.  **Open in browser**
    Navigate to `http://localhost:5173`.

## 🎯 User Flows

### Importing a Ticket with ZK Verification
1.  Navigate to the "Import Reservation" tab and use the form to find a reservation.
2.  In the details modal, click "Import Reservation". The ticket is immediately added to the "My Tickets" tab with a "Registered" status.
3.  The **Identity Verification** modal appears, displaying a unique QR code.
4.  Scan the QR code with the Self mobile app. This generates a Zero-Knowledge proof on the user's device, confirming ownership without revealing private data.
5.  The backend verifies the proof. On success, the user is notified, and the ticket is now ready to be sold.

### Selling a Verified Ticket as an NFT
1.  Navigate to the "My Tickets" tab. All imported and owned tickets are displayed here.
2.  Click "Resell" on a ticket.
3.  A modal appears to set the desired selling price.
4.  After setting a price, a **Summary Modal** shows the final listing details.
5.  Clicking "Confirm Listing" initiates a transaction to call the `mintTicket` function on the smart contract.
6.  The user confirms the transaction in their wallet (e.g., MetaMask).
7.  Upon confirmation, a success modal appears with a link to view the transaction on Etherscan.



## 🚀 Deployment

- **Frontend**: Build the static assets with `pnpm run build` and deploy to any static hosting provider like Vercel or Netlify.
- **Backend**: The Next.js API route in the `server` directory must be deployed as a serverless function.
- **Webhook URL**: The deployed backend endpoint must be publicly accessible, and the `VITE_SELF_ENDPOINT` and `NEXT_PUBLIC_SELF_ENDPOINT` environment variables must be updated to this public URL.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for ETHGlobal and is available under the GPL License.

---

Built with ❤️ for ETHGlobal using modern web technologies and inspired by the beautiful city of Cannes.

