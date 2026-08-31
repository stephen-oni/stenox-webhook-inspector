import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage';
import InspectorPage from './pages/InspectorPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';

import './App.css';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/landing" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          <Route path="/inspector" element={<ProtectedRoute><InspectorPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}