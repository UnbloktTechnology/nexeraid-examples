import { expect } from "chai";
import hre from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { getAddress } from "viem";

describe("ArtworkNFT", function () {
  async function deployArtworkNFTFixture() {
    const [owner, addr1, addr2] = await hre.viem.getWalletClients();

    const artworkNFT = await hre.viem.deployContract("ArtworkNFT", [
      "ArtworkNFT",
      "ANFT",
      owner.account.address,
    ]);

    return { artworkNFT, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { artworkNFT, owner } = await loadFixture(deployArtworkNFTFixture);
      expect(await artworkNFT.read.owner()).to.equal(
        getAddress(owner.account.address),
      );
    });

    it("Should have the correct name and symbol", async function () {
      const { artworkNFT } = await loadFixture(deployArtworkNFTFixture);
      expect(await artworkNFT.read.name()).to.equal("ArtworkNFT");
      expect(await artworkNFT.read.symbol()).to.equal("ANFT");
    });
  });

  describe("Minting", function () {
    it("Should allow the owner to mint a new token", async function () {
      const { artworkNFT, owner, addr1 } = await loadFixture(
        deployArtworkNFTFixture,
      );
      await artworkNFT.write.mint([addr1.account.address, "INSC123"]);
      expect(await artworkNFT.read.ownerOf([1n])).to.equal(
        getAddress(addr1.account.address),
      );
      expect(await artworkNFT.read.getInscriptionId([1n])).to.equal("INSC123");
    });

    it("Should not allow non-owners to mint", async function () {
      const { artworkNFT, addr1, addr2 } = await loadFixture(
        deployArtworkNFTFixture,
      );
      await expect(
        artworkNFT.write.mint([addr2.account.address, "INSC456"], {
          account: addr1.account,
        }),
      ).to.be.rejectedWith("Ownable: caller is not the owner");
    });
  });

  describe("InscriptionId", function () {
    it("Should return the correct inscription ID", async function () {
      const { artworkNFT, addr1 } = await loadFixture(deployArtworkNFTFixture);
      await artworkNFT.write.mint([addr1.account.address, "INSC789"]);
      expect(await artworkNFT.read.getInscriptionId([1n])).to.equal("INSC789");
    });

    it("Should revert for non-existent tokens", async function () {
      const { artworkNFT } = await loadFixture(deployArtworkNFTFixture);
      await expect(artworkNFT.read.getInscriptionId([999n])).to.be.rejectedWith(
        "ArtworkNFT: Inscription query for nonexistent token",
      );
    });
  });
});
