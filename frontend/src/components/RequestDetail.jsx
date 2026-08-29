import React from 'react';
import { Trash2, Globe, FileCode } from 'lucide-react';

export default function RequestDetail({ request, onDelete }) {
  if (!request) {
    return (
      <div className="bg-slate-800/80 border border-slate-700 rounded-lg h-[650px] flex items-center justify-center text-slate-500 text-sm">
        Select a captured request from the sidebar to inspect payload and headers.
      </div>
    );
  }

  let formattedBody = request.body;
  try {
    const parsed = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
    formattedBody = JSON.stringify(parsed, null, 2);
  } catch (e) {
    // Leave as raw string if not valid JSON
  }

  let parsedHeaders = request.headers;
  try {
    if (typeof request.headers === 'string') {
      parsedHeaders = JSON.parse(request.headers);
    }
  } catch (e) {
    parsedHeaders = {};
  }

  return (
    <div className="bg-slate-800/80 border border-slate-700 rounded-lg h-[650px] flex flex-col overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-800">
        <div>
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            {request.http_method} Details
          </h3>
          <p className="text-xs text-slate-400">Captured at {new Date(request.created_at).toLocaleString()}</p>
        </div>
        <button
          onClick={() => onDelete(request.id)}
          className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900 px-3 py-1.5 rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 space-y-6 text-sm">
        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wider flex items-center gap-1">
            Request Headers
          </h4>
          <div className="bg-slate-900 rounded border border-slate-700 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2">Header Key</th>
                  <th className="p-2">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {Object.entries(parsedHeaders || {}).map(([k, v]) => (
                  <tr key={k}>
                    <td className="p-2 text-cyan-400 font-semibold">{k}</td>
                    <td className="p-2 break-all">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2 tracking-wider flex items-center gap-1">
            <FileCode className="w-4 h-4" /> Raw Payload Body
          </h4>
          <pre className="bg-slate-950 p-4 rounded border border-slate-700 font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap">
            {formattedBody || '// No payload body attached'}
          </pre>
        </div>
      </div>
    </div>
  );
}