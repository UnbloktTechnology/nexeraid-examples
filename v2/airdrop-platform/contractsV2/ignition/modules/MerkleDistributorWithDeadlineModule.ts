import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MerkleDistributorWithDeadlineModule = buildModule("MerkleDistributorWithDeadlineModule", (m) => {
  const merkleDistributorWithDeadline = m.contract("MerkleDistributorWithDeadline", [
    m.getParameter("token"),
    m.getParameter("merkleRoot"),
    m.getParameter("endTime"),
    m.getParameter("signerAddress"),
  ]);

  return { merkleDistributorWithDeadline };
});

export default MerkleDistributorWithDeadlineModule;