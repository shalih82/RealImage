import { useState, useEffect, useRef } from 'react';
import type { ServiceItem } from '../config';

// ─── Preset icons for services ────────────────────────────────────────────────
const PRESET_ICONS: { label: string; path: string }[] = [
  {
    label: 'Heart',
    path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 4.875 9 11.25 9 11.25s9-6.375 9-11.25z',
  },
  {
    label: 'Camera',
    path: 'M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.585 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.989-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316zM16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z',
  },
  {
    label: 'Video',
    path: 'M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z',
  },
  {
    label: 'Location',
    path: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z',
  },
  {
    label: 'Book',
    path: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  },
  {
    label: 'Sparkle',
    path: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
  },
  {
    label: 'Star',
    path: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
  },
  {
    label: 'Gift',
    path: 'M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z',
  },
  {
    label: 'Users',
    path: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z',
  },
  {
    label: 'Music',
    path: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
  },
];

const emptyService: ServiceItem = {
  icon: PRESET_ICONS[0].path,
  image: '',
  title: '',
  tag: '',
  description: '',
  features: [],
  startingPrice: '',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: ServiceItem) => void;
  initialData?: ServiceItem | null;
  mode: 'add' | 'edit';
}

const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(91,164,181,0.25)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: '#D6E8EE',
  fontSize: '14px',
  fontWeight: 300,
  outline: 'none',
  transition: 'all 0.3s ease',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '0.3em',
  color: 'rgba(214,232,238,0.4)',
  textTransform: 'uppercase' as const,
  marginBottom: '6px',
  display: 'block',
};

export default function ServiceEditModal({ isOpen, onClose, onSave, initialData, mode }: Props) {
  const [formData, setFormData] = useState<ServiceItem>(emptyService);
  const [featuresText, setFeaturesText] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        setFeaturesText(initialData.features.join(', '));
      } else {
        setFormData(emptyService);
        setFeaturesText('');
      }
      setTimeout(() => titleRef.current?.focus(), 150);
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave({
      ...formData,
      title: formData.title.trim(),
      tag: formData.tag.trim(),
      description: formData.description.trim(),
      image: formData.image?.trim() || undefined,
      features: featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      startingPrice: formData.startingPrice?.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onWheel={(e) => e.stopPropagation()}
      data-lenis-prevent
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(5,10,15,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'svcModalFadeIn 0.25s ease',
        padding: '24px',
        overscrollBehavior: 'contain',
      }}
    >
      <style>{`
        @keyframes svcModalFadeIn { from { opacity: 0 } to { opacity: 1 } }
        .svc-input:focus {
          border-color: rgba(91,164,181,0.6) !important;
          background: rgba(91,164,181,0.05) !important;
        }
        .svc-modal-body::-webkit-scrollbar { width: 4px; }
        .svc-modal-body::-webkit-scrollbar-track { background: transparent; }
        .svc-modal-body::-webkit-scrollbar-thumb { background: rgba(91,164,181,0.2); border-radius: 4px; }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(10,16,24,0.97)',
          border: '1px solid rgba(91,164,181,0.2)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,164,181,0.05)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '32px 36px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              className="font-serif-display"
              style={{
                fontSize: '22px',
                fontWeight: 200,
                color: '#D6E8EE',
                margin: 0,
                letterSpacing: '0.06em',
              }}
            >
              {mode === 'add' ? 'Add New Service' : 'Edit Service'}
            </h2>
            <p
              className="font-sans-body"
              style={{
                fontSize: '11px',
                color: 'rgba(214,232,238,0.35)',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '6px',
              }}
            >
              {mode === 'add' ? 'Create a new service listing' : 'Modify service details'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              color: 'rgba(214,232,238,0.5)',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,80,80,0.4)';
              e.currentTarget.style.color = 'rgba(255,120,120,0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = 'rgba(214,232,238,0.5)';
            }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div
          className="svc-modal-body"
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          style={{
            padding: '24px 36px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            overscrollBehavior: 'contain',
          }}
        >
          {/* Title */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Service Title *
            </label>
            <input
              ref={titleRef}
              className="font-sans-body svc-input"
              style={inputStyle}
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Pre-Wedding Shoot"
              required
            />
          </div>

          {/* Tag */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Tag / Category
            </label>
            <input
              className="font-sans-body svc-input"
              style={inputStyle}
              value={formData.tag}
              onChange={(e) => setFormData((p) => ({ ...p, tag: e.target.value }))}
              placeholder="e.g. Photography"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Description
            </label>
            <textarea
              className="font-sans-body svc-input"
              style={{
                ...inputStyle,
                minHeight: '100px',
                resize: 'vertical',
                lineHeight: 1.7,
              }}
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the service offering..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Image URL
            </label>
            <input
              className="font-sans-body svc-input"
              style={inputStyle}
              value={formData.image || ''}
              onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
              placeholder="e.g. /images/project-7.jfif"
            />
            {formData.image ? (
              <div
                style={{
                  marginTop: '12px',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxHeight: '160px',
                }}
              >
                <img
                  src={formData.image}
                  alt="Service preview"
                  style={{
                    width: '100%',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : null}
          </div>

          {/* Features */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Features (comma-separated)
            </label>
            <input
              className="font-sans-body svc-input"
              style={inputStyle}
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="e.g. Full Day Coverage, 2 Photographers, All Rituals"
            />
            {featuresText && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {featuresText
                  .split(',')
                  .map((f) => f.trim())
                  .filter(Boolean)
                  .map((feat, i) => (
                    <span
                      key={i}
                      className="font-sans-body"
                      style={{
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        color: 'rgba(214,232,238,0.5)',
                        padding: '4px 10px',
                        border: '1px solid rgba(91,164,181,0.2)',
                        borderRadius: '20px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {feat}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Starting Price (optional)
            </label>
            <input
              className="font-sans-body svc-input"
              style={inputStyle}
              value={formData.startingPrice || ''}
              onChange={(e) => setFormData((p) => ({ ...p, startingPrice: e.target.value }))}
              placeholder="e.g. ₹25,000"
            />
          </div>

          {/* Icon selector */}
          <div>
            <label className="font-sans-body" style={labelStyle}>
              Icon
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
              }}
            >
              {PRESET_ICONS.map((icon) => {
                const selected = formData.icon === icon.path;
                return (
                  <button
                    key={icon.label}
                    type="button"
                    title={icon.label}
                    onClick={() => setFormData((p) => ({ ...p, icon: icon.path }))}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      borderRadius: '12px',
                      background: selected
                        ? 'linear-gradient(135deg, rgba(91,164,181,0.2), rgba(239,191,4,0.2))'
                        : 'rgba(255,255,255,0.03)',
                      border: selected
                        ? '1px solid rgba(91,164,181,0.5)'
                        : '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke={selected ? '#5BA4B5' : 'rgba(214,232,238,0.4)'}
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={icon.path} />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '20px 36px 28px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            gap: '12px',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="font-sans-body"
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(214,232,238,0.5)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              e.currentTarget.style.color = '#D6E8EE';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.color = 'rgba(214,232,238,0.5)';
            }}
          >
            Cancel
          </button>
          <button
            id="svc-modal-save-btn"
            type="submit"
            className="font-sans-body"
            style={{
              flex: 2,
              padding: '13px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'opacity 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.85';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {mode === 'add' ? 'Add Service' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
