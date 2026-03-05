'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import Navbar from '@/components/Navbar';
import UserCard from '@/components/UserCard';
import VerifySubscriptionButton from '@/components/VerifySubscriptionButton';

export default function UsersPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setAuthUser(user);

      const { data: prof } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setProfile(prof);

      if (prof && prof.is_verified) {
        const { data: allUsers } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        setUsers(allUsers || []);
      }

      setLoading(false);
    }
    load();
  }, [router]);

  function handleVerified() {
    setProfile((prev) => ({ ...prev, is_verified: true }));
    // Reload users after verification
    supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => setUsers(data || []));
  }

  if (loading) {
    return (
      <>
        <Navbar user={authUser} />
        <div className="container text-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  // Block access if not verified
  if (profile && !profile.is_verified) {
    return (
      <>
        <Navbar user={authUser} />
        <div className="container">
          <div className="card">
            <h2>Account Not Verified</h2>
            <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
              You must verify your subscription before accessing this page.
            </p>
            <div className="mt-2">
              <VerifySubscriptionButton
                userId={authUser?.id}
                onVerified={handleVerified}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={authUser} />
      <div className="container">
        <h1 className="mb-2">Users</h1>
        {users.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
        ) : (
          <div className="user-grid">
            {users.map((u) => (
              <UserCard key={u.id} user={u} currentUserId={authUser?.id} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
