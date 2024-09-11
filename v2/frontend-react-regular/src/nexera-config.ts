export const createSession = () => {
  return fetch("yourApiUrl/api/create-nexera-session", { method: "POST" }).then(
    (res) => res.json()
  );
};
