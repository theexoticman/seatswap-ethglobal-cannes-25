// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./TicketNFT.sol"; // Import our custom TicketNFT contract

contract SeatSwapMarketplace is Ownable, ReentrancyGuard {
    // --- Constants --- //
    address public immutable platformTreasury;
    address public immutable airlineTreasury;
    uint256 public platformFeeBasisPoints; // e.g., 250 for 2.5%
    uint256 public constant BID_INCREMENT = 1 ether; // $1 bid increment (assuming 1 ether = $1 for simplicity)
    uint256 public constant AUCTION_DURATION = 24 hours;

    // --- Data Structures --- //
    struct Auction {
        uint256 tokenId;
        address payable seller;
        uint256 highestBid;
        address payable highestBidder;
        uint256 auctionEndTime;
        uint256 minBid; // Half the initial ticket price
        bool ended;
    }

    // --- State Variables --- //

    // This is the correct way for the marketplace to reference the NFT contract it manages.
    TicketNFT public ticketNFT;

    mapping(string => uint256) public pnrToTokenId;
    
    mapping(uint256 => Auction) public auctions;
    mapping(address => uint256) public refunds;

    // --- Events --- //
    event TicketMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string pnr
    );
    event TicketListedForAuction(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 minBid
    );
    event BidPlaced(
        uint256 indexed tokenId,
        address indexed bidder,
        uint256 amount,
        uint256 highestBid
    );
    event AuctionEnded(
        uint256 indexed tokenId,
        address indexed winner,
        uint256 finalPrice,
        uint256 platformFee,
        uint256 airlineFee
    );
    event ListingCancelled(uint256 indexed tokenId);
    event RefundClaimed(address indexed beneficiary, uint256 amount);

    // --- Constructor --- //
    constructor(
        address initialOwner,
        address _platformTreasury,
        address _airlineTreasury,
        uint256 _platformFeeBasisPoints,
        address _ticketNFTAddress // REFACTOR: Added NFT contract address to constructor
    ) Ownable(initialOwner) {
        require(_platformTreasury != address(0), "Platform treasury cannot be zero");
        require(_airlineTreasury != address(0), "Airline treasury cannot be zero");
        require(_platformFeeBasisPoints <= 10000, "Platform fee cannot exceed 100%");
        require(_ticketNFTAddress != address(0), "TicketNFT address cannot be zero");

        platformTreasury = _platformTreasury;
        airlineTreasury = _airlineTreasury;
        platformFeeBasisPoints = _platformFeeBasisPoints;
        ticketNFT = TicketNFT(_ticketNFTAddress);
    }

    // --- Modifiers --- //
    modifier onlyTicketOwner(uint256 _tokenId) {
        require(ticketNFT.ownerOf(_tokenId) == msg.sender, "Not the owner of the ticket");
        _;
    }

    // --- Core Functions --- //

  
    function mintTicket(
        address to,
        string calldata pnr
    ) public nonReentrant {

        // Example data for the new ticket details.
        // In a real app, this would come from a trusted source or oracle.
        address mockAirlineAddress = airlineTreasury;
        uint256 airlineFee = 50 * 1 ether; 

        uint256 newTokenId = ticketNFT.mint(
            to,
            pnr,    
            mockAirlineAddress,
            airlineFee
        );

        pnrToTokenId[pnr] = newTokenId;
        emit TicketMinted(newTokenId, to, pnr);
    }

    /**
     * @dev Allows a seller to list their NFT for auction.
     * The NFT must be approved to the marketplace contract before calling this function.
     * @param _tokenId The ID of the NFT to list.
     * @param _initialPrice The initial fixed price of the ticket (used to calculate minBid).
     */
    function listTicketForAuction(uint256 _tokenId, uint256 _initialPrice) public payable nonReentrant onlyTicketOwner(_tokenId) {
        require(_initialPrice > 0, "Initial price must be greater than zero");
        require(auctions[_tokenId].seller == address(0), "Ticket already listed for auction");
        require(ticketNFT.getApproved(_tokenId) == address(this), "NFT not approved for marketplace");

        // --- FEE ON TRANSFER LOGIC ---
        TicketNFT.TicketDetails memory details = ticketNFT.getTicketDetails(_tokenId);
        require(msg.value == details.airlineFee, "Must send exact airline fee to list");
        payable(airlineTreasury).transfer(msg.value);
        // --- END FEE LOGIC ---

        // Calculate minBid as half the initial price
        uint256 calculatedMinBid = _initialPrice / 2;

        auctions[_tokenId] = Auction({
            tokenId: _tokenId,
            seller: payable(msg.sender),
            highestBid: 0,
            highestBidder: payable(address(0)),
            auctionEndTime: block.timestamp + AUCTION_DURATION,
            minBid: calculatedMinBid,
            ended: false
        });

        // Transfer NFT to the marketplace contract to hold it during auction
        ticketNFT.transferFrom(msg.sender, address(this), _tokenId);

        emit TicketListedForAuction(_tokenId, msg.sender, calculatedMinBid);
    }

    /**
     * @dev Allows a bidder to place a bid on an NFT.
     * @param _tokenId The ID of the NFT to bid on.
     */
    function placeBid(uint256 _tokenId) public payable nonReentrant {
        Auction storage auction = auctions[_tokenId];
        require(auction.seller != address(0), "Ticket not listed for auction");
        require(block.timestamp < auction.auctionEndTime, "Auction has ended");
        require(msg.sender != auction.seller, "Seller cannot bid on their own ticket");

        // Get ticket details from TicketNFT to calculate airline fee
        TicketNFT.TicketDetails memory details = ticketNFT.getTicketDetails(_tokenId);
        uint256 airlineFee = details.airlineFee;

        // Calculate fees for this bid
        uint256 currentPlatformFee = (msg.value * platformFeeBasisPoints) / 10000;
        uint256 totalFees = currentPlatformFee + airlineFee;

        require(msg.value > auction.highestBid, "Bid must be higher than current highest bid");
        require(msg.value >= auction.minBid, "Bid must be at least the minimum bid");
        require(msg.value >= auction.highestBid + BID_INCREMENT, "Bid must be at least 1$ higher than current highest bid");
        require(msg.value > totalFees, "Bid amount must cover fees");

        // If there's a previous highest bidder, refund their funds
        if (auction.highestBidder != payable(address(0))) {
            refunds[auction.highestBidder] += auction.highestBid;
        }

        // Update highest bid and bidder
        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);

        // Pay platform and airline fees immediately on each new bid
        payable(platformTreasury).transfer(currentPlatformFee);
        payable(airlineTreasury).transfer(airlineFee);

        emit BidPlaced(_tokenId, msg.sender, msg.value, auction.highestBid);
    }

    /**
     * @dev Allows losing bidders to claim their refunds.
     */
    function claimRefund() public nonReentrant {
        uint256 refundAmount = refunds[msg.sender];
        require(refundAmount > 0, "No refund available");

        refunds[msg.sender] = 0;
        payable(msg.sender).transfer(refundAmount);

        emit RefundClaimed(msg.sender, refundAmount);
    }

    /**
     * @dev Ends the auction and transfers the NFT to the highest bidder.
     * Can be called by anyone after the auction ends.
     * @param _tokenId The ID of the NFT whose auction is to be ended.
     */
    function endAuction(uint256 _tokenId) public nonReentrant {
        Auction storage auction = auctions[_tokenId];
        require(auction.seller != address(0), "Ticket not listed for auction");
        require(block.timestamp >= auction.auctionEndTime, "Auction has not ended yet");
        require(!auction.ended, "Auction already ended");

        auction.ended = true;

        if (auction.highestBidder != payable(address(0))) {
            // Transfer NFT to the highest bidder
            ticketNFT.transferFrom(address(this), auction.highestBidder, _tokenId);

            // Pay seller (highest bid minus fees already collected)
            uint256 finalPlatformFee = (auction.highestBid * platformFeeBasisPoints) / 10000;
            TicketNFT.TicketDetails memory details = ticketNFT.getTicketDetails(_tokenId);
            uint256 finalAirlineFee = details.airlineFee;

            uint256 sellerPayout = auction.highestBid - finalPlatformFee - finalAirlineFee;
            require(sellerPayout >= 0, "Seller payout cannot be negative");

            payable(auction.seller).transfer(sellerPayout);

            emit AuctionEnded(
                _tokenId,
                auction.highestBidder,
                auction.highestBid,
                finalPlatformFee,
                finalAirlineFee
            );
        } else {
            // No bids, transfer NFT back to seller
            ticketNFT.transferFrom(address(this), auction.seller, _tokenId);
            emit AuctionEnded(_tokenId, address(0), 0, 0, 0);
        }
    }

    /**
     * @dev Allows the seller to cancel their listing before any bids are placed.
     * Transfers NFT back to the seller.
     * @param _tokenId The ID of the NFT to delist.
     */
    function cancelListing(uint256 _tokenId) public nonReentrant onlyTicketOwner(_tokenId) {
        Auction storage auction = auctions[_tokenId];
        require(auction.seller != address(0), "Ticket not listed for auction");
        require(auction.highestBid == 0, "Cannot cancel auction with bids");
        require(auction.seller == msg.sender, "Only the seller can cancel this listing");

        // Transfer NFT back to seller
        ticketNFT.transferFrom(address(this), msg.sender, _tokenId);

        // Mark auction as ended
        auction.ended = true;

        emit ListingCancelled(_tokenId);
    }

    /**
     * @dev Allows the current owner of the NFT to mark a ticket as redeemed.
     * Calls the claimTicket function on the TicketNFT contract.
     * @param _tokenId The ID of the ticket NFT to mark as redeemed.
     */
    function claimTicket(uint256 _tokenId) public nonReentrant {
        require(ticketNFT.ownerOf(_tokenId) == msg.sender, "Only the NFT owner can claim ticket");
        ticketNFT.claimTicket(_tokenId);
    }

    // --- Owner-only Functions --- //

    /**
     * @dev Sets a new platform fee basis points.
     * Only callable by the contract owner.
     * @param _newPlatformFeeBasisPoints The new platform fee in basis points (e.g., 250 for 2.5%).
     */
    function setPlatformFee(uint256 _newPlatformFeeBasisPoints) public onlyOwner {
        require(_newPlatformFeeBasisPoints <= 10000, "Platform fee cannot exceed 100%");
        platformFeeBasisPoints = _newPlatformFeeBasisPoints;
    }

    // Fallback function to receive Ether
    receive() external payable {}
    fallback() external payable {}
}


