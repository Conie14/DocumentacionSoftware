/**
 * PM2 Ecosystem — Sistema de Recetas (Docusaurus)
 *
 * Flujo de despliegue:
 *   pnpm install          ← instala + aplica parches automáticamente
 *   pnpm build            ← compila el sitio estático en /build
 *   pm2 start ecosystem.config.js ← sirve los archivos estáticos
 *
 * Puerto: 3020 (configurable via env PORT)
 *
 * Ruta en servidor: C:\ProyectosGE\DocumentacionSoftware
 */

// Mismo patrón que recetario: script JS wrapper + sin interpreter explícito.
// PM2 en Windows detecta automáticamente Node.js para archivos .js.
module.exports = {
  apps: [
    {
      name: 'docs',

      // Wrapper JS que lanza Docusaurus con process.execPath (evita problemas de PATH en Windows)
      script: './scripts/start-docs.js',
      cwd: 'C:\\ProyectosGE\\DocumentacionSoftware',

      env: {
        NODE_ENV: 'production',
        PORT: 3020,
      },

      // Comportamiento ante fallos — igual que recetario
      autorestart:   true,
      watch:         false,
      max_restarts:  10,
      restart_delay: 5000,
      min_uptime:    '10s',

      // Logs
      out_file:        './logs/docs-out.log',
      error_file:      './logs/docs-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      merge_logs:      true,

      exec_mode: 'fork',
    },
  ],
};
