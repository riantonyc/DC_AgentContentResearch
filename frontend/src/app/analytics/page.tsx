'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Clock, 
  ThumbsUp, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw,
  PlusCircle
} from 'lucide-react';

interface SocialStats {
  id?: string;
  username: string;
  followers_count: number;
  total_likes: number;
  total_posts: number;
  engagement_rate: number;
  created_at?: string;
}

export default function AnalyticsPage() {
  const [instagramStats, setInstagramStats] = useState<SocialStats | null>(null);
  const [tiktokStats, setTiktokStats] = useState<SocialStats | null>(null);

  const [igUsername, setIgUsername] = useState('__dickywahyu');
  const [ttUsername, setTtUsername] = useState('dickywahyu__');

  const [loadingScrapeIg, setLoadingScrapeIg] = useState(false);
  const [loadingScrapeTt, setLoadingScrapeTt] = useState(false);

  // Manual Stats Form state
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualPlatform, setManualPlatform] = useState<'instagram' | 'tiktok'>('instagram');
  const [manualUsername, setManualUsername] = useState('');
  const [manualFollowers, setManualFollowers] = useState(0);
  const [manualLikes, setManualLikes] = useState(0);
  const [manualPosts, setManualPosts] = useState(0);

  // AI Insights State
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchLatestStats();
  }, []);

  const fetchLatestStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/social/latest');
      if (res.ok) {
        const data = await res.json();
        setInstagramStats(data.instagram);
        setTiktokStats(data.tiktok);
      }
    } catch (err) {
      console.error('Error fetching social stats:', err);
    }
  };

  const handleScrape = async (platform: 'instagram' | 'tiktok') => {
    const username = platform === 'instagram' ? igUsername : ttUsername;
    if (!username.trim()) return;

    if (platform === 'instagram') setLoadingScrapeIg(true);
    else setLoadingScrapeTt(true);

    try {
      const res = await fetch('http://localhost:8000/api/social/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, username })
      });

      if (res.ok) {
        const data = await res.json();
        if (platform === 'instagram') setInstagramStats(data);
        else setTiktokStats(data);
      }
    } catch (err) {
      console.error(`Error scraping ${platform}:`, err);
    } finally {
      setLoadingScrapeIg(false);
      setLoadingScrapeTt(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/social/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: manualPlatform,
          username: manualUsername,
          followers_count: Number(manualFollowers),
          total_likes: Number(manualLikes),
          total_posts: Number(manualPosts)
        })
      });

      if (res.ok) {
        const result = await res.json();
        if (manualPlatform === 'instagram') setInstagramStats(result.data);
        else setTiktokStats(result.data);
        setShowManualModal(false);
      }
    } catch (err) {
      console.error('Error submitting manual stats:', err);
    }
  };

  const handleAskAIAnalytics = async () => {
    if (!aiQuestion.trim()) return;
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    const contextStr = `
Data Statistik Terkini:
- Instagram: ${instagramStats?.username || 'N/A'}, Followers: ${instagramStats?.followers_count || 0}, ER: ${instagramStats?.engagement_rate || 0}%
- TikTok: ${tiktokStats?.username || 'N/A'}, Followers: ${tiktokStats?.followers_count || 0}, Total Likes: ${tiktokStats?.total_likes || 0}, ER: ${tiktokStats?.engagement_rate || 0}%
    `;

    try {
      const res = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: `Sebagai Analytics Agent khusus Konten Kreator Rohani Kristen, tolong berikan analisis & rekomendasi taktis berdasarkan data statistik berikut:\n${contextStr}\n\nPertanyaan Kreator: ${aiQuestion}` 
        })
      });
      const data = await res.json();
      setAiAnalysisResult(data.response);
    } catch (err) {
      console.error(err);
      setAiAnalysisResult('Gagal terhubung ke AI Analytics Agent.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 bg-[#FFFFFF] font-sans min-h-screen text-[#111111]">
      <main className="max-w-6xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EAEAEA] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#666666] mb-1 font-medium">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>TikTok & Instagram Analytics (Free API / Public Scraper)</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111111]">
              Statistik Perkembangan Konten Kreator
            </h1>
            <p className="text-[#666666] text-sm mt-1">
              Pantau pertumbuhan Followers, Engagement Rate, dan statistik performa akun TikTok & Instagram pelayananmu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              Catat Stats Manual
            </button>
          </div>
        </div>

        {/* Platform Cards: TikTok & Instagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instagram Card */}
          <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
                  IG
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">Instagram Profile</h3>
                  <p className="text-xs text-gray-500">{instagramStats?.username || '@renungan.harian.id'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  placeholder="Username IG..."
                  className="w-28 px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white"
                />
                <button
                  onClick={() => handleScrape('instagram')}
                  disabled={loadingScrapeIg}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all disabled:opacity-50"
                  title="Scrape Stats"
                >
                  {loadingScrapeIg ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Followers</span>
                <span className="text-lg font-bold text-gray-900">{instagramStats?.followers_count?.toLocaleString('id-ID') || 0}</span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Posts</span>
                <span className="text-lg font-bold text-gray-900">{instagramStats?.total_posts || 0}</span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Engagement</span>
                <span className="text-lg font-bold text-indigo-600">{instagramStats?.engagement_rate || 0}%</span>
              </div>
            </div>
          </div>

          {/* TikTok Card */}
          <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-black text-white font-bold flex items-center justify-center text-xs">
                  TK
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">TikTok Profile</h3>
                  <p className="text-xs text-gray-500">{tiktokStats?.username || '@kreator.kristen'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={ttUsername}
                  onChange={(e) => setTtUsername(e.target.value)}
                  placeholder="Username TikTok..."
                  className="w-28 px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white"
                />
                <button
                  onClick={() => handleScrape('tiktok')}
                  disabled={loadingScrapeTt}
                  className="p-1.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-all disabled:opacity-50"
                  title="Scrape Stats"
                >
                  {loadingScrapeTt ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Followers</span>
                <span className="text-lg font-bold text-gray-900">{tiktokStats?.followers_count?.toLocaleString('id-ID') || 0}</span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Likes</span>
                <span className="text-lg font-bold text-gray-900">{tiktokStats?.total_likes?.toLocaleString('id-ID') || 0}</span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Engagement</span>
                <span className="text-lg font-bold text-emerald-600">{tiktokStats?.engagement_rate || 0}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* AI Analytics Advisor */}
        <div className="p-6 bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-[#111111] uppercase tracking-wider">
              Tanyakan Analisis Strategi ke AI Analytics Agent
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAIAnalytics()}
              placeholder="Contoh: 'Berikan evaluasi kenapa konten TikTok renungan pemuda kita lebih banyak disukai daripada IG?'..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm outline-none focus:border-indigo-600 transition-colors"
            />
            <button
              onClick={handleAskAIAnalytics}
              disabled={!aiQuestion.trim() || isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap shadow-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <span>Analisis Strategi AI</span>
              )}
            </button>
          </div>

          {aiAnalysisResult && (
            <div className="p-4 bg-white border border-[#EAEAEA] rounded-xl text-xs leading-relaxed text-[#111111] whitespace-pre-wrap font-sans">
              <strong className="block mb-2 font-bold text-indigo-700">📊 Rekomendasi Analytics AI:</strong>
              {aiAnalysisResult}
            </div>
          )}
        </div>

        {/* Manual Stats Modal */}
        {showManualModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-gray-200 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-base text-gray-900">Catat Statistik Manual</h3>
                <button onClick={() => setShowManualModal(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>

              <form onSubmit={handleManualSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Platform</label>
                  <select
                    value={manualPlatform}
                    onChange={(e) => setManualPlatform(e.target.value as 'instagram' | 'tiktok')}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="@username"
                    value={manualUsername}
                    onChange={(e) => setManualUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Followers</label>
                    <input
                      type="number"
                      required
                      value={manualFollowers}
                      onChange={(e) => setManualFollowers(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Likes</label>
                    <input
                      type="number"
                      required
                      value={manualLikes}
                      onChange={(e) => setManualLikes(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Total Posts</label>
                    <input
                      type="number"
                      required
                      value={manualPosts}
                      onChange={(e) => setManualPosts(Number(e.target.value))}
                      className="w-full px-2 py-1.5 border rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-4 py-2 border rounded-xl text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
                  >
                    Simpan Stats
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
