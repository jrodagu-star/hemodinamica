/**
 * Rutas bajo `public/` respetando `base` de Vite (p. ej. GitHub Pages /repo/).
 */
export function publicAsset(path) {
  const normalized = path.replace(/^\/+/, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
