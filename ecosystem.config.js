/**
 * PM2 Ecosystem — Sistema de Recetas (Docusaurus)
 *
 * Flujo de despliegue:
 *   pnpm install          ← instala + aplica parches automáticamente
 *   pnpm build            ← compila el sitio estático en /build
 *   pm2 start ecosystem.config.js ← sirve los archivos estáticos
 *
 * Puerto: 3020 (configurable via env PORT)
 */

module.exports = {
  apps: [
    {
      name: 'portal-recetas',
      script: 'node_modules/.bin/docusaurus',
      args: 'serve --port 3020 --host 0.0.0.0',
      cwd: __dirname,
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
      },
      // Reinicio automático si falla
      autorestart: true,
      max_restarts: 5,
      restart_delay: 3000,
      // Logs
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
