import { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { contactPageConfig } from '../config';
import { isSupabaseConfigured, sendToSupabase, fetchFromSupabase } from '../lib/enquiries';
import { useAdmin } from '../hooks/useAdmin';

interface Props {
  onBack: () => void;
}

type FormData = {
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  venue: string;
  serviceType: string;
  budget: string;
  message: string;
};

type Submission = FormData & { submittedAt: string; id: string };

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const STORAGE_KEY = 'realimage_enquiries';

// ─── Storage helpers ──────────────────────────────────────────────────────────
function loadSubmissions(): Submission[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveSubmission(data: FormData): Submission {
  const entry: Submission = {
    ...data,
    id: Date.now().toString(36),
    submittedAt: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };
  const existing = loadSubmissions();
  existing.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return entry;
}

function clearSubmissions() {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Excel export ─────────────────────────────────────────────────────────────
function exportToExcel() {
  const submissions = loadSubmissions();
  if (submissions.length === 0) {
    alert('No enquiries to export yet.');
    return;
  }

  const rows = submissions.map((s, i) => ({
    '#': i + 1,
    'Submitted At': s.submittedAt,
    'Full Name': s.name,
    'Email': s.email,
    'Phone': s.phone,
    'Wedding Date': s.weddingDate,
    'Venue / Location': s.venue,
    'Service Type': s.serviceType,
    'Budget Range': s.budget,
    'Message': s.message,
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 4 },   // #
    { wch: 22 },  // Submitted At
    { wch: 22 },  // Full Name
    { wch: 28 },  // Email
    { wch: 16 },  // Phone
    { wch: 16 },  // Wedding Date
    { wch: 24 },  // Venue
    { wch: 28 },  // Service Type
    { wch: 24 },  // Budget
    { wch: 48 },  // Message
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Enquiries');

  const fileName = `RealImage_Enquiries_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function InputField({
  label, id, value, onChange, type = 'text', placeholder, required = false,
}: {
  label: string; id: string; value: string; onChange: (val: string) => void;
  type?: string; placeholder?: string; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor={id} className="font-sans-body" style={{
        fontSize: '11px', letterSpacing: '0.25em',
        color: focused ? '#5BA4B5' : 'rgba(214,232,238,0.4)',
        textTransform: 'uppercase', transition: 'color 0.3s ease',
      }}>
        {label} {required && <span style={{ color: '#5BA4B5' }}>*</span>}
      </label>
      <input
        id={id} type={type} value={value} required={required} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="font-sans-body"
        style={{
          background: focused ? 'rgba(91,164,181,0.05)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${focused ? 'rgba(91,164,181,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', padding: '14px 18px', color: '#D6E8EE',
          fontSize: '15px', fontWeight: 300, outline: 'none',
          transition: 'all 0.3s ease', width: '100%', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

function SelectField({
  label, id, value, onChange, options, required = false,
}: {
  label: string; id: string; value: string; onChange: (val: string) => void;
  options: { label: string; value: string }[]; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label htmlFor={id} className="font-sans-body" style={{
        fontSize: '11px', letterSpacing: '0.25em',
        color: focused ? '#5BA4B5' : 'rgba(214,232,238,0.4)',
        textTransform: 'uppercase', transition: 'color 0.3s ease',
      }}>
        {label} {required && <span style={{ color: '#5BA4B5' }}>*</span>}
      </label>
      <select
        id={id} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="font-sans-body"
        style={{
          background: focused ? 'rgba(91,164,181,0.05)' : 'rgba(6,20,31,0.8)',
          border: `1px solid ${focused ? 'rgba(91,164,181,0.5)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '10px', padding: '14px 18px',
          color: value ? '#D6E8EE' : 'rgba(214,232,238,0.35)',
          fontSize: '15px', fontWeight: 300, outline: 'none',
          transition: 'all 0.3s ease', width: '100%', appearance: 'none', cursor: 'pointer',
        }}
      >
        <option value="" disabled style={{ color: 'rgba(214,232,238,0.35)', background: '#06141F' }}>— Select —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: '#06141F', color: '#D6E8EE' }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Export button (floating, admin only) ────────────────────────────────────
function ExportButton() {
  const { isAdmin } = useAdmin();
  const count = loadSubmissions().length;
  const [hovered, setHovered] = useState(false);

  if (!isAdmin) return null;

  return (
    <button
      id="export-excel-btn"
      onClick={exportToExcel}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title="Export all enquiries to Excel"
      className="font-sans-body"
      style={{
        position: 'fixed',
        bottom: '32px',
        right: '32px',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '14px 22px',
        background: hovered
          ? 'linear-gradient(135deg, #5BA4B5, #EFBF04)'
          : 'rgba(6,20,31,0.9)',
        border: '1px solid rgba(91,164,181,0.4)',
        borderRadius: '40px',
        color: '#D6E8EE',
        fontSize: '12px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: hovered ? '0 8px 32px rgba(91,164,181,0.3)' : '0 4px 16px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M3 10h18M3 14h18M10 3v18M6.5 3h11A1.5 1.5 0 0119 4.5v15a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-15A1.5 1.5 0 016.5 3z" />
      </svg>
      Export Excel
      {count > 0 && (
        <span style={{
          background: '#5BA4B5',
          color: '#06141F',
          fontSize: '10px',
          fontWeight: 700,
          padding: '2px 7px',
          borderRadius: '10px',
          letterSpacing: '0.05em',
        }}>
          {count}
        </span>
      )}
    </button>
  );
}

// ─── Enquiries View (Admin) ─────────────────────────────────────────────────────
function EnquiriesView({ onBack }: { onBack: () => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([])

  

  useEffect(() => {
    let mounted = true
    async function load() {
      if (isSupabaseConfigured()) {
        const rows: any[] = await fetchFromSupabase()
        if (!mounted) return
        // map supabase rows to Submission shape when possible
        const mapped = rows.map((r) => ({
          id: r.client_id ?? r.id ?? String(Date.now()),
          submittedAt: r.submitted_at ?? new Date().toLocaleString('en-IN'),
          name: r.name ?? (r.raw?.name || ''),
          email: r.email ?? (r.raw?.email || ''),
          phone: r.phone ?? (r.raw?.phone || ''),
          weddingDate: r.wedding_date ?? (r.raw?.weddingDate || ''),
          venue: r.venue ?? (r.raw?.venue || ''),
          serviceType: r.service_type ?? (r.raw?.serviceType || ''),
          budget: r.budget ?? (r.raw?.budget || ''),
          message: r.message ?? (r.raw?.message || ''),
        }))
        setSubmissions(mapped)
      } else {
        setSubmissions(loadSubmissions())
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '70vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="font-serif-display" style={{ fontSize: 'clamp(24px, 3vw, 32px)', margin: 0, color: '#D6E8EE', fontWeight: 200 }}>
          Saved Enquiries
        </h2>
        <button
          onClick={onBack}
          className="font-sans-body"
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: '#D6E8EE', fontSize: 11, letterSpacing: '0.25em',
            textTransform: 'uppercase', padding: '10px 20px', borderRadius: 30, cursor: 'pointer',
            transition: 'background 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          Back to Form
        </button>
      </div>
      
      <div style={{ 
        overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px',
        scrollbarWidth: 'thin', scrollbarColor: 'rgba(91,164,181,0.5) rgba(0,0,0,0.2)'
      }}>
        {submissions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(214,232,238,0.5)' }}>
            No enquiries found.
          </div>
        ) : (
          [...submissions].reverse().map(s => (
            <div key={s.id} style={{ 
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', 
              padding: '20px', borderRadius: '12px' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <strong className="font-sans-body" style={{ fontSize: '16px', color: '#5BA4B5', fontWeight: 600 }}>{s.name}</strong>
                <span className="font-sans-body" style={{ fontSize: '12px', color: 'rgba(214,232,238,0.5)' }}>{s.submittedAt}</span>
              </div>
              <div className="font-sans-body" style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '12px', fontSize: '13px', color: '#D6E8EE', marginBottom: '16px' 
              }}>
                <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Email</span> {s.email || '-'}</div>
                <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Phone</span> {s.phone || '-'}</div>
                <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Service</span> {s.serviceType || '-'}</div>
                {s.weddingDate && <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Date</span> {s.weddingDate}</div>}
                {s.venue && <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Venue</span> {s.venue}</div>}
                {s.budget && <div><span style={{ color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', display: 'block', marginBottom: '2px' }}>Budget</span> {s.budget}</div>}
              </div>
              {s.message && (
                <div className="font-sans-body" style={{ 
                  fontSize: '13px', color: 'rgba(214,232,238,0.8)', background: 'rgba(0,0,0,0.2)', 
                  padding: '16px', borderRadius: '8px', lineHeight: 1.6, borderLeft: '2px solid rgba(91,164,181,0.5)'
                }}>
                  {s.message}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactPage({ onBack }: Props) {
  const cfg = contactPageConfig;
  const { isAdmin } = useAdmin();
  const formRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [adminViewMode, setAdminViewMode] = useState<'form' | 'enquiries'>('form');
  const [submissionCount, setSubmissionCount] = useState(loadSubmissions().length);
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', phone: '', weddingDate: '',
    venue: '', serviceType: '', budget: '', message: '',
  });

  const set = (key: keyof FormData) => (val: string) =>
    setFormData((prev) => ({ ...prev, [key]: val }));

  const handleClear = () => {
    if (window.confirm('Are you sure you want to completely remove all saved enquiries? This action cannot be undone.')) {
      clearSubmissions();
      setSubmissionCount(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => {
      const saved = saveSubmission(formData);
      setSubmissionCount(loadSubmissions().length);

      // If a webhook is configured (via Vite env or config), forward the submission
      const webhook = import.meta.env.VITE_ENQUIRY_WEBHOOK || (contactPageConfig as any).webhookUrl;
      if (webhook) {
        try {
          fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saved),
          }).catch((err) => {
            console.warn('Failed to forward enquiry to webhook:', err);
          });
        } catch (err) {
          console.warn('Failed to forward enquiry to webhook:', err);
        }
      }

      // If Supabase is configured, also persist there (non-blocking)
      if (isSupabaseConfigured()) {
        try {
          sendToSupabase(saved).catch((err) => console.warn('Supabase send failed', err));
        } catch (err) {
          console.warn('Supabase send failed', err);
        }
      }

      setFormStatus('success');
    }, 1200);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', background: '#06141F', color: '#D6E8EE' }}>

      {/* Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(340px, 1.4fr)',
        minHeight: '100vh',
        paddingTop: '72px',
      }}>

        {/* ── Left info panel ── */}
        <div style={{
          padding: '10vh 6vw 10vh 8vw',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        }}>
          <div>
            <p className="font-sans-body" style={{
              fontSize: '11px', letterSpacing: '0.35em', color: '#5BA4B5',
              textTransform: 'uppercase', marginBottom: '28px',
            }}>
              {cfg.eyebrow}
            </p>
            <h1 className="font-serif-display" style={{
              fontSize: 'clamp(36px, 4.5vw, 72px)', fontWeight: 200,
              letterSpacing: '0.04em', lineHeight: 1.1, margin: 0, marginBottom: '28px',
              background: 'linear-gradient(135deg, #D6E8EE 0%, rgba(214,232,238,0.5) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {cfg.title}
            </h1>
            <p className="font-sans-body" style={{
              fontSize: '15px', lineHeight: 1.9, color: 'rgba(214,232,238,0.5)',
              fontWeight: 300, maxWidth: '360px', marginBottom: '60px',
            }}>
              {cfg.subtitle}
            </p>

            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {cfg.details.map((detail) => (
                <div key={detail.label}>
                  <p className="font-sans-body" style={{
                    fontSize: '10px', letterSpacing: '0.3em',
                    color: 'rgba(214,232,238,0.3)', textTransform: 'uppercase', marginBottom: '8px',
                  }}>
                    {detail.label}
                  </p>
                  {detail.href ? (
                    <a href={detail.href} className="font-sans-body" style={{
                      fontSize: '16px', color: 'rgba(214,232,238,0.8)',
                      textDecoration: 'none', transition: 'color 0.3s', display: 'block',
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#5BA4B5'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(214,232,238,0.8)'; }}
                    >
                      {detail.value}
                    </a>
                  ) : (
                    <span className="font-sans-body" style={{ fontSize: '16px', color: 'rgba(214,232,238,0.8)' }}>
                      {detail.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Availability badge + enquiry counter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 22px', background: 'rgba(91,164,181,0.07)',
              border: '1px solid rgba(91,164,181,0.2)', borderRadius: '12px', alignSelf: 'flex-start',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: '#5BA4B5', boxShadow: '0 0 8px #5BA4B5',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }} />
              <style>{`@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }`}</style>
              <span className="font-sans-body" style={{
                fontSize: '12px', letterSpacing: '0.15em',
                color: 'rgba(214,232,238,0.65)', textTransform: 'uppercase',
              }}>
                {cfg.availabilityText}
              </span>
            </div>

            {isAdmin && submissionCount > 0 && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  id="contact-view-side-btn"
                  onClick={() => setAdminViewMode(m => m === 'form' ? 'enquiries' : 'form')}
                  className="font-sans-body"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', background: 'rgba(91,164,181,0.08)',
                    border: '1px solid rgba(91,164,181,0.25)', borderRadius: '12px',
                    cursor: 'pointer', color: '#5BA4B5',
                    fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,164,181,0.18)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#D6E8EE';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(91,164,181,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#5BA4B5';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {adminViewMode === 'enquiries' ? 'Show Form' : 'View Data'}
                </button>
                <button
                  id="contact-export-side-btn"
                  onClick={exportToExcel}
                  className="font-sans-body"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '10px',
                    padding: '12px 20px', background: 'rgba(239,191,4,0.08)',
                    border: '1px solid rgba(239,191,4,0.25)', borderRadius: '12px',
                    cursor: 'pointer', color: 'rgba(214,232,238,0.7)',
                    fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,191,4,0.18)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#D6E8EE';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,191,4,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(214,232,238,0.7)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M3 10h18M3 14h18M10 3v18M6.5 3h11A1.5 1.5 0 0119 4.5v15a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-15A1.5 1.5 0 016.5 3z" />
                  </svg>
                  Export {submissionCount} enquir{submissionCount === 1 ? 'y' : 'ies'} → Excel
                </button>
                <button
                  id="contact-clear-side-btn"
                  onClick={handleClear}
                  className="font-sans-body"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '12px 20px', background: 'rgba(220,53,69,0.08)',
                    border: '1px solid rgba(220,53,69,0.25)', borderRadius: '12px',
                    cursor: 'pointer', color: 'rgba(220,53,69,0.8)',
                    fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,53,69,0.18)';
                    (e.currentTarget as HTMLButtonElement).style.color = '#ff6b6b';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,53,69,0.08)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(220,53,69,0.8)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div style={{
          padding: '10vh 8vw 10vh 6vw',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          {isAdmin && adminViewMode === 'enquiries' ? (
            <EnquiriesView onBack={() => setAdminViewMode('form')} />
          ) : formStatus === 'success' ? (
            <div style={{
              textAlign: 'center', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '24px', padding: '60px 0',
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(91,164,181,0.2), rgba(239,191,4,0.2))',
                border: '1px solid rgba(91,164,181,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
              }}>
                ✓
              </div>
              <h2 className="font-serif-display" style={{
                fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 200, color: '#D6E8EE', margin: 0,
              }}>
                {cfg.successMessage.title}
              </h2>
              <p className="font-sans-body" style={{
                fontSize: '15px', color: 'rgba(214,232,238,0.5)',
                lineHeight: 1.8, maxWidth: '360px', textAlign: 'center',
              }}>
                {cfg.successMessage.body}
              </p>

              {/* Download Excel CTA on success — admin only */}
              {isAdmin && (
                <button
                  id="contact-download-excel-btn"
                  onClick={exportToExcel}
                  className="font-sans-body"
                  style={{
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                    border: 'none', color: '#ffffff',
                    fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '14px 32px', borderRadius: '40px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg> Download Excel ({submissionCount} record{submissionCount !== 1 ? 's' : ''})
                </button>
              )}

              <button
                id="contact-success-back-btn"
                onClick={onBack}
                className="font-sans-body"
                style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#D6E8EE', fontSize: 11, letterSpacing: '0.25em',
                  textTransform: 'uppercase', padding: '12px 28px', borderRadius: 30, cursor: 'pointer',
                }}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
            >
              <p className="font-sans-body" style={{
                fontSize: '11px', letterSpacing: '0.25em',
                color: 'rgba(214,232,238,0.3)', textTransform: 'uppercase', marginBottom: '8px',
              }}>
                {cfg.formLabel}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField label="Full Name" id="contact-name" value={formData.name} onChange={set('name')} placeholder="Your name" required />
                <InputField label="Email" id="contact-email" type="email" value={formData.email} onChange={set('email')} placeholder="abu22333@gmail.com" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InputField label="Phone" id="contact-phone" type="tel" value={formData.phone} onChange={set('phone')} placeholder="+91 99423 68786" />
                <SelectField label="Service" id="contact-service" value={formData.serviceType} onChange={set('serviceType')} required options={cfg.serviceOptions} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: (formData.serviceType && formData.serviceType !== 'albums') ? '1fr 1fr' : '1fr', gap: '20px' }}>
                {formData.serviceType && formData.serviceType !== 'albums' && (
                  <InputField 
                    label={formData.serviceType === 'events' ? 'Event Date' : 'Wedding Date'} 
                    id="contact-date" 
                    type="date" 
                    value={formData.weddingDate} 
                    onChange={set('weddingDate')} 
                  />
                )}
                <SelectField label="Budget Range" id="contact-budget" value={formData.budget} onChange={set('budget')} options={cfg.budgetOptions} />
              </div>
              
              {formData.serviceType && formData.serviceType !== 'albums' && (
                <InputField label="Venue / Location" id="contact-venue" value={formData.venue} onChange={set('venue')} placeholder="City or venue name" />
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="contact-message" className="font-sans-body" style={{
                  fontSize: '11px', letterSpacing: '0.25em',
                  color: 'rgba(214,232,238,0.4)', textTransform: 'uppercase',
                }}>Message</label>
                <textarea
                  id="contact-message" value={formData.message}
                  onChange={(e) => set('message')(e.target.value)} rows={4}
                  placeholder="Tell us about your dream wedding..."
                  className="font-sans-body"
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px', padding: '14px 18px', color: '#D6E8EE',
                    fontSize: '15px', fontWeight: 300, outline: 'none',
                    resize: 'vertical', minHeight: '110px', transition: 'all 0.3s ease',
                    fontFamily: 'inherit', boxSizing: 'border-box', width: '100%',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(91,164,181,0.5)'; e.currentTarget.style.background = 'rgba(91,164,181,0.05)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginTop: '8px' }}>
                <button
                  id="contact-submit-btn" type="submit"
                  disabled={formStatus === 'submitting'} className="font-sans-body"
                  style={{
                    background: formStatus === 'submitting' ? 'rgba(91,164,181,0.3)' : 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                    border: 'none', color: '#ffffff', fontSize: '12px', letterSpacing: '0.2em',
                    textTransform: 'uppercase', padding: '18px 40px', borderRadius: '40px',
                    cursor: formStatus === 'submitting' ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.3s ease, transform 0.3s ease', minWidth: '200px',
                  }}
                  onMouseEnter={(e) => {
                    if (formStatus !== 'submitting') {
                      (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
                      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.opacity = '1';
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  }}
                >
                  {formStatus === 'submitting' ? 'Saving…' : cfg.submitLabel}
                </button>

                {isAdmin && submissionCount > 0 && (
                  <span className="font-sans-body" style={{
                    fontSize: '11px', letterSpacing: '0.15em',
                    color: 'rgba(214,232,238,0.3)', textTransform: 'uppercase',
                  }}>
                    {submissionCount} saved enquir{submissionCount === 1 ? 'y' : 'ies'}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Floating export button (always visible on Contact page) */}
      <ExportButton />
    </div>
  );
}
