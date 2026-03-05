'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/supabase/client';
import Navbar from '@/components/Navbar';
import RequiredChannels from '@/components/RequiredChannels';
import VerifySubscriptionButton from '@/components/VerifySubscriptionButton';

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container text-center"><p>Loading...</p></div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerifyMode = searchParams.get('verify') === 'true';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [channelUrl, setChannelUrl] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requiredChannels, setRequiredChannels] = useState([]);
  const [registered, setRegistered] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch required channels
    supabase
      .from('required_channels')
      .select('*')
      .then(({ data }) => {
        setRequiredChannels(data || []);
      });

    // If in verify mode, get current user
    if (isVerifyMode) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setCurrentUser(data.user);
          setRegistered(true);
        }
      });
    }
  }, [isVerifyMode]);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sign up with Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const userId = signUpData?.user?.id;
    if (!userId) {
      setError('Registration failed. Please try again.');
      setLoading(false);
      return;
    }

    // Insert user into users table
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email,
      channel_url: channelUrl || null,
      is_verified: false,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setCurrentUser(signUpData.user);
    setRegistered(true);
    setLoading(false);
  }

  async function handleGoogleRegister() {
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/register?verify=true`,
      },
    });
    if (googleError) {
      setError(googleError.message);
    }
  }

  function handleVerified() {
    router.push('/dashboard');
    router.refresh();
  }

  // Show verification step
  if (registered || isVerifyMode) {
    return (
      <>
        <Navbar user={null} />
        <div className="auth-wrapper">
          <div className="card">
            <h1>Verify Subscription</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
              Before you can access CreatorRank, you must be subscribed to all
              required YouTube channels. Please subscribe to each channel below,
              then click &quot;Confirm Subscription&quot;.
            </p>
            <RequiredChannels channels={requiredChannels} />
            <div className="mt-2">
              <VerifySubscriptionButton
                userId={currentUser?.id}
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
      <Navbar user={null} />
      <div className="auth-wrapper">
        <div className="card">
          <h1>Register</h1>

          {error && <p className="msg-error">{error}</p>}

          <RequiredChannels channels={requiredChannels} />

          <div className="mt-2">
            <button className="btn-google" onClick={handleGoogleRegister}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </button>

            <div className="auth-divider">or register with email</div>

            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                />
              </div>
              <div className="form-group">
                <label htmlFor="channel">Your YouTube Channel URL (optional)</label>
                <input
                  id="channel"
                  type="url"
                  value={channelUrl}
                  onChange={(e) => setChannelUrl(e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="text-center mt-2" style={{ fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <a href="/login">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
