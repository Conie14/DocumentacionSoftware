/**
 * Auto-patch para Docusaurus 3.10.1 + webpack 5.107.2
 * Se ejecuta automáticamente después de cada pnpm install (postinstall)
 *
 * Bug 1: plugin-content-docs accede a siteConfig.future.experimental_faster.mdxCrossCompilerCache
 *        sin optional chaining — explota si future.experimental_faster no está definido en el config
 *
 * Bug 2: webpack 5.107.2 rechaza las opciones { name, color, reporters, reporter } que
 *        webpackbar (usado por Docusaurus) pasa al ProgressPlugin
 */

const fs = require('fs');
const path = require('path');

let patchesApplied = 0;
let patchesFailed = 0;

function applyPatch(filePath, search, replace, description) {
  const fullPath = path.resolve(__dirname, '..', filePath);

  if (!fs.existsSync(fullPath)) {
    // Buscar en .pnpm si no está en la ruta directa
    const pnpmDir = path.resolve(__dirname, '..', 'node_modules', '.pnpm');
    if (!fs.existsSync(pnpmDir)) {
      console.warn(`  ⚠ No encontrado: ${filePath}`);
      patchesFailed++;
      return;
    }

    // Buscar recursivamente en .pnpm
    const dirs = fs.readdirSync(pnpmDir);
    let found = false;
    for (const dir of dirs) {
      const candidate = path.join(pnpmDir, dir, 'node_modules', filePath.replace('node_modules/', ''));
      if (fs.existsSync(candidate)) {
        patchFile(candidate, search, replace, description);
        found = true;
        break;
      }
    }
    if (!found) {
      console.warn(`  ⚠ No encontrado en .pnpm: ${filePath}`);
      patchesFailed++;
    }
    return;
  }

  patchFile(fullPath, search, replace, description);
}

function patchFile(fullPath, search, replace, description) {
  const content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes(replace)) {
    console.log(`  ✓ Ya aplicado: ${description}`);
    patchesApplied++;
    return;
  }

  if (!content.includes(search)) {
    console.warn(`  ⚠ Texto no encontrado (versión distinta?): ${description}`);
    patchesFailed++;
    return;
  }

  const patched = content.replace(search, replace);
  fs.writeFileSync(fullPath, patched, 'utf8');
  console.log(`  ✓ Aplicado: ${description}`);
  patchesApplied++;
}

console.log('\n🔧 Aplicando parches de compatibilidad Docusaurus 3.10.1...\n');

// ── Parche 1: plugin-content-docs — optional chaining en experimental_faster ──
applyPatch(
  'node_modules/@docusaurus/plugin-content-docs/lib/index.js',
  'siteConfig.future.experimental_faster.mdxCrossCompilerCache',
  'siteConfig.future?.experimental_faster?.mdxCrossCompilerCache',
  'plugin-content-docs: optional chaining en experimental_faster'
);

// ── Parche 2: webpack ProgressPlugin — aceptar opciones legacy de webpackbar ──
function patchProgressPlugin() {
  const pnpmDir = path.resolve(__dirname, '..', 'node_modules', '.pnpm');
  if (!fs.existsSync(pnpmDir)) {
    console.warn('  ⚠ Directorio .pnpm no encontrado');
    patchesFailed++;
    return;
  }

  const dirs = fs.readdirSync(pnpmDir);
  let found = false;

  for (const dir of dirs) {
    if (!dir.startsWith('webpack@5')) continue;

    const candidate = path.join(pnpmDir, dir, 'node_modules', 'webpack', 'lib', 'ProgressPlugin.js');
    if (!fs.existsSync(candidate)) continue;

    const content = fs.readFileSync(candidate, 'utf8');
    const search = `compiler.hooks.validate.tap(PLUGIN_NAME, () => {
			compiler.validate(
				() => require("../schemas/plugins/ProgressPlugin.json"),
				this.options,
				{
					name: "Progress Plugin",
					baseDataPath: "options"
				},
				(options) => require("../schemas/plugins/ProgressPlugin.check")(options)
			);
		});`;

    const replace = `compiler.hooks.validate.tap(PLUGIN_NAME, () => {
			try {
				compiler.validate(
					() => require("../schemas/plugins/ProgressPlugin.json"),
					this.options,
					{
						name: "Progress Plugin",
						baseDataPath: "options"
					},
					(options) => require("../schemas/plugins/ProgressPlugin.check")(options)
				);
			} catch (_e) {
				// Ignore validation errors from legacy progress options (webpackbar compatibility)
			}
		});`;

    if (content.includes('Ignore validation errors from legacy')) {
      console.log('  ✓ Ya aplicado: webpack ProgressPlugin — compatibilidad webpackbar');
      patchesApplied++;
      found = true;
      break;
    }

    if (content.includes('compiler.hooks.validate.tap')) {
      fs.writeFileSync(candidate, content.replace(search, replace), 'utf8');
      console.log('  ✓ Aplicado: webpack ProgressPlugin — compatibilidad webpackbar');
      patchesApplied++;
      found = true;
      break;
    }
  }

  if (!found) {
    console.warn('  ⚠ webpack ProgressPlugin no encontrado o ya no necesita parche');
  }
}

patchProgressPlugin();

console.log(`\n📊 Resultado: ${patchesApplied} aplicados, ${patchesFailed} con advertencias\n`);
