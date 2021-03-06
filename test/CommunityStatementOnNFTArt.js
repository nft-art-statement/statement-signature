const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CommunityStatementOnNFTArt", () => {
  let owner, alice, bob, carol;
  let nft;
  let CommunityStatementOnNFTArt;

  beforeEach(async () => {
    CommunityStatementOnNFTArt = await ethers.getContractFactory(
      "CommunityStatementOnNFTArt"
    );
    [owner, alice, bob, carol] = await ethers.getSigners();

    nft = await CommunityStatementOnNFTArt.deploy();
  });

  describe("signToStatement", () => {
    it("save msg.sender as signer", async () => {
      expect(await nft.signedAddressMap(await alice.getAddress())).to.equal(
        false
      );
      await nft.connect(alice).signToStatement();
      expect(await nft.signedAddressMap(await alice.getAddress())).to.equal(
        true
      );
    });

    it("emit event", async () => {
      const tx = await nft.connect(alice).signToStatement();
      const receipt = await tx.wait();
      expect(receipt.events.length).to.equal(1);
      const signEvent = receipt.events[0];
      expect(signEvent.args.signer).to.equal(await alice.getAddress());
    });

    it("does not emit event if already signed", async () => {
      await nft.connect(alice).signToStatement();
      const tx = await nft.connect(alice).signToStatement();
      const receipt = await tx.wait();
      expect(receipt.events.length).to.equal(0);
    });

    it("does not emit event if already signed and minted", async () => {
      await nft.connect(alice).signToStatementAndMintBadge();
      const tx = await nft.connect(alice).signToStatement();
      const receipt = await tx.wait();
      expect(receipt.events.length).to.equal(0);
    });
  });

  describe("signToStatementAndMintBadge", () => {
    it("save msg.sender as signer", async () => {
      expect(await nft.signedAddressMap(await alice.getAddress())).to.equal(
        false
      );
      await nft.connect(alice).signToStatementAndMintBadge();
      expect(await nft.signedAddressMap(await alice.getAddress())).to.equal(
        true
      );
    });

    it("mint a NFT", async () => {
      await nft.connect(alice).signToStatementAndMintBadge();
      const aliceTokenId = ethers.BigNumber.from(await alice.getAddress());
      expect(await nft.ownerOf(aliceTokenId.toString())).to.equal(
        await alice.getAddress()
      );
    });

    it("emit events", async () => {
      const tx = await nft.connect(alice).signToStatementAndMintBadge();
      const receipt = await tx.wait();
      expect(receipt.events.length).to.equal(2);
      const signEvent = receipt.events[0];
      expect(signEvent.args.signer).to.equal(await alice.getAddress());
    });

    it("only emit Transfer event if already signed", async () => {
      await nft.connect(alice).signToStatement();
      const tx = await nft.connect(alice).signToStatementAndMintBadge();
      const receipt = await tx.wait();

      expect(receipt.events.length).to.equal(1);
      expect(receipt.events[0].event).to.equal("Transfer");
    });
  });

  describe("tokenURI", () => {
    beforeEach(async () => {
      await nft.connect(alice).signToStatementAndMintBadge();
    });

    it("returns uri", async () => {
      const aliceTokenId = ethers.BigNumber.from(await alice.getAddress());
      expect(await nft.tokenURI(aliceTokenId)).to.equal("ipfs://[cid]");
    });

    it("throws an error if token is not exists", async () => {
      await expect(nft.tokenURI(0)).to.be.revertedWith(
        "CommunityStatementOnNFTArt: URI query for nonexistent token"
      );
    });
  });
});
