/**
 * Si `src/lib/hemodynamicDashboard.js` falta o está vacío (p. ej. iCloud “solo en la nube”),
 * copia la copia de respaldo más reciente por fecha de modificación.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const libDir = path.join(root, 'src', 'lib')
const target = path.join(libDir, 'hemodynamicDashboard.js')

const MIN_BYTES = 4000

function safeStat(p) {
  try {
    return fs.statSync(p)
  } catch {
    return null
  }
}

const cur = safeStat(target)
if (cur && cur.size >= MIN_BYTES) {
  process.exit(0)
}

let names
try {
  names = fs.readdirSync(libDir)
} catch (e) {
  console.error('No se puede leer src/lib:', e.message)
  process.exit(1)
}

const backups = names
  .filter(
    (f) =>
      f.startsWith('hemodynamicDashboard') &&
      f.endsWith('.js') &&
      f !== 'hemodynamicDashboard.js',
  )
  .map((f) => {
    const p = path.join(libDir, f)
    return { f, p, mtime: safeStat(p)?.mtimeMs ?? 0 }
  })
  .sort((a, b) => b.mtime - a.mtime)

if (backups.length === 0) {
  console.error(
    'Falta src/lib/hemodynamicDashboard.js y no hay copias hemodynamicDashboard *.js en src/lib.',
  )
  process.exit(1)
}

fs.copyFileSync(backups[0].p, target)
console.warn(
  `[ensure-hemodynamic-dashboard] Copiado "${backups[0].f}" → hemodynamicDashboard.js (${safeStat(target)?.size ?? 0} bytes).`,
)
