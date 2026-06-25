import { useEffect, useState } from 'react';
import { heroConfig, galleryConfig } from '../config';

// Floating thumbnail data — 6 dedicated hero images
const FLOATING_THUMBS = [
  { image: 'images/project-13.jfif', label: 'Pre-Wedding', position: 0 },
  { image: 'images/project-14.jfif', label: 'Traditional', position: 1 },
  { image: 'images/project-15.jfif', label: 'Candid', position: 2 },
  { image: 'images/project-16.jfif', label: 'Post-Wedding', position: 3 },
  { image: 'images/project-17.jfif', label: 'Engagement', position: 4 },
  { image: 'images/project-18.jpg', label: 'Haldi', position: 5 },
];

const HERO_CARD_IMAGES = [
  'images/project-19.jfif',
  'images/project-20.jfif',
  'images/project-21.jfif',
  'images/project-22.jfif',
  'images/project-23.jfif',
  'images/project-24.jfif',
  'images/project-25.jfif',
];

interface HeroFieldProps {
  onNavigateToGallery?: () => void;
}

export default function HeroField({ onNavigateToGallery }: HeroFieldProps = {}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-cycle slideshow in the glass card
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_CARD_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (!heroConfig.wordmarkText && !heroConfig.titleLine1) {
    return null;
  }

  // Feature words to display as pills
  const features = ['Candid', 'Cinematic', 'Timeless'];

  // Floating thumbnails layout — 3 left, 3 right (or fewer if less projects)
  const leftThumbs = FLOATING_THUMBS.filter((_, i) => i % 2 === 0).slice(0, 3);
  const rightThumbs = FLOATING_THUMBS.filter((_, i) => i % 2 === 1).slice(0, 3);

  // Positions for left thumbnails (percentages from top)
  const leftPositions = [
    { top: '15%', left: '3vw', width: 120, rotate: -3 },
    { top: '45%', left: '5vw', width: 100, rotate: 2 },
    { top: '70%', left: '2vw', width: 110, rotate: -1 },
  ];

  // Positions for right thumbnails
  const rightPositions = [
    { top: '20%', right: '3vw', width: 115, rotate: 3 },
    { top: '50%', right: '5vw', width: 105, rotate: -2 },
    { top: '75%', right: '2.5vw', width: 120, rotate: 1.5 },
  ];

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* ── Floating Photo Thumbnails — Left Side ── */}
      {leftThumbs.map((thumb, i) => (
        <div
          key={`left-${i}`}
          className={`float-thumb float-thumb-${i + 1}`}
          style={{
            position: 'absolute',
            top: leftPositions[i]?.top || '30%',
            left: leftPositions[i]?.left || '4vw',
            width: leftPositions[i]?.width || 100,
            zIndex: 2,
            transform: `rotate(${leftPositions[i]?.rotate || 0}deg)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(91,164,181,0.08)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <img
              src={thumb.image}
              alt={thumb.label}
              style={{
                width: '100%',
                aspectRatio: '3/4',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.85) saturate(0.9)',
              }}
              loading="lazy"
            />
            {/* Label overlay */}
            <div
              className="font-sans-body"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
              }}
            >
              {thumb.label}
            </div>
          </div>
        </div>
      ))}

      {/* ── Floating Photo Thumbnails — Right Side ── */}
      {rightThumbs.map((thumb, i) => (
        <div
          key={`right-${i}`}
          className={`float-thumb float-thumb-${i + 4}`}
          style={{
            position: 'absolute',
            top: rightPositions[i]?.top || '30%',
            right: rightPositions[i]?.right || '4vw',
            width: rightPositions[i]?.width || 100,
            zIndex: 2,
            transform: `rotate(${rightPositions[i]?.rotate || 0}deg)`,
          }}
        >
          <div
            style={{
              position: 'relative',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(48,176,208,0.08)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <img
              src={thumb.image}
              alt={thumb.label}
              style={{
                width: '100%',
                aspectRatio: '3/4',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.85) saturate(0.9)',
              }}
              loading="lazy"
            />
            <div
              className="font-sans-body"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '6px 10px',
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                fontSize: '9px',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.7)',
                textTransform: 'uppercase',
              }}
            >
              {thumb.label}
            </div>
          </div>
        </div>
      ))}

      {/* ── Central Content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
          maxWidth: '900px',
          padding: '100px 24px 80px',
        }}
      >
        {/* Eyebrow / Subtitle */}
        {heroConfig.eyebrow && (
          <p
            className="font-sans-body"
            style={{
              fontSize: '12px',
              letterSpacing: '0.3em',
              color: 'rgba(91, 164, 181, 0.8)',
              textTransform: 'uppercase',
              marginBottom: '24px',
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
            }}
          >
            {heroConfig.eyebrow}
          </p>
        )}

        {/* Large Gradient Headline */}
        <h1
          className="font-serif-display gradient-text-shimmer"
          style={{
            fontSize: 'clamp(42px, 6vw, 84px)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '24px',
            letterSpacing: '0.02em',
          }}
        >
          {heroConfig.titleLine1}
          {heroConfig.titleLine2 && (
            <>
              <br />
              {heroConfig.titleLine2}
            </>
          )}
        </h1>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '48px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {features.map((feature, i) => (
            <span key={feature} style={{ display: 'flex', alignItems: 'center' }}>
              <span className="feature-pill">
                {feature}
              </span>
            </span>
          ))}
        </div>

        {/* ── Redesigned Premium Glassmorphism Card ── */}
        <div
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '720px',
            padding: '12px',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: '24px',
            borderRadius: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            transition: 'transform 0.4s ease, box-shadow 0.4s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 30px 70px rgba(0,0,0,0.5), 0 0 40px rgba(91,164,181,0.15), inset 0 1px 0 rgba(255,255,255,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
          }}
        >
          {/* Left Side: Text and Icon */}
          <div
            style={{
              flex: '1',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(91,164,181,0.2), rgba(239,191,4,0.1))',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="rgba(237,232,228,0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.585 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.989-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
            </div>

            <p
              className="font-serif-display"
              style={{
                fontSize: '18px',
                color: '#ffffff',
                marginBottom: '8px',
                lineHeight: 1.4,
                letterSpacing: '0.01em',
              }}
            >
              {heroConfig.descriptionLine1 || 'Explore our wedding photography portfolio'}
            </p>
            <p
              className="font-sans-body"
              style={{
                fontSize: '13px',
                color: 'rgba(214,232,238,0.5)',
                lineHeight: 1.5,
              }}
            >
              {heroConfig.descriptionLine2 || 'Premium photography & cinematic films'}
            </p>
          </div>

          {/* Right Side: Slideshow preview */}
          <div
            style={{
              flex: '1.2',
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              minHeight: '200px',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
            }}
          >
            {HERO_CARD_IMAGES.map((imgSrc, i) => (
              <div
                key={imgSrc}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: i === currentSlide ? 1 : 0,
                  transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 5s ease',
                  transform: i === currentSlide ? 'scale(1.05)' : 'scale(1)',
                  zIndex: i === currentSlide ? 1 : 0,
                }}
              >
                <img
                  src={imgSrc}
                  alt={`Hero Slide ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.85) contrast(1.1)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)',
                  }}
                />
              </div>
            ))}

            {/* Minimal Slide indicators */}
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '20px',
                display: 'flex',
                gap: '6px',
                zIndex: 2,
                background: 'rgba(0,0,0,0.3)',
                padding: '6px 10px',
                borderRadius: '12px',
                backdropFilter: 'blur(4px)',
              }}
            >
              {HERO_CARD_IMAGES.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i === currentSlide ? '16px' : '4px',
                    height: '4px',
                    borderRadius: '2px',
                    background:
                      i === currentSlide
                        ? 'rgba(255, 255, 255, 0.95)'
                        : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glowing CTA Button */}
        {heroConfig.ctaText && (
          <button
            className="glow-btn glow-btn-primary font-sans-body pulse-glow"
            onClick={() => {
              if (onNavigateToGallery) {
                onNavigateToGallery();
              } else if (heroConfig.ctaTargetId) {
                document
                  .getElementById(heroConfig.ctaTargetId)
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            style={{
              padding: '16px 42px',
              fontSize: '15px',
            }}
          >
            {heroConfig.ctaText}
          </button>
        )}
      </div>

      {/* ── Scroll Indicator ── */}
      <div
        className="scroll-indicator"
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
        }}
        onClick={() => {
          document
            .getElementById('philosophy')
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        <div className="scroll-chevrons">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="rgba(237,232,228,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19.5 5.25l-7.5 7.5-7.5-7.5" />
            <path d="M19.5 11.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
        <span
          className="font-sans-body"
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'rgba(214,232,238,0.35)',
            textTransform: 'uppercase',
          }}
        >
          Learn More
        </span>
      </div>
    </section>
  );
}
