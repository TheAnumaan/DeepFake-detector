import React from 'react';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">About News Credibility Analyzer</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="mb-4">
          In today's digital landscape, misinformation spreads rapidly. Our mission is to empower 
          readers with the tools to critically evaluate news content and identify potential 
          misinformation.
        </p>
        <p>
          Using advanced AI technology from Google's Gemini, we analyze news articles across multiple 
          dimensions to provide an objective assessment of their credibility and highlight areas that 
          may require further verification.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal pl-5 space-y-4">
          <li>
            <strong>Input:</strong> You provide an article's title, content, and source.
          </li>
          <li>
            <strong>AI Analysis:</strong> Our system uses the Gemini AI model to evaluate the content 
            based on multiple factors including source credibility, factual consistency, citation of 
            sources, and presence of emotional or biased language.
          </li>
          <li>
            <strong>Scoring:</strong> The system generates a credibility score from 0-100 based on 
            the comprehensive analysis.
          </li>
          <li>
            <strong>Detailed Breakdown:</strong> You receive a detailed report highlighting potentially 
            misleading elements and recommended verification steps.
          </li>
        </ol>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Responsible Use</h2>
        <p className="mb-4">
          While our tool uses advanced AI to assist in the evaluation of news content, it should be 
          used as one of many tools in your critical thinking toolkit. No AI system is perfect, and 
          results should be considered as suggestions rather than definitive judgments.
        </p>
        <p>
          We encourage users to:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Cross-reference information with multiple reputable sources</li>
          <li>Be aware of your own biases when evaluating news</li>
          <li>Consider the broader context of the information presented</li>
          <li>Look for primary sources whenever possible</li>
        </ul>
        <p>
          By fostering critical thinking skills alongside technological tools, we can build a more 
          informed and resilient information ecosystem.
        </p>
      </div>
    </div>
  );
};

export default About;