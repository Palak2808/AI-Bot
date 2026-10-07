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
  const { message, threadId } = req.body;
  //validate above fields
  if(!message || !threadId) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const result = await generateText(message, threadId);
  res.json({ message: result });
});

app.listen(3001, () => console.log("Server running"));
