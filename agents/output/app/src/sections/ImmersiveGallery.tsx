import { useEffect, useRef, useCallback, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { galleryConfig } from '../config';

gsap.registerPlugin(ScrollTrigger);

interface Props {
  onSelect: (id: string) => void;
}

// ─── Single gallery card ───────────────────────────────────────────────────────

function GalleryCard({
  project,
  isHovered,
  onHover,
  onLeave,
  onSelect,
}: {
  project: typeof galleryConfig.projects[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      style={{
        flex: '0 0 clamp(260px, 20vw, 320px)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
      }}
    >
      {/* Image */}
      <div
        style={{
          width: '100%',
          aspectRatio: '3 / 4',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '12px',
          border: isHovered ? '1px solid rgba(91,164,181,0.3)' : '1px solid rgba(255,255,255,0.06)',
          transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
          boxShadow: isHovered
            ? '0 0 20px rgba(0,0,0,0.8), 0 0 40px rgba(91,164,181,0.15)'
            : '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            filter: isHovered ? 'brightness(0.7)' : 'brightness(0.9)',
          }}
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 40%, rgba(5,10,15,0.85) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Hover info overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '14px',
            right: '14px',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <p
            className="font-sans-body"
            style={{
              fontSize: '9px',
              letterSpacing: '0.25em',
              color: 'rgba(91,164,181,0.8)',
              textTransform: 'uppercase',
              marginBottom: '5px',
            }}
          >
            {project.location} · {project.year}
          </p>
          <p
            className="font-sans-body"
            style={{
              fontSize: 'clamp(11px, 1vw, 13px)',
              lineHeight: 1.6,
              color: 'rgba(237,232,228,0.7)',
              fontWeight: 300,
              margin: 0,
            }}
          >
            {project.subtitle}
          </p>
        </div>

        {/* Tag pill */}
        <div
          className="font-sans-body"
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 3,
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(237,232,228,0.7)',
            background: 'rgba(5,10,15,0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {project.meta?.[0]?.value || project.title}
        </div>
      </div>

      {/* Title below image */}
      <div style={{ marginTop: '14px' }}>
        <h3
          className="font-serif-display"
          style={{
            fontSize: 'clamp(16px, 1.6vw, 22px)',
            fontWeight: 300,
            color: isHovered ? '#EDE8E4' : 'rgba(237,232,228,0.7)',
            letterSpacing: '0.04em',
            margin: 0,
            transition: 'color 0.35s ease',
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>
        <p
          className="font-sans-body"
          style={{
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: isHovered ? '#5BA4B5' : 'rgba(214,232,238,0.4)',
            textTransform: 'uppercase',
            marginTop: '6px',
            transition: 'color 0.35s ease',
          }}
        >
          {project.location}
        </p>
      </div>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────────

export default function ImmersiveGallery({ onSelect }: Props) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const PROJECTS = galleryConfig.projects;
  // Duplicate for seamless loop
  const duplicated = [...PROJECTS, ...PROJECTS];

  if (PROJECTS.length === 0 && !galleryConfig.title) {
    return null;
  }

  const initAutoScroll = useCallback(() => {
    if (!trackRef.current) return;

    const track = trackRef.current;
    const halfWidth = track.scrollWidth / 2;

    gsap.set(track, { x: 0 });

    tweenRef.current = gsap.to(track, {
      x: -halfWidth,
      duration: PROJECTS.length * 6,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x: number) => {
          return parseFloat(x) % halfWidth;
        }),
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [PROJECTS.length]);

  const handleCardHover = (idx: number) => {
    setHoveredIndex(idx);
    tweenRef.current?.pause();
  };

  const handleCardLeave = () => {
    setHoveredIndex(null);
    tweenRef.current?.resume();
  };

  // Header fade-in
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

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 2,
        background: 'transparent',
        overflow: 'hidden',
        padding: 'clamp(60px, 10vh, 100px) 0',
      }}
    >
      {/* Section header */}
      <div
        ref={headerRef}
        style={{
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          marginBottom: 'clamp(36px, 6vh, 56px)',
          opacity: 0,
        }}
      >
        <div
          className="font-sans-body"
          style={{
            fontSize: '10px',
            letterSpacing: '0.4em',
            color: 'rgba(91,164,181,0.7)',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          {galleryConfig.sectionLabel}
        </div>
        <h2
          className="font-serif-display gradient-text"
          style={{
            fontSize: 'clamp(24px, 3.5vw, 42px)',
            fontWeight: 200,
            letterSpacing: '0.05em',
            lineHeight: 1.2,
            margin: '0 0 12px',
          }}
        >
          {galleryConfig.title}
        </h2>
        <div style={{
          width: '32px', height: '1px',
          background: 'linear-gradient(90deg, transparent, #5BA4B5, #EFBF04, transparent)',
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
        background: 'linear-gradient(270deg, #050A0F, transparent)',
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
        {duplicated.map((project, idx) => (
          <GalleryCard
            key={`${project.id}-${idx}`}
            project={project}
            isHovered={hoveredIndex === idx}
            onHover={() => handleCardHover(idx)}
            onLeave={handleCardLeave}
            onSelect={() => onSelect(project.id)}
          />
        ))}
      </div>
    </section>
  );
}
