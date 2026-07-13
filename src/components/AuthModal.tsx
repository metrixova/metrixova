import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

type AuthModalProps = {
  isOpen: boolean;
  initialMode?: 'login' | 'signup';
  redirectPath?: string;
  onClose: () => void;
};

export function AuthModal({ isOpen, initialMode = 'login', redirectPath = '/dashboard', onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    setMode(initialMode);
    setEmail('');
    setPassword('');
    setName('');
    setStatus('idle');
    setError('');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: name.trim(),
          });
        }
      }

      setStatus('success');
      setTimeout(() => {
        onClose();
        navigate(redirectPath || '/access');
      }, 600);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Unable to authenticate.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-metrix-bg/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-lg bg-metrix-surface border border-metrix-crimson-dark rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-metrix-crimson-dark via-metrix-crimson-bright to-metrix-crimson-dark" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-metrix-muted hover:text-metrix-white transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-display text-white mb-2">
                  {mode === 'login' ? 'Sign in to your dashboard' : 'Create your Metrixova account'}
                </h2>
                <p className="text-sm text-metrix-muted">
                  {mode === 'login'
                    ? 'Enter your email and password to continue.'
                    : 'Register and start monitoring your observability pipeline.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'login' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/50 text-metrix-muted hover:bg-metrix-bg'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/50 text-metrix-muted hover:bg-metrix-bg'}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="authName" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                      Full Name
                    </label>
                    <input
                      id="authName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="authEmail" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    id="authEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                  />
                </div>

                <div>
                  <label htmlFor="authPassword" className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    Password
                  </label>
                  <input
                    id="authPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-metrix-bg border border-metrix-surface/70 rounded-xl px-4 py-3 text-white placeholder:text-metrix-muted focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full mt-2 rounded-xl bg-metrix-crimson-bright px-4 py-3 text-white font-medium hover:bg-metrix-crimson transition-colors disabled:opacity-70"
                >
                  {status === 'loading'
                    ? 'Working…'
                    : mode === 'login'
                    ? 'Log In'
                    : 'Sign Up'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
