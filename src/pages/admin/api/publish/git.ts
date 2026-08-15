import type { APIRoute } from 'astro';
import { execSync } from 'child_process';

interface ChangedFile {
  status: string;
  path: string;
}

function runGit(cmd: string): string {
  try {
    return execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' }).trim();
  } catch (err: any) {
    return '';
  }
}

export const GET: APIRoute = async () => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ success: false, error: 'Local development only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const branch = runGit('git branch --show-current') || 'main';
    const statusRaw = runGit('git status --porcelain');
    const lastCommit = runGit('git log -1 --pretty=format:"%h - %s (%cr)"') || 'No commits yet';
    const remotes = runGit('git remote');

    const changedFiles: ChangedFile[] = [];
    if (statusRaw) {
      statusRaw.split(/\r?\n/).forEach((line) => {
        if (line.trim()) {
          const status = line.substring(0, 2).trim();
          const filePath = line.substring(3).trim();
          changedFiles.push({ status, path: filePath });
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        branch,
        isClean: changedFiles.length === 0,
        changedFiles,
        lastCommit,
        hasRemote: remotes.length > 0
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to inspect git repository'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  if (!import.meta.env.DEV && process.env.NODE_ENV !== 'test') {
    return new Response(JSON.stringify({ success: false, error: 'Local development only' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const message = (body?.message || 'Update content via Antler Admin').trim();
    const shouldPush = Boolean(body?.push);

    // Stage all changes
    execSync('git add .', { cwd: process.cwd() });

    // Commit
    const commitOutput = execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
      cwd: process.cwd(),
      encoding: 'utf-8'
    }).trim();

    let pushOutput = '';
    if (shouldPush) {
      try {
        pushOutput = execSync('git push', { cwd: process.cwd(), encoding: 'utf-8' }).trim();
      } catch (pushErr: any) {
        pushOutput = pushErr.message || 'Push failed';
      }
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        commit: commitOutput,
        pushed: shouldPush,
        pushOutput
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to commit changes'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
