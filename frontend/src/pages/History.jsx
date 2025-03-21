import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5002/api/history');
        setArticles(response.data);
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-500 text-green-800';
    if (score >= 60) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  if (loading) return <div className="text-center py-8">Loading history...</div>;
  if (error) return <div className="text-center text-red-600 py-8">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Analysis History</h1>
      
      {articles.length === 0 ? (
        <p className="text-center text-gray-600">No articles have been analyzed yet.</p>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{article.title}</h2>
                <span 
                  className={`px-3 py-1 rounded-full border ${getScoreColor(article.credibilityScore)}`}
                >
                  Score: {article.credibilityScore}/100
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">
                Source: {article.source || 'Not specified'}
              </p>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {article.content.substring(0, 200)}...
              </p>
              
              <p className="text-gray-500 text-sm">
                Analyzed on {new Date(article.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
