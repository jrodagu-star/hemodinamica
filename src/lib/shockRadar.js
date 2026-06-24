/**
 * Patrones cualitativos de shock (GC, RVS sistémica, precarga/PVC, PAM, SvO₂/ScvO₂)
 * según tabla de referencia clínica (Tipodeshock-GastocardacoGC-RVSsistmica-PrecargaPVC).
 * Cada vector usa escala 0–1: bajo → 0, alto → 1 (según el parámetro).
 */

function clamp01(x) {
  return Math.max(0, Math.min(1, x))
}

/** Plantillas ideales [f_gc, f_rvs, f_pvc, f_pam, f_sat] en [0,1]. */
export const SHOCK_RADAR_AXES = [
  {
    key: 'hipovolemico',
    label: 'Hipovolémico',
    shortLabel: 'Hipovolémico',
    vec: [0.12, 0.88, 0.12, 0.18, 0.18],
  },
  {
    key: 'cardiogenico',
    label: 'Cardiogénico',
    shortLabel: 'Cardiogénico',
    vec: [0.12, 0.88, 0.82, 0.18, 0.18],
  },
  {
    key: 'shock_mixto',
    label: 'Shock mixto (cardiogénico + séptico)',
    shortLabel: 'Shock mixto',
    vec: [0.42, 0.14, 0.38, 0.24, 0.62],
  },
  {
    key: 'septico',
    label: 'Séptico',
    shortLabel: 'Séptico',
    vec: [0.9, 0.06, 0.38, 0.34, 0.78],
  },
  {
    key: 'obstructivo',
    label: 'Obstructivo',
    shortLabel: 'Obstructivo',
    vec: [0.12, 0.9, 0.9, 0.18, 0.18],
  },
]

/**
 * Vector del paciente en las mismas 5 dimensiones que la tabla (derivadas de inputs).
 */
export function patientShockFeatures(results, rawInputs) {
  const val = (id) => {
    const v = parseFloat(rawInputs[id])
    return Number.isFinite(v) ? v : null
  }

  const gc = results.gc
  const rvs = results.rvs
  const pvc = val('pvc')
  const tam = results.tam
  const svo2 = val('svo2')
  const scvo2 = val('scvo2')
  const satVenosa = svo2 ?? scvo2

  const f_gc = gc == null ? 0.5 : clamp01((gc - 2) / 5)

  const f_rvs = rvs == null ? 0.5 : clamp01((rvs - 900) / 2100)

  const f_pvc = pvc == null ? 0.5 : clamp01((pvc - 1) / 18)

  const f_pam = tam == null ? 0.5 : clamp01((tam - 52) / 48)

  const f_sat =
    satVenosa == null ? 0.5 : clamp01((satVenosa - 48) / 48)

  return [f_gc, f_rvs, f_pvc, f_pam, f_sat]
}

function euclidean(a, b) {
  let s = 0
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i]
    s += d * d
  }
  return Math.sqrt(s / a.length)
}

/**
 * Puntuación 0–100 por eje: semejanza del paciente al patrón de ese tipo de shock.
 */
export function shockRadarScores(results, rawInputs) {
  const P = patientShockFeatures(results, rawInputs)
  const sigma = 0.38

  return SHOCK_RADAR_AXES.map(({ vec }) => {
    const d = euclidean(P, vec)
    const score = 100 * Math.exp(-(d * d) / (2 * sigma * sigma))
    return Math.round(score)
  })
}
