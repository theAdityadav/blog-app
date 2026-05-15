import Head from 'next/head';
import Navbar from './Navbar';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title = 'BlogSphere', description = 'A modern platform for thoughtful writing' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>" />
      </Head>
      <Navbar />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerInner}>
            <span className={styles.footerBrand}>
              <span style={{ color: 'var(--amber)' }}>✦</span> BlogSphere
            </span>
            <span className={styles.footerCopy}>© {new Date().getFullYear()} — Built with Next.js & MongoDB</span>
          </div>
        </div>
      </footer>
    </>
  );
}
