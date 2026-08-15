import type { APIRoute } from 'astro';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

interface BuildState {
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

// In-memory state holding the latest build execution
const globalBuildState: BuildState = {
  status: 'idle',
  startedAt: null,
  completedAt: null,
  durationMs: null,
  exitCode: null,
  logs: [],
  distStats: null
};

function calculateDirStats(dirPath: string): { filesCount: number; totalSizeBytes: number } {
  let filesCount = 0;
  let totalSizeBytes = 0;

  if (!fs.existsSync(dirPath)) {
    return { filesCount: 0, totalSizeBytes: 0 };
  }

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        filesCount++;
        totalSizeBytes += stat.size;
      }
    }
  }

  walk(dirPath);
  return { filesCount, totalSizeBytes };
}

export const GET: APIRoute = async () => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ success: false, error: 'Local development only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    data: globalBuildState
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async () => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ success: false, error: 'Local development only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (globalBuildState.status === 'building') {
    return new Response(JSON.stringify({
      success: false,
      error: 'A static build is already in progress'
    }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const startTime = Date.now();
  globalBuildState.status = 'building';
  globalBuildState.startedAt = new Date().toISOString();
  globalBuildState.completedAt = null;
  globalBuildState.durationMs = null;
  globalBuildState.exitCode = null;
  globalBuildState.logs = [`[${new Date().toLocaleTimeString()}] Starting static production build (astro build)...`];
  globalBuildState.distStats = null;

  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'cmd.exe' : 'npm';
  const args = isWin ? ['/c', 'npm.cmd', 'run', 'build'] : ['run', 'build'];

  const proc = spawn(cmd, args, {
    cwd: process.cwd(),
    env: { ...process.env, FORCE_COLOR: 'true' }
  });

  proc.stdout?.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    globalBuildState.logs.push(...lines);
  });

  proc.stderr?.on('data', (data) => {
    const lines = data.toString().split(/\r?\n/).filter(Boolean);
    globalBuildState.logs.push(...lines);
  });

  proc.on('close', (code) => {
    const endTime = Date.now();
    globalBuildState.completedAt = new Date().toISOString();
    globalBuildState.durationMs = endTime - startTime;
    globalBuildState.exitCode = code;
    globalBuildState.status = code === 0 ? 'success' : 'failed';

    if (code === 0) {
      const distPath = path.resolve('dist');
      globalBuildState.distStats = calculateDirStats(distPath);
      globalBuildState.logs.push(`[${new Date().toLocaleTimeString()}] Static build completed successfully in ${((endTime - startTime) / 1000).toFixed(1)}s! (${globalBuildState.distStats.filesCount} files generated)`);
    } else {
      globalBuildState.logs.push(`[${new Date().toLocaleTimeString()}] Build failed with exit code ${code}`);
    }
  });

  return new Response(JSON.stringify({
    success: true,
    message: 'Static build initiated',
    data: globalBuildState
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
