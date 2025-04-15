import Groq from "groq-sdk";
import fs from "fs";

const groq = new Groq({
  apiKey: "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",
});

export async function AnalyzeImage(filePath) {
  try {
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");

    const result = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "What do you see in this image?",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    console.log(result.choices[0].message.content);
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error during transcription:", error.message);
  }
}
