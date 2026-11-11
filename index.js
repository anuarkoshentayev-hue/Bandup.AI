import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(client) });
});

app.post("/api/speaking", async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: "AI is not configured yet. Add OPENAI_API_KEY to your .env file." });
    const { question, answer, part = "Part 1" } = req.body;
    if (!answer?.trim()) return res.status(400).json({ error: "Please enter an answer first." });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: "You are a supportive IELTS Speaking examiner and English coach. Give an approximate practice assessment, not an official IELTS score. Assess fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation only if audio is provided (otherwise say pronunciation cannot be assessed from text). Give an estimated band range, two strengths, three specific improvements, and a more natural sample answer. Keep feedback appropriate for a teenage learner." },
        { role: "user", content: `IELTS ${part} question: ${question || "Tell me about your hometown."}\nStudent answer: ${answer}` }
      ]
    });
    res.json({ feedback: response.choices[0]?.message?.content || "No feedback returned." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not get AI feedback. Check your API key and try again." });
  }
});

app.post("/api/writing", async (req, res) => {
  try {
    if (!client) return res.status(503).json({ error: "AI is not configured yet. Add OPENAI_API_KEY to your .env file." });
    const { task, essay, taskType = "Task 2" } = req.body;
    if (!essay?.trim()) return res.status(400).json({ error: "Please paste your writing first." });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are an IELTS Writing tutor. Assess the submitted work using the four IELTS criteria: Task Achievement/Task Response, Coherence and Cohesion, Lexical Resource, and Grammatical Range and Accuracy. Give approximate practice band estimates (not official scores), explain each briefly, identify recurring errors, and provide a short action plan. Do not rewrite the whole essay unless asked. Be supportive and age-appropriate." },
        { role: "user", content: `Task type: ${taskType}\nQuestion: ${task || "No prompt supplied"}\nStudent writing:\n${essay}` }
      ]
    });
    res.json({ feedback: response.choices[0]?.message?.content || "No feedback returned." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not evaluate writing. Check your API key and try again." });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`BandUp AI server running on http://localhost:${port}`));