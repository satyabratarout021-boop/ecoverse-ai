import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { EcoMapPage } from './pages/EcoMapPage';
import { SmartSathiPage } from './pages/SmartSathiPage';
import { EcoMindPage } from './pages/EcoMindPage';
import { JalRakshakPage } from './pages/JalRakshakPage';
import { EnergyGuardPage } from './pages/EnergyGuardPage';
import { EcoAIPage } from './pages/EcoAIPage';
import { AdminPortalPage } from './pages/AdminPortalPage';
import { StaffPortalPage } from './pages/StaffPortalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

import { Bot, X, Sparkles } from 'lucide-react';

export const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Floating Mini EcoAI Widget state
  const [floatingChatOpen, setFloatingChatOpen] = useState(false);

  // Hide floating widget if already on /ecoai page
  const isEcoAIPage = location.pathname === '/ecoai';

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map-3d" element={<EcoMapPage />} />
          <Route path="/smartsathi" element={<SmartSathiPage />} />
          <Route path="/ecomind" element={<EcoMindPage />} />
          <Route path="/jalrakshak" element={<JalRakshakPage />} />
          <Route path="/energyguard" element={<EnergyGuardPage />} />
          <Route path="/ecoai" element={<EcoAIPage />} />
          <Route path="/admin" element={<AdminPortalPage />} />
          <Route path="/staff" element={<StaffPortalPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      {/* Floating EcoAI Action Button */}
      {!isEcoAIPage && (
        <div className="fixed bottom-6 right-6 z-40">
          <Link
            to="/ecoai"
            className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 border border-emerald-400/40"
            title="Ask EcoAI Civic Assistant"
          >
            <Bot className="w-4 h-4 text-white animate-bounce" />
            <span className="hidden sm:inline">Ask EcoAI</span>
          </Link>
        </div>
      )}

      {location.pathname !== '/map-3d' && <Footer />}
    </div>
  );
};
