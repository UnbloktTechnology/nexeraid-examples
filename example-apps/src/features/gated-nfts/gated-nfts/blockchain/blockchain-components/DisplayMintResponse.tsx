import { short0xString } from "@nexeraprotocol/nexera-id-schemas";

import type { MintResponse } from "./blockchain.schema";

export const DisplayMintResponse = (props: {
  mintResponse?: MintResponse;
  gasCost?: number;
  writeData?: {
    isSuccess: boolean;
    isLoading: boolean;
  };
  error?: string;
}) => {
  return (
    <label>
      {props.mintResponse ? (
        <div>
          <div>
            Authorized:{" "}
            {props.mintResponse.signatureResponse.isAuthorized ? "YES" : "NO"}
          </div>
          {props.mintResponse.signatureResponse.signature && (
            <div>
              Signature:{" "}
              {short0xString(props.mintResponse.signatureResponse.signature)}
            </div>
          )}
          {props.mintResponse.signatureResponse.blockExpiration && (
            <div>
              Block Expiration:{" "}
              {props.mintResponse.signatureResponse.blockExpiration}
            </div>
          )}
          {props.writeData && (
            <div>
              Transaction Status:{" "}
              {props.writeData.isLoading
                ? "Loading..."
                : props.writeData.isSuccess
                  ? props.gasCost
                    ? "Success"
                    : "Minting..."
                  : "Failed"}
            </div>
          )}
          {props.gasCost && <div>Gas Cost: {props.gasCost}</div>}
          {props.error && <div>Error: {props.error}</div>}
        </div>
      ) : (
        "No Response"
      )}
    </label>
  );
};
