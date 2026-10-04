"use client";

import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Bookmark, 
  Zap, 
  Layers, 
  Video, 
  FileText, 
  MessageSquare,
  ArrowRight,
  Loader2,
  X
} from "lucide-react";

interface IdeaCard {
  id: string;
  topic: string;
  format: "Short Video" | "LinkedIn" | "Thread" | "Article" | string;
  angle: string;
  hook: string;
  outline: string[];
  isSaved?: boolean;
}

const FORMAT_TYPES = ["Semua Format", "Short Video", "LinkedIn", "Thread", "Article"];

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<IdeaCard[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState("Semua Format");
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Variant Modal state
  const [variantModalIdea, setVariantModalIdea] = useState<IdeaCard | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<string[]>([]);
  const [isGeneratingVariants, setIsGeneratingVariants] = useState(false);

  // Load ideas from DB on mount
  useEffect(() => {
    fetchIdeasFromDB();
  }, []);

  const fetchIdeasFromDB = async () => {
    setIsLoadingList(true);
    try {
      const res = await fetch("http://localhost:8000/api/ideas/");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setIsLoadingList(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => 
    selectedFormat === "Semua Format" || idea.format === selectedFormat
  );

  const handleCopyHook = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSaveIdea = async (id: string) => {
    // Optimistic UI update
    setIdeas(ideas.map(item => 
      item.id === id ? { ...item, isSaved: !item.isSaved } : item
    ));

    try {
      await fetch(`http://localhost:8000/api/ideas/${id}/toggle-save`, {
        method: "PATCH"
      });
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const handleGenerateIdeas = async () => {
    if (!topicInput.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("http://localhost:8000/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: topicInput,
          format: selectedFormat === "Semua Format" ? "Short Video" : selectedFormat
        })
      });
      if (res.ok) {
        const newIdea: IdeaCard = await res.json();
        setIdeas([newIdea, ...ideas]);
        setTopicInput("");
      } else {
        alert("Gagal meracik ide.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal memproses ide konten.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenVariantsModal = async (idea: IdeaCard) => {
    setVariantModalIdea(idea);
    setGeneratedVariants([]);
    setIsGeneratingVariants(true);
    try {
      const res = await fetch("http://localhost:8000/api/ideas/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: idea.topic,
          current_hook: idea.hook
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedVariants(data.variants || []);
      }
    } catch (err) {
      console.error(err);
      setGeneratedVariants(["Gagal memuat variasi hook."]);
    } finally {
      setIsGeneratingVariants(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case "Short Video": return <Video className="w-3.5 h-3.5" />;
      case "LinkedIn": return <FileText className="w-3.5 h-3.5" />;
      case "Thread": return <MessageSquare className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 bg-[#FFFFFF] font-sans min-h-screen text-[#111111]">
      <main className="max-w-6xl w-full mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#EAEAEA] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#666666] mb-1 font-medium">
              <Zap className="w-4 h-4 text-[#111111]" />
              <span>Creative Intelligence Studio & DB</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
              Kartu Ide Konten & Hook Generator
            </h1>
            <p className="text-[#666666] text-sm mt-1">
              Ide dan *hook* yang diracik akan tersimpan secara otomatis di Database.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs bg-[#FAFAFA] border border-[#EAEAEA] text-[#666666] px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{ideas.length} Ide Tersimpan di DB</span>
            </span>
          </div>
        </div>

        {/* Live Idea Generator Bar */}
        <div className="mb-10 p-5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <label className="block text-xs font-semibold text-[#111111] mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#111111]" />
            <span>Generate Ide & Hook Konten Baru Ke DB</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateIdeas()}
              placeholder="Masukkan topik atau kata kunci (contoh: 'Tips Produktivitas WFH', 'Strategi Launching SaaS')..."
              className="flex-1 px-4 py-2.5 bg-white border border-[#EAEAEA] rounded-xl text-sm outline-none focus:border-[#111111] transition-colors"
            />
            <button
              onClick={handleGenerateIdeas}
              disabled={!topicInput.trim() || isGenerating}
              className="bg-[#111111] hover:bg-black text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Meracik Ide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate & Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Format Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {FORMAT_TYPES.map(fmt => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                selectedFormat === fmt
                  ? "bg-[#111111] text-white"
                  : "bg-[#FAFAFA] border border-[#EAEAEA] text-[#666666] hover:text-[#111111] hover:bg-[#F0F0F0]"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Ideas Grid */}
        {isLoadingList ? (
          <div className="flex justify-center items-center py-20 text-xs text-[#666666] space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
            <span>Memuat database ide...</span>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-16 bg-[#FAFAFA] border border-[#EAEAEA] rounded-2xl">
            <p className="text-sm text-[#666666]">Belum ada ide tersimpan dalam format ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredIdeas.map(idea => (
              <div
                key={idea.id}
                className="bg-white border border-[#EAEAEA] hover:border-[#D0D0D0] rounded-2xl p-6 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-[#FAFAFA] border border-[#EAEAEA] px-2.5 py-1 rounded-md font-medium text-[#444444] flex items-center gap-1.5">
                        {getFormatIcon(idea.format)}
                        <span>{idea.format}</span>
                      </span>
                      <span className="text-xs text-[#888888] font-medium">
                        • {idea.angle}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleSaveIdea(idea.id)}
                      className="p-1 text-[#888888] hover:text-[#111111] transition-colors"
                      title={idea.isSaved ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                    >
                      <Bookmark className={`w-4 h-4 ${idea.isSaved ? "fill-[#111111] text-[#111111]" : ""}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-[#111111] mb-4">
                    {idea.topic}
                  </h3>

                  <div className="bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl p-4 mb-4 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">
                          🪝 Hook Pembuka:
                        </span>
                        <p className="text-xs font-medium text-[#111111] italic leading-relaxed">
                          "{idea.hook}"
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyHook(idea.id, idea.hook)}
                        className="ml-2 p-1.5 bg-white border border-[#EAEAEA] rounded-lg text-[#555555] hover:text-[#111111] hover:border-[#111111] transition-colors shrink-0"
                        title="Salin Hook"
                      >
                        {copiedId === idea.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <span className="text-[10px] font-semibold text-[#888888] uppercase tracking-wider block mb-1">
                      📌 Poin Pokok Konten:
                    </span>
                    {idea.outline.map((pt, idx) => (
                      <div key={idx} className="flex items-start text-xs text-[#555555] space-x-2">
                        <span className="text-[#999999]">•</span>
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F5F5F5] flex items-center justify-between">
                  <button
                    onClick={() => handleOpenVariantsModal(idea)}
                    className="text-xs font-medium text-[#555555] hover:text-[#111111] flex items-center space-x-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Generate Variasi Hook</span>
                  </button>

                  <span className="text-xs text-[#888888] flex items-center gap-1 cursor-pointer hover:text-[#111111]">
                    <span>Gunakan Draf</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Modal Variasi Hook */}
        {variantModalIdea && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-150">
            <div className="bg-white border border-[#EAEAEA] rounded-2xl max-w-xl w-full flex flex-col shadow-2xl overflow-hidden">
              
              <div className="p-5 border-b border-[#EAEAEA] flex justify-between items-center bg-[#FAFAFA]">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-base font-bold text-[#111111]">
                    Variasi Hook Alternatif (AI Generated)
                  </h3>
                </div>
                <button
                  onClick={() => setVariantModalIdea(null)}
                  className="p-1 rounded-lg text-[#666666] hover:bg-[#EAEAEA] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-[#666666]">
                  Variasi hook pembuka AI untuk topik: <strong className="text-[#111111]">{variantModalIdea.topic}</strong>
                </p>

                {isGeneratingVariants ? (
                  <div className="flex items-center justify-center py-8 space-x-2 text-xs text-[#666666]">
                    <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                    <span>Membuat variasi hook...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generatedVariants.map((varText, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#FAFAFA] border border-[#EAEAEA] rounded-xl flex justify-between items-center text-xs text-[#111111]"
                      >
                        <div className="flex-1 pr-3">
                          <ReactMarkdown>{varText}</ReactMarkdown>
                        </div>
                        <button
                          onClick={() => handleCopyHook(`var-${idx}`, varText)}
                          className="p-1.5 bg-white border border-[#EAEAEA] rounded-lg text-[#555555] hover:text-[#111111] transition-colors shrink-0"
                        >
                          {copiedId === `var-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[#EAEAEA] bg-[#FAFAFA] flex justify-end">
                <button
                  onClick={() => setVariantModalIdea(null)}
                  className="px-4 py-2 bg-[#111111] text-white text-xs font-medium rounded-xl hover:bg-black transition-colors"
                >
                  Selesai
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}
