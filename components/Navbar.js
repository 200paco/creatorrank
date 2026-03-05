'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';

export default function Navbar({ user }) {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        CreatorRank
      </Link>
      <ul className="navbar-links">
        <li>
          <Link href="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link href="/users">Users</Link>
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link href="/login">Login</Link>
            </li>
            <li>
              <Link href="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
