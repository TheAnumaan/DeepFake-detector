// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TextAnalysis from './pages/TextAnalysis';
import AudioAnalysis from './pages/AudioAnalysis';
import ImageAnalysis from './pages/ImageAnalysis';
import VideoAnalysis from './pages/VideoAnalysis';
import History from './pages/History';
import About from './pages/About';
import './App.css';
import SignIn from './pages/signIn';
import SignUp from './pages/signUp';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/text-analysis" element={<TextAnalysis />} />
            <Route path="/audio-analysis" element={<AudioAnalysis />} />
            <Route path="/image-analysis" element={<ImageAnalysis />} />
            <Route path="/video-analysis" element={<VideoAnalysis />} />
            <Route path="/signIn" element={<SignIn />} /> 
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;