'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminAuthGate({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('lucira_admin_auth');
    if (auth !== 'true') {
      router.push('/');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className='min-h-screen bg-zinc-950 flex items-center justify-center'>
        <Loader2 className='animate-spin text-zinc-500' size={40} />
      </div>
    );
  }

  return children;
}
