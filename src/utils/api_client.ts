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
  const res = await response.json();
  return res;
}

export const getRuleWebHook = async (address: string) => {
  const response = await fetch(`/api/rule_webhook?address=${address}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "GET",
  });
  const res = await response.json();
  return res;
}
