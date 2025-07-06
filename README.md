# SeatSwap - A Decentralized Flight Ticket Marketplace

SeatSwap is a decentralized application that reimagines the flight ticket resale market. By leveraging Zero-Knowledge (ZK) proofs and representing tickets as NFTs, SeatSwap unlocks new liquidity for a traditionally illiquid asset. It enables a robust secondary market where tickets can be resold through various models, including auctions.

A key innovation of this model is its approach to privacy and compliance. NFT acquisition and resale on the secondary market can happen in a permissionless manner. Only the final ticket holder who intends to travel must provide their KYC data directly to the airline for redemption, dramatically reducing friction for traders and speculators.

This project was built for ETHGlobal, integrating a React frontend, a Next.js backend for identity verification, and Solidity smart contracts for on-chain logic.

## 🛠 Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS, shadcn/ui
- **Backend (ID Verification)**: Next.js API Routes
- **Blockchain**: Hardhat, Ethers.js, Solidity
- **Identity**: Self.xyz SDK for Zero-Knowledge Proofs
- **Development**: `concurrently` for running multiple services, `pnpm` for package management

## Dependencies

- **Node.js**: Version 18+ is required.
- **pnpm**: The recommended package manager for this project.
- **ngrok**: Required to create a secure, public-facing URL for the local backend server, which is necessary for the Self.xyz verification service to communicate with your application during development.

## 🚀 Getting Started

This section guides you through setting up the project for development and running a full demo.

### Phase 1: Environment Setup

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/theexoticman/seatswap-ethglobal-cannes-25.git
    cd seatswap-ethglobal-cannes-25
    ```

2.  **Install All Dependencies**
    Run the installation command from the root directory. The `postinstall` script will automatically install dependencies for the `server` and `onchain` directories as well.
    ```bash
    npm install
    ```

3.  **Set Up On-Chain Environment (`onchain/.env`)**
    Create an `.env` from `.env_template` file inside the `onchain` directory. This is required for deploying your smart contracts.
    ```
    SEPOLIA_RPC_URL="https://rpc-url/YOUR_INFURA_KEY"
    PRIVATE_KEY="YOUR_WALLET_PRIVATE_KEY"
    ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"  (Optional)
    ```
    *Ensure the wallet has Sepolia ETH for gas fees.*

4.  **Set Up Backend & Frontend Environments**
    - **Create ngrok Account**: You will need a free [ngrok](https://ngrok.com/) account.
    - **Update Backend Env (`server/.env`)** from `server/.env_template`: Create this file and add your ngrok URL.
      ```
      NEXT_PUBLIC_SELF_SCOPE="seatswap"
      # Replace with your ngrok URL. The port must match your backend server port (default 3001).
      NEXT_PUBLIC_SELF_ENDPOINT="https://your-ngrok-url.ngrok-free.app/api/verify"
       ```
    - **Update Frontend Env (`.env.local`)**: Create this file in the root directory.
      ```
      VITE_SELF_SCOPE="seatswap"
      VITE_SELF_ENDPOINT="https://your-ngrok-url.ngrok-free.app/api/verify"
       ```

### Phase 2: Running the Demo

1.  **Deploy Smart Contracts**
    From the root directory, run the Hardhat deployment script. This will deploy `TicketNFT.sol` and `SeatSwapMarketplace.sol` to the Sepolia testnet.
    ```bash
    npx hardhat run onchain/scripts/deploy.js --network sepolia
    ```
    After deployment, copy the new `SeatSwapMarketplace` contract address and paste it into `src/contract-config.js`.

2.  **Start the ngrok Tunnel**
    Open a new terminal and start ngrok to expose your backend server.
    ```bash
    # The port should match the one your Next.js server will use (default: 3001)
    ngrok http 3001
    ```
    *If you are using a new ngrok URL, remember to update your `.env.local` files again.*

3.  **Run the Application**
    From the root directory, run the `dev` script. This will start the Vite frontend and the Next.js backend simultaneously.
    ```bash
    pnpm run dev
    ```

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to interact with the SeatSwap dApp.

## 🎯 User Flows

### Importing a Ticket with ZK Verification
1.  Navigate to the "Import Reservation" tab and use the form to find a ticket.
2.  Click "Import Reservation" to add your ticket to the platform. To do this, we first need to verify you are the owner of that ticket.
3.  The **Identity Verification** process uses Self.xyz. Scan the QR code with the Self mobile app to prove ownership without revealing private data.

### Selling a Verified Ticket as an NFT
1.  Navigate to the "My Tickets" tab.
2.  Click "Resell" on a verified ticket.
3.  Set the price for the NFT.
4.  Review the details and mint your Ticket NFT.
5.  Approve the transaction in your wallet to mint the ticket as an NFT on the marketplace.
6.  If everything goes well, the NFT is minted and the Etherscan transaction URL will be displayed.


### Bidding for Tickets on the marketplace.

TODO


## 📄 License

This project is created for ETHGlobal and is available under the GPL License.

---

Built with ❤️ for ETHGlobal using modern web technologies and inspired by the beautiful city of Cannes.

