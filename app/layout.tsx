import type { Metadata, Viewport } from 'next';
import './globals.css';

const SITE_URL = 'https://neosenia-calculateur.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Calculateur écrans LED transparents · NEOSENIA',
    template: '%s · NEOSENIA',
  },
  description:
    "Estimez en quelques secondes le prix livré (DDP, TVA incluse) d'un écran LED transparent pour vitrine : Crystal Film holographique ou LED transparent sur structure démontable. Garantie 5 ans.",
  keywords: ['écran LED transparent', 'vitrine LED', 'écran holographique', 'Crystal Film', 'affichage vitrine', 'devis écran LED'],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    siteName: 'NEOSENIA',
    title: 'Calculateur écrans LED transparents · NEOSENIA',
    description: "Prix livré estimé (DDP, TVA incluse), garantie 5 ans, pour écran LED transparent de vitrine.",
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
        {/* Fontshare — Clash Display (H1) + Satoshi (H2/H3) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
        {/* Google Fonts — Inter (corps) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var io=new IntersectionObserver(function(e){e.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}})},{threshold:0.12});function obs(){document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',obs)}else{obs()}})()` }} />
        {children}
      </body>
    </html>
  );
}
