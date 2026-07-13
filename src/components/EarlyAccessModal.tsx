import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export function EarlyAccessModal({
  isOpen,
  onClose
}: {isOpen: boolean;onClose: () => void;}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setEmail('');
      setName('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleGoogleSignIn = async () => {
    setStatus('loading');
    try {
      await signInWithPopup(auth, googleProvider);
      setStatus('success');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setStatus('idle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="absolute inset-0 bg-metrix-bg/80 backdrop-blur-sm" />
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="relative w-full max-w-md bg-metrix-surface border border-metrix-crimson-dark rounded-xl shadow-2xl overflow-hidden">
          
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-metrix-crimson-dark via-metrix-crimson-bright to-metrix-crimson-dark" />

            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-metrix-muted hover:text-metrix-white transition-colors"
            aria-label="Close modal">
            
              <X size={20} />
            </button>

            <div className="p-8">
              {status === 'success' ?
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="text-center py-8">
              
                  <div className="w-16 h-16 bg-metrix-crimson-dark/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-metrix-crimson-bright w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-display text-metrix-white mb-2">
                    You're on the list
                  </h2>
                  <p className="text-metrix-muted">
                    We'll notify you when your workspace is ready for
                    deployment.
                  </p>
                  <button
                onClick={onClose}
                className="mt-8 w-full py-3 px-4 bg-metrix-surface border border-metrix-crimson-dark text-metrix-white rounded hover:bg-metrix-bg transition-colors font-medium">
                
                    Close
                  </button>
                </motion.div> :

            <>
                  <h2
                id="modal-title"
                className="text-2xl font-display text-metrix-white mb-2">
                
                    Request Early Access
                  </h2>
                  <p className="text-metrix-muted mb-8 text-sm">
                    Join the waitlist for enterprise-grade AI observability.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                    htmlFor="name"
                    className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    
                        Full Name
                      </label>
                      <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted/50 focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all"
                    placeholder="Your Name" />
                  
                    </div>
                    <div>
                      <label
                    htmlFor="email"
                    className="block text-xs font-mono text-metrix-muted mb-1 uppercase tracking-wider">
                    
                        Work Email
                      </label>
                      <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 rounded px-4 py-3 text-metrix-white placeholder:text-metrix-muted/50 focus:outline-none focus:border-metrix-crimson-bright focus:ring-1 focus:ring-metrix-crimson-bright transition-all"
                    placeholder="you@example.com" />
                  
                    </div>
                    <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full mt-6 bg-metrix-crimson-bright hover:bg-metrix-crimson text-metrix-white py-3 px-4 rounded font-medium transition-colors flex items-center justify-center disabled:opacity-70">
                  
                      {status === 'loading' ?
                  <Loader2 className="w-5 h-5 animate-spin" /> :

                  'Request Access'
                  }
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-6">
                    <div className="flex-1 h-px bg-metrix-crimson-dark/20" />
                    <span className="text-xs text-metrix-muted uppercase tracking-wider">Or</span>
                    <div className="flex-1 h-px bg-metrix-crimson-dark/20" />
                  </div>

                  {/* Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={status === 'loading'}
                    className="w-full bg-metrix-bg border border-metrix-crimson-dark/50 hover:border-metrix-crimson-bright text-metrix-white py-3 px-4 rounded font-medium transition-colors flex items-center justify-center gap-3 disabled:opacity-70">
                    {status === 'loading' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                      </>
                    )}
                  </button>
                </>
            }
            </div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}