import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { getLang, setLang, type Lang } from './services/i18n';

const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LevelPage = lazy(() => import('./pages/LevelPage').then(m => ({ default: m.LevelPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const ProgressPage = lazy(() => import('./pages/ProgressPage').then(m => ({ default: m.ProgressPage })));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage').then(m => ({ default: m.GlossaryPage })));
const CurriculumPage = lazy(() => import('./pages/CurriculumPage').then(m => ({ default: m.CurriculumPage })));
const ZonePage = lazy(() => import('./pages/ZonePage').then(m => ({ default: m.ZonePage })));
const PlotPage = lazy(() => import('./pages/PlotPage').then(m => ({ default: m.PlotPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(m => ({ default: m.SearchPage })));

export function App() {
  const [themeMode] = useState<'system' | 'light' | 'dark'>(() => (localStorage.getItem('epq_theme_mode') as any) || 'system');
  const [systemDark, setSystemDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [lang, setLangState] = useState<Lang>(() => getLang());

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
      <a className="skip-link" href="#main-content">跳到主内容</a>
      <header className="topbar" role="banner">
        <div className="topbar-inner">
          <Link to="/" className="brand">🌿 Ethereum Infinite Garden Quest</Link>
          <nav aria-label="主导航">
            <Link to="/map">{lang==='zh'?'地图':'Map'}</Link>
            <Link to="/progress">{lang==='zh'?'总览':'Progress'}</Link>
            <Link to="/curriculum">{lang==='zh'?'课程':'Curriculum'}</Link>
            <Link to="/glossary">{lang==='zh'?'术语':'Glossary'}</Link>
            <Link to="/search">{lang==='zh'?'搜索':'Search'}</Link>
            <button className="btn btn-ghost" onClick={() => { const n = lang==='zh'?'en':'zh'; setLangState(n); setLang(n); }}>{lang==='zh'?'EN':'中'}</button>
          </nav>
        </div>
      </header>
      <main id="main-content" role="main" tabIndex={-1}>
      <Suspense fallback={<div className="container"><div className="card">加载中...</div></div>}><Routes>
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
      </Routes></Suspense>
      </main>
    </>
  );
}
