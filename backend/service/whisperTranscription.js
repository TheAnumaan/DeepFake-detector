import fs from 'fs';
import { Groq } from 'groq-sdk';

// Initialize Groq client with API key
const groq = new Groq({ apiKey: "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" });

// Function to transcribe audio file
export async function transcribeAudio(filePath) {
  try {

    // Create a readable stream from the buffer
    const audioStream = fs.createReadStream(filePath);

    // Send the audio stream to Groq's Whisper API for transcription
    const response = await groq.audio.transcriptions.create({
      file: audioStream,
      model: 'whisper-large-v3',
      response_format: 'json'
    });

    // Output the transcription result
    console.log("trsnscribe successfully");
    return response.text;
  } catch (error) {
    console.error('Error during transcription:', error.message);
  }
}