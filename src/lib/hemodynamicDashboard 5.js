import { surfaceAreaM2 } from './hemodynamics.js'

/**
 * Datos de referencia del manual.
 * [categoría, sigla, nombre del parámetro, fórmula / origen, valor normal, unidad, significado clínico]
 */
export const REFERENCE_ROWS = [
  [
    'Precarga',
    'PVC',
    'Presión venosa central',
    'Medición directa por CVC en AD',
    '2–8 (8–12 en VM)',
    'mmHg',
    '',
  ],
  [
    'Precarga',
    'Wedge / PAOP',
    'Presión capilar pulmonar / en cuña',
    'Medición directa por CAP',
    '6–12',
    'mmHg',
    '',
  ],
  [
    'Precarga',
    'GEDI',
    'Volumen diastólico global indexado (transpulmonar)',
    'Termodilución transpulmonar',
    '680–800',
    'mL/m²',
    '',
  ],
  [
    'Precarga',
    'VTDVD',
    'Volumen teleodiastólico ventricular derecho',
    'Termodilución continua (CAP)',
    '80–150',
    'mL',
    '',
  ],
  [
    'Precarga',
    'VVS',
    'Variación del volumen sistólico',
    '(VSmax−VSmin)/VSmedia',
    '<10–15%',
    '%',
    '',
  ],
  [
    'Contractilidad',
    'GC',
    'Gasto cardíaco',
    'VS × FC',
    '3.0–5.0',
    'L/min',
    '',
  ],
  [
    'Contractilidad',
    'IC',
    'Índice cardíaco',
    'GC / ASC',
    '2.4–4.0',
    'L/min/m²',
    '',
  ],
  [
    'Contractilidad',
    'VS',
    'Volumen sistólico',
    'GC / FC × 1000',
    '>60',
    'mL/lat',
    '',
  ],
  [
    'Contractilidad',
    'IVS',
    'Índice de volumen sistólico',
    'IC / FC × 1000',
    '25–45 o 40–70',
    'mL/lat/m²',
    '',
  ],
  [
    'Contractilidad',
    'ITSVI',
    'Índice de trabajo sistólico ventricular izquierdo',
    'IVS × (PAM−PEAP) × 0.0136',
    '40–60',
    'g·m/m²/lat',
    '',
  ],
  [
    'Contractilidad',
    'CPO',
    'Poder cardíaco (cardiac power output)',
    'GC × PAM',
    ' >1.0 basal',
    'W',
    'Predice lesión por hipoperfusión orgánica.',
  ],
  [
    'Postcarga',
    'TAM',
    'Tensión arterial media',
    '(PAS + 2×PAD) / 3',
    '70–90',
    'mmHg',
    '',
  ],
  [
    'Postcarga',
    'RVS',
    'Resistencia vascular sistémica',
    '((PAM−PVC)×80)/GC',
    '1700–2400',
    'din·s·cm⁻⁵',
    '',
  ],
  [
    'Postcarga',
    'IRVS',
    'Índice de resistencia vascular sistémica',
    '((PAM−PVC)×80)/IC',
    '1600–2400',
    'din·s·cm⁻⁵/m²',
    '',
  ],
  [
    'Circulación pulmonar',
    'PAP m',
    'Presión arterial pulmonar media',
    'Medición directa por CAP',
    '10–15',
    'mmHg',
    '',
  ],
  [
    'Circulación pulmonar',
    'RVP',
    'Resistencia vascular pulmonar',
    '((PAPM−PEAP)×80)/GC',
    'Variable',
    'din·s·cm⁻⁵',
    '',
  ],
  [
    'Circulación pulmonar',
    'IRVP',
    'Índice de resistencia vascular pulmonar',
    '((PAPM−PEAP)×80)/IC',
    '200–400',
    'din·s·cm⁻⁵/m²',
    '',
  ],
  [
    'Circulación pulmonar',
    'ELWI',
    'Exceso de agua pulmonar indexado',
    'Termodilución transpulmonar',
    '3–7',
    'mL/kg',
    '',
  ],
  [
    'VD',
    'PAPI',
    'Índice de pulsatibilidad de la arteria pulmonar',
    '(PAPs−PAPd)/PVC',
    '>1.85',
    'adim.',
    'Predice el riesgo de fallo del VD; si < 1: peligro.',
  ],
  [
    'VD',
    'FEVD',
    'Fracción de eyección del ventrículo derecho',
    'Termodilución continua (CAP)',
    '46–50',
    '%',
    '',
  ],
  [
    'VD',
    'ITSVD',
    'Índice de trabajo sistólico ventricular derecho',
    'IVS × (PAPM−PVC) × 0.0136',
    '4–8',
    'g·m/m²/lat',
    '',
  ],
  [
    'VD',
    'PVC / Wedge',
    'Cociente PVC / PAOP',
    'PVC / PAOP',
    '<0.86',
    'adim.',
    '',
  ],
  [
    'Oxigenación',
    'SvO2',
    'Saturación venosa mixta de oxígeno',
    'Muestra de arteria pulmonar',
    '65–75',
    '%',
    '',
  ],
  [
    'Oxigenación',
    'ScvO2',
    'Saturación venosa central de oxígeno',
    'Muestra de VCS',
    '>70',
    '%',
    '',
  ],
  [
    'Oxigenación',
    'CaO2',
    'Contenido arterial de oxígeno',
    'CaO₂ = (0,0138×Hb×SpO₂)+(0,0031×PaO₂)',
    '~21',
    'mL/dL',
    '',
  ],
  [
    'Oxigenación',
    'DO2',
    'Transporte (oferta) de oxígeno',
    'CaO2×GC×10',
    '~900',
    'mL O2/min',
    '',
  ],
  [
    'Oxigenación',
    'DO2I',
    'Índice de transporte de oxígeno',
    'CaO2×IC×10',
    '520–570',
    'mL O2/min/m²',
    '',
  ],
  [
    'Oxigenación',
    'VO2',
    'Consumo de oxígeno',
    '(CaO2−CvO2)×GC×10',
    '110–160',
    'mL O2/min',
    '',
  ],
  [
    'Oxigenación',
    'O2ER',
    'Extracción de oxígeno',
    '((SaO2−SvO2)/SaO2)×100',
    '~25',
    '%',
    '',
  ],
  [
    'Oxigenación',
    'Delta PCO2',
    'Diferencia venoarterial de CO₂ (PvCO2−PaCO2)',
    'PvCO2−PaCO2',
    '<5',
    'mmHg',
    '',
  ],
  [
    'Oxigenación',
    'Lactato',
    'Lactato sérico / plasmático',
    'Laboratorio',
    '<2.0',
    'mmol/L',
    '',
  ],
]

/**
 * Rangos normales orientativos (manual / criterios habituales en UCI).
 * Sirven solo para la codificación por colores en datos de entrada.
 */
export const INPUT_NORMAL_RANGE = {
  edad: [18, 95],
  peso: [42, 130],
  altura: [145, 200],
  pas: [90, 135],
  pad: [60, 85],
  fc: [60, 100],
  asc: [1.55, 2.2],
  gc: [3.0, 5.0],
  pvc: [2, 8],
  paop: [6, 12],
  paps: [15, 30],
  papd: [5, 15],
  papm: [10, 15],
  hb: [11.5, 16.5],
  spo2: [94, 100],
  svo2: [65, 75],
  scvo2: [68, 78],
  pao2: [75, 100],
  paco2: [35, 45],
  pvco2: [38, 48],
  cvo2: [11, 15],
  lactato: [0.5, 2.0],
}

/**
 * @returns {'empty' | 'low' | 'normal' | 'high'}
 */
export function inputRangeStatus(fieldId, rawValue) {
  const range = INPUT_NORMAL_RANGE[fieldId]
  if (!range) return 'empty'
  const v = parseFloat(rawValue)
  if (!Number.isFinite(v)) return 'empty'
  const [lo, hi] = range
  if (v < lo) return 'low'
  if (v > hi) return 'high'
  return 'normal'
}

/**
 * Campos de entrada agrupados por categoría (UI calculadora).
 * Cada campo: [id, etiqueta, placeholder unidad]
 */
export const INPUT_FIELD_GROUPS = [
  {
    id: 'anthropometry',
    title: 'Antropometría',
    fields: [
      ['edad', 'Edad', 'años'],
      ['peso', 'Peso', 'kg'],
      ['altura', 'Altura', 'cm'],
    ],
  },
  {
    id: 'pressure_fc',
    title: 'Tensión arterial y frecuencia',
    fields: [
      ['pas', 'PAS', 'mmHg'],
      ['pad', 'PAD', 'mmHg'],
      ['fc', 'FC', 'lpm'],
    ],
  },
  {
    id: 'asc_gc',
    title: 'Superficie corporal y gasto cardíaco',
    fields: [
      ['asc', 'ASC manual (opcional)', 'm²'],
      ['gc', 'GC', 'L/min'],
    ],
  },
  {
    id: 'preload',
    title: 'Precarga / presiones de llenado',
    fields: [
      ['pvc', 'PVC', 'mmHg'],
      ['paop', 'PAOP / Wedge', 'mmHg'],
    ],
  },
  {
    id: 'pulmonary',
    title: 'Circulación pulmonar',
    fields: [
      ['paps', 'PAPs', 'mmHg'],
      ['papd', 'PAPd', 'mmHg'],
      ['papm', 'PAPm', 'mmHg'],
    ],
  },
  {
    id: 'oxygen_sat',
    title: 'Hb y saturaciones',
    fields: [
      ['hb', 'Hb', 'g/dL'],
      ['spo2', 'SaO2 / SpO2', '%'],
      ['svo2', 'SvO2', '%'],
      ['scvo2', 'ScvO2', '%'],
    ],
  },
  {
    id: 'gasometria',
    title: 'Gasometría y metabolismo',
    fields: [
      ['pao2', 'PaO2', 'mmHg'],
      ['paco2', 'PaCO2', 'mmHg'],
      ['pvco2', 'PvCO2', 'mmHg'],
      ['cvo2', 'CvO2', 'mL/dL'],
      ['lactato', 'Lactato', 'mmol/L'],
    ],
  },
]

/** Lista plana (mismo orden que los grupos); usada para estado inicial y lógica. */
export const INPUT_FIELDS = INPUT_FIELD_GROUPS.flatMap((g) => g.fields)

export const RESULTS_META = {
  tam: { label: 'TAM', ref: '70–90 mmHg', unit: 'mmHg', normal: [70, 90] },
  gc: { label: 'GC', ref: '3.0–5.0 L/min', unit: 'L/min', normal: [3, 5] },
  ic: { label: 'IC', ref: '2.4–4.0 L/min/m²', unit: 'L/min/m²', normal: [2.4, 4.0] },
  vs: { label: 'VS', ref: '>60 mL/lat', unit: 'mL/lat', min: 60 },
  ivs: { label: 'IVS', ref: '25–45 mL/lat/m²', unit: 'mL/lat/m²', normal: [25, 45] },
  itsvi: { label: 'ITSVI', ref: '40–60 g·m/m²/lat', unit: 'g·m/m²/lat', normal: [40, 60] },
  cpo: { label: 'CPO', ref: '>1.0 W', unit: 'W', min: 1 },
  rvs: { label: 'RVS', ref: '1700–2400 din·s·cm⁻⁵', unit: 'din·s·cm⁻⁵', normal: [1700, 2400] },
  irvs: { label: 'IRVS', ref: '1600–2400 din·s·cm⁻⁵/m²', unit: 'din·s·cm⁻⁵/m²', normal: [1600, 2400] },
  rvp: { label: 'RVP', ref: 'Sin rango fijo en tabla', unit: 'din·s·cm⁻⁵' },
  irvp: { label: 'IRVP', ref: '200–400 din·s·cm⁻⁵/m²', unit: 'din·s·cm⁻⁵/m²', normal: [200, 400] },
  papi: { label: 'PAPI', ref: '>1.85', unit: 'adim.', min: 1.85 },
  pvcw: { label: 'PVC/Wedge', ref: '<0.86', unit: 'adim.', max: 0.86 },
  cao2: { label: 'CaO2', ref: '~21 mL/dL', unit: 'mL/dL', normal: [19, 22] },
  do2: { label: 'DO2', ref: '~900 mL O2/min', unit: 'mL O2/min', normal: [800, 1000] },
  do2i: { label: 'DO2I', ref: '520–570 mL O2/min/m²', unit: 'mL O2/min/m²', normal: [520, 570] },
  vo2: { label: 'VO2', ref: '110–160 mL O2/min', unit: 'mL O2/min', normal: [110, 160] },
  o2er: { label: 'O2ER', ref: '~25%', unit: '%', normal: [20, 30] },
  dpco2: { label: 'Delta PCO2', ref: '<5 mmHg', unit: 'mmHg', max: 5 },
  lactato: { label: 'Lactato', ref: '<2.0 mmol/L', unit: 'mmol/L', max: 2 },
}

export const IMPORTANT_KEYS = ['tam', 'ic', 'rvs', 'cao2', 'do2', 'papi', 'dpco2', 'lactato']

/**
 * Escenarios de ejemplo alineados con patrones típicos de shock (valores orientativos).
 * `papm` se omite para calcularlo a partir de PAPs/PAPd cuando aplique.
 */
export const SAMPLE_PRESETS = [
  {
    id: 'cardiogenico',
    label: 'Shock cardiogénico',
    values: {
      pas: 86,
      pad: 52,
      fc: 122,
      asc: 1.82,
      gc: 2.35,
      pvc: 17,
      paop: 24,
      paps: 44,
      papd: 26,
      hb: 11.2,
      spo2: 93,
      svo2: 52,
      scvo2: 56,
      pao2: 72,
      paco2: 40,
      pvco2: 48,
      cvo2: 12.9,
      lactato: 4.4,
    },
  },
  {
    id: 'septico',
    label: 'Shock séptico (hiperdinámico)',
    values: {
      pas: 102,
      pad: 58,
      fc: 118,
      asc: 1.95,
      gc: 6.1,
      pvc: 8,
      paop: 11,
      paps: 30,
      papd: 15,
      hb: 10.4,
      spo2: 97,
      svo2: 76,
      scvo2: 79,
      pao2: 90,
      paco2: 31,
      pvco2: 35,
      cvo2: 10.4,
      lactato: 3.6,
    },
  },
  {
    id: 'obstructivo',
    label: 'Shock obstructivo',
    values: {
      pas: 82,
      pad: 48,
      fc: 132,
      asc: 1.76,
      gc: 1.95,
      pvc: 19,
      paop: 18,
      paps: 52,
      papd: 34,
      hb: 11.5,
      spo2: 91,
      svo2: 49,
      scvo2: 52,
      pao2: 68,
      paco2: 42,
      pvco2: 50,
      cvo2: 13.1,
      lactato: 4.9,
    },
  },
  {
    id: 'mixto',
    label: 'Shock mixto (cardiogénico + séptico)',
    values: {
      pas: 94,
      pad: 60,
      fc: 116,
      asc: 1.9,
      gc: 3.75,
      pvc: 14,
      paop: 21,
      paps: 40,
      papd: 23,
      hb: 10.6,
      spo2: 95,
      svo2: 61,
      scvo2: 66,
      pao2: 78,
      paco2: 36,
      pvco2: 44,
      cvo2: 11.9,
      lactato: 5.4,
    },
  },
]

export function round(v, n = 2) {
  return Number.isFinite(v) ? Number(v.toFixed(n)) : null
}

/**
 * IMC (kg/m²) y ASC por Du Bois (m²) a partir de peso (kg) y altura (cm).
 * La edad se devuelve parseada para la UI; no entra aún en fórmulas hemodinámicas.
 * @param {Record<string, string>} raw
 */
export function computeAnthropometrics(raw) {
  const edadV = parseFloat(raw.edad)
  const peso = parseFloat(raw.peso)
  const altura = parseFloat(raw.altura)

  const edad = Number.isFinite(edadV) && edadV > 0 ? edadV : null

  if (!Number.isFinite(peso) || !Number.isFinite(altura) || altura <= 0 || peso <= 0) {
    return { edad, imc: null, ascDuBois: null }
  }

  const alturaM = altura / 100
  const imc = peso / (alturaM * alturaM)
  const ascDuBois = surfaceAreaM2(peso, altura)

  return {
    edad,
    imc: round(imc, 2),
    ascDuBois: round(ascDuBois, 3),
  }
}

export function statusFor(key, value) {
  const meta = RESULTS_META[key] || {}
  if (value == null) return { txt: 'No calculable', cls: 'warn' }
  if (meta.normal) {
    if (value < meta.normal[0]) return { txt: 'Bajo', cls: 'bad' }
    if (value > meta.normal[1]) return { txt: 'Alto', cls: 'warn' }
    return { txt: 'En rango', cls: 'ok' }
  }
  if (meta.min != null)
    return value >= meta.min ? { txt: 'Adecuado', cls: 'ok' } : { txt: 'Bajo', cls: 'bad' }
  if (meta.max != null)
    return value <= meta.max ? { txt: 'Adecuado', cls: 'ok' } : { txt: 'Alto', cls: 'bad' }
  return { txt: 'Interpretar', cls: 'warn' }
}

function score(value, low, high, inverse = false) {
  if (value == null) return 0
  if (!inverse) {
    if (value <= low) return 20
    if (value >= high) return 100
    return Math.round(20 + ((value - low) / (high - low)) * 80)
  }
  if (value <= low) return 100
  if (value >= high) return 20
  return Math.round(100 - ((value - low) / (high - low)) * 80)
}

export function radarScores(results) {
  return [
    score(results.tam, 55, 75),
    score(results.ic, 1.8, 3.2),
    score(results.cao2, 15, 21),
    score(results.do2, 500, 900),
    score(results.papi, 1.2, 2.2),
    score(results.rvs, 1000, 1800, true),
  ]
}

/**
 * @param {Record<string, string>} raw — valores de input como texto
 */
export function computeResults(raw) {
  const val = (id) => {
    const v = parseFloat(raw[id])
    return Number.isFinite(v) ? v : null
  }

  const pas = val('pas'),
    pad = val('pad'),
    fc = val('fc'),
    pvc = val('pvc')
  const ascManual = val('asc')
  const { ascDuBois } = computeAnthropometrics(raw)
  const asc =
    ascManual != null && ascManual > 0 ? ascManual : ascDuBois != null ? ascDuBois : null
  let gc = val('gc')
  const paop = val('paop'),
    paps = val('paps'),
    papd = val('papd')
  let papm = val('papm')
  const hb = val('hb'),
    spo2 = val('spo2'),
    svo2 = val('svo2'),
    pao2 = val('pao2'),
    paco2 = val('paco2'),
    pvco2 = val('pvco2'),
    cvo2 = val('cvo2'),
    lactato = val('lactato')

  const tam = pas != null && pad != null ? (pas + 2 * pad) / 3 : null
  if (papm == null && paps != null && papd != null) papm = (paps + 2 * papd) / 3
  const ic = gc != null && asc != null && asc !== 0 ? gc / asc : null
  const vs = gc != null && fc != null && fc !== 0 ? (gc / fc) * 1000 : null
  const ivs = ic != null && fc != null && fc !== 0 ? (ic / fc) * 1000 : null
  const itsvi =
    ivs != null && tam != null && paop != null ? ivs * (tam - paop) * 0.0136 : null
  const cpo = gc != null && tam != null ? (gc * tam) / 451 : null
  const rvs =
    tam != null && pvc != null && gc != null && gc !== 0
      ? ((tam - pvc) * 80) / gc
      : null
  const irvs =
    tam != null && pvc != null && ic != null && ic !== 0
      ? ((tam - pvc) * 80) / ic
      : null
  const rvp =
    papm != null && paop != null && gc != null && gc !== 0
      ? ((papm - paop) * 80) / gc
      : null
  const irvp =
    papm != null && paop != null && ic != null && ic !== 0
      ? ((papm - paop) * 80) / ic
      : null
  const papi =
    paps != null && papd != null && pvc != null && pvc !== 0
      ? (paps - papd) / pvc
      : null
  const pvcw = pvc != null && paop != null && paop !== 0 ? pvc / paop : null
  const cao2 =
    hb != null && spo2 != null && pao2 != null
      ? 0.0138 * hb * (spo2 / 100) * 100 + 0.0031 * pao2
      : null
  const do2 = cao2 != null && gc != null ? cao2 * gc * 10 : null
  const do2i = cao2 != null && ic != null ? cao2 * ic * 10 : null
  const vo2 =
    cao2 != null && cvo2 != null && gc != null ? (cao2 - cvo2) * gc * 10 : null
  const o2er =
    spo2 != null && svo2 != null && spo2 !== 0 ? ((spo2 - svo2) / spo2) * 100 : null
  const dpco2 = pvco2 != null && paco2 != null ? pvco2 - paco2 : null

  return {
    tam: round(tam, 1),
    gc: round(gc, 2),
    ic: round(ic, 2),
    vs: round(vs, 1),
    ivs: round(ivs, 1),
    itsvi: round(itsvi, 1),
    cpo: round(cpo, 2),
    rvs: round(rvs, 0),
    irvs: round(irvs, 0),
    rvp: round(rvp, 0),
    irvp: round(irvp, 0),
    papi: round(papi, 2),
    pvcw: round(pvcw, 2),
    cao2: round(cao2, 2),
    do2: round(do2, 0),
    do2i: round(do2i, 0),
    vo2: round(vo2, 0),
    o2er: round(o2er, 1),
    dpco2: round(dpco2, 1),
    lactato: round(lactato, 1),
  }
}

export function categoryOptions() {
  const cats = [...new Set(REFERENCE_ROWS.map((r) => r[0]))]
  return cats
}
