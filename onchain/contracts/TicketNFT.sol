// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketNFT is ERC721, Ownable, ReentrancyGuard {
    // --- Data Structures --- //
    struct TicketDetails {
        string pnr;
        address airlineAddress;
        uint256 airlineFee;
        bool redeemed;
    }

    mapping(uint256 => TicketDetails) private _ticketDetails;
    uint256 private _nextTokenId;
    address public marketplaceAddress;

    event TicketMinted(
        address indexed to,
        uint256 indexed tokenId,
        string pnr,
        address airlineAddress,
        uint256 airlineFee
    );
    event TicketRedeemed(uint256 indexed tokenId);

    constructor(
        address initialOwner,
        address _marketplaceAddress
    ) ERC721("TicketNFT", "TKT") Ownable(initialOwner) {
        // Allow zero address only during deployment, it will be set correctly later.
        if (_marketplaceAddress != address(0)) {
            marketplaceAddress = _marketplaceAddress;
        }
    }

    function mint(
        address to,
        string memory _pnr,
        address _airlineAddress,
        uint256 _airlineFee
    ) public onlyOwner returns (uint256) {
        _nextTokenId++;
        uint256 newTokenId = _nextTokenId;
        _safeMint(to, newTokenId);

        _ticketDetails[newTokenId] = TicketDetails({
            pnr: _pnr,
            airlineAddress: _airlineAddress,
            airlineFee: _airlineFee,
            redeemed: false
        });

        emit TicketMinted(to, newTokenId, _pnr, _airlineAddress, _airlineFee);
        return newTokenId;
    }

    function getTicketDetails(uint256 tokenId) public view returns (TicketDetails memory) {
        return _ticketDetails[tokenId];
    }

    function claimTicket(uint256 tokenId) public nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Only NFT owner can claim ticket");
        require(!_ticketDetails[tokenId].redeemed, "Ticket already redeemed");
        _ticketDetails[tokenId].redeemed = true;
        emit TicketRedeemed(tokenId);
    }
    
    function setMarketplaceAddress(address _newMarketplaceAddress) public onlyOwner {
        require(_newMarketplaceAddress != address(0), "New marketplace address cannot be zero");
        marketplaceAddress = _newMarketplaceAddress;
    }

}
