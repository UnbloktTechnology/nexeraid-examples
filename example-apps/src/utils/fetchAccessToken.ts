// Define the input and response types
interface AccessTokenRequest {
  address: string;
  blockchainNamespace: string;
}

interface AccessTokenResponse {
  accessToken: string;
}

type ExampleType =
  | "bank"
  | "bank-web3"
  | "defi-offchain-zkp"
  | "defi-rule-engine"
  | "kyc"
  | "sygnum-web3";

export async function fetchAccessToken(
  requestData: AccessTokenRequest,
  exampleType: ExampleType,
): Promise<AccessTokenResponse> {
  try {
    const response = await fetch(`/api/${exampleType}/access-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch access token");
    }

    const data = (await response.json()) as AccessTokenResponse;
    return data;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw new Error("Error fetching access token");
  }
}
