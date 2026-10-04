'use client';

import React, { useState, useEffect } from 'react';

interface Script {
  id: string;
  title: string;
  hook: string;
  bible_verse: string;
  core_reflection: string;
  call_to_action: string;
  tone: string;
  format: string;
  full_script: string;
  status: string;
  created_at: string;
}

export default function ScriptBuilderPage() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Warm & Gentle');
  const [targetAudience, setTargetAudience] = useState('Pemuda & Dewasa Muda');
  const [format, setFormat] = useState('Reels / TikTok (<60s)');
  const [bibleTranslation, setBibleTranslation] = useState('TB (Terjemahan Baru)');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [activeScript, setActiveScript] = useState<Script | null>(null);
  const [scriptList, setScriptList] = useState<Script[]>([]);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/scripts/');
      if (res.ok) {
        const data = await res.json();
        setScriptList(data);
        if (data.length > 0 && !activeScript) {
          setActiveScript(data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching scripts:', err);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/scripts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          tone,
          target_audience: targetAudience,
          format,
          bible_translation: bibleTranslation,
          additional_notes: additionalNotes
        })
      });

      if (res.ok) {
        const scriptData = await res.json();
        setActiveScript(scriptData);
        setScriptList([scriptData, ...scriptList]);
      }
    } catch (err) {
      console.error('Error generating script:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScript = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Yakin ingin menghapus skrip ini?')) return;
    try {
      const res = await fetch(`http://localhost:8000/api/scripts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setScriptList(scriptList.filter(s => s.id !== id));
        if (activeScript?.id === id) setActiveScript(null);
      }
    } catch (err) {
      console.error('Error deleting script:', err);
    }
  };

  const handleUpdateScript = async () => {
    if (!activeScript) return;
    try {
      const res = await fetch(`http://localhost:8000/api/scripts/${activeScript.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeScript)
      });
      if (res.ok) {
        setScriptList(scriptList.map(s => s.id === activeScript.id ? activeScript : s));
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error updating script:', err);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-8 bg-[#F9FAFB] font-sans min-h-screen">
      <main className="max-w-6xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                ✝ AI Script Protocol
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Custom Script Builder Rohani
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Susun skrip renungan video pendek yang terstruktur, otentik, dan disesuaikan dengan gaya pelayananmu.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              + Buat Skrip Baru
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Riwayat Skrip ({scriptList.length})
            </button>
          </div>
        </div>

        {/* CREATE TAB */}
        {activeTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: Controls */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-3">
                Kustomisasi Parameter Skrip
              </h2>

              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Topik / Tema Renungan *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Menghadapi Rasa Takut & Cemas, Janji Kesetiaan Tuhan..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Tone / Emosi Bicara
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Warm & Gentle">Warm & Gentle (Menyejukkan)</option>
                      <option value="Passionate & Bold">Passionate & Bold (Semangat)</option>
                      <option value="Youthful & Relatable">Youthful & Relatable (Gen-Z)</option>
                      <option value="Deep & Exegetical">Deep & Exegetical (Mendalam)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Target Audiens
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Pemuda & Dewasa Muda">Pemuda & Dewasa Muda</option>
                      <option value="Orang Tua & Keluarga">Orang Tua & Keluarga</option>
                      <option value="Remaja & Pelajar">Remaja & Pelajar</option>
                      <option value="Umum">Jemaat Umum</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Format Konten
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="Reels / TikTok (<60s)">Reels / TikTok (&lt;60s)</option>
                      <option value="Carousel IG (5-10 Slide)">Carousel IG Slide</option>
                      <option value="Khotbah Pendek (3-5 Menit)">Khotbah Pendek</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Versi Alkitab
                    </label>
                    <select
                      value={bibleTranslation}
                      onChange={(e) => setBibleTranslation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="TB (Terjemahan Baru)">TB (Terjemahan Baru)</option>
                      <option value="BIMK (Bahasa Indonesia Masa Kini)">BIMK</option>
                      <option value="NIV / ESV (Inggris)">NIV / ESV</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Catatan Khusus / Ilustrasi Tambahan (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Sertakan konteks cerita atau pesan spesifik yang ingin kamu sampaikan..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyusun Skrip AI...
                    </>
                  ) : (
                    <>✨ Generate Custom Script AI</>
                  )}
                </button>
              </form>
            </div>

            {/* Right Panel: Active Script Result */}
            <div className="lg:col-span-7 space-y-6">
              {activeScript ? (
                <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                        {activeScript.format} • {activeScript.tone}
                      </span>
                      {isEditing ? (
                        <input 
                          type="text" 
                          value={activeScript.title} 
                          onChange={e => setActiveScript({...activeScript, title: e.target.value})} 
                          className="w-full text-xl font-bold text-gray-900 mt-1 border border-indigo-300 rounded px-2 py-1 outline-none"
                        />
                      ) : (
                        <h2 className="text-xl font-bold text-gray-900 mt-1">
                          {activeScript.title}
                        </h2>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all">Batal</button>
                          <button onClick={handleUpdateScript} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-all">Simpan</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1">✏️ Edit</button>
                          <button onClick={() => navigator.clipboard.writeText(activeScript.full_script)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1">📋 Salin</button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Structured Blocks */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hook */}
                    <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">1. HOOK PEMBUKA (0-5s)</span>
                      {isEditing ? (
                        <textarea value={activeScript.hook} onChange={e => setActiveScript({...activeScript, hook: e.target.value})} className="w-full text-sm font-medium text-amber-950 bg-white border border-amber-300 rounded p-2 outline-none" rows={3} />
                      ) : (
                        <p className="text-sm font-medium text-amber-950">"{activeScript.hook}"</p>
                      )}
                    </div>

                    {/* Bible Verse */}
                    <div className="p-4 bg-blue-50/70 border border-blue-200/70 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">2. LANDASAN AYAT ALKITAB</span>
                      {isEditing ? (
                        <textarea value={activeScript.bible_verse} onChange={e => setActiveScript({...activeScript, bible_verse: e.target.value})} className="w-full text-sm font-medium text-blue-950 bg-white border border-blue-300 rounded p-2 outline-none" rows={3} />
                      ) : (
                        <p className="text-sm font-medium text-blue-950">{activeScript.bible_verse}</p>
                      )}
                    </div>
                  </div>

                  {/* Core Reflection */}
                  <div className="p-4 bg-purple-50/70 border border-purple-200/70 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wide">3. PESAN RENUNGAN INTI</span>
                    {isEditing ? (
                      <textarea value={activeScript.core_reflection} onChange={e => setActiveScript({...activeScript, core_reflection: e.target.value})} className="w-full text-sm text-purple-950 bg-white border border-purple-300 rounded p-2 outline-none" rows={4} />
                    ) : (
                      <p className="text-sm text-purple-950 leading-relaxed">{activeScript.core_reflection}</p>
                    )}
                  </div>

                  {/* CTA & Prayer */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-xl space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">4. DOA & CALL TO ACTION (CTA)</span>
                    {isEditing ? (
                      <textarea value={activeScript.call_to_action} onChange={e => setActiveScript({...activeScript, call_to_action: e.target.value})} className="w-full text-sm font-medium text-emerald-950 bg-white border border-emerald-300 rounded p-2 outline-none" rows={3} />
                    ) : (
                      <p className="text-sm font-medium text-emerald-950">{activeScript.call_to_action}</p>
                    )}
                  </div>

                  {/* Full Production Script */}
                  <div className="space-y-2 pt-2 border-t">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">🎬 Full Production Script (Visual & Acting Cues)</h3>
                    {isEditing ? (
                      <textarea value={activeScript.full_script} onChange={e => setActiveScript({...activeScript, full_script: e.target.value})} className="w-full p-4 bg-gray-900 text-gray-100 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-mono outline-none" rows={8} />
                    ) : (
                      <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-xs leading-relaxed whitespace-pre-wrap font-mono">{activeScript.full_script}</pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-300 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
                    ✝
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">
                    Belum ada skrip yang dipilih
                  </h3>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Isi topik di panel sebelah kiri dan klik "Generate Custom Script AI" untuk membuat skrip renungan rohani terstruktur.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scriptList.map((sc) => (
              <div
                key={sc.id}
                onClick={() => {
                  setActiveScript(sc);
                  setActiveTab('create');
                }}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      {sc.format}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {sc.created_at ? new Date(sc.created_at).toLocaleDateString('id-ID') : ''}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                    {sc.title}
                  </h3>
                  <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">
                    "{sc.hook}"
                  </p>
                </div>
                <div className="pt-3 border-t text-[11px] font-medium text-indigo-600 flex items-center justify-between">
                  <span>Tone: {sc.tone}</span>
                  <div className="flex items-center gap-2">
                    <span onClick={(e) => handleDeleteScript(sc.id, e)} className="text-red-500 hover:text-red-700 hover:underline">Hapus</span>
                    <span>Lihat Skrip →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
