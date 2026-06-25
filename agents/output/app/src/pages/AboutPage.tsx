import { useEffect, useRef, useState } from 'react';

interface Props {
  onBack: () => void;
}

export default function AboutPage({ onBack: _onBack }: Props) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: '#06141F',
        color: '#D6E8EE',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20vh',
          right: '-10vw',
          width: '50vw',
          height: '50vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(91,164,181,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10vh',
          left: '-10vw',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,191,4,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Hero Section with Background Image */}
      <div
        style={{
          position: 'relative',
          padding: '12vh 8vw 10vh',
          paddingTop: 'calc(72px + 12vh)',
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <img
            src="images/project-10.jfif"
            alt="RealImage Photography - Golden hour shoot"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 30%',
              display: 'block',
            }}
          />
          {/* Gradient overlay for readability */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(6,20,31,0.95) 0%, rgba(6,20,31,0.7) 50%, rgba(6,20,31,0.3) 100%)',
              pointerEvents: 'none',
            }}
          />
          {/* Bottom gradient to blend into next section */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(6,20,31,1) 0%, transparent 30%)',
              pointerEvents: 'none',
            }}
          />
          {/* subtle accent gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(91,164,181,0.1) 0%, transparent 50%, rgba(239,191,4,0.1) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Content Overlay */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '820px',
          }}
        >
          <p
            className="font-sans-body"
            style={{
              fontSize: '11px',
              letterSpacing: '0.35em',
              color: '#5BA4B5',
              textTransform: 'uppercase',
              marginBottom: '28px',
            }}
          >
            ABOUT US
          </p>
          <h1
            className="font-serif-display"
            style={{
              fontSize: 'clamp(42px, 6vw, 96px)',
              fontWeight: 200,
              letterSpacing: '0.04em',
              lineHeight: 1.05,
              margin: 0,
              marginBottom: '32px',
              background: 'linear-gradient(135deg, #D6E8EE 0%, rgba(214,232,238,0.55) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Our Story
          </h1>
          <p
            className="font-sans-body"
            style={{
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.8,
              color: 'rgba(214,232,238,0.5)',
              maxWidth: '580px',
              fontWeight: 300,
            }}
          >
            A legacy of creative photography, built on passion and trust.
          </p>
          <p
            className="font-sans-body"
            style={{
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              lineHeight: 2,
              color: 'rgba(214,232,238,0.7)',
              fontWeight: 300,
              marginTop: '32px',
              maxWidth: '820px',
            }}
          >
            For over 15 years, RealImage Photography has been capturing life's most meaningful
            moments through creative and professional photography. What started as a passion for
            storytelling through images has grown into a trusted photography business dedicated to
            delivering memories that last a lifetime.
          </p>
          
          <div style={{ marginTop: '48px' }}>
            <span
              className="font-sans-body"
              style={{
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: 'rgba(214,232,238,0.6)',
                textTransform: 'uppercase',
                display: 'inline-block',
                padding: '8px 16px',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '24px',
                background: 'rgba(6,20,31,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            >
              Since 2010 · Madurai, India
            </span>
          </div>
        </div>
      </div>

      {/* Experience Stats */}
      <div
        style={{
          padding: '4vh 8vw 2vh',
          display: 'flex',
          alignItems: 'center',
          gap: '48px',
          flexWrap: 'wrap',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease 0.3s, transform 1s ease 0.3s',
        }}
      >
        {[
          { number: '15+', label: 'Years of Experience' },
          { number: '500+', label: 'Happy Clients' },
          { number: '1000+', label: 'Events Captured' },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              minWidth: '140px',
            }}
          >
            <span
              className="font-serif-display"
              style={{
                fontSize: 'clamp(36px, 4vw, 56px)',
                fontWeight: 200,
                background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              {stat.number}
            </span>
            <span
              className="font-sans-body"
              style={{
                fontSize: '11px',
                letterSpacing: '0.25em',
                color: 'rgba(214,232,238,0.4)',
                textTransform: 'uppercase',
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main Content with Image */}
      <div
        style={{
          padding: '2vh 8vw 4vh',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
        }}
      >

        {/* Content blocks */}
        {[
          {
            title: 'Our Philosophy',
            body: "We believe every photograph should tell a story. Whether it's a wedding, family celebration, corporate event, portrait session, or special occasion, our goal is to capture genuine emotions, natural moments, and unforgettable experiences with attention to detail and artistic vision.",
            icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM16.5 8.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z',
          },
          {
            title: 'Trust & Experience',
            body: 'Over the years, we have had the privilege of working with hundreds of clients, helping them preserve their most cherished memories. Our commitment to quality, professionalism, and customer satisfaction has earned us the trust of families, individuals, and businesses alike.',
            icon: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
          },
          {
            title: 'Our Approach',
            body: 'At RealImage Photography, we combine experience, creativity, and modern photography techniques to create images that you will treasure for years to come.',
            icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
          },
        ].map((block, i) => (
          <ContentBlock key={i} {...block} index={i} />
        ))}
      </div>

      {/* Full width image with tagline */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '6vh',
          marginBottom: '6vh',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 1.2s ease 0.55s, transform 1.2s ease 0.55s',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <img
            src="images/project-4.jpg"
            alt="RealImage Photography - Destination shoot"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 40%',
              display: 'block',
            }}
          />
          {/* Overlay to make text pop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to right, rgba(6,20,31,0.9) 0%, rgba(6,20,31,0.2) 50%, rgba(6,20,31,0.9) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, transparent 0%, rgba(6,20,31,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '40px 8vw',
            textAlign: 'center',
          }}
        >
          <p
            className="font-serif-display"
            style={{
              fontSize: 'clamp(24px, 3.5vw, 48px)',
              fontWeight: 400,
              letterSpacing: '0.05em',
              color: '#EFBF04',
              textAlign: 'center',
              margin: 0,
              textShadow: '0 4px 30px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            "Every frame we capture is a piece of your story"
          </p>

          <div
            style={{
              marginTop: '40px',
              paddingTop: '32px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <p
              className="font-serif-display"
              style={{
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                fontWeight: 200,
                letterSpacing: '0.06em',
                lineHeight: 1.6,
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Capturing Moments.
            </p>
            <p
              className="font-serif-display"
              style={{
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                fontWeight: 300,
                letterSpacing: '0.06em',
                lineHeight: 1.6,
                color: '#EFBF04',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Preserving Memories.
            </p>
            <p
              className="font-serif-display"
              style={{
                fontSize: 'clamp(20px, 2.5vw, 32px)',
                fontWeight: 200,
                letterSpacing: '0.06em',
                lineHeight: 1.6,
                color: '#FFFFFF',
                margin: 0,
                textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)',
              }}
            >
              Creating Stories.
            </p>
          </div>
        </div>
      </div>

      {/* Closing */}
      <div
        style={{
          padding: '4vh 8vw 14vh',
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.4s ease 0.8s',
        }}
      >
        <p
          className="font-sans-body"
          style={{
            fontSize: 'clamp(14px, 1.3vw, 17px)',
            lineHeight: 2,
            color: 'rgba(214,232,238,0.5)',
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 300,
          }}
        >
          Thank you for allowing us to be a part of your special journey. We look forward to
          capturing your next unforgettable moment.
        </p>
      </div>
    </div>
  );
}

function ImageCard({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '4/3',
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'default',
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(6,20,31,0.75) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0.6,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
        }}
      >
        <span
          className="font-sans-body"
          style={{
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: hovered ? '#5BA4B5' : 'rgba(214,232,238,0.6)',
            textTransform: 'uppercase',
            transition: 'color 0.4s ease',
          }}
        >
          {caption}
        </span>
      </div>
    </div>
  );
}

function ContentBlock({
  title,
  body,
  icon,
  index,
}: {
  title: string;
  body: string;
  icon: string;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '48px 0',
        cursor: 'default',
        transition: 'padding 0.4s ease',
        paddingLeft: hovered ? '24px' : '0',
      }}
    >
      {/* Index */}
      <span
        className="font-sans-body"
        style={{
          position: 'absolute',
          top: 48,
          right: 0,
          fontSize: '11px',
          letterSpacing: '0.25em',
          color: 'rgba(214,232,238,0.2)',
        }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: hovered ? '3px' : '0px',
          height: '60%',
          background: 'linear-gradient(180deg, #5BA4B5, #EFBF04)',
          borderRadius: '2px',
          transition: 'width 0.4s ease',
        }}
      />

      <div style={{ display: 'flex', gap: '6vw', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left: icon + title */}
        <div style={{ flex: '0 0 auto', minWidth: '200px', maxWidth: '300px' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: hovered
                ? 'linear-gradient(135deg, rgba(91,164,181,0.2), rgba(239,191,4,0.2))'
                : 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              transition: 'background 0.4s ease, border 0.4s ease',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke={hovered ? '#5BA4B5' : 'rgba(214,232,238,0.7)'}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'stroke 0.4s ease', display: 'block' }}
            >
              <path d={icon} />
            </svg>
          </div>
          <h3
            className="font-serif-display"
            style={{
              fontSize: 'clamp(22px, 2.5vw, 32px)',
              fontWeight: 200,
              letterSpacing: '0.04em',
              color: '#D6E8EE',
              margin: 0,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Right: description */}
        <div
          style={{
            flex: 1,
            opacity: hovered ? 1 : 0.55,
            transition: 'opacity 0.4s ease',
            minWidth: '260px',
          }}
        >
          <p
            className="font-sans-body"
            style={{
              fontSize: 'clamp(15px, 1.3vw, 17px)',
              lineHeight: 2,
              color: 'rgba(214,232,238,0.75)',
              fontWeight: 300,
              maxWidth: '560px',
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
