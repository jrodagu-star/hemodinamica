import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages (repo de proyecto): https://jrodagu-star.github.io/hemodinamica/
// Solo importa el nombre del repo (hemodinamica), no el propietario en la subruta.
// En CI: VITE_BASE_PATH=/<repo>/ ; en local sin variable → base '/'.
function resolveBase() {
  const raw = process.env.VITE_BASE_PATH
  if (raw == null || raw === '') return '/'
  return raw.endsWith('/') ? raw : `${raw}/`
}

// https://vite.dev/config/
export default defineConfig({
  base: resolveBase(),
  plugins: [react(), tailwindcss()],
})
