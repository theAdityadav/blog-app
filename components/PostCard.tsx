import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import styles from './PostCard.module.css';

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

export default function PostCard({ post }: { post: Post }) {
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });
  const initials = post.author?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <article className={styles.card}>
      <div className={styles.cardBody}>
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={`tag ${styles.tag}`}>{tag}</span>
            ))}
          </div>
        )}
        <Link href={`/posts/${post.slug}`}>
          <h2 className={styles.title}>{post.title}</h2>
        </Link>
        <p className={styles.excerpt}>{post.excerpt}</p>
      </div>

      <div className={styles.footer}>
        <div className={styles.author}>
          <div className={styles.authorAvatar}>{initials}</div>
          <div>
            <span className={styles.authorName}>{post.author?.name}</span>
            <span className={styles.meta}>{timeAgo}</span>
          </div>
        </div>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            {post.views}
          </span>
          <Link href={`/posts/${post.slug}`} className={styles.readMore}>
            Read →
          </Link>
        </div>
      </div>
    </article>
  );
}
