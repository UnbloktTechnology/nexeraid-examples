import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerkleDistributorModule = buildModule("MerkleDistributorModule", (m) => {
  const merkleDistributor = m.contract("MerkleDistributor", [
    m.getParameter("token"),
    m.getParameter("merkleRoot"),
    m.getParameter("signerAddress"),
  ]);

  return { merkleDistributor };
});

export default MerkleDistributorModule;