import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from '@/components/shared/Providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NeuroDaily — Organiza tu día, reduce la fricción mental',
    template: '%s | NeuroDaily',
  },
  description:
    'Organizador diario que te ayuda a decidir qué hacer ahora, cómo empezar cuando estás bloqueado y qué microdescanso usar según tu estado.',
  keywords: ['productividad', 'bienestar', 'organización', 'hábitos', 'claridad mental'],
  authors: [{ name: 'NeuroDaily' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'NeuroDaily',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
