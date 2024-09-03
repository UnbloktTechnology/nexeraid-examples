import React from "react";
import {
  useIsAuthenticated,
  useOpenWidget,
  useLatestVerification,
  useCustomerStatus,
} from "@nexeraid/react-sdk";

export const IdentityFlow = () => {
  const { openWidget, isLoading: isOpenLoading } = useOpenWidget({});
  const { isAuthenticated, isLoading: isAuthLoading } = useIsAuthenticated();
  const { data, isLoading: isVerificationLoading } = useLatestVerification();
  const status = useCustomerStatus();

  const isVerified = data?.isVerified;
  const isCompliant = status === "Active";

  const isLoading = isOpenLoading || isAuthLoading || isVerificationLoading;

  return (
    <div>
      <h1>Identity Flow</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!data?.isVerified && (
          <button
            style={{
              padding: "16px 24px",
              borderRadius: 16,
              cursor: "pointer",
              backgroundColor: "#0258FD",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
              border: "none",
            }}
            onClick={openWidget}
            id="identity-btn"
          >
            {isLoading
              ? "Loading..."
              : !isAuthenticated
                ? "Start KYC"
                : !isCompliant
                  ? "Not Compliant"
                  : isVerified
                    ? "Verified!"
                    : "Verify"}
          </button>
        )}
        {data?.isVerified && <div className="text-green-500">Verified!</div>}
      </div>
    </div>
  );
};
