const express = require("express");
const app = express(); // Use express() to create the app

const server = require("http").createServer(app);
const cors = require("cors");
const openai = require("openai");
require("dotenv").config();

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

const openaiClient = new openai.OpenAI({ apiKey });

const allowedOrigins = ["http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST"], // Specify the allowed HTTP methods
};

app.use(cors(corsOptions));
app.use(express.json()); // Add this line to parse JSON bodies

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("server is running");
});

app.post("/generate-speech", async (req, res) => {
  const { text, selectedVoiceModel } = req.body; // Assuming text is sent in the request body
  try {
    const mp3 = await openaiClient.audio.speech.create({
      model: "tts-1",
      voice: selectedVoiceModel,
      input: text,
    });
    const audioBuffer = Buffer.from(await mp3.buffer());
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error generating speech:", error);
    res.status(500).send("Speech generation failed");
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
