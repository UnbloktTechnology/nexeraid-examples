import { shortAddress } from "@nexeraid/identity-schemas";

import type { ClaimResponse } from "../utils/blockchain.schema";

export const getTransactionStatus = (props: {
  claimResponse?: ClaimResponse;
  gasCost?: bigint;
  writeData?: {
    isSuccess: boolean;
    isLoading: boolean;
  };
  error?: string;
}) => {
  if (props.error) {
    return "Failed";
  }

  if (props.writeData?.isLoading) {
    return "Loading...";
  }

  if (props.writeData?.isSuccess) {
    return props.gasCost ? "Success" : "Minting...";
  }

  return "Failed";
};

export const DisplayApiResponse = (props: {
  claimResponse?: ClaimResponse;
  gasCost?: bigint;
  writeData?: {
    isSuccess: boolean;
    isLoading: boolean;
  };
  error?: string;
}) => {
  return (
    <label>
      {props.claimResponse ? (
        <div>
          <div>
            Authorized:{" "}
            {props.claimResponse.signatureResponse.isAuthorized ? "YES" : "NO"}
          </div>
          {props.claimResponse.signatureResponse.payload && (
            <div>
              Payload:{" "}
              {shortAddress(props.claimResponse.signatureResponse.payload)}
            </div>
          )}
          {props.claimResponse.signatureResponse.blockExpiration && (
            <div>
              Block Expiration:{" "}
              {props.claimResponse.signatureResponse.blockExpiration}
            </div>
          )}
          {props.claimResponse.signatureResponse.signature && (
            <div>
              Signature:{" "}
              {shortAddress(props.claimResponse.signatureResponse.signature)}
            </div>
          )}
          {props.writeData && (
            <div>Transaction Status: {getTransactionStatus(props)}</div>
          )}
          {!props.error && (
            <div>
              Gas Cost: {props.gasCost ? props.gasCost.toString() : "Pending"}
            </div>
          )}
          {props.error && <div>Error: {props.error}</div>}
        </div>
      ) : (
        "No Response"
      )}
    </label>
  );
};
