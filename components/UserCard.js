'use client';

import { useState } from 'react';

export default function UserCard({ user, currentUserId }) {
  const [loading, setLoading] = useState(false);
  const [helped, setHelped] = useState(false);

  async function handleHelp() {
    setLoading(true);
    try {
      const res = await fetch('/api/help/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helper_id: currentUserId,
          target_id: user.id,
        }),
      });
      if (res.ok) {
        setHelped(true);
      }
    } catch (err) {
      console.error('Error helping user:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card user-card">
      <p className="user-card-email">{user.email}</p>
      {user.channel_url && (
        <p className="user-card-channel">
          <a href={user.channel_url} target="_blank" rel="noopener noreferrer">
            {user.channel_url}
          </a>
        </p>
      )}
      {user.id !== currentUserId && (
        <button
          className="btn btn-primary btn-sm"
          onClick={handleHelp}
          disabled={loading || helped}
        >
          {helped ? 'Helped!' : loading ? 'Sending...' : 'Help'}
        </button>
      )}
    </div>
  );
}
