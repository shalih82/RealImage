import { useEffect, useRef, useState } from 'react';
import { aboutPageConfig, type AboutPageConfig } from '../config';
import { useAdmin } from '../hooks/useAdmin';

interface Props {
  onBack: () => void;
}

const STORAGE_KEY = 'ri_about_page_data';

const DEFAULT_STORY_BLOCK_ICON = 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM16.5 8.25a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0z';

function cloneAboutPageConfig(config: AboutPageConfig): AboutPageConfig {
  return {
    ...config,
    stats: config.stats.map((stat) => ({ ...stat })),
    blocks: config.blocks.map((block) => ({ ...block })),
  };
}

function loadAboutPageConfig(): AboutPageConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AboutPageConfig;
      if (parsed && parsed.title) return cloneAboutPageConfig(parsed);
    }
  } catch {
    // fall back to defaults
  }
  return cloneAboutPageConfig(aboutPageConfig);
}

export default function AboutPage({ onBack: _onBack }: Props) {
  const { isAdmin } = useAdmin();
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<AboutPageConfig>(loadAboutPageConfig);
  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState<AboutPageConfig>(cloneAboutPageConfig(aboutPageConfig));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
  }, []);

  const openEditor = () => {
    setDraft(cloneAboutPageConfig(content));
    setShowEditor(true);
  };

  const saveContent = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    setContent(cloneAboutPageConfig(draft));
    setShowEditor(false);
  };

  const resetContent = () => {
    const defaults = cloneAboutPageConfig(aboutPageConfig);
    setDraft(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    setContent(defaults);
  };

  const addStoryBlock = () => {
    setDraft((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { title: 'New Story Block', body: '', icon: DEFAULT_STORY_BLOCK_ICON },
      ],
    }));
  };

  const removeStoryBlock = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

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
      {isAdmin && (
        <button
          type="button"
          onClick={openEditor}
          className="font-sans-body"
          style={{
            position: 'fixed',
            top: '88px',
            right: '24px',
            zIndex: 200,
            padding: '10px 16px',
            borderRadius: '999px',
            border: '1px solid rgba(91,164,181,0.35)',
            background: 'rgba(6,20,31,0.8)',
            color: '#D6E8EE',
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          }}
        >
          Edit About Page
        </button>
      )}

      {showEditor && (
        <div
          data-lenis-prevent
          onClick={(e) => e.target === e.currentTarget && setShowEditor(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(2,7,12,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            data-lenis-prevent
            style={{
              width: '100%',
              maxWidth: '780px',
              maxHeight: '92vh',
              overflowY: 'auto',
              background: 'rgba(6,20,31,0.96)',
              border: '1px solid rgba(91,164,181,0.24)',
              borderRadius: '22px',
              padding: '24px',
              color: '#D6E8EE',
              boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
              overscrollBehavior: 'contain',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 className="font-serif-display" style={{ margin: 0, fontSize: '24px', fontWeight: 200 }}>Edit About Page</h2>
                <p className="font-sans-body" style={{ margin: '6px 0 0', fontSize: '12px', color: 'rgba(214,232,238,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Update the story sections and highlights</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={resetContent} style={{ ...editorButtonStyle, borderColor: 'rgba(239,191,4,0.35)', color: '#EFBF04' }}>Reset</button>
                <button type="button" onClick={() => setShowEditor(false)} style={{ ...editorButtonStyle, borderColor: 'rgba(255,255,255,0.16)', color: 'rgba(214,232,238,0.75)' }}>Cancel</button>
                <button type="button" onClick={saveContent} style={{ ...editorButtonStyle, borderColor: 'rgba(91,164,181,0.4)', color: '#5BA4B5' }}>Save</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <EditorField label="Eyebrow" value={draft.eyebrow} onChange={(value) => setDraft((prev) => ({ ...prev, eyebrow: value }))} />
              <EditorField label="Title" value={draft.title} onChange={(value) => setDraft((prev) => ({ ...prev, title: value }))} />
              <EditorField label="Intro line" value={draft.intro} onChange={(value) => setDraft((prev) => ({ ...prev, intro: value }))} textarea />
              <EditorField label="Main body" value={draft.body} onChange={(value) => setDraft((prev) => ({ ...prev, body: value }))} textarea />
              <EditorField label="Location badge" value={draft.location} onChange={(value) => setDraft((prev) => ({ ...prev, location: value }))} />
              <EditorField label="Hero image" value={draft.heroImage} onChange={(value) => setDraft((prev) => ({ ...prev, heroImage: value }))} />
              <EditorField label="Hero image alt" value={draft.heroImageAlt} onChange={(value) => setDraft((prev) => ({ ...prev, heroImageAlt: value }))} />
              <EditorField label="Featured image" value={draft.featuredImage} onChange={(value) => setDraft((prev) => ({ ...prev, featuredImage: value }))} />
              <EditorField label="Featured image alt" value={draft.featuredImageAlt} onChange={(value) => setDraft((prev) => ({ ...prev, featuredImageAlt: value }))} />
              <EditorField label="Quote" value={draft.quote} onChange={(value) => setDraft((prev) => ({ ...prev, quote: value }))} />
              <EditorField label="Quote caption" value={draft.quoteCaption} onChange={(value) => setDraft((prev) => ({ ...prev, quoteCaption: value }))} />
              <EditorField label="Closing text" value={draft.closingText} onChange={(value) => setDraft((prev) => ({ ...prev, closingText: value }))} textarea />

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <h3 className="font-sans-body" style={{ margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'rgba(214,232,238,0.45)' }}>Stats</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {draft.stats.map((stat, index) => (
                    <div key={index} style={{ display: 'grid', gap: '8px', gridTemplateColumns: '1fr 2fr' }}>
                      <EditorField label="Number" value={stat.number} onChange={(value) => setDraft((prev) => ({ ...prev, stats: prev.stats.map((item, itemIndex) => itemIndex === index ? { ...item, number: value } : item) }))} />
                      <EditorField label="Label" value={stat.label} onChange={(value) => setDraft((prev) => ({ ...prev, stats: prev.stats.map((item, itemIndex) => itemIndex === index ? { ...item, label: value } : item) }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <h3 className="font-sans-body" style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '11px', color: 'rgba(214,232,238,0.45)' }}>Story blocks</h3>
                  <button type="button" onClick={addStoryBlock} style={{ ...editorButtonStyle, borderColor: 'rgba(91,164,181,0.4)', color: '#5BA4B5' }}>Add Block</button>
                </div>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {draft.blocks.map((block, index) => (
                    <div key={index} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span className="font-sans-body" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,232,238,0.45)' }}>Block {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeStoryBlock(index)}
                          style={{
                            ...editorButtonStyle,
                            borderColor: 'rgba(255,80,80,0.3)',
                            color: 'rgba(255,120,120,0.9)',
                          }}
                        >
                          Remove
                        </button>
                      </div>
                      <EditorField label="Title" value={block.title} onChange={(value) => setDraft((prev) => ({ ...prev, blocks: prev.blocks.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} />
                      <EditorField label="Body" value={block.body} onChange={(value) => setDraft((prev) => ({ ...prev, blocks: prev.blocks.map((item, itemIndex) => itemIndex === index ? { ...item, body: value } : item) }))} textarea />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
            {content.eyebrow}
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
            {content.title}
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
            {content.intro}
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
            {content.body}
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
              {content.location}
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
        {content.stats.map((stat, i) => (
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
        {content.blocks.map((block, i) => (
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
            src={content.featuredImage}
            alt={content.featuredImageAlt}
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
            {content.quote}
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
              {content.quoteCaption}
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
          {content.closingText}
        </p>
      </div>
    </div>
  );
}

function EditorField({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span className="font-sans-body" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(214,232,238,0.45)' }}>
        {label}
      </span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-sans-body"
          style={{
            minHeight: '90px',
            resize: 'vertical',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '10px 12px',
            color: '#D6E8EE',
            outline: 'none',
          }}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-sans-body"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '10px',
            padding: '10px 12px',
            color: '#D6E8EE',
            outline: 'none',
          }}
        />
      )}
    </label>
  );
}

const editorButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '999px',
  color: '#D6E8EE',
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: '11px',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
};

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
