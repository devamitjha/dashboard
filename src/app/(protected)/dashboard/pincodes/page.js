'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Loader2, RefreshCw, FileDown } from 'lucide-react';
import PincodeTable from './PincodeTable';

export default function PincodesDashboard() {
  const [pincodes, setPincodes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const fetchPincodes = useCallback(async (page = 1, q = '') => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
      const res = await fetch(`${baseUrl}/api/pincodes?page=${page}&limit=15${q ? `&q=${encodeURIComponent(q)}` : ''}`);
      const data = await res.json();
      if (data.success) {
        setPincodes(data.pincodes || []);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error('Failed to fetch pincodes', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchPincodes(1, query); }, 500);
    return () => clearTimeout(timer);
  }, [query, fetchPincodes]);

  return (
    <div className='max-w-7xl mx-auto py-10 px-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6'>
        <div className='flex items-start gap-4'>
           <div className='bg-zinc-100 p-3 rounded-2xl'><MapPin size={24} className='text-zinc-400' /></div>
           <div>
             <h1 className='text-3xl font-bold text-zinc-900'>Pincode Management</h1>
             <p className='text-zinc-500 mt-1'>Manage serviceability and payment availability by pincode.</p>
           </div>
        </div>
        
        <div className='flex items-center gap-3'>
           <button className='flex items-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest text-emerald-600 transition-all'>
             <RefreshCw size={16} /> Refine GPS
           </button>
           <button className='flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all'>
             <FileDown size={18} /> Import Data
           </button>
        </div>
      </div>

      <div className='bg-white rounded-3xl border border-zinc-100 shadow-xl shadow-zinc-100/50 overflow-hidden'>
        <div className='p-6 border-b border-zinc-50 flex items-center justify-between gap-4 bg-white/50 backdrop-blur-sm'>
          <h2 className='text-xl font-bold text-zinc-900 italic font-figtree'>Serviceable Areas</h2>
          <div className='relative max-w-sm w-full'>
            <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400' size={18} />
            <input
              type='text'
              placeholder='Search by pincode...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className='w-full pl-12 pr-6 py-3 bg-zinc-50/50 border border-zinc-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-zinc-100 transition-all font-medium'
            />
          </div>
        </div>
        
        <PincodeTable 
          data={pincodes} 
          pagination={pagination} 
          onPageChange={(p) => fetchPincodes(p, query)} 
        />
      </div>
    </div>
  );
}
