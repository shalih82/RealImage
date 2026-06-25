import { footerConfig } from '../config';

export default function Footer() {
  if (!footerConfig.visionText && !footerConfig.brandName && footerConfig.columns.length === 0) {
    return null;
  }

  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        width: '100%',
        background: '#050A0F',
        zIndex: 4,
        overflow: 'hidden',
      }}
    >
      {/* Ambient video (if provided) */}
      {footerConfig.videoPath && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.15,
            zIndex: 0,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          >
            <source src={footerConfig.videoPath} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Glassmorphism top separator */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(91,164,181,0.5), rgba(239,191,4,0.5), transparent)',
          boxShadow: '0 0 20px rgba(48,176,208,0.15)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '20vh 8vw 8vh',
        }}
      >
        {footerConfig.visionText && (
          <div style={{ maxWidth: '720px', marginBottom: '120px' }}>
            <p
              className="font-serif-display"
              style={{
                fontSize: '17px',
                fontWeight: 300,
                lineHeight: 2.2,
                color: 'rgba(237,232,228,0.75)',
                letterSpacing: '0.02em',
              }}
            >
              {footerConfig.visionText}
            </p>
          </div>
        )}

        {footerConfig.columns.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '48px',
              paddingBottom: '60px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {footerConfig.columns.map((col) => (
              <div key={col.heading}>
                <p
                  className="font-sans-body"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.25em',
                    color: 'rgba(91, 164, 181, 0.6)',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                  }}
                >
                  {col.heading}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {col.entries.map((entry, idx) =>
                    entry.href ? (
                      <a
                        key={idx}
                        href={entry.href}
                        style={{
                          color: '#EDE8E4',
                          opacity: 0.6,
                          fontSize: '15px',
                          textDecoration: 'none',
                          lineHeight: 1.8,
                          transition: 'opacity 0.4s, color 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          (e.target as HTMLElement).style.opacity = '1';
                          (e.currentTarget as HTMLAnchorElement).style.color = '#5BA4B5';
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.opacity = '0.6';
                          (e.target as HTMLElement).style.color = '#EDE8E4';
                        }}
                      >
                        {entry.text}
                      </a>
                    ) : (
                      <span
                        key={idx}
                        style={{
                          color: '#EDE8E4',
                          opacity: 0.6,
                          fontSize: '15px',
                          lineHeight: 1.8,
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {entry.text}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '32px',
          }}
        >
          {footerConfig.brandName && (
            <p
              className="font-serif-display"
              style={{
                fontSize: '16px',
                letterSpacing: '0.15em',
                color: 'rgba(214,232,238,0.6)',
                textShadow: '0 0 20px rgba(91, 164, 181, 0.4)',
              }}
            >
              {footerConfig.brandName}
            </p>
          )}
          {footerConfig.copyright && (
            <p
              className="font-sans-body"
              style={{
                fontSize: '12px',
                color: 'rgba(237,232,228,0.25)',
              }}
            >
              {footerConfig.copyright}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
