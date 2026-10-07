import express from "express";
import { generateText } from "./chatbot.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("hi");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const result = await generateText(message);
  res.json({ message: result });
});

app.listen(3001, () => console.log("Server running"));
