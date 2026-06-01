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

// En Windows, PM2 no resuelve 'node' desde el PATH; hay que indicar
// el intérprete como ruta absoluta via process.execPath (el node.exe
// que el propio PM2 usa) y el script como ruta relativa al cwd.
module.exports = {
  apps: [
    {
      name: 'docs',
      interpreter: process.execPath,  // → C:\Program Files\nodejs\node.exe  (absoluta)
      script: 'node_modules/@docusaurus/core/bin/docusaurus.mjs',
      args: 'serve --port 3020 --host 0.0.0.0',
      cwd: 'C:\\ProyectosGE\\DocumentacionSoftware',
      env: {
        NODE_ENV: 'production',
      },
      // Reinicio automático si falla
      autorestart: true,
      max_restarts: 5,
      restart_delay: 3000,
      // Logs con rutas absolutas para evitar ambigüedad
      error_file: 'C:\\ProyectosGE\\DocumentacionSoftware\\logs\\pm2-error.log',
      out_file:   'C:\\ProyectosGE\\DocumentacionSoftware\\logs\\pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
