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

// Detecta si corre en el servidor de producción (Windows + Administrador)
// o en la máquina de desarrollo; ajusta el cwd en consecuencia.
const isProd = process.env.COMPUTERNAME === 'WIN-AHGHB3Q61DS';
const projectRoot = isProd
  ? 'C:\\ProyectosGE\\DocumentacionSoftware'
  : __dirname;

// En Windows, PM2 no puede ejecutar el script POSIX de node_modules/.bin/
// directamente; hay que pasar node como intérprete y apuntar al .mjs de Docusaurus.
module.exports = {
  apps: [
    {
      name: 'docs',
      script: 'node',
      args: 'node_modules/@docusaurus/core/bin/docusaurus.mjs serve --port 3020 --host 0.0.0.0',
      cwd: projectRoot,
      env: {
        NODE_ENV: 'production',
      },
      // Reinicio automático si falla
      autorestart: true,
      max_restarts: 5,
      restart_delay: 3000,
      // Logs
      error_file: './logs/pm2-error.log',
      out_file:   './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
};
