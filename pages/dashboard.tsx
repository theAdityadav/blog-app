import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  published: boolean;
  views: number;
  createdAt: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  const fetchMyPosts = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?author=${(session.user as any).id}&limit=50`);
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { fetchMyPosts(); }, [fetchMyPosts]);

  async function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Post deleted');
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch {
      toast.error('Failed to delete post');
    }
  }

  if (status === 'loading' || loading) {
    return (
      <Layout title="Dashboard — BlogSphere">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return (
    <Layout title="My Posts — BlogSphere">
      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>My Posts</h1>
              <p className={styles.pageSub}>Manage your writing</p>
            </div>
            <Link href="/write" className="btn btn-amber">
              + Write New Post
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>{posts.length}</span>
              <span className={styles.statLabel}>Total Posts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{published.length}</span>
              <span className={styles.statLabel}>Published</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{drafts.length}</span>
              <span className={styles.statLabel}>Drafts</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>{totalViews.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Views</span>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✦</span>
              <h3>No posts yet</h3>
              <p>Write your first post and share your ideas with the world.</p>
              <Link href="/write" className="btn btn-amber" style={{ marginTop: '20px' }}>
                Write Your First Post
              </Link>
            </div>
          ) : (
            <div className={styles.postList}>
              {posts.map((post) => (
                <div key={post._id} className={styles.postRow}>
                  <div className={styles.postInfo}>
                    <div className={styles.postMeta}>
                      <span className={`${styles.status} ${post.published ? styles.statusPublished : styles.statusDraft}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <Link href={`/posts/${post.slug}`} className={styles.postTitle}>
                      {post.title}
                    </Link>
                    <p className={styles.postExcerpt}>{post.excerpt?.substring(0, 120)}…</p>
                    <div className={styles.postFooter}>
                      <span className={styles.postDate}>
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </span>
                      <span className={styles.postViews}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        {post.views} views
                      </span>
                    </div>
                  </div>
                  <div className={styles.postActions}>
                    <Link href={`/posts/${post.slug}`} className="btn btn-ghost" style={{ fontSize: '13px' }}>
                      View
                    </Link>
                    <Link href={`/edit/${post.slug}`} className="btn btn-outline" style={{ fontSize: '13px' }}>
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: '13px', padding: '8px 14px' }}
                      onClick={() => handleDelete(post.slug, post.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
