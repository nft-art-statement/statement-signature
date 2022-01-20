// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StatementSignature is ERC721 {

    // TODO set document cid
    string public statementCid = "ipfs://[doc_pdf_cid]";
    mapping(address => bool) public signedAddressMap;

    modifier disabled { revert("Disabled"); _; }

    event Sign(address indexed signer);

    constructor() ERC721("StatementSignature", "SS") {}

    function signToStatement() public {
        signedAddressMap[msg.sender] = true;
        emit Sign(msg.sender);
    }

    function signToStatementAndMintBadge() public {
        signedAddressMap[msg.sender] = true;
        _safeMint(msg.sender, uint256(uint160(msg.sender)));
        emit Sign(msg.sender);
    }

    // Disabled ERC721 interfaces
    function approve(address to, uint256 tokenId) public virtual override disabled {}
    function setApprovalForAll(address operator, bool approved) public virtual override disabled {}
    function safeTransferFrom(address from, address to, uint256 tokenId) public override disabled {}
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override disabled {}
    function transferFrom(address from, address to, uint256 tokenId) public virtual override disabled {}
}

