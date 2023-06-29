import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

import { getNexeraContracts } from "@nexeraprotocol/nexera-id-contracts-sdk/src";
import { NEXERA_CHAINS } from "@nexeraprotocol/nexera-id-schemas";

export const MOCK_COMPLIANCE_PM = "0x5EdAa7487770Da9174C69AF50d87dd36De7c5e13";

export const getProvider = (chain: NEXERA_CHAINS) =>
  new ethers.providers.JsonRpcProvider(
    chain === NEXERA_CHAINS.FUJI
      ? "https://ava-testnet.public.blastapi.io/ext/bc/C/rpc"
      : "https://rpc-mumbai.maticvigil.com",
    parseInt(chain),
  );

export const useMockCompliancePmVerifiedStatus = (props: {
  address?: string;
}) => {
  return useQuery({
    queryKey: ["mockCompliancePmVerifiedStatus", props.address],
    queryFn: async () => {
      if (!props.address) {
        throw new Error("No address provided");
      }
      const mockCompliancePM = getNexeraContracts({
        signerOrProvider: getProvider(NEXERA_CHAINS.FUJI),
        environment: "local",
        chainId: NEXERA_CHAINS.FUJI,
        overrideAddresses: {
          // this is mock contract... it should work as the real one (in regards to the interface and params it accepts)
          compliancePropertyManager: MOCK_COMPLIANCE_PM,
        },
      }).compliancePropertyManager;

      const rkey = ethers.utils.hexZeroPad(props.address, 32);
      console.log("rkey", rkey);
      const result1 = await mockCompliancePM.verified(1, rkey);
      console.log("result1", result1);
      return {
        isVerified18: result1,
        isVerified21: false,
        isVerifiedCountry: false,
        isVerified4Jurisdiction: false,
      };
    },
    enabled: !!props.address,
  });
};
