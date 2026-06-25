import { useState, useRef } from 'react';
import { servicesPageConfig } from '../config';
import type { ServiceItem } from '../config';
import { useAdmin } from '../hooks/useAdmin';
import { useServices } from '../hooks/useServices';
import ServiceEditModal from '../components/ServiceEditModal';

interface Props {
  onBack: () => void;
  onContact: () => void;
}

function ServiceCard({
  service,
  index,
  isAdmin,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  service: ServiceItem;
  index: number;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setConfirmDelete(false);
      }}
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '40px 0',
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
          top: 40,
          right: 0,
          fontSize: '11px',
          letterSpacing: '0.25em',
          color: 'rgba(237,232,228,0.2)',
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

      <div style={{ display: 'flex', gap: '6vw', alignItems: 'flex-start' }}>
        {/* Left: icon + title */}
        <div style={{ flex: '0 0 38%' }}>
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
              <path d={service.icon} />
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
              marginBottom: '8px',
              transition: 'color 0.4s ease',
            }}
          >
            {service.title}
          </h3>
          <span
            className="font-sans-body"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: hovered ? '#5BA4B5' : 'rgba(237,232,228,0.3)',
              textTransform: 'uppercase',
              transition: 'color 0.4s ease',
            }}
          >
            {service.tag}
          </span>
        </div>

        {/* Right: description + features + price */}
        <div
          style={{
            flex: 1,
            opacity: hovered ? 1 : 0.55,
            transition: 'opacity 0.4s ease',
          }}
        >
          <p
            className="font-sans-body"
            style={{
              fontSize: '15px',
              lineHeight: 1.9,
              color: 'rgba(214,232,238,0.75)',
              fontWeight: 300,
              marginBottom: '28px',
              maxWidth: '520px',
            }}
          >
            {service.description}
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            {service.features.map((feat, i) => (
              <span
                key={i}
                className="font-sans-body"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: 'rgba(237,232,228,0.5)',
                  padding: '6px 14px',
                  border: '1px solid rgba(91,164,181,0.2)',
                  borderRadius: '30px',
                  textTransform: 'uppercase',
                }}
              >
                {feat}
              </span>
            ))}
          </div>

          {service.startingPrice && (
            <p
              className="font-sans-body"
              style={{
                fontSize: '13px',
                letterSpacing: '0.15em',
                color: hovered ? 'rgba(237,232,228,0.6)' : 'rgba(237,232,228,0.3)',
                textTransform: 'uppercase',
                transition: 'color 0.4s ease',
              }}
            >
              Starting from{' '}
              <span
                style={{
                  color: hovered ? '#5BA4B5' : 'rgba(214,232,238,0.3)',
                  fontWeight: 600,
                  fontSize: '15px',
                  transition: 'color 0.4s ease',
                }}
              >
                {service.startingPrice}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Admin controls */}
      {isAdmin && hovered && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            animation: 'svcAdminFadeIn 0.2s ease',
          }}
        >
          <AdminButton label="Edit" color="#5BA4B5" onClick={onEdit} />
          {!isFirst && (
            <AdminButton label="↑ Move Up" color="rgba(237,232,228,0.5)" onClick={onMoveUp} />
          )}
          {!isLast && (
            <AdminButton label="↓ Move Down" color="rgba(237,232,228,0.5)" onClick={onMoveDown} />
          )}
          {confirmDelete ? (
            <AdminButton label="Confirm Delete" color="#FF5050" onClick={onDelete} />
          ) : (
            <AdminButton
              label="Delete"
              color="rgba(255,80,80,0.7)"
              onClick={() => setConfirmDelete(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function AdminButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="font-sans-body"
      style={{
        background: 'transparent',
        border: `1px solid ${color}40`,
        color: color,
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        borderRadius: '20px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.background = `${color}15`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.background = 'transparent';
      }}
    >
      {label}
    </button>
  );
}

export default function ServicesPage({ onBack, onContact }: Props) {
  const cfg = servicesPageConfig;
  const { isAdmin } = useAdmin();
  const { services, addService, updateService, deleteService, reorderService, resetToDefaults } =
    useServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const handleAdd = () => {
    setEditingIndex(null);
    setModalMode('add');
    setModalOpen(true);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSave = (service: ServiceItem) => {
    if (modalMode === 'edit' && editingIndex !== null) {
      updateService(editingIndex, service);
    } else {
      addService(service);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        background: '#050A0F',
        color: '#EDE8E4',
      }}
    >
      <style>{`
        @keyframes svcAdminFadeIn { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>

      {/* Hero */}
      <div
        style={{
          padding: '10vh 8vw 6vh',
          paddingTop: 'calc(72px + 8vh)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
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
          {cfg.eyebrow}
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
            background: 'linear-gradient(135deg, #EDE8E4 0%, rgba(237,232,228,0.55) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {cfg.title}
        </h1>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <p
            className="font-sans-body"
            style={{
              fontSize: 'clamp(15px, 1.4vw, 18px)',
              lineHeight: 1.8,
              color: 'rgba(237,232,228,0.5)',
              maxWidth: '580px',
              fontWeight: 300,
            }}
          >
            {cfg.subtitle}
          </p>

          {/* Admin toolbar */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
              <button
                id="svc-admin-add-btn"
                onClick={handleAdd}
                className="font-sans-body"
                style={{
                  background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '10px 22px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'opacity 0.3s, transform 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Add Service
              </button>
              <button
                id="svc-admin-reset-btn"
                onClick={resetToDefaults}
                className="font-sans-body"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(237,232,228,0.5)',
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '10px 18px',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  e.currentTarget.style.color = '#EDE8E4';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = 'rgba(237,232,228,0.5)';
                }}
              >
                Reset Defaults
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Services list */}
      <div
        style={{
          padding: '6vh 8vw 14vh',
        }}
      >
        {services.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              color: 'rgba(237,232,228,0.3)',
            }}
          >
            <p className="font-serif-display" style={{ fontSize: '24px', fontWeight: 200, marginBottom: '16px' }}>
              No services yet
            </p>
            {isAdmin && (
              <p className="font-sans-body" style={{ fontSize: '13px' }}>
                Click "Add Service" above to create your first service listing.
              </p>
            )}
          </div>
        )}

        {services.map((service, i) => (
          <ServiceCard
            key={`${service.title}-${i}`}
            service={service}
            index={i}
            isAdmin={isAdmin}
            onEdit={() => handleEdit(i)}
            onDelete={() => deleteService(i)}
            onMoveUp={() => reorderService(i, i - 1)}
            onMoveDown={() => reorderService(i, i + 1)}
            isFirst={i === 0}
            isLast={i === services.length - 1}
          />
        ))}

        {/* Last border */}
        {services.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        )}
      </div>

      {/* CTA band */}
      <div
        style={{
          margin: '0 8vw 14vh',
          padding: '56px 6vw',
          background: 'radial-gradient(circle, rgba(91,164,181,0.06) 0%, transparent 70%)',
          border: '1px solid rgba(91,164,181,0.15)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            className="font-serif-display"
            style={{
              fontSize: 'clamp(22px, 2.5vw, 32px)',
              fontWeight: 300,
              color: '#D6E8EE',
              marginBottom: '10px',
            }}
          >
            {cfg.cta.heading}
          </p>
          <p
            className="font-sans-body"
            style={{
              fontSize: '14px',
              color: 'rgba(237,232,228,0.45)',
              fontWeight: 300,
            }}
          >
            {cfg.cta.subheading}
          </p>
        </div>
        <button
          id="services-contact-cta-btn"
          onClick={onContact}
          className="font-sans-body"
          style={{
            background: 'transparent',
            border: '1px solid rgba(91,164,181,0.2)',
            color: '#EDE8E4',
            fontSize: '12px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '16px 36px',
            borderRadius: '40px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,164,181,0.08)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(91,164,181,0.4)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(91,164,181,0.2)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          {cfg.cta.buttonText}
        </button>
      </div>

      {/* Edit Modal */}
      <ServiceEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initialData={editingIndex !== null ? services[editingIndex] : null}
        mode={modalMode}
      />
    </div>
  );
}
