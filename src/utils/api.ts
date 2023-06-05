const getAccessToken = async (address: string) => {
  const response = await fetch(
    `/api/access_token?address=${address}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    }
  );
  const { accessToken } = await response.json();
  return accessToken
}

export {
  getAccessToken
}