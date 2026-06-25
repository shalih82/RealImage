import { useEffect, useRef, useState } from 'react';
import { navigationConfig } from '../config';
import { useAdmin } from '../hooks/useAdmin';

type PageView = 'home' | 'services' | 'contact' | 'gallery' | 'about';

interface Props {
  activePage: PageView;
  onNavigate: (page: PageView) => void;
}

const PAGE_ROUTES: Record<string, PageView> = {
  home: 'home',
  services: 'services',
  contact: 'contact',
  gallery: 'gallery',
  about: 'about',
};

const PAGE_LABELS: Record<PageView, string> = {
  home: '',
  services: 'Services',
  contact: 'Contact',
  gallery: 'Gallery',
  about: 'About',
};

export default function Navigation({ activePage, onNavigate }: Props) {
  const { isAdmin, openLogin, logout } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Secret: click brand 5 times within 3s to open admin login
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBrandClick = () => {
    if (activePage !== 'home') {
      onNavigate('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Secret admin trigger: 5 clicks within 3 seconds
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      if (!isAdmin) openLogin();
      return;
    }
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 3000);
  };

  const handleNavClick = (label: string, targetId: string) => {
    const key = label.toLowerCase();
    if (PAGE_ROUTES[key]) {
      onNavigate(PAGE_ROUTES[key]);
      return;
    }
    if (activePage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isSubPage = activePage !== 'home';

  if (!navigationConfig.brandMark && navigationConfig.links.length === 0) return null;

  // All links visible to everyone — export buttons are admin-only (handled in ContactPage)
  const visibleLinks = navigationConfig.links;

  const navBg = scrolled || isSubPage
    ? 'rgba(6, 20, 31, 0.85)'
    : 'rgba(6, 20, 31, 0.3)';

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 100,
        padding: '0 4vw',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.5s ease',
        backgroundColor: navBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled || isSubPage
          ? '1px solid rgba(255,255,255,0.06)'
          : '1px solid rgba(255,255,255,0.03)',
        boxSizing: 'border-box',
      }}
    >
      {/* Left side: Back button on sub-pages, Brand on home */}
      {isSubPage ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            id="nav-back-btn"
            onClick={() => onNavigate('home')}
            className="font-sans-body"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#D6E8EE',
              fontSize: 11,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              padding: '8px 18px',
              borderRadius: 30,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = '#5BA4B5';
              (e.currentTarget as HTMLButtonElement).style.color = '#5BA4B5';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,164,181,0.06)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)';
              (e.currentTarget as HTMLButtonElement).style.color = '#D6E8EE';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            }}
          >
            ← Back
          </button>
          <span
            className="font-sans-body"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: 'rgba(214,232,238,0.3)',
              textTransform: 'uppercase',
            }}
          >
            {PAGE_LABELS[activePage]}
          </span>
        </div>
      ) : (
        <button
          id="nav-brand"
          onClick={handleBrandClick}
          className="font-serif-display"
          style={{
            fontSize: '18px',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: '#FFFFFF',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            textShadow: '0 0 20px rgba(91, 164, 181, 0.3)',
          }}
        >
          {navigationConfig.brandMark}
        </button>
      )}

      {/* Right side: Nav links + Book Now CTA + admin badge */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {visibleLinks.map((item) => {
          const key = item.label.toLowerCase();
          const isActive =
            (key === 'home' && activePage === 'home') ||
            (key === 'services' && activePage === 'services') ||
            (key === 'contact' && activePage === 'contact') ||
            (key === 'gallery' && activePage === 'gallery') ||
            (key === 'about' && activePage === 'about');

          return (
            <button
              key={item.targetId}
              id={`nav-${key}`}
              onClick={() => handleNavClick(item.label, item.targetId)}
              className="font-sans-body"
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                opacity: isActive ? 1 : 0.55,
                fontSize: '14px',
                letterSpacing: '0.08em',
                cursor: 'pointer',
                transition: 'opacity 0.4s ease, color 0.3s ease',
                padding: 0,
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = isActive ? '1' : '0.55';
              }}
            >
              {item.label}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    background: 'linear-gradient(90deg, #5BA4B5, #EFBF04)',
                    borderRadius: '1px',
                    boxShadow: '0 0 8px rgba(91,164,181,0.4)',
                  }}
                />
              )}
            </button>
          );
        })}


        {/* Admin badge (shown when logged in) */}
        {isAdmin && (
          <button
            id="nav-admin-logout"
            onClick={logout}
            title="Click to logout admin"
            className="font-sans-body"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '5px 12px',
              background: 'rgba(91,164,181,0.1)',
              border: '1px solid rgba(91,164,181,0.3)',
              borderRadius: '20px',
              color: '#5BA4B5',
              fontSize: '10px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,80,80,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,120,120,0.9)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,164,181,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(91,164,181,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = '#5BA4B5';
            }}
          >
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
            Admin
          </button>
        )}
      </div>
    </nav>
  );
}
