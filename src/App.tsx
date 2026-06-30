import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, setPersistence, browserSessionPersistence, type User } from 'firebase/auth';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { DashboardNavbar } from './components/DashboardNavbar';
import { AuthModal } from './components/AuthModal';
import { FooterSection } from './components/FooterSection';
import { EarlyAccessModal } from './components/EarlyAccessModal';
import { Landing } from './pages/Landing';
import { AccessPage } from './pages/AccessPage';
import { Dashboard } from './pages/Dashboard';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';

function ProtectedRoute({ currentUser, onRequireAuth, children }: { currentUser: User | null; onRequireAuth: (path: string) => void; children: React.ReactNode; }) {
  useEffect(() => {
    if (!currentUser) {
      onRequireAuth('/dashboard');
    }
  }, [currentUser, onRequireAuth]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-metrix-bg text-white px-6">
        <div className="max-w-xl text-center">
          <p className="text-lg font-medium">You must sign in to access the dashboard.</p>
          <p className="mt-3 text-metrix-muted">A sign in prompt is being opened now.</p>
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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRedirectPath, setAuthRedirectPath] = useState('/dashboard');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  const handleOpenAuthModal = (redirectPath = '/access', initialMode: 'login' | 'signup' = 'login') => {
    setAuthRedirectPath(redirectPath);
    setAuthModalMode(initialMode);
    setAuthModalOpen(true);
  };
  const handleCloseAuthModal = () => setAuthModalOpen(false);

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
    <BrowserRouter>
      <ScrollToTop />
      <div className={`min-h-screen bg-transparent text-metrix-white selection:bg-metrix-crimson-bright selection:text-white ${theme === 'light' ? 'theme-light' : 'theme-dark'}`}>
        <Routes>
          <Route path="/" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthModal('/access', 'login')} /><Landing onOpenModal={handleOpenModal} /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/access" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthModal('/access', 'login')} /><AccessPage /></>} />
          <Route path="/Product" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthModal('/access', 'login')} /><AccessPage /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute currentUser={currentUser} onRequireAuth={handleOpenAuthModal}>
                <>
                  <DashboardNavbar />
                  <Dashboard theme={theme} setTheme={setTheme} />
                </>
              </ProtectedRoute>
            }
          />
          <Route path="/privacy" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthModal('/access', 'login')} /><Privacy /><FooterSection onOpenModal={handleOpenModal} /></>} />
          <Route path="/terms" element={<><Navbar onOpenModal={handleOpenModal} theme={theme} onToggleTheme={toggleTheme} currentUser={currentUser} onRequireAuth={() => handleOpenAuthModal('/access', 'login')} /><Terms /><FooterSection onOpenModal={handleOpenModal} /></>} />
        </Routes>

        <EarlyAccessModal isOpen={isModalOpen} onClose={handleCloseModal} />
        <AuthModal isOpen={authModalOpen} initialMode={authModalMode} redirectPath={authRedirectPath} onClose={handleCloseAuthModal} />
      </div>
    </BrowserRouter>);

}