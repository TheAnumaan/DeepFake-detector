import React, { useState } from 'react';
import axios from 'axios';

const TextAnalysis = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [isRealOrFake,setIsRealOrFake] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      if (!title || !content) {
        throw new Error('Title and content are required');
      }

      const response = await axios.post('http://localhost:5002/api/analyze', {
        url,
        title,
        content,
        source
      });

      setAnalysis(response.data.analysis);
      if(response.data.analysis.credibilityScore>=55) setIsRealOrFake(`News from ${source} is Real`);
      else setIsRealOrFake(`News from ${source} is Fake`);
    } catch (err) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">News Credibility Analyzer</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Article URL (optional)</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="https://example.com/article"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="CNN, Fox News, Twitter, etc."
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Article Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            placeholder="Enter the title of the article"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Article Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            rows="5"
            placeholder="Paste the full article content here"
            required
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Analyze for Misinformation'}
        </button>
        
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>
      
      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Analysis Results</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Credibility Score</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                <div
                  className={`h-4 rounded-full ${
                    analysis.credibilityScore >= 80
                      ? 'bg-green-600'
                      : analysis.credibilityScore >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${analysis.credibilityScore}%` }}
                />
              </div>
              <span className={`font-bold text-xl ${getScoreColor(analysis.credibilityScore)}`}>
                {analysis.credibilityScore}/100, 
                ({isRealOrFake})
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Potentially Misleading Elements</h3>
            <ul className="list-disc pl-5">
              {analysis.misleadingElements.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Verification Steps</h3>
            <ol className="list-decimal pl-5">
              {analysis.verificationSteps.map((step, index) => (
                <li key={index} className="mb-1">{step}</li>
              ))}
            </ol>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Overall Assessment</h3>
            <p className="text-gray-800">{analysis.overallAssessment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysis;