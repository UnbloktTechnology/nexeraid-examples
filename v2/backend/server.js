const { createNexeraSdk } = require("@nexeraid/js-sdk");
require("dotenv").config();

const apiClient = createNexeraSdk({
  webhookSecret: process.env.WEBHOOK_SECRET,
  apiKey: process.env.API_KEY,
});

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to access the API
app.use(express.json());

// API routes

//WEB3 route
app.post("/api/generate-web3-challenge", async (req, res) => {
  const sessionRes = await apiClient.createWeb3Challenge({
    workflowId: process.env.WEB3_WORKFLOW_ID,
    ...req.body,
  });
  res.status(200).json(sessionRes);
});

//Regular route. process.env.CUSTOMER_ID must be replaced. you need to authenticate the user before opening a nexera user session.
app.post("/api/create-nexera-session", async (req, res) => {
  const sessionRes = await apiClient.createSession({
    workflowId: process.env.REGULAR_WORKFLOW_ID,
    externalCustomerId: process.env.CUSTOMER_ID,
  });
  res.status(200).json(sessionRes);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
