'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { BookOpen, Clapperboard, LineChart, PenTool, Settings } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = async (customQuery?: string) => {
    const textToSend = customQuery || query;
    if (!textToSend.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse("Gagal terhubung ke AI GraceScript Hub.");
    } finally {
      setIsLoading(false);
      if (!customQuery) setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setQuery(promptText);
    handleSend(promptText);
  };

  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 bg-white font-sans items-center justify-start min-h-screen">
      
      <main className="flex flex-col items-center max-w-3xl w-full mt-2 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            ✝ GraceScript AI Platform
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] mt-2">
            Konten Rohani Apa Yang Ingin Kamu Buat Hari Ini?
          </h1>
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Riset ayat Alkitab, buat skrip renungan video TikTok/Reels yang terstruktur, dan pantau pertumbuhan pelayananmu.
          </p>
        </div>



        {/* AI Command Center Box */}
        <div className="w-full border border-gray-200 rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] bg-white transition-all focus-within:shadow-[0_4px_24px_rgba(0,0,0,0.07)] focus-within:border-indigo-400">
          <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanyakan ayat Alkitab, ide renungan harian, atau minta dibuatkan skrip..." 
            className="w-full min-h-[90px] resize-none outline-none text-[#111111] placeholder:text-gray-400 text-base bg-transparent"
          />
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-xs text-gray-400 font-medium">
              <span>💡 Contoh: "Tolong carikan ayat Alkitab tentang kecemasan dan inspirasi skripnya"</span>
            </div>
            
            <button 
              onClick={() => handleSend()}
              disabled={!query.trim() || isLoading}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2 shadow-sm"
            >
              <span>{isLoading ? 'Menyusun...' : 'Kirim AI'}</span>
              {!isLoading && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick Action Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 font-medium">
          <button 
            onClick={() => handleQuickPrompt("Riset ayat Alkitab & renungan tentang mengatasi overthinking untuk pemuda")}
            className="hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Riset Renungan Filipi 4</span>
          </button>
          
          <button 
            onClick={() => handleQuickPrompt("Buatkan 3 ide konten TikTok rohani dengan gaya Youthful & Relatable")}
            className="hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Clapperboard className="w-3.5 h-3.5 text-rose-500" />
            <span>3 Ide TikTok Gen-Z</span>
          </button>
          
          <button 
            onClick={() => handleQuickPrompt("Bagaimana strategi meningkatkan engagement rate akun Instagram renungan rohani?")}
            className="hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50/50 border border-gray-200 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LineChart className="w-3.5 h-3.5 text-emerald-500" />
            <span>Strategi Analytics IG</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-4">
          <Link href="/scripts" className="p-5 bg-gradient-to-br from-indigo-50/70 to-purple-50/70 border border-indigo-100 rounded-2xl hover:shadow-[0_4px_20px_rgba(79,70,229,0.15)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-indigo-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <PenTool className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-700">Custom Script Builder</h3>
            <p className="text-xs text-gray-500 mt-1">Buat skrip video (Hook - Ayat - Renungan - Doa) yang siap direkam.</p>
          </Link>

          <Link href="/settings" className="p-5 bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border border-emerald-100 rounded-2xl hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-white/60 backdrop-blur-sm border border-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 text-sm group-hover:text-emerald-700">Creator Persona</h3>
            <p className="text-xs text-gray-500 mt-1">Atur tone suara (Warm, Bold, Gen-Z) & terjemahan Alkitab favoritmu.</p>
          </Link>
        </div>

        {/* Response Display Area */}
        {response && (
          <div className="w-full mt-6 p-6 bg-gray-50 border border-gray-200 rounded-2xl text-[#111111] leading-relaxed shadow-xs">
            <article className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-4">
              <ReactMarkdown
                components={{
                  a: ({ node, ...props }) => (
                    <a 
                      {...props} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-indigo-600 hover:underline font-medium"
                    />
                  ),
                  h1: ({ node, ...props }) => <h1 {...props} className="text-xl font-bold text-[#111111] mt-4 mb-2" />,
                  h2: ({ node, ...props }) => <h2 {...props} className="text-lg font-bold text-[#111111] mt-4 mb-2" />,
                  h3: ({ node, ...props }) => <h3 {...props} className="text-base font-semibold text-[#111111] mt-3 mb-1.5" />,
                  ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 space-y-1 my-2" />,
                  ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 space-y-1 my-2" />,
                  li: ({ node, ...props }) => <li {...props} className="my-0.5" />,
                  strong: ({ node, ...props }) => <strong {...props} className="font-semibold text-[#111111]" />
                }}
              >
                {response}
              </ReactMarkdown>
            </article>
          </div>
        )}

      </main>
    </div>
  );
}
