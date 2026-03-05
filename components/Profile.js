'use client';

export default function Profile({ user }) {
  if (!user) return null;

  return (
    <div className="card">
      <h2>My Profile</h2>
      <p className="mt-1">
        <strong>Email:</strong> {user.email}
      </p>
      <p className="mt-1">
        <strong>Channel:</strong>{' '}
        {user.channel_url ? (
          <a href={user.channel_url} target="_blank" rel="noopener noreferrer">
            {user.channel_url}
          </a>
        ) : (
          <span style={{ color: 'var(--text-muted)' }}>Not set</span>
        )}
      </p>
      <p className="mt-1">
        <strong>Status:</strong>{' '}
        {user.is_verified ? (
          <span className="badge badge-verified">Verified</span>
        ) : (
          <span className="badge badge-unverified">Not Verified</span>
        )}
      </p>
    </div>
  );
}
