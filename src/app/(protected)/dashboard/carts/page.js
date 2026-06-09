'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, User, Clock, Package, Globe, ExternalLink, Tag } from 'lucide-react';
import { DataTable } from '../../../../components/ui/DataTable';
import { Badge } from '../../../../components/ui/badge';
import { format } from 'date-fns';

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerType, setCustomerType] = useState('ALL');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    async function fetchCarts() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
        const res = await fetch(`${baseUrl}/api/admin/carts?start_date=${startDate}&end_date=${endDate}&customer_type=${customerType}&t=${Date.now()}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success) {
          setCarts(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch carts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCarts();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchCarts, 60000);
    return () => clearInterval(interval);
  }, [startDate, endDate, customerType]);

  const columns = [
    {
      header: 'Customer Details',
      accessorKey: 'userId',
      cell: ({ row }) => {
        const item = row.original;
        const customer = item.customer;
        return (
          <div className="flex flex-col gap-1">
            {customer ? (
              <>
                <div className="flex items-center gap-2 font-black text-zinc-900 text-sm tracking-tight">
                  <User size={14} className="text-[#5A413F]" />
                  {customer.firstName} {customer.lastName}
                </div>
                <div className="text-[10px] text-zinc-500 truncate max-w-[180px] font-medium">{customer.email}</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{customer.phone}</div>
              </>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 font-bold text-zinc-400">
                  <User size={14} />
                  Guest
                </div>
                {item.sessionId && (
                   <span className="text-[9px] text-zinc-300 font-mono truncate max-w-[150px]">
                     SID: {item.sessionId}
                   </span>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      header: 'Attribution / Source',
      accessorKey: 'utmSource',
      cell: ({ row }) => {
        const item = row.original;
        const page = item.sourcePage || 'unknown';
        const cleanPage = page.replace(/^https?:\/\/[^\/]+/, '') || '/';
        return (
          <div className="flex flex-col gap-1 max-w-[200px]">
            <div className="flex items-center gap-1.5 text-xs text-zinc-600 font-medium">
              <Globe size={12} className="text-zinc-400" />
              <span className="truncate" title={page}>{cleanPage}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-zinc-100 text-zinc-500 border-zinc-200 text-[9px] font-black uppercase tracking-tighter px-1.5 py-0">
                {item.utmSource || 'Organic'}
              </Badge>
              {item.utmMedium && (
                 <span className="text-[9px] text-zinc-400 font-bold uppercase">{item.utmMedium}</span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Campaign / Context',
      accessorKey: 'utmCampaign',
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-zinc-900 truncate max-w-[120px]">
              {item.utmCampaign || 'None'}
            </span>
            <div className="flex flex-wrap gap-1">
              {item.utmContent && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-[8px] font-bold px-1 py-0">
                  CT: {item.utmContent}
                </Badge>
              )}
              {item.utmTerm && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-[8px] font-bold px-1 py-0">
                  TM: {item.utmTerm}
                </Badge>
              )}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: ({ row }) => {
        const items = row.original.items || [];
        return (
          <div className="flex flex-col gap-1.5">
            {items.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="size-8 rounded bg-zinc-100 flex-shrink-0 overflow-hidden border border-zinc-200">
                  {item.image && <img src={item.image} alt="" className="size-full object-cover" />}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium line-clamp-1 max-w-[200px]">{item.title}</span>
                  <span className="text-[10px] text-zinc-500">Qty: {item.quantity} • ₹{item.price?.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {items.length > 3 && (
              <span className="text-[10px] text-[#5A413F] font-bold">
                + {items.length - 3} more items
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: 'Total Value',
      accessorKey: 'totalAmount',
      cell: ({ row }) => (
        <span className="font-black text-zinc-900">
          ₹{row.original.totalAmount?.toLocaleString() || row.original.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Last Activity',
      accessorKey: 'updatedAt',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs text-zinc-500">
          <div className="flex items-center gap-1.5">
            <Clock size={12} />
            {row.original.updatedAt ? format(new Date(row.original.updatedAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
          </div>
        </div>
      ),
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
            <ShoppingCart className="text-[#5A413F]" size={32} />
            Abandoned Carts
          </h1>
          <p className="text-zinc-500 mt-1">Real-time view of customer shopping carts across the store.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Customer Details</span>
              <select 
                value={customerType} 
                onChange={(e) => setCustomerType(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none cursor-pointer"
              >
                <option value="ALL">All Users</option>
                <option value="CUSTOMER">Registered Customers</option>
                <option value="GUEST">Guest Users</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-zinc-100 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Start Date</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none"
              />
            </div>
            <div className="h-8 w-px bg-zinc-100 mx-2" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">End Date</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs font-bold bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="px-4 py-2 border-r border-zinc-100 text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live View
                  </p>
                  <p className="text-[10px] font-bold text-zinc-900">Refreshes every 1m</p>
              </div>
              <div className="px-4 py-2 text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Carts</p>
                  <p className="text-xl font-black text-zinc-900">{carts.length}</p>
              </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A413F]"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={carts} hideCount={true} />
      )}
    </div>
  );
}
