// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 
      'bg-blue-700 text-white' : 
      'text-blue-100 hover:bg-blue-600 hover:text-white';
  };
  
  return (
    <nav className="bg-blue-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-white font-bold text-xl flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Fake News Detector
          </Link>
          
          <div className="flex space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              Text Analysis
            </Link>
            <Link 
              to="/audio" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/audio')}`}
            >
              Audio Analysis
            </Link>
            <Link 
              to="/image" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/image')}`}
            >
              Image Analysis
            </Link>
            <Link 
              to="/history" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/history')}`}
            >
              History
            </Link>
            <Link 
              to="/about" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/about')}`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;