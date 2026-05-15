import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#0f0e0d',
            color: '#faf7f2',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '4px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#c8853a', secondary: '#faf7f2' } },
          error: { iconTheme: { primary: '#dc2626', secondary: '#faf7f2' } },
        }}
      />
    </SessionProvider>
  );
}
