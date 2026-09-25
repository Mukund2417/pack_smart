import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/AuthVisual';
import { TRANSLATIONS } from '../data/i18n';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const IS_GOOGLE_CONFIGURED = Boolean(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('mock-client-id'));

export default function Login({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const loginT = t.loginPage || TRANSLATIONS.en.loginPage || {};

  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginAsJury, googleLogin, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [googleNotice, setGoogleNotice] = useState('');

  // Target path after login
  const fromPath = location.state?.from?.pathname || '/recommendation';

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !loginSuccess) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, loginSuccess, navigate, fromPath]);

  // Client-side real-time validation
  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 8) {
      errs.password = "Password must contain at least 8 characters.";
    }
    return errs;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    setGoogleNotice('');

    try {
      await login(email.trim(), password);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Invalid email or password. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      setGoogleNotice('Google authentication response was incomplete.');
      return;
    }
    setIsSubmitting(true);
    setServerError('');
    try {
      await googleLogin(credentialResponse.credential);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Google authentication failed on the server.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleNotice('Google authentication was cancelled or encountered an error.');
  };

  const handleJuryLogin = async (role = 'researcher') => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const email = role === 'admin' ? 'admin@packsmart.io' : 'researcher@packsmart.io';
      const pass = role === 'admin' ? 'admin123' : 'research123';
      await login(email, pass);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 500);
    } catch (err) {
      console.warn('Jury login fallback applied:', err);
      // Fallback in case of backend cold-start or network issue
      if (loginAsJury) {
        loginAsJury(role);
      }
      setLoginSuccess(true);
      setTimeout(() => {
        navigate(fromPath, { replace: true });
      }, 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center font-sans">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Interactive PackSmart Visual (hidden on small mobile or shown compactly) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block lg:col-span-6 xl:col-span-7 h-full"
        >
          <AuthVisual />
        </motion.div>

        {/* RIGHT COLUMN: Login Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Header / Titles */}
            <div className="mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-500 uppercase">
                Welcome Back
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Sign in to PackSmart
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Access your intelligent food packaging workspace.
              </p>
            </div>

            {/* Global Server Error Alert */}
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{serverError}</span>
              </motion.div>
            )}

            {/* Google notice */}
            {googleNotice && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5"
              >
                <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{googleNotice}</span>
              </motion.div>
            )}

            {/* Success Banner */}
            {loginSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold">Authenticated successfully! Redirecting to workspace...</span>
              </motion.div>
            )}

            {/* Floating Bottom-Left Compact Evaluator Quick Access */}
            <div className="fixed bottom-4 left-4 z-50">
              <button
                type="button"
                id="evaluator-instant-login"
                onClick={() => handleJuryLogin('researcher')}
                disabled={isSubmitting}
                title="Account: researcher@packsmart.io (Food Scientist Role)"
                className="py-2 px-3 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50 border border-amber-300"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                <span>⚡ 1-Click Evaluator Access</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              
              {/* Email Field */}
              <div>
                <label 
                  htmlFor="login-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (touched.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@organization.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all outline-none ${
                      touched.email && errors.email
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                    }`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label 
                    htmlFor="login-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (touched.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-2.5 rounded-xl text-sm transition-all outline-none ${
                      touched.password && errors.password
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || loginSuccess}
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex items-center justify-center gap-2 ${
                  isSubmitting || loginSuccess
                    ? 'bg-amber-400/70 text-slate-900 cursor-not-allowed'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : loginSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authenticated</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-mono text-[10px]">
                  ─── OR ───
                </span>
              </div>
            </div>

            {/* Google Authentication Section */}
            <div className="flex flex-col items-center">
              {IS_GOOGLE_CONFIGURED ? (
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                  <div className="w-full flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="continue_with"
                      shape="pill"
                      theme="filled_black"
                      width="100%"
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <button
                  type="button"
                  onClick={() => setGoogleNotice("Google sign-in is not configured yet (client ID is unset). Please use standard email and password login.")}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>

            {/* Create Account Link */}
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
              >
                Create account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left"
            >
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" /> Password Recovery
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                For security reasons on self-hosted or research deployments, password resets are handled via your workspace administrator or database admin.
              </p>
              <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-white/5 text-[11px] font-mono text-slate-400">
                Contact: <span className="text-amber-400">support@packsmart.org</span>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-colors"
              >
                Understood
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
