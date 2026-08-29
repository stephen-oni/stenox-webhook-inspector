import React from 'react';
import { Layers, Server, Database, Lock, Code2, Cpu, Radio, Webhook, Activity } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* What the App is About & Its Uses */}
      <div className="bg-slate-800/80 border border-emerald-500/30 rounded-xl p-6 mb-8 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Webhook className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">About SteNox</h1>
            <p className="text-xs font-mono text-emerald-400">Enterprise Webhook Diagnostic Platform v2.4</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          SteNox is an automated 3-tier authenticated webhook inspector and request sink platform built for developers, system administrators, and infrastructure engineers. Its primary purpose is to solve the friction of testing, capturing, and debugging real-time API callbacks from external services without deploying code to production servers.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 p-4 rounded-lg border border-white/5">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
              <Radio className="w-4 h-4" />
              <span>Isolated Ingestion Sinks</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Provides every registered operator with a dedicated UUID-targeted collector URL (`/api/collect/:endpoint_id`) to instantly accept arbitrary HTTP methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).
            </p>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-lg border border-white/5">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs mb-1">
              <Activity className="w-4 h-4" />
              <span>Live Telemetry & Diagnostics</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Captures inbound headers, origin IPs, and raw JSON payloads in real-time, allowing engineers to audit HMAC signatures, check authorization tokens, and verify payload schemas instantly.
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-2">Infrastructure & Architecture</h2>
      <p className="text-slate-400 text-sm mb-6">
        The platform is engineered as a robust three-tier decoupled system, designed to provide secure, high-throughput webhook ingestion and diagnostic telemetry.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
          <Layers className="w-6 h-6 text-cyan-400 mb-2" />
          <h3 className="font-semibold text-white text-sm">Presentation Tier</h3>
          <p className="text-xs text-slate-400 mt-1">
            A high-performance React SPA compiled via multi-stage container builds and delivered globally through optimized Nginx reverse proxies.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
          <Server className="w-6 h-6 text-emerald-400 mb-2" />
          <h3 className="font-semibold text-white text-sm">Application Tier</h3>
          <p className="text-xs text-slate-400 mt-1">
            Asynchronous Python APIs handling session authorization, dynamic request capture, and payload processing with autonomous dependency gating.
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-lg">
          <Database className="w-6 h-6 text-amber-400 mb-2" />
          <h3 className="font-semibold text-white text-sm">Persistence Tier</h3>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise-grade relational databases bound to resilient cloud storage volumes, ensuring zero data loss during automated failovers.
          </p>
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-6 mb-8">
        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" /> Operational Security Standards
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          SteNox adheres to strict zero-trust networking principles. External client ingress is strictly limited to the presentation edge. Core Application and Persistence tiers communicate exclusively over isolated internal networks. Cold-start race conditions are eliminated via programmatic infrastructure health checks prior to traffic routing.
        </p>
      </div>

      {/* Author Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 rounded-lg p-6 shadow-glow-emerald">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Cloud & DevOps Engineer</h3>
            <p className="text-[11px] font-mono text-emerald-400">Stephen Oni</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          SteNox v2.4 is designed and built by Stephen Oni. Specializing in cloud infrastructure automation, container orchestration, and secure web architectures, the platform reflects a fusion of robust hardware-level systems design and modern cloud-native software engineering.
        </p>

        {/* Social Links */}
        <div className="flex items-center space-x-4 pt-3 border-t border-white/10 font-mono text-xs">
          <a
            href="https://github.com/stephen-oni"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-emerald-400 transition-colors"
          >
            GitHub Profile
          </a>
          <span className="text-slate-600">•</span>
          <a
            href="https://linkedin.com/in/stephen-omololu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-cyan-400 transition-colors"
          >
            LinkedIn Network
          </a>
        </div>
      </div>
    </div>
  );
}