from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import requests
import torch
import os

app = Flask(__name__,static_folder="uploads")
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all origins for now, restrict in production

# Load model and processor with error handling
model_name = "prithivMLmods/Deep-Fake-Detector-v2-Model"
try:
    extractor = AutoFeatureExtractor.from_pretrained(model_name)
    model = AutoModelForImageClassification.from_pretrained(model_name)
    labels = model.config.id2label
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
    extractor, model, labels = None, None, None

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    try:
        data = request.get_json()
        image_url = data.get("image_url")
        if not image_url:
            return jsonify({"error": "Missing image_url"}), 400
        if not model or not extractor:
            return jsonify({"error": "Model not loaded"}), 500

        # Check if the image_url is a local file path
        if not image_url.startswith("http://") and not image_url.startswith("https://"):
            # Construct the full URL for local file paths
            image_url = f"http://localhost:5000/{image_url.replace('\\', '/')}"

        # Load and prepare image
        response = requests.get(image_url, stream=True)
        response.raise_for_status()
        image = Image.open(response.raw).convert("RGB")

        # Predict
        inputs = extractor(images=image, return_tensors="pt")
        with torch.no_grad():
            logits = model(**inputs).logits
            probs = torch.nn.functional.softmax(logits, dim=-1)
            top_idx = torch.argmax(probs).item()

        return jsonify({
            "status": "success",
            "prediction": labels[top_idx],
            "confidence": float(probs[0][top_idx])
        })

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Image download error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)