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
        'mysql',
        'pg',
        'pg-query-stream',
        'better-sqlite3',
        'sqlite3',
        'oracledb',
        'tedious',
    ],
    logLevel: 'info',
}).catch(() => process.exit(1));
