'use client';

import { useState, useEffect } from 'react';
import { CreditCard, User, Clock, CheckCircle2, ShieldCheck, MapPin, Receipt, ExternalLink } from 'lucide-react';
import { DataTable } from '../../../../components/ui/DataTable';
import { Badge } from '../../../../components/ui/badge';
import { format } from 'date-fns';

export default function PaymentsPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://webuat.lucirajewelry.com';
        const url = `${baseUrl}/api/admin/orders?start_date=${startDate}&end_date=${endDate}&t=${Date.now()}`;
        console.log('Fetching orders from:', url);
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [startDate, endDate]);

  const columns = [
    {
      header: 'Order Details',
      accessorKey: 'shopifyOrderName',
      cell: ({ row }) => {
        const order = row.original;
        const displayName = order.shopifyOrderName && !order.shopifyOrderName.includes('DRAFT') 
          ? order.shopifyOrderName 
          : `#${String(order.shopifyOrderId || "").split('/').pop()}`;
        return (
          <div className="flex flex-col gap-1">
            <span className="font-black text-[#5A413F] text-sm tracking-tight">{displayName}</span>
            <span className="text-[10px] text-zinc-400 font-mono break-all max-w-[150px]">
                {String(order.shopifyOrderId || "").split('/').pop()}
            </span>
          </div>
        );
      },
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
      cell: ({ row }) => {
        const customer = row.original.customer;
        const address = row.original.shippingAddress;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 font-bold text-zinc-900 text-xs">
              <User size={12} className="text-zinc-400" />
              {customer?.firstName} {customer?.lastName}
            </div>
            <div className="text-[10px] text-zinc-500 truncate max-w-[180px]">{customer?.email}</div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <MapPin size={10} />
                {address?.city}, {address?.province}
            </div>
          </div>
        );
      },
    },
    {
      header: 'Payment info',
      accessorKey: 'paymentMethod',
      cell: ({ row }) => {
        const order = row.original;
        const method = order.paymentMethod?.type === "partial_cod" ? "Partial COD" : "Prepaid";
        return (
          <div className="flex flex-col gap-1.5">
            <Badge variant={method === "Prepaid" ? "success" : "warning"} className="w-fit text-[9px] px-1.5 py-0">
                {method}
            </Badge>
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-zinc-700">RP: {order.razorpayPaymentId || 'N/A'}</span>
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest">Razorpay Secure</span>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: ({ row }) => (
        <div className="flex flex-col">
            <span className="font-black text-zinc-900">₹{row.original.totalAmount?.toLocaleString()}</span>
            {row.original.paymentMethod?.type === "partial_cod" && (
                <span className="text-[10px] text-zinc-400 italic">Prepaid: ₹{row.original.paymentMethod.prepaidAmount?.toLocaleString()}</span>
            )}
        </div>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-[10px] text-zinc-500 font-medium">
            <span>{row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM dd, yyyy') : 'N/A'}</span>
            <span>{row.original.createdAt ? format(new Date(row.original.createdAt), 'HH:mm') : ''}</span>
        </div>
      ),
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
            const status = row.original.status || 'PAID';
            return (
                <Badge className={cn(
                    "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border-none",
                    status === 'PAID' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                )}>
                    {status}
                </Badge>
            )
        }
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={32} />
            Website Orders
          </h1>
          <p className="text-zinc-500 mt-1">Confirmed orders from the website (Shopify Admin API channel).</p>
        </div>
        <div className="flex items-center gap-4">
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
                max={format(new Date(), 'yyyy-MM-dd')}
                className="text-xs font-bold bg-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-zinc-100 shadow-sm">
              <div className="px-6 py-2 text-center border-r border-zinc-50">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total Sales</p>
                  <p className="text-xl font-black text-zinc-900">₹{orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0).toLocaleString()}</p>
              </div>
              <div className="px-6 py-2 text-center">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Orders</p>
                  <p className="text-xl font-black text-zinc-900">{orders.length}</p>
              </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={orders} hideCount={true} />
      )}
    </div>
  );
}

function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
