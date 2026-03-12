import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Map, BookOpen, BookMarked, BarChart3, Leaf, Search } from 'lucide-react';
import { type ReactNode } from 'react';
import { HomePage } from './pages/HomePage';
import { LevelPage } from './pages/LevelPage';
import { MapPage } from './pages/MapPage';
import { ProgressPage } from './pages/ProgressPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { ZonePage } from './pages/ZonePage';
import { PlotPage } from './pages/PlotPage';
import { SearchPage } from './pages/SearchPage';

function PageShell({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

export function App() {
  const location = useLocation();
  const isPath = (prefix: string) => location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="brand">
            <Leaf size={24} color="#4a8f61" />
            ETHCorePlay
          </Link>
          <nav>
            <Link to="/map" className={isPath('/map') || isPath('/zone') || isPath('/plot') ? 'active' : ''}>
              <Map size={18} /> 地图
            </Link>
            <Link to="/progress" className={isPath('/progress') ? 'active' : ''}>
              <BarChart3 size={18} /> 总览
            </Link>
            <Link to="/curriculum" className={isPath('/curriculum') ? 'active' : ''}>
              <BookOpen size={18} /> 课程
            </Link>
            <Link to="/glossary" className={isPath('/glossary') ? 'active' : ''}>
              <BookMarked size={18} /> 术语
            </Link>
            <Link to="/search" className={isPath('/search') ? 'active' : ''}>
              <Search size={18} /> 搜索
            </Link>
          </nav>
        </div>
      </header>
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageShell><HomePage /></PageShell>} />
          <Route path="/map" element={<PageShell><MapPage /></PageShell>} />
          <Route path="/level/:id" element={<PageShell><LevelPage /></PageShell>} />
          <Route path="/progress" element={<PageShell><ProgressPage /></PageShell>} />
          <Route path="/curriculum" element={<PageShell><CurriculumPage /></PageShell>} />
          <Route path="/glossary" element={<PageShell><GlossaryPage /></PageShell>} />
          <Route path="/zone/:zoneKey" element={<PageShell><ZonePage /></PageShell>} />
          <Route path="/plot/:id" element={<PageShell><PlotPage /></PageShell>} />
          <Route path="/search" element={<PageShell><SearchPage /></PageShell>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
