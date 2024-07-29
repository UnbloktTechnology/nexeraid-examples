interface CustomerStatusRequest {
  address: string;
}

export interface CustomerStatusResponse {
  status: string;
}

type ExampleType =
  | "bank"
  | "bank-web3"
  | "defi-offchain-zkp"
  | "defi-rule-engine"
  | "kyc"
  | "sygnum-web3"
  | "kyc-airdrop";

export async function fetchCustomerStatus(
  requestData: CustomerStatusRequest,
  exampleType: ExampleType,
): Promise<CustomerStatusResponse> {
  try {
    const response = await fetch(`/api/${exampleType}/get-customer-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customer status");
    }

    const data = (await response.json()) as CustomerStatusResponse;
    console.log("Customer status:", data);
    return data;
  } catch (error) {
    console.error("Error fetching customer status:", error);
    throw new Error("Error fetching customer");
  }
}
