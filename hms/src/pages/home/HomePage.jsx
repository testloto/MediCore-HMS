/**
 * HomePage — orchestrator only.
 * Above-the-fold: NavBar, Ticker, Hero, StatsBar load immediately.
 * Below-the-fold: Departments, Doctors, WhyUs, Testimonials, CTA, Footer
 *   are lazy-loaded and rendered only when they scroll into view (IntersectionObserver).
 */
import React, { lazy, Suspense, useRef, useState, useEffect, memo, useCallback } from 'react';

// ── Above the fold — eager ──────────────────────────────────────────
import NavBar             from './sections/NavBar';
import AnnouncementTicker from './sections/AnnouncementTicker';
import HeroSection        from './sections/HeroSection';
import StatsBar           from './sections/StatsBar';

// ── Below the fold — lazy (each is its own chunk) ───────────────────
const DepartmentsSection  = lazy(() => import('./sections/DepartmentsSection'));
const DoctorsSection      = lazy(() => import('./sections/DoctorsSection'));
const WhyUsSection        = lazy(() => import('./sections/WhyUsSection'));
const TestimonialsSection = lazy(() => import('./sections/TestimonialsSection'));
const CTASection          = lazy(() => import('./sections/CTASection'));
const FooterSection       = lazy(() => import('./sections/FooterSection'));

// ── Thin placeholder shown until a section enters viewport ──────────
const SectionPlaceholder = memo(({ height = 400 }) => (
  <div style={{ height, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: '#18ae94', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
));
SectionPlaceholder.displayName = 'SectionPlaceholder';

// ── Lazy section wrapper — only renders children when in view ────────
function LazySection({ children, height = 400, rootMargin = '200px' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [visible, rootMargin]);

  return (
    <div ref={ref}>
      {visible
        ? <Suspense fallback={<SectionPlaceholder height={height} />}>{children}</Suspense>
        : <SectionPlaceholder height={height} />
      }
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────
export default function HomePage({ onLogin, onRegister }) {
  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── ABOVE FOLD — loads immediately, no lazy ── */}
      <NavBar onLogin={onLogin} onRegister={onRegister} />
      <AnnouncementTicker />
      <HeroSection onLogin={onLogin} onRegister={onRegister} />
      <StatsBar />

      {/* ── BELOW FOLD — lazy loaded as user scrolls ── */}
      <LazySection height={520}>
        <DepartmentsSection />
      </LazySection>

      <LazySection height={480}>
        <DoctorsSection onRegister={onRegister} />
      </LazySection>

      <LazySection height={500}>
        <WhyUsSection />
      </LazySection>

      <LazySection height={380}>
        <TestimonialsSection />
      </LazySection>

      <LazySection height={320}>
        <CTASection onLogin={onLogin} onRegister={onRegister} />
      </LazySection>

      <LazySection height={360}>
        <FooterSection />
      </LazySection>
    </div>
  );
}
