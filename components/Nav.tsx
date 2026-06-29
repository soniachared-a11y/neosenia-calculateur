'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Calculateur' },
  { href: '/regie-publicitaire', label: 'Régie publicitaire' },
  { href: '/pack-ugc', label: 'Pack vidéos UGC' },
];

export function Nav() {
  const path = usePathname();

  return (
    <header className="nav-bar fixed left-0 right-0 top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 no-underline"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan text-xs font-bold text-bg">
            N
          </div>
          <div className="leading-none">
            <div className="text-sm font-bold uppercase tracking-widest text-primary">NEOSENIA</div>
            <div className="text-[10px] text-muted" style={{ fontFamily: 'var(--font-body)' }}>
              Écrans LED B2B
            </div>
          </div>
        </Link>

        {/* Liens nav (masqués sur très petit mobile) */}
        <nav className="hidden items-center gap-1 sm:flex">
          {links.map(({ href, label }) => {
            const active = path === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? 'bg-cyan/10 text-cyan'
                    : 'text-muted hover:text-primary'
                }`}
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA nav premium */}
        <a
          href="mailto:contact@neosenia.com?subject=Demande%20de%20devis%20écran%20LED"
          className="cta-nav group cursor-pointer rounded-full border border-cyan/25 bg-bg px-4 py-2 text-xs font-bold text-cyan"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <span className="relative flex items-center gap-2">
            <span>Parler à un expert</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan/10 ring-1 ring-cyan/20 transition-all duration-200 group-hover:bg-cyan/20 group-hover:ring-cyan/45">
              <svg width="8" height="8" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M1.5 4.5h6M5.5 2l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </span>
        </a>
      </div>

      {/* Nav mobile — liens sous le header */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-border px-5 py-2 sm:hidden">
        {links.map(({ href, label }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                active ? 'bg-cyan/10 text-cyan' : 'text-muted'
              }`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
