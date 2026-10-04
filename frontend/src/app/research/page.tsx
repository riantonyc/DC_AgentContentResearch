"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ArrowRight, 
  X, 
  Loader2, 
  CheckCircle2,
  Clock,
  Trash2
} from "lucide-react";

interface Source {
  title: string;
  url: string;
}

interface ResearchItem {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
  fullContent: string;
  sources: Source[];
}

const CATEGORIES = ["Semua", "AI & Tech", "Social Media", "SEO & LLM", "Marketing"];

export default function ResearchPage() {
  const [researchList, setResearchList] = useState<ResearchItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalItem, setActiveModalItem] = useState<ResearchItem | null>(null);
  
  // Live research states
  const [newTopic, setNewTopic] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load research list from DB on mount
  useEffect(() => {
    fetchResearchFromDB();
  }, []);

  const fetchResearchFromDB = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("http://localhost:8000/api/research/");
      if (res.ok) {
        const data = await res.json();
        setResearchList(data);
      }
    } catch (err) {
      console.error("Error fetching research:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const filteredItems = researchList.filter(item => {
    const matchesCat = selectedCategory === "Semua" || item.category === selectedCategory;
    const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleRunLiveResearch = async () => {
    if (!newTopic.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("http://localhost:8000/api/research/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: newTopic, category: selectedCategory === "Semua" ? "AI & Tech" : selectedCategory })
      });
      if (res.ok) {
        const newItem: ResearchItem = await res.json();
        setResearchList([newItem, ...researchList]);
        setActiveModalItem(newItem);
        setNewTopic("");
      } else {
        alert("Gagal melakukan riset.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal terhubung ke backend server.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeleteResearch = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus laporan riset ini?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/research/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setResearchList(researchList.filter(item => item.id !== id));
        if (activeModalItem?.id === id) setActiveModalItem(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 bg-[#FFFFFF] font-sans min-h-screen text-[#111111]">
      <main className="max-w-6xl w-full mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#EAEAEA] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#666666] mb-1 font-medium">
              <BookOpen className="w-4 h-4 text-[#111111]" />
              <span>Research Hub & Database</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
              Riset Pasar & Tren Berbasis Data Real-Time
            </h1>
            <p className="text-[#666666] text-sm mt-1">
              Semua laporan tersimpan secara permanen di Database SQLite (*Source-Grounded AI*).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#FAFAFA] border border-[#EAEAEA] text-[#666666] px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{researchList.length} Laporan Tersimpan di Database</span>
            </span>
          </div>
        </div>

        {/* Live Search Input Bar */}
        <div className="mb-10 p-5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#111111]" />
            <span>Mulai Riset Topik Baru & Simpan ke DB</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunLiveResearch()}
                placeholder="Masukkan topik riset (contoh: 'Tren B2B SaaS marketing di LinkedIn 2026')..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm outline-none focus:border-[#111111] transition-colors"
              />
              <Search className="w-4 h-4 text-[#999999] absolute left-3.5 top-3" />
            </div>
            <button
              onClick={handleRunLiveResearch}
              disabled={!newTopic.trim() || isSearching}
              className="bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mencari & Menyimpan...</span>
                </>
              ) : (
                <>
                  <span>Jalankan Riset Web</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-[#111111] text-white"
                    : "bg-[#FAFAFA] border border-[#EAEAEA] text-[#666666] hover:text-[#111111] hover:bg-[#F0F0F0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari riset tersimpan..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-lg text-xs outline-none focus:border-[#111111]"
            />
            <Search className="w-3.5 h-3.5 text-[#888888] absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Research Cards Grid */}
        {isLoadingList ? (
          <div className="flex justify-center items-center py-20 text-xs text-[#666666] space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Memuat database riset...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl">
            <p className="text-sm text-[#666666]">Belum ada riset tersimpan dalam kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group bg-white border border-[#EAEAEA] hover:border-[#CCCCCC] rounded-2xl p-6 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-medium bg-[#FAFAFA] border border-[#EAEAEA] px-2.5 py-0.5 rounded-md text-[#555555]">
                      {item.category}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] text-[#888888] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.date}
                      </span>
                      <button
                        onClick={(e) => handleDeleteResearch(item.id, e)}
                        className="text-[#999999] hover:text-red-600 transition-colors p-1"
                        title="Hapus Riset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#111111] group-hover:text-black transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#666666] leading-relaxed line-clamp-3 mb-4">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#F5F5F5] flex items-center justify-between">
                  <div className="flex items-center space-x-1 overflow-hidden">
                    <Globe className="w-3.5 h-3.5 text-[#888888] shrink-0" />
                    <span className="text-[11px] text-[#777777] truncate">
                      {item.sources.length} Sitasi Sumber
                    </span>
                  </div>

                  <span className="text-xs font-medium text-[#111111] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Lihat Laporan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Detail Riset */}
        {activeModalItem && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
            <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              
              <div className="p-6 border-b border-[#EAEAEA] flex justify-between items-start bg-[#FAFAFA]">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium bg-white border border-[#EAEAEA] px-2.5 py-0.5 rounded-md text-[#555555]">
                      {activeModalItem.category}
                    </span>
                    <span className="text-xs text-[#888888]">{activeModalItem.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#111111]">
                    {activeModalItem.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="p-1.5 rounded-lg text-[#666666] hover:bg-[#EAEAEA] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-[#111111]">
                <article className="prose prose-neutral max-w-none text-sm space-y-3">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a 
                          {...props} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                        />
                      ),
                      h1: ({ node, ...props }) => <h1 {...props} className="text-lg font-bold text-[#111111] mt-4 mb-2" />,
                      h2: ({ node, ...props }) => <h2 {...props} className="text-base font-bold text-[#111111] mt-4 mb-2" />,
                      h3: ({ node, ...props }) => <h3 {...props} className="text-sm font-semibold text-[#111111] mt-3 mb-1.5" />,
                      ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 space-y-1 my-2" />,
                      ol: ({ node, ...props }) => <ol {...props} className="list-decimal pl-5 space-y-1 my-2" />,
                      li: ({ node, ...props }) => <li {...props} className="my-0.5" />
                    }}
                  >
                    {activeModalItem.fullContent}
                  </ReactMarkdown>
                </article>

                <div className="pt-4 border-t border-[#EAEAEA]">
                  <h4 className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Sitasi & Sumber Data Nyata:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeModalItem.sources.map((src, idx) => (
                      <a
                        key={idx}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-[#FAFAFA] border border-[#EAEAEA] hover:border-[#111111] text-[#333333] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-3 h-3 text-[#777777]" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-[#EAEAEA] bg-[#FAFAFA] flex justify-end space-x-3">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 text-xs font-medium text-[#555555] hover:text-[#111111] transition-colors"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
