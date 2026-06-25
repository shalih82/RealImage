import { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../hooks/useAdmin';

export default function AdminLoginModal() {
  const { showLoginModal, closeLogin, tryLogin } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showLoginModal) {
      setPassword('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showLoginModal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = tryLogin(password);
    if (!ok) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPassword('');
    }
  };

  if (!showLoginModal) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeLogin(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5,10,15,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes shakeX {
          0%,100% { transform: translateX(0) }
          20% { transform: translateX(-8px) }
          40% { transform: translateX(8px) }
          60% { transform: translateX(-6px) }
          80% { transform: translateX(6px) }
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'rgba(10,16,24,0.95)',
          border: '1px solid rgba(91,164,181,0.2)',
          borderRadius: '20px',
          padding: '48px 44px',
          width: '100%',
          maxWidth: '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(91,164,181,0.05)',
          animation: shake ? 'shakeX 0.5s ease' : 'none',
        }}
      >
        {/* Lock icon */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(91,164,181,0.15), rgba(239,191,4,0.15))',
            border: '1px solid rgba(91,164,181,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', margin: '0 auto 16px',
          }}>
            🔐
          </div>
          <h2 className="font-serif-display" style={{
            fontSize: '22px', fontWeight: 200, color: '#D6E8EE',
            margin: 0, letterSpacing: '0.06em',
          }}>
            Admin Access
          </h2>
          <p className="font-sans-body" style={{
            fontSize: '12px', color: 'rgba(237,232,228,0.35)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginTop: '8px',
          }}>
            RealImage Studio
          </p>
        </div>

        {/* Password input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label htmlFor="admin-pw-input" className="font-sans-body" style={{
            fontSize: '10px', letterSpacing: '0.3em',
            color: 'rgba(214,232,238,0.35)', textTransform: 'uppercase',
          }}>
            Password
          </label>
          <input
            ref={inputRef}
            id="admin-pw-input"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            placeholder="Enter admin password"
            className="font-sans-body"
            autoComplete="current-password"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${error ? 'rgba(255,80,80,0.5)' : 'rgba(91,164,181,0.3)'}`,
              borderRadius: '10px', padding: '14px 18px',
              color: '#D6E8EE', fontSize: '15px', fontWeight: 300,
              outline: 'none', transition: 'all 0.3s ease',
              width: '100%', boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(91,164,181,0.6)';
              e.currentTarget.style.background = 'rgba(91,164,181,0.05)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error
                ? 'rgba(255,80,80,0.5)' : 'rgba(91,164,181,0.3)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            }}
          />
          {error && (
            <p className="font-sans-body" style={{
              fontSize: '11px', color: 'rgba(255,100,100,0.85)',
              letterSpacing: '0.1em', margin: 0,
            }}>
              Incorrect password. Try again.
            </p>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            onClick={closeLogin}
            className="font-sans-body"
            style={{
              flex: 1, padding: '12px', borderRadius: '10px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(214,232,238,0.5)', fontSize: '12px',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
              (e.currentTarget as HTMLButtonElement).style.color = '#D6E8EE';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(214,232,238,0.5)';
            }}
          >
            Cancel
          </button>
          <button
            id="admin-login-submit"
            type="submit"
            className="font-sans-body"
            style={{
              flex: 2, padding: '12px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
              border: 'none', color: '#fff',
              fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'opacity 0.3s, transform 0.3s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            Unlock
          </button>
        </div>
      </form>
    </div>
  );
}
