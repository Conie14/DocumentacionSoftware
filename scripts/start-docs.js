/**
 * start-docs.js — Launcher de Docusaurus para PM2 en Windows
 *
 * PM2 en Windows detecta automáticamente Node.js para archivos .js
 * (sin necesidad de especificar interpreter).
 * Usamos process.execPath para obtener la ruta absoluta al node.exe
 * y evitar problemas de resolución de PATH en el servidor.
 */

'use strict';

const { spawn } = require('child_process');
const path     = require('path');

const projectRoot   = path.resolve(__dirname, '..');
const docusaurusBin = path.join(
  projectRoot,
  'node_modules',
  '@docusaurus',
  'core',
  'bin',
  'docusaurus.mjs'
);

console.log('[docs] Iniciando servidor Docusaurus...');
console.log('[docs] node    :', process.execPath);
console.log('[docs] script  :', docusaurusBin);
console.log('[docs] cwd     :', projectRoot);
console.log('[docs] puerto  : 3020');

const child = spawn(
  process.execPath,          // ruta absoluta al node.exe que usa PM2
  [docusaurusBin, 'serve', '--port', '3020', '--host', '0.0.0.0'],
  {
    cwd:   projectRoot,
    stdio: 'inherit',        // PM2 captura stdout/stderr en sus logs
    env:   { ...process.env, NODE_ENV: 'production' },
  }
);

child.on('error', (err) => {
  console.error('[docs] Error al iniciar el proceso:', err.message);
  process.exit(1);
});

child.on('exit', (code, signal) => {
  console.log(`[docs] Proceso terminado — código: ${code}, señal: ${signal}`);
  process.exit(code ?? 0);
});
