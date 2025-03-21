import sys
import whisper
import os

def transcribe_audio(audio_path):
    # Verify file exists
    if not os.path.exists(audio_path):
        print(f"Error: File not found at path: {audio_path}", file=sys.stderr)
        sys.exit(1)
        
    try:
        # Load the Whisper model
        model = whisper.load_model("base",device="cpu")
        
        # Transcribe the audio file
        result = model.transcribe(audio_path)
        
        # Print the transcription (will be captured by Node.js)
        print(result["text"].strip())
        
    except Exception as e:
        print(f"Error during transcription: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python whisper_transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)
    
    audio_path = sys.argv[1]
    transcribe_audio(audio_path)