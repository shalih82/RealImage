import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Change this password to whatever you want ────────────────────────────────
const ADMIN_PASSWORD = 'Igris2005';
const SESSION_KEY = 'ri_admin_session';

interface AdminContextValue {
  isAdmin: boolean;
  showLoginModal: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  tryLogin: (pw: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(
    () => sessionStorage.getItem(SESSION_KEY) === '1'
  );
  const [showLoginModal, setShowLoginModal] = useState(false);

  const openLogin = useCallback(() => setShowLoginModal(true), []);
  const closeLogin = useCallback(() => setShowLoginModal(false), []);

  const tryLogin = useCallback((pw: string): boolean => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setIsAdmin(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, showLoginModal, openLogin, closeLogin, tryLogin, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider');
  return ctx;
}
