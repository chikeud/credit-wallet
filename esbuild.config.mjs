import esbuild from 'esbuild';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: false, // <- ✅ Don't bundle
    platform: 'node',
    target: ['node22'],
    outdir: 'dist/src/index.cjs', // <- if you want all files, not a single outfile
    format: 'cjs',
    sourcemap: true,
    logLevel: 'info',
}).catch(() => process.exit(1));
