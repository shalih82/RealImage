import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FluidBackground from './components/FluidBackground';
import Navigation from './components/Navigation';
import HeroField from './sections/HeroField';

import ImmersiveGallery from './sections/ImmersiveGallery';
import MediumsGlossary from './sections/MediumsGlossary';
import Footer from './sections/Footer';
import ProjectDetail from './pages/ProjectDetail';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import { getProjectById } from './config';
import { AdminProvider } from './hooks/useAdmin';
import { ServicesProvider } from './hooks/useServices';
import AdminLoginModal from './components/AdminLoginModal';
import GalleryPage from './pages/GalleryPage';
import MatrixTextRain from './components/MatrixTextRain';
import WhatsAppButton from './components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

type PageView = 'home' | 'services' | 'contact' | 'gallery' | 'about';

function AppInner() {
  const [fluidActive, setFluidActive] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<PageView>('home');
  const lenisRef = useRef<Lenis | null>(null);
  const savedScrollRef = useRef(0);
  const pendingScrollRef = useRef<number | null>(null);
  const selectedProject = selectedProjectId ? getProjectById(selectedProjectId) : null;

  // -- helpers --
  const navigateTo = (page: PageView) => {
    savedScrollRef.current = window.scrollY;
    pendingScrollRef.current = 0;
    setSelectedProjectId(null);
    setActivePage(page);
    window.scrollTo({ top: 0 });
  };

  const handleSelectProject = (id: string) => {
    savedScrollRef.current = window.scrollY;
    pendingScrollRef.current = 0;
    setSelectedProjectId(id);
    setActivePage('home');
  };

  const handleBack = () => {
    pendingScrollRef.current = savedScrollRef.current;
    setSelectedProjectId(null);
    setActivePage('home');
  };

  // -- scroll restore --
  useLayoutEffect(() => {
    if (pendingScrollRef.current === null) return;
    const target = pendingScrollRef.current;
    pendingScrollRef.current = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lenisRef.current?.resize();
        lenisRef.current?.scrollTo(target, { immediate: true, force: true });
      });
    });
  }, [selectedProjectId, activePage]);

  // -- lenis smooth scroll --
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.05 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); };
  }, []);

  // -- fluid background visibility --
  useEffect(() => {
    if (selectedProject || activePage !== 'home') return;
    const heroEl = document.getElementById('hero-section');
    const philEl = document.getElementById('philosophy');
    const galleryEl = document.getElementById('gallery');
    if (!heroEl || !philEl || !galleryEl) return;

    const visibility = { hero: true, phil: false, gallery: false };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === heroEl) visibility.hero = entry.isIntersecting;
          if (entry.target === philEl) visibility.phil = entry.isIntersecting;
          if (entry.target === galleryEl) visibility.gallery = entry.isIntersecting;
        });
        setFluidActive(visibility.hero || visibility.phil || visibility.gallery);
      },
      { threshold: 0.05 }
    );
    observer.observe(heroEl);
    observer.observe(philEl);
    observer.observe(galleryEl);
    return () => observer.disconnect();
  }, [selectedProject, activePage]);

  // -- project detail view --
  if (selectedProject) {
    return (
      <div style={{ position: 'relative' }}>
        <AdminLoginModal />
        <MatrixTextRain opacity={0.06} zIndex={0} />
        <FluidBackground isActive={true} />
        <ProjectDetail project={selectedProject} onBack={handleBack} />
        <WhatsAppButton />
      </div>
    );
  }

  // -- services page --
  if (activePage === 'services') {
    return (
      <div style={{ position: 'relative' }}>
        <AdminLoginModal />
        <MatrixTextRain opacity={0.04} zIndex={0} />
        <FluidBackground isActive={false} />
        <Navigation activePage={activePage} onNavigate={navigateTo} />
        <ServicesPage onBack={() => navigateTo('home')} onContact={() => navigateTo('contact')} />
        <WhatsAppButton />
      </div>
    );
  }

  // -- contact page --
  if (activePage === 'contact') {
    return (
      <div style={{ position: 'relative' }}>
        <AdminLoginModal />
        <MatrixTextRain opacity={0.04} zIndex={0} />
        <FluidBackground isActive={false} />
        <Navigation activePage={activePage} onNavigate={navigateTo} />
        <ContactPage onBack={() => navigateTo('home')} />
      </div>
    );
  }

  // -- gallery page --
  if (activePage === 'gallery') {
    return (
      <div style={{ position: 'relative' }}>
        <AdminLoginModal />
        <MatrixTextRain opacity={0.04} zIndex={0} />
        <FluidBackground isActive={false} />
        <Navigation activePage={activePage} onNavigate={navigateTo} />
        <GalleryPage onBack={() => navigateTo('home')} />
        <WhatsAppButton />
      </div>
    );
  }

  // -- about page --
  if (activePage === 'about') {
    return (
      <div style={{ position: 'relative' }}>
        <AdminLoginModal />
        <MatrixTextRain opacity={0.04} zIndex={0} />
        <FluidBackground isActive={false} />
        <Navigation activePage={activePage} onNavigate={navigateTo} />
        <AboutPage onBack={() => navigateTo('home')} />
        <WhatsAppButton />
      </div>
    );
  }

  // -- home --
  return (
    <div style={{ position: 'relative' }}>
      <AdminLoginModal />
      <MatrixTextRain opacity={0.1} zIndex={0} />
      <FluidBackground isActive={fluidActive} />
      <Navigation activePage={activePage} onNavigate={navigateTo} />

      <div id="hero-section" style={{ position: 'relative', zIndex: 1 }}>
        <HeroField onNavigateToGallery={() => navigateTo('gallery')} />
      </div>



      <div id="gallery" style={{ position: 'relative', zIndex: 3 }}>
        <ImmersiveGallery onSelect={handleSelectProject} />
      </div>

      <div style={{ position: 'relative', zIndex: 50 }}>
        <div id="mediums">
          <MediumsGlossary />
        </div>
        <div id="footer">
          <Footer />
        </div>
      </div>
      
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <AdminProvider>
      <ServicesProvider>
        <AppInner />
      </ServicesProvider>
    </AdminProvider>
  );
}

export default App;
