const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // --- DEPLOY TicketNFT ---
  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  const ticketNFT = await TicketNFT.deploy(deployer.address);
  await ticketNFT.waitForDeployment();
  const ticketNFTAddress = await ticketNFT.getAddress();
  console.log("TicketNFT deployed to:", ticketNFTAddress);

  // --- DEPLOY SeatSwapMarketplace ---
  const platformTreasury = deployer.address; 
  const airlineTreasury = deployer.address;
  const platformFeeBasisPoints = 250; // 2.5%

  const SeatSwapMarketplace = await ethers.getContractFactory("SeatSwapMarketplace");
  const marketplace = await SeatSwapMarketplace.deploy(
    deployer.address,
    platformTreasury,
    airlineTreasury,
    platformFeeBasisPoints,
    ticketNFTAddress
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("SeatSwapMarketplace deployed to:", marketplaceAddress);

  // --- POST-DEPLOYMENT CONFIGURATION ---
  console.log("Setting marketplace address on TicketNFT contract...");
  let tx = await ticketNFT.setMarketplaceAddress(marketplaceAddress);
  await tx.wait();
  console.log("Marketplace address set successfully.");

  console.log("Granting MINTER_ROLE to SeatSwapMarketplace...");
  const MINTER_ROLE = await ticketNFT.MINTER_ROLE();
  tx = await ticketNFT.grantRole(MINTER_ROLE, marketplaceAddress);
  await tx.wait();
  console.log("MINTER_ROLE granted successfully.");

  console.log("Minting a sample ticket to the deployer address...");
  const samplePNR = "SEATSWAP123";
  tx = await marketplace.mintTicket(deployer.address, samplePNR);
  await tx.wait();
  console.log(`Ticket with PNR "${samplePNR}" minted successfully to ${deployer.address}.`);

  console.log("Deployment and configuration complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 