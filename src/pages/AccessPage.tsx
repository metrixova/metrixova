import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export function AccessPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

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
          await updateProfile(userCredential.user, { displayName: name.trim() });
        }
      }

      setStatus('success');
      setTimeout(() => navigate('/dashboard'), 600);
    } catch (err: any) {
      setStatus('error');
      setError(err?.message || 'Unable to authenticate.');
    }
  };

  return (
    <main className="min-h-screen bg-metrix-bg text-metrix-white flex items-center justify-center px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-3xl border border-metrix-crimson-dark/50 bg-metrix-surface/80 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <p className="text-sm font-mono uppercase tracking-[0.3em] text-metrix-muted">Secure access</p>
          <h1 className="mt-3 text-3xl font-display">Continue to your dashboard</h1>
          <p className="mt-3 text-sm text-metrix-muted">
            Sign in here to enter the observability workspace.
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === 'login' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/40 text-metrix-muted hover:bg-metrix-bg/70'}`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${mode === 'signup' ? 'bg-metrix-crimson-bright text-white' : 'bg-metrix-bg/40 text-metrix-muted hover:bg-metrix-bg/70'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label htmlFor="accessName" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
                Full Name
              </label>
              <input
                id="accessName"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
              />
            </div>
          )}

          <div>
            <label htmlFor="accessEmail" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
              Email
            </label>
            <input
              id="accessEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              required
              className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
            />
          </div>

          <div>
            <label htmlFor="accessPassword" className="mb-1 block text-xs font-mono uppercase tracking-wider text-metrix-muted">
              Password
            </label>
            <input
              id="accessPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-xl border border-metrix-surface/70 bg-metrix-bg px-4 py-3 text-white placeholder:text-metrix-muted focus:border-metrix-crimson-bright focus:outline-none focus:ring-1 focus:ring-metrix-crimson-bright"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="mt-2 w-full rounded-xl bg-metrix-crimson-bright px-4 py-3 font-medium text-white transition-colors hover:bg-metrix-crimson disabled:opacity-70"
          >
            {status === 'loading' ? 'Working…' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
