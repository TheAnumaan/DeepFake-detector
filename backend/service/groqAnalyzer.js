import { Groq } from 'groq-sdk/index.mjs';

export async function analyzeWithGroq(title, content, source) {
  const prompt = `
  Analyze this news article for potential misinformation or fake news:
    
    Title: ${title}
    Source: ${source}
    Content: ${content}
    
    Evaluate based on:
    1. Credibility of source
    2. Presence of clickbait elements
    3. Emotional language
    4. Factual inconsistencies
    5. Balance of perspectives
    6. Citation of sources
    7. Expert opinions
    8. Recent publication
    
    Provide:
    - A credibility score from 0-100
    - Identification of potentially misleading statements
    - Recommended verification steps
    - An overall assessment
    
    Format response as JSON with these fields:
    {
      "credibilityScore": number,
      "misleadingElements": [string],
      "verificationSteps": [string],
      "overallAssessment": string
    }
  `;
  const groq = new Groq({ apiKey: "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" });

  try {
    const result = await groq.chat.completions.create({
      messages:[{
        role:"user",
        content:prompt
      }],
      model:"llama3-70b-8192"
    });

    const raw = result.choices[0].message.content;

    // Extract and parse JSON from Groq response
    const jsonMatch =
      raw.match(/```json\s*([\s\S]*?)\s*```/) || raw.match(/{[\s\S]*}/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[1] || jsonMatch[0];
      try {
        return JSON.parse(jsonString);
      } catch (err) {
        console.error("JSON parse error:", err.message);
      }
    }
    
    throw new Error("Groq response does not contain valid JSON.");
  } catch (error) {
    console.error("Groq analysis failed:", error.message);
    return {
      credibilityScore: 50,
      misleadingElements: ["Error in Groq analysis"],
      verificationSteps: ["Try again later"],
      overallAssessment: "Fallback due to Groq error"
    };
  }
}