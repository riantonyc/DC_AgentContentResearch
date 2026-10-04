'use client';

import React, { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [creatorName, setCreatorName] = useState('Kreator Rohani');
  const [niche, setNiche] = useState('Renungan & Edukasi Rohani Kristen');
  const [tone, setTone] = useState('Warm & Gentle');
  const [targetAudience, setTargetAudience] = useState('Pemuda & Dewasa Muda');
  const [preferredFormat, setPreferredFormat] = useState('Reels / TikTok (<60s)');
  const [bibleTranslation, setBibleTranslation] = useState('TB (Terjemahan Baru)');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPersona();
  }, []);

  const fetchPersona = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/persona/');
      if (res.ok) {
        const data = await res.json();
        setCreatorName(data.creator_name || 'Kreator Rohani');
        setNiche(data.niche || 'Renungan & Edukasi Rohani Kristen');
        setTone(data.tone || 'Warm & Gentle');
        setTargetAudience(data.target_audience || 'Pemuda & Dewasa Muda');
        setPreferredFormat(data.preferred_format || 'Reels / TikTok (<60s)');
        setBibleTranslation(data.bible_translation || 'TB (Terjemahan Baru)');
      }
    } catch (err) {
      console.error('Error fetching persona:', err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/persona/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_name: creatorName,
          niche,
          tone,
          target_audience: targetAudience,
          preferred_format: preferredFormat,
          bible_translation: bibleTranslation
        })
      });

      if (res.ok) {
        setMessage('Persona berhasil diperbarui!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error('Error saving persona:', err);
      setMessage('Gagal menyimpan persona.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 p-8 bg-[#F9FAFB] font-sans min-h-screen">
      <main className="max-w-3xl w-full mx-auto space-y-6">
        
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            ✝ Persona & AI Brand Voice
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
            Pengaturan Persona Kreator Rohani
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pengaturan ini akan digunakan oleh seluruh AI Agent (Research, Ideas, dan Script Builder) untuk menghasilkan konten yang konsisten dengan karakter gayamu.
          </p>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Nama Kreator / Channel
              </label>
              <input
                type="text"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Fokus Niche / Pelayanan
              </label>
              <input
                type="text"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Default Tone Suara
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Warm & Gentle">Warm & Gentle (Menyejukkan & Lembut)</option>
                  <option value="Passionate & Bold">Passionate & Bold (Semangat & Antusias)</option>
                  <option value="Youthful & Relatable">Youthful & Relatable (Khas Gen-Z / Pemuda)</option>
                  <option value="Deep & Exegetical">Deep & Exegetical (Mendalam / Eksegesis)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Audiens Utama
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Pemuda & Dewasa Muda">Pemuda & Dewasa Muda</option>
                  <option value="Orang Tua & Keluarga">Orang Tua & Keluarga</option>
                  <option value="Remaja & Pelajar">Remaja & Pelajar</option>
                  <option value="Umum">Jemaat Umum</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Versi Alkitab Utama
                </label>
                <select
                  value={bibleTranslation}
                  onChange={(e) => setBibleTranslation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="TB (Terjemahan Baru)">TB (Terjemahan Baru - LAI)</option>
                  <option value="BIMK (Bahasa Indonesia Masa Kini)">BIMK (Bahasa Indonesia Masa Kini)</option>
                  <option value="NIV / ESV (Inggris)">NIV / ESV (Versi Inggris)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Format Konten Standar
                </label>
                <select
                  value={preferredFormat}
                  onChange={(e) => setPreferredFormat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Reels / TikTok (<60s)">Reels / TikTok (&lt;60s)</option>
                  <option value="Carousel IG (5-10 Slide)">Carousel IG Slide</option>
                  <option value="Khotbah Pendek (3-5 Menit)">Khotbah Pendek</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Pengaturan Persona'}
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
