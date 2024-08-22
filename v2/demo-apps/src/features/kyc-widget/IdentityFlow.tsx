import React from "react";
import { useOpenWidget } from "@nexeraid/react-sdk";

export const IdentityFlow = () => {
  const openWidget = useOpenWidget({});

  return (
    <div>
      <h1>Identity Flow</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
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
          Start KYC
        </button>
      </div>
    </div>
  );
};
