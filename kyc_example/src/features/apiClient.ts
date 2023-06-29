export const getAccessToken = async (address: string) => {
  const response = await fetch(`/api/access_token?address=${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  const { accessToken } = await response.json();
  return accessToken;
};

export const getDataWebHook = async (address: string) => {
  const response = await fetch(`/api/data_webhook?address=${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return await response.json();
};

export const getScenarioWebhook = async (address: string) => {
  const response = await fetch(`/api/scenario_webhook?address=${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  return await response.json();
};
