// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StatementSignature is ERC721 {

    uint256 private _nextTokenId;
    string public statementCid = "ipfs://[doc_pdf_cid]";
    mapping(address => bool) public signedAddressMap;

    event Sign(address indexed signer);

    constructor() ERC721("StatementSignature", "SS") {}

    function signToStatement() public {
        signedAddressMap[msg.sender] = true;
        emit Sign(msg.sender);
    }

    function signToStatementAndMintBadge() public {
        signedAddressMap[msg.sender] = true;
        _safeMint(msg.sender, _nextTokenId++);
        emit Sign(msg.sender);
    }

    // Disable ERC721 functions

    function safeTransferFrom(address from, address to, uint256 tokenId) public override {}
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {}
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {}
}

