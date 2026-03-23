import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RoadmapPage from './pages/RoadmapPage';
import LessonPage from './pages/LessonPage';

function AppContent() {
  const location = useLocation();
  const isLessonPage = location.pathname.includes('/lesson/');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className={`app-container ${isLessonPage ? 'fixed-layout' : ''}`}>
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/role/:roleId" element={<RoadmapPage sidebarOpen={sidebarOpen} />} />
        <Route path="/role/:roleId/lesson/:lessonId" element={<LessonPage sidebarOpen={sidebarOpen} />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
