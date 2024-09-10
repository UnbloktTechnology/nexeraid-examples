export const createSession = () => {
    return fetch("http://localhost:5000/api/create-nexera-session", { method: "POST" }).then(
        (res) => res.json(),
    );
};