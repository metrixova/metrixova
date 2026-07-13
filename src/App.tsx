import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, setPersistence, browserSessionPersistence, type User } from 'firebase/auth';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
// DashboardNavbar removed — top nav is handled inside the dashboard UI now
import { FooterSection } from './components/FooterSection';
import { EarlyAccessModal } from './components/EarlyAccessModal';
import { CookieBanner } from './components/CookieBanner';
import { Landing } from './pages/Landing';
import { AccessPage } from './pages/AccessPage';
import { Dashboard } from './pages/Dashboard';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { AboutPage } from './pages/About';
import { AuthPage } from './pages/AuthPage';

function ProtectedRoute({ currentUser, onRequireAuth, children }: { currentUser: User | null; onRequireAuth: (path: string) => void; children: React.ReactNode; }) {
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-metrix-bg text-white px-6">
        <div className="max-w-xl text-center">
          <p className="text-lg font-medium">You must sign in to access the dashboard.</p>
          <p className="mt-3 text-metrix-muted">Click the button below to open the sign-in page in a new tab.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => onRequireAuth('/dashboard')}
              className="inline-flex items-center justify-center rounded-full bg-metrix-crimson-bright px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-metrix-crimson"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  const handleOpenAuthPage = (redirectPath = '/access', initialMode: 'login' | 'signup' = 'login') => {
    const targetPath = initialMode === 'signup' ? '/signup' : '/login';
    window.open(`${window.location.origin}/#${targetPath}?redirect=${encodeURIComponent(redirectPath)}`, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence).catch(() => undefined);

    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsubscribe;
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className={`min-h-screen bg-transparent text-metrix-white selection:bg-metrix-crimson-bright selection:text-white ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
        <Routes>
          <Route path="/" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthPage('/access', 'login')} /><Landing onOpenModal={handleOpenModal} /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/access" element={<><AccessPage onOpenModal={handleOpenModal} /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/about" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthPage('/access', 'login')} /><AboutPage /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/Product" element={<Navigate to="/access" replace />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute currentUser={currentUser} onRequireAuth={(path) => handleOpenAuthPage(path, 'login')}>
                <Dashboard theme={theme} setTheme={setTheme} currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/privacy" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthPage('/access', 'login')} /><Privacy /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/terms" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthPage('/access', 'login')} /><Terms /><FooterSection onOpenModal={handleOpenModal} /></>} />
        </Routes>

        <CookieBanner />
        <EarlyAccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
      </div>
    </HashRouter>);

}