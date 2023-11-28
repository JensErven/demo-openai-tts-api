// import fs from "fs";
// import path from "path";
// import OpenAI from "openai";

// const openai = new OpenAI();

// export async function generateSpeech() {
//   const speechFile = path.resolve("./speech.mp3");
//   try {
//     const mp3 = await openai.audio.speech.create({
//       model: "tts-1",
//       voice: "alloy",
//       input: "Today is a wonderful day to build something people love!",
//     });

//     const buffer = Buffer.from(await mp3.buffer()); // Use mp3.buffer() to get the buffer directly
//     await fs.promises.writeFile(speechFile, buffer);
//     return speechFile; // Return the file path for reference or further use
//   } catch (error) {
//     console.error("Error generating speech:", error);
//     throw error; // Propagate the error for handling in the component
//   }
// }
