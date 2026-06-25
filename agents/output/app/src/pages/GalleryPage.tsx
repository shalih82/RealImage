import { useState, useEffect, useRef, useCallback } from 'react';
import { useAdmin } from '../hooks/useAdmin';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Photo {
  id: string;
  dataUrl: string;
  name: string;
  type: 'image' | 'video';
}

interface Album {
  id: string;
  name: string;
  description: string;
  photos: Photo[];
  createdAt: string;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'ri_gallery_albums';

function loadAlbums(): Album[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAlbums(albums: Album[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(albums));
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LightboxProps {
  photos: Photo[];
  startIndex: number;
  onClose: () => void;
}

function Lightbox({ photos, startIndex, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + photos.length) % photos.length), [photos.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % photos.length), [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <div
      id="lightbox-overlay"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        animation: 'fadeInFast 0.2s ease',
      }}
    >
      {/* Close */}
      <button
        id="lightbox-close"
        onClick={onClose}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 20, width: 44, height: 44,
          borderRadius: '50%', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 10,
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
      >✕</button>

      {/* Counter */}
      <div style={{
        position: 'absolute', top: 32, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'sans-serif', fontSize: 12, letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.5)', userSelect: 'none',
      }}>
        {current + 1} / {photos.length}
      </div>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          id="lightbox-prev"
          onClick={e => { e.stopPropagation(); prev(); }}
          style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 22, width: 52, height: 52,
            borderRadius: '50%', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >‹</button>
      )}

      {/* Image or Video */}
      {photos[current].type === 'video' ? (
        <video
          src={photos[current].dataUrl}
          onClick={e => e.stopPropagation()}
          controls
          autoPlay
          style={{
            maxWidth: '88vw', maxHeight: '88vh',
            borderRadius: 4,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            userSelect: 'none',
            outline: 'none',
          }}
        />
      ) : (
        <img
          src={photos[current].dataUrl}
          alt={photos[current].name}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: '88vw', maxHeight: '88vh',
            objectFit: 'contain', borderRadius: 4,
            boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
            userSelect: 'none',
          }}
        />
      )}

      {/* Next */}
      {photos.length > 1 && (
        <button
          id="lightbox-next"
          onClick={e => { e.stopPropagation(); next(); }}
          style={{
            position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: 22, width: 52, height: 52,
            borderRadius: '50%', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >›</button>
      )}

      {/* Thumbnail strip */}
      {photos.length > 1 && (
        <div style={{
          position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 8, maxWidth: '80vw', overflowX: 'auto', padding: '4px 0',
        }}>
          {photos.map((p, i) => (
            <img
              key={p.id}
              src={p.dataUrl}
              alt=""
              onClick={e => { e.stopPropagation(); setCurrent(i); }}
              style={{
                width: 54, height: 54, objectFit: 'cover',
                borderRadius: 3, cursor: 'pointer', flexShrink: 0,
                opacity: i === current ? 1 : 0.4,
                border: i === current ? '2px solid #30B0D0' : '2px solid transparent',
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── New Album Modal ──────────────────────────────────────────────────────────

interface NewAlbumModalProps {
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

function NewAlbumModal({ onSave, onClose }: NewAlbumModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 8, color: '#fff',
    fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(12,18,26,0.97)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: 36,
          width: '90%', maxWidth: 440,
          boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
        }}
      >
        <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: 20, fontWeight: 400, letterSpacing: '0.05em' }}>
          Create New Album
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, letterSpacing: '0.1em', margin: '0 0 28px', textTransform: 'uppercase' }}>
          Admin · Gallery
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            Album Name *
          </label>
          <input
            id="new-album-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Priya & Arjun Wedding"
            style={inputStyle}
            onFocus={e => (e.currentTarget.style.borderColor = '#30B0D0')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
            Description
          </label>
          <textarea
            id="new-album-desc"
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder="Brief description of this album…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
            onFocus={e => (e.currentTarget.style.borderColor = '#30B0D0')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            id="new-album-cancel"
            onClick={onClose}
            style={{
              flex: 1, padding: '12px 0',
              background: 'transparent',
              borderTop: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 8, color: 'rgba(255,255,255,0.6)',
              fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
          >Cancel</button>
          <button
            id="new-album-save"
            onClick={() => { if (name.trim()) onSave(name.trim(), desc.trim()); }}
            disabled={!name.trim()}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              flex: 1, padding: '12px 0',
              background: hovered ? 'linear-gradient(135deg, rgba(91,164,181,0.05), rgba(239,191,4,0.05))' : 'rgba(255,255,255,0.02)',
              border: hovered ? '1px dashed rgba(91,164,181,0.4)' : '1px dashed rgba(255,255,255,0.1)',
              borderRadius: 8,
              color: name.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
              fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >Create Album</button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void;
}

type View = 'albums' | 'album-detail';

export default function GalleryPage({ onBack: _onBack }: Props) {
  const { isAdmin } = useAdmin();
  const [albums, setAlbums] = useState<Album[]>(loadAlbums);
  const [view, setView] = useState<View>('albums');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ photos: Photo[]; index: number } | null>(null);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAlbum = albums.find(a => a.id === selectedAlbumId) ?? null;

  // Persist whenever albums change
  useEffect(() => { saveAlbums(albums); }, [albums]);

  // ── Album CRUD ──────────────────────────────────────────────────────────────

  const createAlbum = (name: string, description: string) => {
    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      name,
      description,
      photos: [],
      createdAt: new Date().toISOString(),
    };
    setAlbums(prev => [newAlbum, ...prev]);
    setShowNewAlbum(false);
  };

  const deleteAlbum = (albumId: string) => {
    if (!confirm('Delete this album and all its photos?')) return;
    setAlbums(prev => prev.filter(a => a.id !== albumId));
    setView('albums');
    setSelectedAlbumId(null);
  };

  const SUPPORTED_TYPES = [
    'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp',
    'image/tiff', 'image/svg+xml', 'image/heic', 'image/heif', 'image/avif',
    'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm',
    'video/x-matroska', 'video/avi', 'video/mov',
  ];

  const addPhotos = useCallback((files: FileList | null, albumId: string) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const fileArr = Array.from(files).filter(f =>
      f.type.startsWith('image/') || f.type.startsWith('video/') || SUPPORTED_TYPES.includes(f.type)
    );

    const readers = fileArr.map(file => new Promise<Photo>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({
        id: `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        dataUrl: reader.result as string,
        name: file.name,
        type: file.type.startsWith('video/') ? 'video' : 'image',
      });
      reader.readAsDataURL(file);
    }));

    Promise.all(readers).then(newPhotos => {
      setAlbums(prev => prev.map(a =>
        a.id === albumId ? { ...a, photos: [...a.photos, ...newPhotos] } : a
      ));
      setUploading(false);
    });
  }, []);

  const deletePhoto = (albumId: string, photoId: string) => {
    setAlbums(prev => prev.map(a =>
      a.id === albumId ? { ...a, photos: a.photos.filter(p => p.id !== photoId) } : a
    ));
  };

  // ── Shared styles ───────────────────────────────────────────────────────────

  const textShadow = '0 2px 16px rgba(0,0,0,0.5)';

  // ─── Album Grid View ────────────────────────────────────────────────────────

  if (view === 'albums') {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 72, background: '#070d14', position: 'relative', zIndex: 1 }}>
        <style>{`
          @keyframes fadeInFast { from { opacity: 0 } to { opacity: 1 } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
          .album-card { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); }
          .album-card:hover { transform: translateY(-6px); }
          .album-card:hover .album-overlay { opacity: 1 !important; }
          .album-card:hover .album-cover { transform: scale(1.06); }
        `}</style>

        {/* Header */}
        <div style={{ padding: '60px 6vw 48px', animation: 'fadeInUp 0.7s ease' }}>
          <div className="font-sans-body" style={{
            fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase', marginBottom: 14, textShadow,
          }}>
            Photo Albums
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <h1 className="font-serif-display" style={{
              fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 200,
              color: '#fff', margin: 0, letterSpacing: '0.05em',
              lineHeight: 1.1, textShadow,
            }}>
              Our Gallery
            </h1>
            {isAdmin && (
              <button
                id="create-album-btn"
                onClick={() => setShowNewAlbum(true)}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                  border: 'none', borderRadius: 30,
                  color: '#fff', fontSize: 11,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: '0 4px 24px rgba(91,164,181,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(91,164,181,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(91,164,181,0.3)'; }}
              >
                ＋ New Album
              </button>
            )}
          </div>
          {albums.length > 0 && (
            <p className="font-sans-body" style={{
              color: 'rgba(214,232,238,0.5)', fontSize: 13,
              marginTop: 12, letterSpacing: '0.05em',
            }}>
              {albums.length} album{albums.length !== 1 ? 's' : ''} · {albums.reduce((n, a) => n + a.photos.length, 0)} photos
            </p>
          )}
        </div>

        {/* Grid */}
        {albums.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 6vw',
            color: 'rgba(255,255,255,0.25)',
            animation: 'fadeInUp 0.7s ease 0.2s both',
          }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.3 }}>📷</div>
            <p className="font-sans-body" style={{ fontSize: 14, letterSpacing: '0.1em' }}>
              {isAdmin ? 'No albums yet. Click "＋ New Album" to get started.' : 'No albums published yet. Check back soon.'}
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '3vw', padding: '0 6vw 100px',
          }}>
            {albums.map((album, i) => (
              <div
                key={album.id}
                className="album-card"
                style={{ animation: `fadeInUp 0.6s ease ${i * 0.08}s both`, cursor: 'pointer' }}
                onClick={() => { setSelectedAlbumId(album.id); setView('album-detail'); }}
              >
                {/* Cover */}
                <div style={{
                  aspectRatio: '4/3', overflow: 'hidden', borderRadius: 8,
                  position: 'relative',
                  background: album.photos.length > 0 ? 'transparent' : 'rgba(255,255,255,0.04)',
                  border: album.photos.length === 0 ? '1px dashed rgba(255,255,255,0.1)' : 'none',
                }}>
                  {album.photos.length > 0 ? (
                    <>
                      <img
                        className="album-cover"
                        src={album.photos[0].dataUrl}
                        alt={album.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', display: 'block' }}
                      />
                      {/* Multi-photo peek */}
                      {album.photos.length > 1 && (
                        <div style={{
                          position: 'absolute', bottom: 10, right: 10,
                          display: 'flex', gap: 4,
                        }}>
                          {album.photos.slice(1, 4).map((p) => (
                            <img key={p.id} src={p.dataUrl} alt=""
                              style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 3, border: '1.5px solid rgba(255,255,255,0.5)' }}
                            />
                          ))}
                          {album.photos.length > 4 && (
                            <div style={{
                              width: 32, height: 32, borderRadius: 3,
                              background: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(255,255,255,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 9, color: '#fff', letterSpacing: '0.05em',
                            }}>+{album.photos.length - 4}</div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      color: '#D6E8EE',
                    }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>🖼️</div>
                      <div className="font-sans-body" style={{ fontSize: 10, letterSpacing: '0.2em' }}>No photos yet</div>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div
                    className="album-overlay"
                    style={{
                      position: 'absolute', inset: 0,
                      background: 'radial-gradient(circle, rgba(91,164,181,0.06) 0%, transparent 70%)',
                      opacity: 0, transition: 'opacity 0.35s',
                      display: 'flex', alignItems: 'flex-end', padding: 20,
                    }}
                  >
                    <span className="font-sans-body" style={{ color: '#fff', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                      View Album →
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="font-serif-display" style={{
                      fontSize: 18, fontWeight: 400, color: '#fff',
                      margin: '0 0 4px', letterSpacing: '0.05em', textShadow,
                    }}>{album.name}</h3>
                    {album.description && (
                      <p className="font-sans-body" style={{
                        fontSize: 12, color: 'rgba(255,255,255,0.4)',
                        margin: 0, letterSpacing: '0.03em',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap', maxWidth: 220,
                      }}>{album.description}</p>
                    )}
                  </div>
                  <div className="font-sans-body" style={{
                    fontSize: 10, color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.15em', flexShrink: 0, marginLeft: 12,
                    paddingTop: 2,
                  }}>
                    {album.photos.length} photo{album.photos.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Admin: delete album from grid */}
                {isAdmin && (
                  <button
                    id={`delete-album-${album.id}`}
                    onClick={e => { e.stopPropagation(); deleteAlbum(album.id); }}
                    style={{
                      marginTop: 12, padding: '6px 14px',
                      background: 'rgba(255,60,60,0.07)',
                      border: '1px solid rgba(255,60,60,0.2)',
                      borderRadius: 20, color: 'rgba(255,100,100,0.7)',
                      fontSize: 10, letterSpacing: '0.15em',
                      textTransform: 'uppercase', cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.15)'; e.currentTarget.style.color = 'rgba(255,120,120,0.9)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.07)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
                  >
                    🗑 Delete Album
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {showNewAlbum && (
          <NewAlbumModal onSave={createAlbum} onClose={() => setShowNewAlbum(false)} />
        )}

        {lightbox && (
          <Lightbox photos={lightbox.photos} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
        )}
      </div>
    );
  }

  // ─── Album Detail View ──────────────────────────────────────────────────────

  if (!selectedAlbum) {
    setView('albums');
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 72, background: '#070d14', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes fadeInFast { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        .photo-thumb { transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s; }
        .photo-thumb:hover { transform: scale(1.03); box-shadow: 0 16px 48px rgba(0,0,0,0.6) !important; }
        .photo-delete-btn { opacity: 0; transition: opacity 0.2s; }
        .photo-thumb-wrap:hover .photo-delete-btn { opacity: 1 !important; }
        .drop-zone-active { border-color: #5BA4B5 !important; background: rgba(91,164,181,0.06) !important; }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ padding: '40px 6vw 0', animation: 'fadeInUp 0.5s ease' }}>
        <button
          id="album-detail-back"
          onClick={() => setView('albums')}
          className="font-sans-body"
          style={{
            background: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.4)', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#5BA4B5')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
        >
          ← All Albums
        </button>
      </div>

      {/* Album header */}
      <div style={{ padding: '28px 6vw 40px', animation: 'fadeInUp 0.5s ease 0.05s both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 className="font-serif-display" style={{
              fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 200,
              color: '#fff', margin: '0 0 8px', letterSpacing: '0.05em', textShadow,
            }}>
              {selectedAlbum.name}
            </h1>
            {selectedAlbum.description && (
              <p className="font-sans-body" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: 0, letterSpacing: '0.04em' }}>
                {selectedAlbum.description}
              </p>
            )}
            <p className="font-sans-body" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, margin: '8px 0 0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {selectedAlbum.photos.length} photo{selectedAlbum.photos.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {isAdmin && (
              <>
                <button
                  id="upload-photos-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '11px 24px',
                    background: 'linear-gradient(135deg, #5BA4B5, #EFBF04)',
                    border: 'none', borderRadius: 30,
                    color: '#fff', fontSize: 11,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    cursor: uploading ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    boxShadow: '0 4px 20px rgba(91,164,181,0.3)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    opacity: uploading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(91,164,181,0.45)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(91,164,181,0.3)'; }}
                >
                  {uploading ? 'Uploading…' : '↑ Upload Photos'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.heic,.heif,.avif,.tiff,.bmp,.svg"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => addPhotos(e.target.files, selectedAlbum.id)}
                />
                <button
                  id="delete-album-detail-btn"
                  onClick={() => deleteAlbum(selectedAlbum.id)}
                  style={{
                    padding: '11px 20px',
                    background: 'rgba(255,60,60,0.07)',
                    border: '1px solid rgba(255,60,60,0.2)',
                    borderRadius: 30, color: 'rgba(255,100,100,0.7)',
                    fontSize: 11, letterSpacing: '0.15em',
                    textTransform: 'uppercase', cursor: 'pointer',
                    fontFamily: 'inherit', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.15)'; e.currentTarget.style.color = 'rgba(255,120,120,0.9)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,60,60,0.07)'; e.currentTarget.style.color = 'rgba(255,100,100,0.7)'; }}
                >
                  🗑 Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Drop zone (admin, no photos) */}
      {isAdmin && selectedAlbum.photos.length === 0 && (
        <div
          style={{ padding: '0 6vw 60px', animation: 'fadeInUp 0.5s ease 0.1s both' }}
          onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={e => { e.preventDefault(); setIsDragOver(false); addPhotos(e.dataTransfer.files, selectedAlbum.id); }}
        >
          <div
            className={isDragOver ? 'drop-zone-active' : ''}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed rgba(255,255,255,0.12)',
              borderRadius: 16, padding: '80px 40px',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.25s',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>☁️</div>
            <p className="font-sans-body" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, margin: '0 0 6px', letterSpacing: '0.04em' }}>
              Drag &amp; drop photos here, or click to browse
            </p>
            <p className="font-sans-body" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: 0, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              JPG, PNG, WEBP, GIF, HEIC, TIFF, SVG, AVIF · MP4, MOV, AVI, WEBM
            </p>
          </div>
        </div>
      )}

      {/* Photo grid */}
      {selectedAlbum.photos.length > 0 && (
        <div style={{
          padding: '0 6vw 100px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '2vw',
        }}>
          {/* Admin upload tile */}
          {isAdmin && (
            <div
              id="add-more-photos-tile"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); addPhotos(e.dataTransfer.files, selectedAlbum.id); }}
              style={{
                aspectRatio: '1',
                border: isDragOver ? '2px dashed #5BA4B5' : '2px dashed rgba(255,255,255,0.1)',
                borderRadius: 8, cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'linear-gradient(135deg, rgba(91,164,181,0.05), rgba(239,191,4,0.05))',
                transition: 'all 0.25s',
                animation: 'fadeInUp 0.5s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!isDragOver) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; } }}
            >
              <div style={{ fontSize: 32, marginBottom: 10, opacity: 0.35 }}>＋</div>
              <div className="font-sans-body" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Add Photos
              </div>
            </div>
          )}

          {selectedAlbum.photos.map((photo, i) => (
            <div
              key={photo.id}
              className="photo-thumb-wrap"
              style={{
                position: 'relative', aspectRatio: '1',
                borderRadius: 8, overflow: 'hidden',
                animation: `fadeInUp 0.5s ease ${i * 0.04}s both`,
              }}
            >
              {photo.type === 'video' ? (
                <video
                  className="photo-thumb"
                  src={photo.dataUrl}
                  onClick={() => setLightbox({ photos: selectedAlbum.photos, index: i })}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', cursor: 'zoom-in',
                    display: 'block',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                  muted
                  playsInline
                  onMouseEnter={e => (e.currentTarget as HTMLVideoElement).play()}
                  onMouseLeave={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                />
              ) : (
                <img
                  className="photo-thumb"
                  src={photo.dataUrl}
                  alt={photo.name}
                  onClick={() => setLightbox({ photos: selectedAlbum.photos, index: i })}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', cursor: 'zoom-in',
                    display: 'block',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  }}
                  loading="lazy"
                />
              )}
              {isAdmin && (
                <button
                  className="photo-delete-btn"
                  id={`delete-photo-${photo.id}`}
                  onClick={e => { e.stopPropagation(); deletePhoto(selectedAlbum.id, photo.id); }}
                  style={{
                    position: 'absolute', top: 8, right: 8,
                    width: 30, height: 30, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', fontSize: 14, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,40,40,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.7)')}
                  title="Delete photo"
                >✕</button>
              )}
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <Lightbox photos={lightbox.photos} startIndex={lightbox.index} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
