#!/usr/bin/env node

import { spawn, spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));

if (args.has('--help') || args.has('-h')) {
  process.stdout.write(
    [
      'Usage:',
      '  node scripts/dev.mjs            Start API + Web dev servers',
      '  node scripts/dev.mjs --api-only Start only the API dev server',
      '  node scripts/dev.mjs --web-only Start only the Web dev server',
      '  node scripts/dev.mjs --no-migrate Skip running Prisma migrations',
      '',
      'Notes:',
      '  - API runs on http://localhost:3000',
      '  - Web runs on http://localhost:4200',
    ].join('\n') + '\n',
  );
  process.exit(0);
}

const children = new Set();
let shuttingDown = false;

function prefixStream(stream, label) {
  let buffer = '';

  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buffer += chunk;
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      process.stdout.write(`[${label}] ${line}\n`);
    }
  });
  stream.on('end', () => {
    if (buffer) process.stdout.write(`[${label}] ${buffer}\n`);
  });
}

function startProcess(label, command, args) {
  const child = spawn(command, args, {
    stdio: ['inherit', 'pipe', 'pipe'],
    detached: process.platform !== 'win32',
  });

  children.add(child);
  prefixStream(child.stdout, label);
  prefixStream(child.stderr, label);

  child.on('exit', (code, signal) => {
    children.delete(child);

    if (shuttingDown) return;

    shuttingDown = true;
    const reason = signal ? `signal ${signal}` : `exit code ${code ?? 0}`;
    process.stderr.write(`[${label}] exited (${reason}), stopping other processes...\n`);
    shutdown();
    process.exitCode = code ?? 0;
  });

  return child;
}

function shutdown() {
  for (const child of children) {
    try {
      if (process.platform !== 'win32' && child.pid) {
        process.kill(-child.pid, 'SIGTERM');
      } else if (child.pid) {
        process.kill(child.pid, 'SIGTERM');
      }
    } catch {
      // ignore
    }
  }
}

process.on('SIGINT', () => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.stderr.write('[dev] received SIGINT, shutting down...\n');
  shutdown();
});

process.on('SIGTERM', () => {
  if (shuttingDown) return;
  shuttingDown = true;
  process.stderr.write('[dev] received SIGTERM, shutting down...\n');
  shutdown();
});

if (!args.has('--web-only') && !args.has('--no-migrate')) {
  const result = spawnSync('npm', ['-C', 'apps/api', 'run', 'db:migrate'], {
    stdio: 'inherit',
  });

  if (result.error) {
    process.stderr.write(`[dev] migrate failed: ${result.error.message}\n`);
    process.exit(1);
  }

  if (result.status && result.status !== 0) {
    process.exit(result.status);
  }
}

if (!args.has('--web-only')) {
  startProcess('api', 'npm', ['-C', 'apps/api', 'run', 'dev']);
}

if (!args.has('--api-only')) {
  startProcess('web', 'npm', ['-C', 'apps/web', 'run', 'start']);
}
