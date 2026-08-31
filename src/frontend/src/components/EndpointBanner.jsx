import React, { useState } from 'react';
import { Copy, Check, Link2 } from 'lucide-react';

export default function EndpointBanner({ endpointId }) {
  const [copied, setCopied] = useState(false);
  const collectorUrl = `${window.location.origin}/api/collect/${endpointId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(collectorUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-6">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="p-2 bg-cyan-950 text-cyan-400 rounded-md">
          <Link2 className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Your Collector Endpoint URL</p>
          <p className="text-sm font-mono text-cyan-300 truncate">{collectorUrl}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        {copied ? 'Copied to Clipboard' : 'Copy Endpoint'}
      </button>
    </div>
  );
}