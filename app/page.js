'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  return (
    <>
      <Navbar user={user} />
      <div className="hero">
        <h1>CreatorRank</h1>
        <p>
          Connect with YouTube creators, help each other grow, and climb the
          ranks together.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {!user ? (
            <>
              <button className="btn btn-primary" onClick={() => router.push('/register')}>
                Get Started
              </button>
              <button
                className="btn"
                style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}
                onClick={() => router.push('/login')}
              >
                Sign In
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </button>
          )}
        </div>
      </div>
    </>
  );
}
