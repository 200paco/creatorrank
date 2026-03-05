'use client';

export default function RequiredChannels({ channels }) {
  if (!channels || channels.length === 0) {
    return (
      <div className="card">
        <h3>Required Channels</h3>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
          No required channels configured yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Required Channels</h3>
      <p className="mt-1" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        You must be subscribed to all of the following YouTube channels to register:
      </p>
      <ul className="channel-list mt-1">
        {channels.map((ch) => (
          <li key={ch.id}>
            <span>&#9654;</span>
            <a href={ch.url} target="_blank" rel="noopener noreferrer">
              {ch.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
