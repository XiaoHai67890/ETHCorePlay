import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { CommandK } from './components/CommandK';
import { getLang, setLang, type Lang } from './services/i18n';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const LevelPage = lazy(() => import('./pages/LevelPage').then((m) => ({ default: m.LevelPage })));
const MapPage = lazy(() => import('./pages/MapPage').then((m) => ({ default: m.MapPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then((m) => ({ default: m.ProgressPage })));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage').then((m) => ({ default: m.CurriculumPage })));
const ZonePage = lazy(() => import('./pages/ZonePage').then((m) => ({ default: m.ZonePage })));
const PlotPage = lazy(() => import('./pages/PlotPage').then((m) => ({ default: m.PlotPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then((m) => ({ default: m.SearchPage })));

export function App() {
  const location = useLocation();
  const [themeMode] = useState<'system' | 'light' | 'dark'>(() => (localStorage.getItem('epq_theme_mode') as 'system' | 'light' | 'dark') || 'system');
  const [systemDark, setSystemDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [lang, setLangState] = useState<Lang>(() => getLang());
  const isMapArea = /^\/(map|zone|plot)(\/|$)/.test(location.pathname);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  useEffect(() => {
    const effectiveDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
    const mode = effectiveDark ? 'dark' : 'light';
    document.body.dataset.theme = mode;
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('epq_theme_mode', themeMode);
  }, [themeMode, systemDark]);

  return (
    <>
      <div className="mesh-bg" aria-hidden />
      <header className="topbar" role="banner">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">
              <Leaf size={24} strokeWidth={2.1} color="#4a8f61" />
            </span>
            <span className="brand-text">Ethereum Infinite Garden Quest</span>
          </Link>
          <nav className="topbar-nav" aria-label="主导航">
            <NavLink to="/map" className={isMapArea ? 'active' : ''}>
              {lang === 'zh' ? '地图' : 'Map'}
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => (isActive ? 'active' : '')}>
              {lang === 'zh' ? '总览' : 'Progress'}
            </NavLink>
            <NavLink to="/curriculum" className={({ isActive }) => (isActive ? 'active' : '')}>
              {lang === 'zh' ? '课程' : 'Curriculum'}
            </NavLink>
            <NavLink to="/glossary" className={({ isActive }) => (isActive ? 'active' : '')}>
              {lang === 'zh' ? '术语' : 'Glossary'}
            </NavLink>
            <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
              {lang === 'zh' ? '搜索' : 'Search'}
            </NavLink>
          </nav>
          <div className="topbar-actions">
            <button
              className={`lang-switch ${lang === 'en' ? 'is-en' : 'is-zh'}`}
              onClick={() => {
                const nextLang = lang === 'zh' ? 'en' : 'zh';
                setLangState(nextLang);
                setLang(nextLang);
              }}
              aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}
            >
              <span className="lang-switch-track">
                <span className="lang-switch-indicator" aria-hidden />
                <span className="lang-switch-label lang-switch-label-zh">中文</span>
                <span className="lang-switch-label lang-switch-label-en">EN</span>
              </span>
            </button>
          </div>
        </div>
      </header>
      <CommandK />
      <main id="main-content" role="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="container">
              <div className="card">加载中...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/level/:id" element={<LevelPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/curriculum" element={<CurriculumPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/zone/:zoneKey" element={<ZonePage />} />
            <Route path="/plot/:id" element={<PlotPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </>
  );
}
