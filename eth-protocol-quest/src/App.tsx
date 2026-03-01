import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { MapPage } from './pages/MapPage';
import { ProgressPage } from './pages/ProgressPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { CurriculumPage } from './pages/CurriculumPage';

export function App() {
  const [themeMode] = useState<'system' | 'light' | 'dark'>(() => (localStorage.getItem('epq_theme_mode') as any) || 'system');
  const [systemDark, setSystemDark] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.('change', fn);
    return () => mq.removeEventListener?.('change', fn);
  }, []);

  useEffect(() => {
    const effectiveDark = themeMode === 'system' ? systemDark : themeMode === 'dark';
    document.body.dataset.theme = effectiveDark ? 'dark' : 'light';
    localStorage.setItem('epq_theme_mode', themeMode);
  }, [themeMode, systemDark]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">🌿 Ethereum Infinite Garden Quest</Link>
          <nav>
            <Link to="/map">地图</Link>
            <Link to="/progress">总览</Link>
            <Link to="/curriculum">课程</Link>
            <Link to="/glossary">术语</Link>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/level/:id" element={<LevelPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/curriculum" element={<CurriculumPage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
