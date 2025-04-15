from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import torch
import torchaudio
from transformers import AutoModelForAudioClassification, Wav2Vec2FeatureExtractor
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

LABELS = ['angry', 'calm', 'happy', 'neutral', 'sad']

# Load models once at startup
feature_extractor = Wav2Vec2FeatureExtractor.from_pretrained("superb/wav2vec2-base-superb-er")
model = AutoModelForAudioClassification.from_pretrained("superb/wav2vec2-base-superb-er")

def analyze_emotion(audio_path):
    try:
        # Check if file exists
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found at path: {audio_path}")
            
        # Load and process audio
        waveform, sr = torchaudio.load(audio_path)
        waveform = waveform.mean(dim=0)  # Convert to mono
        
        # Extract features
        inputs = feature_extractor(
            waveform.numpy(), 
            sampling_rate=sr, 
            return_tensors="pt", 
            padding=True
        )
        
        # Get predictions
        with torch.no_grad():
            logits = model(**inputs).logits
        
        # Calculate probabilities
        probs = torch.nn.functional.softmax(logits, dim=-1)
        top_idx = torch.argmax(probs, dim=-1).item()
        confidence = round(float(probs[0][top_idx].item()), 3)
        
        return {
            "emotion": LABELS[top_idx],
            "confidence": confidence,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }

@app.route('/analyze-audio-emotions', methods=['POST'])
def analyze_audio_file():
    try:
        # Get file path from request body
        data = request.get_json()
        
        if not data or 'audio' not in data:
            return jsonify({
                "status": "error",
                "error": "No audio file path provided"
            }), 400
            
        file = request.files['audio']
        file_path = os.path.join("temp", file.filename)
        os.makedirs("temp", exist_ok=True)
        file.save(file_path)
        
        # Analyze the audio file
        result = analyze_emotion(file_path)
        
        if result["status"] == "error":
            return jsonify(result), 500
        
        os.remove(file_path)
            
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)