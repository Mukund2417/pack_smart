import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import LandingNav from './components/LandingNav';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import GetRecommendation from './pages/GetRecommendation';
import MaterialDatabase from './pages/MaterialDatabase';
import ShelfLifePredictor from './pages/ShelfLifePredictor';
import MapAdvisor from './pages/MapAdvisor';
import SustainabilityAnalyzer from './pages/SustainabilityAnalyzer';
import QrTraceability from './pages/QrTraceability';
import ReportsHistory from './pages/ReportsHistory';
import KnowledgeBase from './pages/KnowledgeBase';
import LaunchChecklist from './pages/LaunchChecklist';
import UserAccount from './pages/UserAccount';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPanel from './pages/AdminPanel';
import VerifyDossier from './pages/VerifyDossier';

function AppContent() {
  const [lang, setLang] = useState(() => {
    return typeof localStorage !== 'undefined' && localStorage.getItem('packsmart_lang')
      ? localStorage.getItem('packsmart_lang')
      : 'en';
  });

  const handleSetLang = (newLang) => {
    setLang(newLang);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('packsmart_lang', newLang);
    }
  };

  return (
    <div className="relative min-h-screen bg-brand-bg dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-black font-sans transition-colors duration-300 flex flex-col justify-between">
      {/* Global Header Navigation */}
      <LandingNav lang={lang} setLang={handleSetLang} />

      {/* Main Dynamic Route Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home lang={lang} setLang={handleSetLang} />} />
          <Route path="/about" element={<About lang={lang} />} />
          <Route path="/login" element={<Login lang={lang} />} />
          <Route path="/signup" element={<Signup lang={lang} />} />
          <Route path="/verify/:dossierId" element={<VerifyDossier lang={lang} />} />

          {/* Protected Application Features */}
          <Route path="/recommendation" element={<ProtectedRoute><GetRecommendation lang={lang} /></ProtectedRoute>} />
          <Route path="/database" element={<ProtectedRoute><MaterialDatabase lang={lang} /></ProtectedRoute>} />
          <Route path="/shelf-life" element={<ProtectedRoute><ShelfLifePredictor lang={lang} /></ProtectedRoute>} />
          <Route path="/map-advisor" element={<ProtectedRoute><MapAdvisor lang={lang} /></ProtectedRoute>} />
          <Route path="/sustainability" element={<ProtectedRoute><SustainabilityAnalyzer lang={lang} /></ProtectedRoute>} />
          <Route path="/qr-traceability" element={<ProtectedRoute><QrTraceability lang={lang} /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><ReportsHistory lang={lang} /></ProtectedRoute>} />
          <Route path="/knowledge-base" element={<ProtectedRoute><KnowledgeBase lang={lang} /></ProtectedRoute>} />
          <Route path="/launch-checklist" element={<ProtectedRoute><LaunchChecklist lang={lang} /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><UserAccount lang={lang} /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel lang={lang} /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Global Footer */}
      <Footer lang={lang} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
