import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

export async function AnalyzeImage(filePath) {
  try {
    const result = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: filePath,
              },
            },
          ],
        },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
    });

    console.log(result);
    return result.choices[0].message.content;
  } catch (error) {
    console.error("Error during transcription:", error.message);
  }
}
