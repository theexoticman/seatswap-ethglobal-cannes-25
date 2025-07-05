// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketNFT is ERC721, Ownable, ReentrancyGuard {
    struct TicketDetails {
        string airlineName;
        string flightNumber;
        uint256 departureDate;
        string origin;
        string destination;
        bytes32 pnrHash;
        uint256 airlineFee;
        bool redeemed;
    }

    // Mapping from tokenId to TicketDetails
    mapping(uint256 => TicketDetails) private _ticketDetails;

    // Counter for new tokens
    uint256 private _nextTokenId;

    // Address of the SeatSwapMarketplace contract
    address public marketplaceAddress;

    event TicketMinted(
        address indexed to,
        uint256 indexed tokenId,
        string airlineName,
        string flightNumber,
        uint256 departureDate,
        string origin,
        string destination,
        uint256 airlineFee
    );
    event TicketRedeemed(uint256 indexed tokenId);

    constructor(address initialOwner, address _marketplaceAddress) ERC721("TicketNFT", "TKT") Ownable(initialOwner) {
        require(_marketplaceAddress != address(0), "Marketplace address cannot be zero");
        marketplaceAddress = _marketplaceAddress;
    }

    /**
     * @dev Mints a new NFT with ticket details to the caller.
     * Anyone can mint a ticket.
     * @param _airlineName The name of the airline.
     * @param _flightNumber The flight number.
     * @param _departureDate The departure date as a Unix timestamp.
     * @param _origin The origin airport code.
     * @param _destination The destination airport code.
     * @param _pnrHash The SHA256 hash of the PNR.
     * @param _airlineFee The fee to be paid to the airline for this specific ticket.
     */
    function mintTicket(
        string memory _airlineName,
        string memory _flightNumber,
        uint256 _departureDate,
        string memory _origin,
        string memory _destination,
        bytes32 _pnrHash,
        uint256 _airlineFee
    ) public returns (uint256) {
        _nextTokenId++;
        uint256 newTokenId = _nextTokenId;
        _safeMint(msg.sender, newTokenId);

        _ticketDetails[newTokenId] = TicketDetails({
            airlineName: _airlineName,
            flightNumber: _flightNumber,
            departureDate: _departureDate,
            origin: _origin,
            destination: _destination,
            pnrHash: _pnrHash,
            airlineFee: _airlineFee,
            redeemed: false
        });

        // Optionally set token URI if metadata URI support is desired
        // _setTokenURI(newTokenId, _tokenURI);

        emit TicketMinted(
            msg.sender,
            newTokenId,
            _airlineName,
            _flightNumber,
            _departureDate,
            _origin,
            _destination,
            _airlineFee
        );

        return newTokenId;
    }

    /**
     * @dev Returns the details of a specific ticket.
     * @param tokenId The ID of the ticket NFT.
     * @return TicketDetails struct containing all ticket information.
     */
    function getTicketDetails(uint256 tokenId)
        public
        view
        returns (
            string memory airlineName,
            string memory flightNumber,
            uint256 departureDate,
            string memory origin,
            string memory destination,
            bytes32 pnrHash,
            uint256 airlineFee,
            bool redeemed
        )
    {
        TicketDetails storage details = _ticketDetails[tokenId];
        return (
            details.airlineName,
            details.flightNumber,
            details.departureDate,
            details.origin,
            details.destination,
            details.pnrHash,
            details.airlineFee,
            details.redeemed
        );
    }

    /**
     * @dev Marks a ticket as redeemed.
     * Only the current owner of the NFT can call this function.
     * @param tokenId The ID of the ticket NFT to mark as redeemed.
     */
    function claimTicket(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Only NFT owner can claim ticket");
        require(_ticketDetails[tokenId].redeemed == false, "Ticket already redeemed");

        _ticketDetails[tokenId].redeemed = true;
        emit TicketRedeemed(tokenId);
    }

    /**
     * @dev Overrides the ERC721 _transfer function to restrict transfers.
     * Only the marketplace contract or the owner can transfer NFTs.
     */
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        // Allow transfers by the marketplace contract
        if (msg.sender == marketplaceAddress) {
            super._transfer(from, to, tokenId);
        } else {
            // For other transfers, ensure the caller is the owner or approved
            require(ownerOf(tokenId) == msg.sender || getApproved(tokenId) == msg.sender || isApprovedForAll(ownerOf(tokenId), msg.sender), "NFT can only be transferred via marketplace or by owner/approved");
            super._transfer(from, to, tokenId);
        }
    }

    // The following functions are necessary to make the _transfer override work correctly
    // These are adjusted to allow the marketplace to manage approvals
    function approve(address to, uint256 tokenId) public override {
        // Allow marketplace to approve, or the owner of the token
        require(msg.sender == marketplaceAddress || ownerOf(tokenId) == msg.sender, "Only marketplace or NFT owner can approve transfers");
        super.approve(to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public override {
        // Allow marketplace to set approval for all, or the owner of the tokens
        require(msg.sender == marketplaceAddress || owner() == msg.sender, "Only marketplace or contract owner can set approval for all");
        super.setApprovalForAll(operator, approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        // Allow marketplace to transferFrom, or the owner/approved
        require(msg.sender == marketplaceAddress || _isApprovedOrOwner(msg.sender, tokenId), "NFT can only be transferred via marketplace or by owner/approved");
        super.transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override {
        // Allow marketplace to safeTransferFrom, or the owner/approved
        require(msg.sender == marketplaceAddress || _isApprovedOrOwner(msg.sender, tokenId), "NFT can only be safe transferred via marketplace or by owner/approved");
        super.safeTransferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override {
        // Allow marketplace to safeTransferFrom, or the owner/approved
        require(msg.sender == marketplaceAddress || _isApprovedOrOwner(msg.sender, tokenId), "NFT can only be safe transferred via marketplace or by owner/approved");
        super.safeTransferFrom(from, to, tokenId, data);
    }

    // Function to update the marketplace address (only callable by owner)
    function setMarketplaceAddress(address _newMarketplaceAddress) public onlyOwner {
        require(_newMarketplaceAddress != address(0), "New marketplace address cannot be zero");
        marketplaceAddress = _newMarketplaceAddress;
    }
}


