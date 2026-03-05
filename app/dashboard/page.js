'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import Navbar from '@/components/Navbar';
import Profile from '@/components/Profile';
import VerifySubscriptionButton from '@/components/VerifySubscriptionButton';

export default function DashboardPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [channelUrl, setChannelUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

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

      if (!prof) {
        // User exists in auth but not in users table (e.g. Google signup)
        const { data: newProf } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            channel_url: null,
            is_verified: false,
          })
          .select()
          .single();
        setProfile(newProf);
        setChannelUrl(newProf?.channel_url || '');
      } else {
        setProfile(prof);
        setChannelUrl(prof.channel_url || '');
      }
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleUpdateChannel(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);

    const { error } = await supabase
      .from('users')
      .update({ channel_url: channelUrl })
      .eq('id', authUser.id);

    if (error) {
      setSaveMsg({ type: 'error', text: error.message });
    } else {
      setSaveMsg({ type: 'success', text: 'Channel updated!' });
      setProfile((prev) => ({ ...prev, channel_url: channelUrl }));
    }
    setSaving(false);
  }

  function handleVerified() {
    setProfile((prev) => ({ ...prev, is_verified: true }));
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
              You must subscribe to all required YouTube channels and verify your
              subscription before accessing the dashboard.
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
        <h1 className="mb-2">Dashboard</h1>

        <Profile user={profile} />

        <div className="card">
          <h3>Update Channel</h3>
          <form onSubmit={handleUpdateChannel} className="mt-1">
            <div className="form-group">
              <label htmlFor="channel_url">YouTube Channel URL</label>
              <input
                id="channel_url"
                type="url"
                value={channelUrl}
                onChange={(e) => setChannelUrl(e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
            {saveMsg && (
              <p className={saveMsg.type === 'error' ? 'msg-error' : 'msg-success'}>
                {saveMsg.text}
              </p>
            )}
            <button className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
