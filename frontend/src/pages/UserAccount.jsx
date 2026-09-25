import React, { useState } from 'react';
import { User, KeyRound, Mail, Building, Shield, CheckCircle2, LogOut } from 'lucide-react';
import { api } from '../api/client';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789-mock-client-id.apps.googleusercontent.com';

export default function UserAccount({ lang, initialMode }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user'); // 'guest', 'user', 'researcher', 'admin'
  const [organization, setOrganization] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('packsmart_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      let res;
      if (mode === 'login') {
        res = await api.login(email, password);
      } else {
        res = await api.signup(name, email, password, role, organization);
      }
      localStorage.setItem('packsmart_token', res.access_token);
      localStorage.setItem('packsmart_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      setFeedback({ type: 'success', message: `Welcome, ${res.user.name}!` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('packsmart_token');
    localStorage.removeItem('packsmart_user');
    setCurrentUser(null);
    setFeedback({ type: 'info', message: 'You have been signed out.' });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await api.googleLogin(credentialResponse.credential);
      localStorage.setItem('packsmart_token', res.access_token);
      localStorage.setItem('packsmart_user', JSON.stringify(res.user));
      setCurrentUser(res.user);
      setFeedback({ type: 'success', message: `Welcome, ${res.user.name} (via Google)!` });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Google Authentication failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setFeedback({ type: 'error', message: 'Google Sign In was unsuccessful. Try again.' });
  };

  return (
    <div className="pt-24 pb-32 min-h-screen px-4 md:px-8 max-w-4xl mx-auto">
      <div className="mb-8 border-b border-white/10 pb-6 text-center">
        <h1 className="text-3xl font-bold text-white font-serif flex items-center justify-center gap-3">
          <User className="w-8 h-8 text-amber-400" />
          {currentUser ? 'User Profile & Identity' : 'Packaging Scientist & Farmer Auth Portal'}
        </h1>
        <p className="text-slate-400 mt-1">
          Role-Based Access Control (RBAC) granting research tools, export capabilities, and custom commodity models.
        </p>
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-2xl text-xs font-mono flex items-center gap-2 ${
          feedback.type === 'error'
            ? 'bg-red-950/40 border border-red-500/30 text-red-300'
            : 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {feedback.message}
        </div>
      )}

      {currentUser ? (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 text-2xl font-bold font-serif">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
                <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono text-xs uppercase font-bold">
              {currentUser.role}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <span className="text-slate-500 block uppercase text-[10px]">Organization</span>
              <span className="text-slate-200 font-bold text-sm mt-1 block">
                {currentUser.organization || 'Independent Operator'}
              </span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <span className="text-slate-500 block uppercase text-[10px]">Security Clearance</span>
              <span className="text-emerald-400 font-bold text-sm mt-1 block">
                Full API & Model Access
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold font-mono flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl max-w-md mx-auto shadow-2xl space-y-6">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Persona / Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                  >
                    <option value="user">Farmer / Agri-Entrepreneur</option>
                    <option value="researcher">Packaging Scientist / Researcher</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Organization / Farm</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Sahyadri Agro Farms"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-slate-950/70 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-yellow-300 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-[0_0_15px_rgba(251,191,36,0.3)] mt-2"
            >
              {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In to Portal' : 'Register Account')}
            </button>
            
            <div className="mt-6 flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-wider">Or continue with</div>
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  shape="circle"
                />
              </GoogleOAuthProvider>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
