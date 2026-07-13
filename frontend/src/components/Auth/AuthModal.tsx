import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { X, Loader2 } from 'lucide-react';
import LumiLogo from '../Logo/LumiLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  hideCloseButton?: boolean;
}

export default function AuthModal({ isOpen, onClose, hideCloseButton = false }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google');
      setLoading(false);
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
            onClick={hideCloseButton ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl glass border border-lumi-border/50 shadow-2xl bg-lumi-bg-secondary/90"
          >
            {/* Close button */}
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-lumi-text-muted hover:bg-white/5 hover:text-lumi-text transition-colors"
              >
                <X size={20} />
              </button>
            )}

            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="mb-4">
                  <LumiLogo size={80} isVisible={true} />
                </div>
                <h2 className="text-2xl font-semibold text-lumi-text tracking-tight">
                  Welcome to Lumi
                </h2>
                <p className="text-sm text-lumi-text-muted mt-2">
                  Sign in to seamlessly save your chat history and preferences.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {error && (
                  <div className="rounded-xl bg-lumi-error/10 border border-lumi-error/20 p-3 text-sm text-lumi-error text-center">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white text-black py-3.5 px-4 text-[15px] font-semibold shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
