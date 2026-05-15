import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '@/components/Layout';
import styles from '@/styles/Post.module.css';

interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: { _id: string; name: string; email: string; bio: string };
  tags: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const isAuthor = session && post && (session.user as any)?.id === post.author?._id?.toString();

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      </Layout>
    );
  }

  if (notFound || !post) {
    return (
      <Layout title="Post Not Found">
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>Post not found</h2>
          <Link href="/" className="btn btn-amber">← Back to home</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`${post.title} — BlogSphere`} description={post.excerpt}>
      <div className={styles.page}>
        <div className={styles.container}>
          <article>
            <header className={styles.header}>
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/?tag=${tag}`} className="tag">{tag}</Link>
                ))}
              </div>

              <h1 className={styles.title}>{post.title}</h1>

              <div className={styles.meta}>
                <div className={styles.author}>
                  <div className={styles.authorAvatar}>
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className={styles.authorName}>{post.author?.name}</span>
                    <span className={styles.date}>
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className={styles.metaRight}>
                  <span className={styles.views}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    {post.views} views
                  </span>
                  {isAuthor && (
                    <Link href={`/edit/${post.slug}`} className="btn btn-outline" style={{ fontSize: '13px', padding: '7px 14px' }}>
                      Edit Post
                    </Link>
                  )}
                </div>
              </div>
            </header>

            <hr className="divider" />

            <div className={`prose ${styles.content}`}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>

            {post.author?.bio && (
              <div className={styles.authorCard}>
                <div className={styles.authorCardAvatar}>
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <span className={styles.authorCardLabel}>Written by</span>
                  <strong className={styles.authorCardName}>{post.author.name}</strong>
                  <p className={styles.authorCardBio}>{post.author.bio}</p>
                </div>
              </div>
            )}
          </article>

          <div className={styles.back}>
            <Link href="/" className="btn btn-outline">
              ← Back to all posts
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
