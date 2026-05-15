import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import styles from '@/styles/Auth.module.css';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const result = await signIn('credentials', { email, password, redirect: false });
      if (result?.error) throw new Error(result.error);

      toast.success('Account created! Welcome to BlogSphere.');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandName}>BlogSphere</span>
        </div>
        <h1 className={styles.heading}>Start writing today</h1>
        <p className={styles.sub}>Create your free account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="btn btn-amber"
            style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? <><span className="spinner" style={{ borderTopColor: 'white' }} />Creating account…</> : 'Create Account'}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link href="/auth/signin" className={styles.footerLink}>Sign in →</Link>
        </p>
        <Link href="/" className={styles.backLink}>← Back to home</Link>
      </div>

      <div className={styles.aside}>
        <blockquote className={styles.quote}>
          "You have to write the book that wants to be written."
        </blockquote>
        <cite className={styles.quoteAuthor}>— Madeleine L'Engle</cite>
      </div>
    </div>
  );
}
