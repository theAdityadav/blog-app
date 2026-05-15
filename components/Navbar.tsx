import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.logoText}>BlogSphere</span>
        </Link>

        <div className={styles.links}>
          <Link href="/" className={`${styles.link} ${router.pathname === '/' ? styles.active : ''}`}>
            Discover
          </Link>
          {session && (
            <>
              <Link href="/dashboard" className={`${styles.link} ${router.pathname === '/dashboard' ? styles.active : ''}`}>
                My Posts
              </Link>
              <Link href="/write" className="btn btn-amber" style={{ padding: '8px 18px', fontSize: '14px' }}>
                Write Post
              </Link>
            </>
          )}
        </div>

        <div className={styles.authArea}>
          {session ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar} onClick={() => setMenuOpen(!menuOpen)}>
                {session.user?.name?.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <strong>{session.user?.name}</strong>
                    <span>{session.user?.email}</span>
                  </div>
                  <hr className={styles.dropdownDivider} />
                  <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    My Posts
                  </Link>
                  <Link href="/write" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
                    Write New Post
                  </Link>
                  <hr className={styles.dropdownDivider} />
                  <button className={`${styles.dropdownItem} ${styles.signOut}`} onClick={handleSignOut}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/auth/signin" className="btn btn-ghost" style={{ fontSize: '14px' }}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '14px' }}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" onClick={() => setMenuOpen(false)}>Discover</Link>
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}>My Posts</Link>
              <Link href="/write" onClick={() => setMenuOpen(false)}>Write Post</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/auth/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
