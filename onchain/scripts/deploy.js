const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  // --- DEPLOY TicketNFT ---
  const TicketNFT = await ethers.getContractFactory("TicketNFT");
  // The marketplace address is not known yet, so we pass the zero address and update it later.
  const ticketNFT = await TicketNFT.deploy(deployer.address, ethers.ZeroAddress);
  await ticketNFT.waitForDeployment();
  const ticketNFTAddress = await ticketNFT.getAddress();
  console.log("TicketNFT deployed to:", ticketNFTAddress);

  // --- DEPLOY SeatSwapMarketplace ---
  // Using deployer address as a placeholder for treasury addresses.
  const platformTreasury = deployer.address; 
  const airlineTreasury = deployer.address;
  const platformFeeBasisPoints = 250; // 2.5%

  const SeatSwapMarketplace = await ethers.getContractFactory("SeatSwapMarketplace");
  const marketplace = await SeatSwapMarketplace.deploy(
    deployer.address,
    platformTreasury,
    airlineTreasury,
    platformFeeBasisPoints,
    ticketNFTAddress // Pass the deployed TicketNFT address
  );
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log("SeatSwapMarketplace deployed to:", marketplaceAddress);

  // --- POST-DEPLOYMENT CONFIGURATION ---

  // 1. Set the correct marketplace address on the TicketNFT contract
  console.log("Setting marketplace address on TicketNFT contract...");
  let tx = await ticketNFT.setMarketplaceAddress(marketplaceAddress);
  await tx.wait();
  console.log("Marketplace address set successfully.");

  // 2. Transfer ownership of the TicketNFT contract to the Marketplace
  // This is a crucial security step so only the marketplace can mint new tickets.
  console.log("Transferring ownership of TicketNFT to SeatSwapMarketplace...");
  tx = await ticketNFT.transferOwnership(marketplaceAddress);
  await tx.wait();
  console.log("Ownership transferred successfully.");

  console.log("Deployment and configuration complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 