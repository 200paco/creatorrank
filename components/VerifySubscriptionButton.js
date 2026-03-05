'use client';

import { useState } from 'react';

export default function VerifySubscriptionButton({ userId, onVerified }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleVerify() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/verify/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (res.ok && data.verified) {
        if (onVerified) onVerified();
      } else {
        setError(data.error || 'Subscription verification failed. Please subscribe to all required channels.');
      }
    } catch (err) {
      setError('An error occurred while verifying. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={handleVerify}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Confirm Subscription'}
      </button>
      {error && <p className="msg-error mt-1">{error}</p>}
    </div>
  );
}
