"use client";

import React, { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse("Error connecting to AI Workspace Backend.");
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col flex-1 p-12 bg-white font-sans items-center justify-start">
      
      <main className="flex flex-col items-center max-w-3xl w-full mt-12">
        
        {/* Header Section */}
        <h1 className="text-3xl font-medium mb-12 tracking-tight text-center">
          What are you working on?
        </h1>

        {/* AI Command Center Box */}
        <div className="w-full border border-[#EAEAEA] rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] bg-white transition-all focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.06)] focus-within:border-[#D1D1D1]">
          <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI workspace anything..." 
            className="w-full min-h-[100px] resize-none outline-none text-[#111111] placeholder:text-[#999999] text-lg bg-transparent"
          />
          
          <div className="flex justify-between items-center mt-4">
            {/* Left side actions (e.g. attachments) */}
            <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F5F5] hover:bg-[#EAEAEA] transition-colors text-[#666666]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
            
            {/* Right side actions (Send) */}
            <button 
              onClick={handleSend}
              disabled={!query.trim() || isLoading}
              className="bg-[#111111] text-white px-5 py-2 rounded-xl font-medium text-sm hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{isLoading ? 'Sending...' : 'Send'}</span>
              {!isLoading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Response Display Area */}
        {response && (
          <div className="w-full mt-8 p-6 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl text-[#111111] whitespace-pre-wrap">
            <p>{response}</p>
          </div>
        )}

        {/* Quick Action Suggestions */}
        <div className="mt-10 flex space-x-8 text-sm text-[#666666] font-medium">
          <span className="hover:text-[#111111] cursor-pointer transition-colors flex items-center space-x-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>Research</span>
          </span>
          <span className="hover:text-[#111111] cursor-pointer transition-colors flex items-center space-x-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Ideas</span>
          </span>
          <span className="hover:text-[#111111] cursor-pointer transition-colors flex items-center space-x-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span>Analyze</span>
          </span>
          <span className="hover:text-[#111111] cursor-pointer transition-colors flex items-center space-x-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <span>Plan</span>
          </span>
        </div>
        
      </main>
    </div>
  );
}
