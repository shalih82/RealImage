import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mediumsConfig } from '../config';
import type { MediumItem } from '../config';

gsap.registerPlugin(ScrollTrigger);

// ─── Single horizontal card ────────────────────────────────────────────────────

function ServiceCard({
  item,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  item: MediumItem;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        flex: '0 0 clamp(280px, 22vw, 340px)',
        height: 'clamp(340px, 45vh, 420px)',
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(135deg, rgba(91,164,181,0.03) 0%, rgba(239,191,4,0.03) 100%)',
        border: `1px solid ${isHovered ? 'rgba(91,164,181,0.5)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'border-color 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(91,164,181,0.15)'
          : '0 4px 20px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(28px, 3vw, 36px)',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, rgba(91,164,181,0.15) 0%, transparent 70%)',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
      }} />

      {/* Top section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <span
          className="font-sans-body"
          style={{
            fontSize: '10px',
            letterSpacing: '0.3em',
            color: isHovered ? '#5BA4B5' : 'rgba(214,232,238,0.5)',
            transition: 'color 0.35s ease',
            display: 'block',
            marginBottom: '24px',
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <h3
          className="font-serif-display"
          style={{
            fontSize: 'clamp(28px, 3vw, 40px)',
            fontWeight: 200,
            letterSpacing: '0.04em',
            color: isHovered ? '#EDE8E4' : 'rgba(237,232,228,0.7)',
            transition: 'color 0.35s ease',
            lineHeight: 1.15,
            margin: '0 0 8px',
          }}
        >
          {item.cn}
        </h3>

        <span
          className="font-sans-body"
          style={{
            fontSize: '9px',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: isHovered ? '#5BA4B5' : 'rgba(237,232,228,0.2)',
            transition: 'color 0.35s ease',
          }}
        >
          {item.en}
        </span>
      </div>

      {/* Divider */}
      <div style={{
        width: isHovered ? '48px' : '24px',
        height: '1px',
        background: isHovered
          ? 'linear-gradient(180deg, #5BA4B5, #EFBF04)'
          : 'rgba(255,255,255,0.1)',
        transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1), background 0.4s ease',
        position: 'relative',
        zIndex: 1,
      }} />

      {/* Description */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <p
          className="font-sans-body"
          style={{
            fontSize: 'clamp(12px, 1vw, 13px)',
            lineHeight: 1.85,
            color: isHovered ? 'rgba(237,232,228,0.55)' : 'rgba(237,232,228,0.25)',
            fontWeight: 300,
            margin: 0,
            transition: 'color 0.4s ease',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: '15%', right: '15%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #5BA4B5, #EFBF04, transparent)',
        opacity: isHovered ? 1 : 0,
        transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────

export default function MediumsGlossary() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const mediums = mediumsConfig.items;

  // We duplicate items to create seamless loop
  const duplicated = [...mediums, ...mediums];

  const initAutoScroll = useCallback(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    // Half the track is one full set of cards
    const halfWidth = track.scrollWidth / 2;

    // Reset position
    gsap.set(track, { x: 0 });

    // Infinite marquee: scroll one full set width, then snap back
    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: mediums.length * 5, // ~5s per card
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          // Wrap seamlessly
          return parseFloat(x) % halfWidth;
        }),
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [mediums.length]);

  // Pause on hover, resume on leave
  const handleCardHover = (idx: number) => {
    setHoveredIndex(idx);
    tweenRef.current?.pause();
  };

  const handleCardLeave = () => {
    setHoveredIndex(null);
    tweenRef.current?.resume();
  };

  // Header fade-in on scroll
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Start auto-scroll
  useEffect(() => {
    const cleanup = initAutoScroll();
    return cleanup;
  }, [initAutoScroll]);

  if (mediums.length === 0) return null;

  return (
    <section
      id="mediums"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        background: '#06141F',
        zIndex: 4,
        overflow: 'hidden',
        padding: 'clamp(60px, 10vh, 100px) 0',
      }}
    >
      {/* Subtle top border gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(91,164,181,0.2), transparent)',
      }} />

      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          marginBottom: 'clamp(36px, 6vh, 56px)',
          opacity: 0,
        }}
      >
        <p
          className="font-sans-body"
          style={{
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: '#D6E8EE',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {mediumsConfig.sectionLabel}
        </p>
        <div style={{
          width: '32px', height: '1px',
          background: 'linear-gradient(90deg, #5BA4B5, #EFBF04)',
        }} />
      </div>

      {/* Edge fade overlays */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0,
        width: 'clamp(40px, 6vw, 100px)',
        background: 'linear-gradient(to right, #06141F 0%, transparent 100%)',
        zIndex: 2, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0,
        width: 'clamp(40px, 6vw, 100px)',
        background: 'linear-gradient(270deg, #06141F, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Auto-scrolling track */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap: 'clamp(20px, 2.5vw, 36px)',
          width: 'max-content',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
        }}
      >
        {duplicated.map((item, idx) => (
          <ServiceCard
            key={idx}
            item={item}
            index={idx % mediums.length}
            isHovered={hoveredIndex === idx}
            onHover={() => handleCardHover(idx)}
            onLeave={handleCardLeave}
          />
        ))}
      </div>
    </section>
  );
}
