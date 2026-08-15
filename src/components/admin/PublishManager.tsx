import React, { useState, useEffect, useRef } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  GitBranch,
  GitCommit,
  UploadCloud,
  Terminal,
  RefreshCw,
  Eye,
  FileCheck
} from 'lucide-react';
import { adminFetch } from '../../lib/admin/api-client';
import { logger } from '../../lib/utils/logger';

interface BuildData {
  status: 'idle' | 'building' | 'success' | 'failed';
  startedAt: string | null;
  completedAt: string | null;
  durationMs: number | null;
  exitCode: number | null;
  logs: string[];
  distStats: {
    filesCount: number;
    totalSizeBytes: number;
  } | null;
}

interface DiagnosticCheck {
  category: 'config' | 'content' | 'build' | 'seo';
  title: string;
  status: 'pass' | 'warning' | 'error';
  message: string;
}

interface DiagnosticsData {
  score: number;
  readiness: string;
  checks: DiagnosticCheck[];
}

interface GitData {
  branch: string;
  isClean: boolean;
  changedFiles: { status: string; path: string }[];
  lastCommit: string;
  hasRemote: boolean;
}

export const PublishManager: React.FC = () => {
  const [buildData, setBuildData] = useState<BuildData | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [gitData, setGitData] = useState<GitData | null>(null);
  const [commitMessage, setCommitMessage] = useState('Update content via Antler Admin');
  const [pushToRemote, setPushToRemote] = useState(true);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const logConsoleRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    loadAll();
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // Auto-scroll logs when logs update
  useEffect(() => {
    if (logConsoleRef.current) {
      logConsoleRef.current.scrollTop = logConsoleRef.current.scrollHeight;
    }
  }, [buildData?.logs]);

  const loadAll = async () => {
    await Promise.all([fetchBuildStatus(), fetchDiagnostics(), fetchGitStatus()]);
  };

  const fetchBuildStatus = async () => {
    try {
      const res = await adminFetch('/publish/build');
      const data = await res.json();
      if (data.success) {
        setBuildData(data.data);
        setIsBuilding(data.data.status === 'building');
      }
    } catch (err) {
      logger.error('Failed to fetch build status:', err);
    }
  };

  const fetchDiagnostics = async () => {
    try {
      const res = await adminFetch('/publish/diagnostics');
      const data = await res.json();
      if (data.success) {
        setDiagnostics(data.data);
      }
    } catch (err) {
      logger.error('Failed to fetch diagnostics:', err);
    }
  };

  const fetchGitStatus = async () => {
    try {
      const res = await adminFetch('/publish/git');
      const data = await res.json();
      if (data.success) {
        setGitData(data.data);
      }
    } catch (err) {
      logger.error('Failed to fetch git status:', err);
    }
  };

  const startStaticBuild = async () => {
    setIsBuilding(true);
    setFeedback(null);

    try {
      const res = await adminFetch('/publish/build', { method: 'POST' });
      const data = await res.json();
      if (!data.success) {
        setFeedback({ type: 'error', message: data.error || 'Failed to start build' });
        setIsBuilding(false);
        return;
      }

      // Start polling build logs every 800ms
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = window.setInterval(async () => {
        const statusRes = await adminFetch('/publish/build');
        const statusData = await statusRes.json();
        if (statusData.success) {
          setBuildData(statusData.data);
          if (statusData.data.status !== 'building') {
            setIsBuilding(false);
            if (pollingRef.current) clearInterval(pollingRef.current);
            fetchDiagnostics();
            fetchGitStatus();
          }
        }
      }, 800);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Build request failed' });
      setIsBuilding(false);
    }
  };

  const handleGitCommit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;

    setIsCommitting(true);
    setFeedback(null);

    try {
      const res = await adminFetch('/publish/git', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage, push: pushToRemote })
      });
      const data = await res.json();

      if (data.success) {
        setFeedback({
          type: 'success',
          message: `Changes committed successfully! ${pushToRemote ? 'Pushed to remote.' : ''}`
        });
        setCommitMessage('Update content via Antler Admin');
        fetchGitStatus();
      } else {
        setFeedback({ type: 'error', message: data.error || 'Git operation failed' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Git commit error' });
    } finally {
      setIsCommitting(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-7 h-7 text-primary" />
            Publish & Deployment Center
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Build your static site, inspect live build logs, and deploy changes to production.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadAll}
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh All"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={startStaticBuild}
            disabled={isBuilding}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white shadow-md transition-all ${
              isBuilding
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isBuilding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Building Static Site...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Build Static Site</span>
              </>
            )}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Top Row: Diagnostics & Git Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pre-Deploy Readiness Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Pre-Deploy Readiness Audit</h3>
            </div>
            {diagnostics && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  diagnostics.score >= 90
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                }`}
              >
                {diagnostics.readiness} ({diagnostics.score}%)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {diagnostics?.checks.map((check, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
              >
                {check.status === 'pass' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                )}
                {check.status === 'warning' && (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                {check.status === 'error' && (
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{check.title}</div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{check.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Git Summary & Deploy Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <GitBranch className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Git Version Control</h3>
            </div>

            <div className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Current Branch:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">
                  {gitData?.branch || 'main'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Working Tree:</span>
                <span className={`font-semibold ${gitData?.isClean ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {gitData?.isClean ? 'Clean (No changes)' : `${gitData?.changedFiles.length} file(s) modified`}
                </span>
              </div>
              <div className="truncate pt-1 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 block mb-0.5">Last Commit:</span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                  {gitData?.lastCommit || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleGitCommit} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
            <input
              type="text"
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Commit message..."
              disabled={gitData?.isClean || isCommitting}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary disabled:opacity-50"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pushToRemote}
                  onChange={(e) => setPushToRemote(e.target.checked)}
                  disabled={gitData?.isClean || isCommitting}
                  className="rounded text-primary focus:ring-primary text-xs"
                />
                <span>Push to Remote</span>
              </label>

              <button
                type="submit"
                disabled={gitData?.isClean || isCommitting}
                className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>{isCommitting ? 'Committing...' : 'Commit & Push'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Build Terminal Logs Console */}
      <div className="bg-slate-950 text-slate-200 rounded-xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-300">Static Build Output Terminal</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {buildData?.status === 'building' && (
              <span className="flex items-center gap-1 text-amber-400 font-mono animate-pulse">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                Building...
              </span>
            )}
            {buildData?.status === 'success' && (
              <span className="flex items-center gap-1 text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Success ({((buildData.durationMs || 0) / 1000).toFixed(1)}s)
              </span>
            )}
            {buildData?.status === 'failed' && (
              <span className="flex items-center gap-1 text-red-400 font-mono">
                <XCircle className="w-3.5 h-3.5" />
                Failed (Exit {buildData.exitCode})
              </span>
            )}

            {buildData?.distStats && (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                {buildData.distStats.filesCount} static files
              </span>
            )}
          </div>
        </div>

        {/* Terminal Log Screen */}
        <div
          ref={logConsoleRef}
          className="bg-slate-900/90 rounded-lg p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto space-y-1 select-text admin-scrollbar border border-slate-800/80"
        >
          {buildData?.logs && buildData.logs.length > 0 ? (
            buildData.logs.map((log, i) => (
              <div key={i} className="leading-relaxed whitespace-pre-wrap">
                {log}
              </div>
            ))
          ) : (
            <div className="text-slate-600 italic py-8 text-center">
              No build logs available. Click "Build Static Site" above to run a production build.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishManager;
