'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download,
  X,
  Briefcase,
  PenTool
} from 'lucide-react';
import * as XLSX from 'xlsx';

// Data models
interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'activity' | 'endorse';
  // Endorse specific fields
  brand?: string;
  price?: number;
  status?: 'pending' | 'paid';
  notes?: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Form State
  const [eventType, setEventType] = useState<'activity' | 'endorse'>('activity');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventTitle, setEventTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [status, setStatus] = useState<'pending' | 'paid'>('pending');
  const [notes, setNotes] = useState('');

  // Dummy Initial Data
  useEffect(() => {
    setEvents([
      { id: '1', date: '2026-10-05', title: 'Shooting Konten IG', type: 'activity' },
      { id: '2', date: '2026-10-10', title: 'Endorse Sepatu', type: 'endorse', brand: 'Nike', price: 5000000, status: 'paid', notes: 'Video 60 detik' },
      { id: '3', date: '2026-10-15', title: 'Endorse Kopi', type: 'endorse', brand: 'Kopi Kenangan', price: 2500000, status: 'pending', notes: 'Reels IG' }
    ]);
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    const weekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    // Weekday headers
    weekdays.forEach((day, i) => {
      days.push(
        <div key={`header-${i}`} className="text-center font-semibold text-xs text-gray-500 py-2">
          {day}
        </div>
      );
    });

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-gray-50 border border-gray-100 rounded-lg"></div>);
    }

    // Days in month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      
      days.push(
        <div key={i} className="min-h-[100px] border border-gray-200 rounded-lg p-2 bg-white hover:border-indigo-300 transition-colors cursor-pointer"
             onClick={() => {
               setEditingEventId(null);
               setEventType('activity');
               setEventDate(dateStr);
               setEventTitle('');
               setBrand('');
               setPrice('');
               setStatus('pending');
               setNotes('');
               setIsModalOpen(true);
             }}>
          <div className="font-medium text-sm text-gray-700 mb-1">{i}</div>
          <div className="space-y-1">
            {dayEvents.map(ev => (
              <div 
                key={ev.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingEventId(ev.id);
                  setEventType(ev.type);
                  setEventDate(ev.date);
                  setEventTitle(ev.title);
                  setBrand(ev.brand || '');
                  setPrice(ev.price || '');
                  setStatus(ev.status || 'pending');
                  setNotes(ev.notes || '');
                  setIsModalOpen(true);
                }}
                className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium hover:opacity-80 transition-opacity ${ev.type === 'endorse' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-indigo-100 text-indigo-800 border border-indigo-200'}`}
              >
                {ev.type === 'endorse' ? '💰 ' : '📝 '}
                {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };

  const handleExportExcel = () => {
    const endorseEvents = events.filter(e => e.type === 'endorse').map(e => ({
      Tanggal: e.date,
      Brand: e.brand,
      'Nama Kegiatan': e.title,
      'Harga (Rp)': e.price,
      Status: e.status === 'paid' ? 'Lunas' : 'Belum Lunas',
      Catatan: e.notes
    }));

    if (endorseEvents.length === 0) {
      alert("Tidak ada data endorse untuk diekspor.");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(endorseEvents);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Endorsements");
    XLSX.writeFile(wb, "Laporan_Endorse.xlsx");
  };

  const handleDeleteEvent = () => {
    if (editingEventId) {
      setEvents(events.filter(e => e.id !== editingEventId));
      setIsModalOpen(false);
    }
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    const eventData: CalendarEvent = {
      id: editingEventId || Date.now().toString(),
      date: eventDate,
      title: eventTitle,
      type: eventType,
      ...(eventType === 'endorse' && {
        brand,
        price: Number(price),
        status,
        notes
      })
    };

    if (editingEventId) {
      setEvents(events.map(ev => ev.id === editingEventId ? eventData : ev));
    } else {
      setEvents([...events, eventData]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1 p-8 md:p-12 bg-[#FFFFFF] font-sans min-h-screen text-[#111111]">
      <main className="max-w-6xl w-full mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-[#EAEAEA] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#666666] mb-1 font-medium">
              <CalendarIcon className="w-4 h-4 text-[#111111]" />
              <span>Workspace Organizer</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight text-[#111111]">
              Kalender Kegiatan & Endorse
            </h1>
            <p className="text-[#666666] text-sm mt-1">
              Jadwalkan kegiatan konten harian dan catat endorsement untuk diekspor ke laporan bulanan.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Laporan Endorse (Excel)</span>
            </button>
            <button
              onClick={() => {
                setEditingEventId(null);
                setEventType('activity');
                setEventDate(new Date().toISOString().split('T')[0]);
                setEventTitle('');
                setBrand('');
                setPrice('');
                setStatus('pending');
                setNotes('');
                setIsModalOpen(true);
              }}
              className="bg-[#111111] hover:bg-black text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kegiatan</span>
            </button>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button onClick={handlePrevMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs font-medium text-gray-700">
                Hari Ini
              </button>
              <button onClick={handleNextMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {renderCalendar()}
          </div>
        </div>
      </main>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">{editingEventId ? 'Edit Catatan' : 'Tambah Catatan Kalender'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvent} className="p-5 space-y-4">
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => setEventType('activity')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md ${eventType === 'activity' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <PenTool className="w-3.5 h-3.5" /> Kegiatan
                </button>
                <button 
                  type="button" 
                  onClick={() => setEventType('endorse')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md ${eventType === 'endorse' ? 'bg-white shadow-sm text-amber-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Briefcase className="w-3.5 h-3.5" /> Endorsement
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Judul / Nama Kegiatan</label>
                <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} required placeholder="Contoh: Shooting Video" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400" />
              </div>

              {eventType === 'endorse' && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nama Brand</label>
                    <input type="text" value={brand} onChange={e => setBrand(e.target.value)} required placeholder="Contoh: Shopee" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Harga/Deal (Rp)</label>
                      <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} required placeholder="5000000" className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Status Pembayaran</label>
                      <select value={status} onChange={e => setStatus(e.target.value as 'pending' | 'paid')} className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 bg-white">
                        <option value="pending">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Catatan Tambahan</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Syarat dan ketentuan, arahan khusus..." className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 resize-none" />
              </div>

              <div className="pt-2 flex gap-3">
                {editingEventId && (
                  <button type="button" onClick={handleDeleteEvent} className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl py-3 px-4 text-sm transition-colors">
                    Hapus
                  </button>
                )}
                <button type="submit" className="flex-1 bg-[#111111] hover:bg-black text-white font-semibold rounded-xl py-3 text-sm transition-colors">
                  {editingEventId ? 'Simpan Perubahan' : 'Simpan Catatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
