import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Copy, Check, Trash2, RefreshCw, Radio, Terminal, Database } from 'lucide-react';
import RequestList from '../components/RequestList';
import RequestDetail from '../components/RequestDetail';
import { getRequests, clearRequests } from '../services/api';
import { authService } from '../services/auth';

export default function InspectorPage({ user: propUser }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return propUser || authService.getUser() || JSON.parse(localStorage.getItem('stenox_user') || 'null');
  });

  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (propUser) {
      setCurrentUser(propUser);
    } else {
      const stored = authService.getUser() || JSON.parse(localStorage.getItem('stenox_user') || 'null');
      setCurrentUser(stored);
    }
  }, [propUser]);

  const endpointId = currentUser?.endpoint_id;

  const endpointUrl = useMemo(() => {
    if (!endpointId) return '';
    return `${window.location.protocol}//${window.location.hostname}:8000/api/collect/${endpointId}`;
  }, [endpointId]);

  const fetchLogs = useCallback(async () => {
    if (!endpointId) return;
    setRefreshing(true);
    try {
      const res = await getRequests(endpointId);
      setRequests(res.data);
      if (res.data.length > 0 && !selectedId) {
        setSelectedId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to query logs', err);
    } finally {
      setRefreshing(false);
    }
  }, [endpointId, selectedId]);

  useEffect(() => {
    if (!endpointId) return;
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [endpointId, fetchLogs]);

  const handleCopy = () => {
    if (!endpointUrl) return;
    navigator.clipboard.writeText(endpointUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearAll = async () => {
    if (!endpointId) return;
    if (!confirm('Purge all captured requests?')) return;
    try {
      await clearRequests(endpointId);
      setRequests([]);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedRequest = requests.find((r) => r.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner: Endpoint Target URL Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 mb-1">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>LIVE INGESTION TARGET</span>
            </div>
            <p className="text-xs text-slate-400">Send webhooks or HTTP calls (POST, GET, PUT) directly to this address:</p>
            <div className="mt-2 flex items-center space-x-2">
              <code className="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-white/10 text-cyan-300 font-mono text-xs sm:text-sm select-all">
                {endpointUrl || 'Generating endpoint URL...'}
              </code>
              <button
                onClick={handleCopy}
                disabled={!endpointUrl}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center space-x-1.5 disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end lg:self-center">
            <button
              onClick={fetchLogs}
              disabled={refreshing || !endpointId}
              className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleClearAll}
              disabled={requests.length === 0 || !endpointId}
              className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs text-red-400 transition-all flex items-center space-x-1.5 disabled:opacity-40"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Stream</span>
            </button>
          </div>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Request Feed (4 cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-slate-300 font-bold tracking-wider">EVENT FEED</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
              {requests.length} Captured
            </span>
          </div>

          <RequestList
            requests={requests}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        {/* Right: Request Inspector (8 cols) */}
        <div className="lg:col-span-8 glass-panel rounded-2xl p-5">
          {selectedRequest ? (
            <RequestDetail
              request={selectedRequest}
              onDeleted={() => {
                fetchLogs();
                setSelectedId(null);
              }}
            />
          ) : (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-white/5 mx-auto flex items-center justify-center text-slate-500">
                <Database className="w-6 h-6" />
              </div>
              <p className="text-sm text-slate-300 font-medium">Awaiting incoming webhooks</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Send a sample POST or GET payload to your target endpoint above. It will display in the event feed automatically.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}