import { useMutation } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { claimToken } from "./airdropActions";
import {
  useRedirectToClaimError,
  useRedirectToClaimSuccess,
} from "./navigation";

export const useClaimMutation = () => {
  const account = useAccount();
  const accountAddress = account.address!;

  const redirectToClaimSuccess = useRedirectToClaimSuccess();
  const redirectToClaimError = useRedirectToClaimError();

  return useMutation({
    mutationFn: async () => {
      const result = await claimToken({
        userAddress: accountAddress,
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
