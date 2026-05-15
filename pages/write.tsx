import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import styles from '@/styles/Write.module.css';

interface Props {
  editSlug?: string;
}

export default function WritePage({ editSlug }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isEdit = !!editSlug;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  useEffect(() => {
    if (!isEdit || !editSlug) return;
    fetch(`/api/posts/${editSlug}`)
      .then((r) => r.json())
      .then((post) => {
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt);
        setTagsInput(post.tags?.join(', ') || '');
        setCoverImage(post.coverImage || '');
        setPublished(post.published);
      })
      .catch(() => toast.error('Failed to load post'));
  }, [isEdit, editSlug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }
    setLoading(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const body = { title, content, excerpt, tags, coverImage, published };

      const res = await fetch(isEdit ? `/api/posts/${editSlug}` : '/api/posts', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success(isEdit ? 'Post updated!' : 'Post published!');
      router.push(`/posts/${data.slug}`);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (status === 'loading') {
    return (
      <Layout title="Write — BlogSphere">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  return (
    <Layout title={isEdit ? 'Edit Post — BlogSphere' : 'Write — BlogSphere'}>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>{isEdit ? 'Edit Post' : 'New Post'}</h1>
              <p className={styles.pageSub}>Writing as <strong>{session.user?.name}</strong></p>
            </div>
            <div className={styles.headerActions}>
              <label className={styles.publishToggle}>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
                <span className={styles.toggleLabel}>{published ? 'Published' : 'Draft'}</span>
              </label>
              <Link href="/dashboard" className="btn btn-outline">Cancel</Link>
              <button
                className="btn btn-amber"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <><span className="spinner" style={{ borderTopColor: 'white' }} />{isEdit ? 'Saving…' : 'Publishing…'}</> : isEdit ? 'Save Changes' : 'Publish Post'}
              </button>
            </div>
          </div>

          <div className={styles.editor}>
            <div className={styles.mainArea}>
              <input
                type="text"
                className={styles.titleInput}
                placeholder="Your post title…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
              />

              <div className={styles.tabs}>
                <button
                  className={`${styles.tab} ${tab === 'write' ? styles.tabActive : ''}`}
                  onClick={() => setTab('write')}
                >Write</button>
                <button
                  className={`${styles.tab} ${tab === 'preview' ? styles.tabActive : ''}`}
                  onClick={() => setTab('preview')}
                >Preview</button>
              </div>

              {tab === 'write' ? (
                <textarea
                  className={styles.contentArea}
                  placeholder="Write your story… (Markdown supported)"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div className={`prose ${styles.preview}`}>
                  {content ? (
                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                  ) : (
                    <p style={{ color: 'var(--muted)', fontStyle: 'italic' }}>Nothing to preview yet…</p>
                  )}
                </div>
              )}
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sideSection}>
                <h3 className={styles.sideTitle}>Post Settings</h3>

                <div className="form-group">
                  <label className="form-label">Excerpt</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Short summary (auto-generated if empty)"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={3}
                    maxLength={300}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="tech, writing, design"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '6px' }}>
                    Comma-separated
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="https://..."
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.sideSection}>
                <h3 className={styles.sideTitle}>Markdown Tips</h3>
                <ul className={styles.tips}>
                  <li><code># Heading 1</code></li>
                  <li><code>## Heading 2</code></li>
                  <li><code>**bold**</code> and <code>*italic*</code></li>
                  <li><code>[link](url)</code></li>
                  <li><code>![image](url)</code></li>
                  <li><code>`inline code`</code></li>
                  <li><code>```code block```</code></li>
                  <li><code>&gt; blockquote</code></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Simple markdown to HTML (basic)
function renderMarkdown(text: string): string {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>');
}
