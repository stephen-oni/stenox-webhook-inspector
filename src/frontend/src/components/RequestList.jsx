import React from 'react';
import { RefreshCw, Trash2, Clock } from 'lucide-react';

export default function RequestList({ requests, selectedId, onSelect, onClearAll, onRefresh, loading }) {
  const getMethodBadge = (method) => {
    const colors = {
      POST: 'bg-emerald-950 text-emerald-400 border-emerald-800',
      GET: 'bg-sky-950 text-sky-400 border-sky-800',
      PUT: 'bg-amber-950 text-amber-400 border-amber-800',
      DELETE: 'bg-rose-950 text-rose-400 border-rose-800',
    };
    return colors[method] || 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-lg flex flex-col h-[650px]">
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
          Caught Requests ({requests.length})
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition-colors"
            title="Refresh list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onClearAll}
            className="p-1.5 hover:bg-rose-900/50 rounded text-rose-400 transition-colors"
            title="Clear all requests"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-slate-700/60">
        {requests.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-sm flex flex-col items-center">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <span>No requests caught yet. Trigger your endpoint URL.</span>
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelect(req.id)}
              className={`p-3 cursor-pointer transition-colors ${
                selectedId === req.id ? 'bg-slate-700/80 border-l-4 border-cyan-400' : 'hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-0.5 rounded border font-mono font-semibold ${getMethodBadge(req.http_method)}`}>
                  {req.http_method}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(req.created_at).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono truncate">{req.remote_ip}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}