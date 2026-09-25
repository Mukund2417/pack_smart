import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Building, 
  Briefcase, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/AuthVisual';
import { TRANSLATIONS } from '../data/i18n';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const IS_GOOGLE_CONFIGURED = Boolean(GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes('mock-client-id'));

export default function Signup({ lang }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const signupT = t.signupPage || TRANSLATIONS.en.signupPage || {};

  const navigate = useNavigate();
  const { signup, googleLogin, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [userType, setUserType] = useState('Food Industry');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [googleNotice, setGoogleNotice] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !signupSuccess) {
      navigate('/recommendation', { replace: true });
    }
  }, [isAuthenticated, signupSuccess, navigate]);

  // Client-side real-time validation
  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = "Name is required.";
    }

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

    if (!confirmPassword) {
      errs.confirmPassword = "Confirm your password.";
    } else if (confirmPassword !== password) {
      errs.confirmPassword = "Passwords do not match.";
    }

    return errs;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setServerError('');
    setGoogleNotice('');

    // Map user type to canonical backend role
    let role = 'user';
    const utLower = userType.toLowerCase();
    if (utLower.includes('researcher')) role = 'researcher';
    else if (utLower.includes('startup') || utLower.includes('industry')) role = 'user';
    else if (utLower.includes('packaging')) role = 'researcher';

    try {
      await signup(name.trim(), email.trim(), password, role, organization.trim());
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/recommendation', { replace: true });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Signup failed. Please try again.');
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
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/recommendation', { replace: true });
      }, 700);
    } catch (err) {
      setServerError(err.message || 'Google signup failed on the server.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleNotice('Google sign-up was cancelled or encountered an error.');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center font-sans">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Interactive PackSmart Visual */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="hidden md:block lg:col-span-6 xl:col-span-7 h-full"
        >
          <AuthVisual />
        </motion.div>

        {/* RIGHT COLUMN: Signup Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-6 xl:col-span-5 w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Header / Titles */}
            <div className="mb-6">
              <span className="text-xs font-mono font-bold tracking-widest text-brand-green dark:text-emerald-400 uppercase">
                Get Started
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                Join PackSmart to engineer precision, food-safe packaging.
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
            {signupSuccess && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-bold">Account created! Preparing your workspace...</span>
              </motion.div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label 
                  htmlFor="signup-name"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (touched.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    onBlur={() => handleBlur('name')}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all outline-none ${
                      touched.name && errors.name
                        ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500 text-slate-900 dark:text-white'
                        : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                    }`}
                  />
                </div>
                {touched.name && errors.name && (
                  <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label 
                  htmlFor="signup-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-email"
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
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm transition-all outline-none ${
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

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label 
                    htmlFor="signup-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touched.password) setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      onBlur={() => handleBlur('password')}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-9 py-2 rounded-xl text-sm transition-all outline-none ${
                        touched.password && errors.password
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label 
                    htmlFor="signup-confirm-password"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1"
                  >
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (touched.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      onBlur={() => handleBlur('confirmPassword')}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-9 py-2 rounded-xl text-sm transition-all outline-none ${
                        touched.confirmPassword && errors.confirmPassword
                          ? 'bg-red-50/50 dark:bg-red-950/20 border-2 border-red-500 text-slate-900 dark:text-white'
                          : 'bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="text-[10px] font-medium text-red-500 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* User Type Dropdown */}
              <div>
                <label 
                  htmlFor="signup-usertype"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-500" /> User Type
                </label>
                <select
                  id="signup-usertype"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:border-amber-400 outline-none"
                >
                  <option value="Food Industry">Food Industry</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Startup">Startup</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Packaging Professional">Packaging Professional</option>
                  <option value="Student">Student</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Organization (Optional) */}
              <div>
                <label 
                  htmlFor="signup-organization"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5"
                >
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Organization <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="signup-organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Sahyadri Farms, Nestlé R&D, Independent"
                  className="w-full bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-900 dark:text-white text-sm focus:border-amber-400 outline-none"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting || signupSuccess}
                className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-md mt-2 flex items-center justify-center gap-2 ${
                  isSubmitting || signupSuccess
                    ? 'bg-brand-green/70 text-white cursor-not-allowed'
                    : 'bg-brand-green hover:bg-brand-green/90 text-white shadow-brand-green/20'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : signupSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Account Created</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Separator */}
            <div className="relative my-5">
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
                      text="signup_with"
                      shape="pill"
                      theme="filled_black"
                      width="100%"
                    />
                  </div>
                </GoogleOAuthProvider>
              ) : (
                <button
                  type="button"
                  onClick={() => setGoogleNotice("Google sign-in is not configured yet (client ID is unset). Please complete registration with the form above.")}
                  className="w-full py-2.5 px-4 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              )}
            </div>

            {/* Already have an account */}
            <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-0.5"
              >
                Sign in
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
