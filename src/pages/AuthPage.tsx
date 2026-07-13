import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { Loader2, ArrowLeft } from 'lucide-react';
import { auth, googleProvider } from '../firebase';

const logoSvg = new URL('../assets/logo.svg', import.meta.url).href;

type AuthMode = 'login' | 'signup';

export function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(location.pathname === '/signup' ? 'signup' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    const nextMode = location.pathname === '/signup' ? 'signup' : 'login';
    setMode(nextMode);
    setEmail('');
    setPassword('');
    setName('');
    setStatus('idle');
    setError('');
  }, [location.pathname]);

  const handleModeChange = (nextMode: AuthMode) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('redirect', redirectPath);
    setSearchParams(nextParams, { replace: true });
    navigate(nextMode === 'signup' ? `/signup?redirect=${encodeURIComponent(redirectPath)}` : `/login?redirect=${encodeURIComponent(redirectPath)}`, { replace: true });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, { displayName: name.trim() });
        }
      }

      setStatus('success');
      setTimeout(() => {
        navigate(redirectPath || '/access', { replace: true });
      }, 600);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Unable to authenticate.');
    }
  };

  const handleGoogleAuth = async () => {
    setStatus('loading');
    setError('');

    try {
      await signInWithPopup(auth, googleProvider);
      setStatus('success');
      setTimeout(() => {
        navigate(redirectPath || '/access', { replace: true });
      }, 600);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  return (
    <main className="min-h-screen bg-metrix-bg px-6 py-16 text-metrix-white md:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-stretch">
        <div className="flex-1 rounded-[2rem] border border-metrix-crimson-dark/40 bg-metrix-surface/80 p-8 shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between gap-3">
            <img src={logoSvg} alt="Metrixova logo" className="h-12 sm:h-14 w-auto object-contain" />
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-metrix-muted transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Metrixova access</p>
            <h1 className="mt-3 text-3xl font-display text-white sm:text-4xl">
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-7 text-metrix-muted">
              {mode === 'login'
                ? 'Sign in to continue to the dashboard and keep your observability workspace connected.'
                : 'Register for a workspace and unlock your observability experience.'}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-2 rounded-full border border-metrix-crimson-dark/30 bg-metrix-bg/70 p-1.5">
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-metrix-crimson-bright text-white' : 'text-metrix-muted hover:text-white'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('signup')}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-metrix-crimson-bright text-white' : 'text-metrix-muted hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="authName" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
                  Full Name
                </label>
                <input
                  id="authName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
                />
              </div>
            )}

            <div>
              <label htmlFor="authEmail" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
                Email
              </label>
              <input
                id="authEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
              />
            </div>

            <div>
              <label htmlFor="authPassword" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
                Password
              </label>
              <input
                id="authPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-2 flex w-full items-center justify-center rounded-xl bg-metrix-crimson-bright px-4 py-3 font-medium text-white transition-colors hover:bg-metrix-crimson disabled:opacity-70"
            >
              {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-metrix-crimson-dark/20" />
            <span className="text-xs uppercase tracking-wider text-metrix-muted">Or</span>
            <div className="h-px flex-1 bg-metrix-crimson-dark/20" />
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={status === 'loading'}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 font-medium text-white transition-colors hover:border-metrix-crimson-bright disabled:opacity-70"
          >
            {status === 'loading' ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <>
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
              </>
            )}
          </button>
        </div>

        <div className="flex-1 rounded-[2rem] border border-metrix-crimson-dark/30 bg-gradient-to-br from-metrix-surface/90 to-metrix-bg/80 p-8 shadow-2xl shadow-black/20">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Why teams choose Metrixova</p>
          <ul className="mt-8 space-y-4 text-sm leading-7 text-metrix-light">
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Real-time anomaly detection and high-signal incident summaries.</li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Unified observability across infrastructure, apps, and services.</li>
            <li className="rounded-2xl border border-white/10 bg-white/5 p-4">Seamless onboarding for teams that need fast operational clarity.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
