import { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import PostCard from '@/components/PostCard';
import styles from '@/styles/Home.module.css';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: { name: string; email: string };
  tags: string[];
  views: number;
  createdAt: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '9' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const res = await fetch(`/api/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotalPages(data.pages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => { setPage(1); }, [debouncedSearch]);

  return (
    <Layout title="BlogSphere — Discover Great Writing">
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.heroEyebrow}>A space for ideas</span>
            <h1 className={styles.heroTitle}>
              Where <em>stories</em><br />find their readers
            </h1>
            <p className={styles.heroSub}>
              Discover thoughtful writing from a growing community of independent voices.
            </p>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.heroDecor}>
            <div className={styles.decorCircle} />
            <div className={styles.decorDot} />
          </div>
        </div>
      </section>

      <section className={styles.feed}>
        <div className="container">
          {loading ? (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✦</span>
              <h3>No posts found</h3>
              <p>{search ? 'Try a different search term.' : 'Be the first to write something!'}</p>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Previous
                  </button>
                  <span className={styles.pageInfo}>Page {page} of {totalPages}</span>
                  <button
                    className="btn btn-outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
