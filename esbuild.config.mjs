import esbuild from 'esbuild';

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['node22'],
    outfile: 'dist/src/index.js',
    format: 'esm',
    sourcemap: true,
    external: [
        'express',
        'knex',
        'pg',
        'mysql',
        'fs',
        'path',
        'events', // <- key here
        'node:events',
        'node:path',
        'node:fs',
        'node:*',  // wildcard for any other node:* modules
        ...Object.keys(require('./package.json').dependencies)
    ],
    logLevel: 'info',
}).catch(() => process.exit(1));
