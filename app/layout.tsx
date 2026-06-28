import type { Metadata, Viewport } from 'next';
import { Nav } from '@/components/Nav';
import './globals.css';

const SITE_URL = 'https://neosenia-calculateur.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Calculateur prix écrans LED · NEOSENIA',
    template: '%s · NEOSENIA',
  },
  description:
    "Calculez en 30 secondes le prix livré DDP de votre écran LED transparent pour vitrine. Crystal Film, Structure modulaire — prix ferme sous 48 h, garantie 5 ans.",
  keywords: ['écran LED transparent', 'vitrine LED', 'écran holographique', 'Crystal Film', 'affichage vitrine', 'devis écran LED', 'régie publicitaire LED'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'NEOSENIA',
    title: 'Calculateur prix écrans LED · NEOSENIA',
    description: "Prix livré DDP, garantie 5 ans, pour écran LED transparent de vitrine. Devis ferme sous 48 h.",
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" />
      </head>
      <body className="pt-[72px] sm:pt-[60px]">
        <Nav />
        {children}
      </body>
    </html>
  );
}
