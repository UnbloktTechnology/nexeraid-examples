import { EvmChainId } from "@nexeraid/react-sdk";
import { useMutation } from "@tanstack/react-query";
import { useAccount, useChainId } from "wagmi";
import { claimToken } from "./airdropActions";
import {
  useRedirectToClaimError,
  useRedirectToClaimSuccess,
} from "./navigation";

export const useClaimMutation = () => {
  const account = useAccount();
  const chainId = useChainId();
  const accountAddress = account.address!;

  const redirectToClaimSuccess = useRedirectToClaimSuccess();
  const redirectToClaimError = useRedirectToClaimError();

  return useMutation({
    mutationFn: async () => {
      if (!accountAddress || !chainId) {
        throw new Error(
          "No account in wallet Client - address" +
            accountAddress +
            " chainId" +
            chainId,
        );
      }
      const parsedChainId = EvmChainId.parse(chainId);
      const result = await claimToken({
        userAddress: accountAddress,
        chainId: parsedChainId,
      });
      return result;
    },
    onSuccess: (sdkResponse) => {
      console.log("sdkResponse", sdkResponse.signatureResponse);
      if (sdkResponse?.signatureResponse.isAuthorized) {
        return redirectToClaimSuccess(accountAddress);
      }
      return redirectToClaimError(
        accountAddress,
        "You are not authorized to claim tokens, please retry the identity verification process",
      );
    },
    onError: (error) => {
      console.error("Error while fetching signature", error);
      redirectToClaimError(accountAddress, "Error while fetching signature");
    },
  });
};
