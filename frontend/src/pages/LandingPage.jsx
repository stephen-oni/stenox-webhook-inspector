import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Server, Radio } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-65px)] ambient-glow py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-5xl mx-auto w-full">

        {/* Hero Section */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Telemetry & Webhook Ingestion Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            Diagnose Webhooks in <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Real-Time High Fidelity
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Inspect live JSON payloads, parse custom HTTP headers, trace latency, and debug webhooks with microsecond precision.
          </p>

          <div className="pt-4 flex justify-center">
            <button
              onClick={() => navigate('/inspector')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-glow-emerald hover:brightness-110 transition-all flex items-center space-x-2"
            >
              <span>Launch Ingestion Workspace</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

        {/* 3 Metric / Feature Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Instant Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accept incoming HTTP POST, PUT, and GET payloads. View raw data formats instantly without manual polling.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-cyan-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Isolated Endpoint</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every user receives an isolated, hardened UUID target path guaranteeing clean segregation of payloads.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl hover:border-teal-500/30 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-white font-semibold text-base mb-1">Header & Signature Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extract and inspect HMAC signatures, User-Agents, and authorization tokens with full visual syntax highlighting.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}