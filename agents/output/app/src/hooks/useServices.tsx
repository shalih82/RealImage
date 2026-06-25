import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { servicesPageConfig } from '../config';
import type { ServiceItem } from '../config';

// ─── localStorage key ────────────────────────────────────────────────────────
const STORAGE_KEY = 'ri_services_data';

interface ServicesContextValue {
  services: ServiceItem[];
  addService: (service: ServiceItem) => void;
  updateService: (index: number, service: ServiceItem) => void;
  deleteService: (index: number) => void;
  reorderService: (fromIndex: number, toIndex: number) => void;
  resetToDefaults: () => void;
}

const ServicesContext = createContext<ServicesContextValue | null>(null);

function loadServices(): ServiceItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* fall through */ }
  return servicesPageConfig.services;
}

function saveServices(services: ServiceItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceItem[]>(loadServices);

  const addService = useCallback((service: ServiceItem) => {
    setServices((prev) => {
      const next = [...prev, service];
      saveServices(next);
      return next;
    });
  }, []);

  const updateService = useCallback((index: number, service: ServiceItem) => {
    setServices((prev) => {
      const next = [...prev];
      next[index] = service;
      saveServices(next);
      return next;
    });
  }, []);

  const deleteService = useCallback((index: number) => {
    setServices((prev) => {
      const next = prev.filter((_, i) => i !== index);
      saveServices(next);
      return next;
    });
  }, []);

  const reorderService = useCallback((fromIndex: number, toIndex: number) => {
    setServices((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      saveServices(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    const defaults = servicesPageConfig.services;
    setServices(defaults);
    saveServices(defaults);
  }, []);

  return (
    <ServicesContext.Provider value={{ services, addService, updateService, deleteService, reorderService, resetToDefaults }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error('useServices must be used inside ServicesProvider');
  return ctx;
}
