/** Balance de masa O₂ y tejido pulmonar funcional — fórmulas de ECMO_VV_Shunt_Calculator.xlsx */

export function parseCalcNumber(raw) {
  if (raw === '' || raw == null) return null
  const n = parseFloat(String(raw).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

function safeDiv(num, den, fallback = 0) {
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return fallback
  const v = num / den
  return Number.isFinite(v) ? v : fallback
}

export function computeEcmoVvShuntCalc({
  svcO2,
  saO2,
  spost,
  qecmo,
  qt,
  fio2,
}) {
  const deltaSatEcmo = spost - svcO2
  const deltaSatSystemic = saO2 - svcO2
  const qtNative = qt - qecmo
  const spNat = safeDiv(qt * saO2 - qecmo * spost, qtNative, 0)
  const saO2Ideal = Math.min(100, 97 + fio2 * 3)
  const do2Ecmo = qecmo * (spost - svcO2)
  const do2Lung = qtNative !== 0 ? (qt - qecmo) * (spNat - svcO2) : 0
  const do2Total = do2Ecmo + do2Lung

  const qsQt = safeDiv(saO2Ideal - saO2, saO2Ideal - svcO2, 0)
  const qsNatQtNat = safeDiv(saO2Ideal - spNat, saO2Ideal - svcO2, 0)
  const fEcmo = safeDiv(do2Ecmo, do2Total, 0)
  const fPulm = safeDiv(do2Lung, do2Total, 0)
  const tfPct = fPulm * safeDiv(spNat, saO2Ideal, 0)
  const rf = Math.max(0, safeDiv(svcO2 - 65, spost - 65, 0))
  const qecmoQt = safeDiv(qecmo, qt, 0)

  return {
    deltaSatEcmo,
    deltaSatSystemic,
    qtNative,
    spNat,
    saO2Ideal,
    do2Ecmo,
    do2Lung,
    do2Total,
    qsQt,
    qsNatQtNat,
    fEcmo,
    fPulm,
    tfPct,
    rf,
    qecmoQt,
  }
}

export function classifyQsQt(fraction) {
  const pct = fraction * 100
  if (pct < 10) return { label: 'Normal', tone: 'emerald', pct }
  if (pct <= 20) return { label: 'Moderado', tone: 'amber', pct }
  return { label: 'Grave', tone: 'red', pct }
}

export function classifyFEcmo(fraction) {
  const pct = fraction * 100
  if (pct > 80) return { label: 'Dependencia casi total del ECMO', tone: 'red', pct }
  if (pct < 30) return { label: 'Recuperación pulmonar', tone: 'emerald', pct }
  return { label: 'Oxigenación mixta ECMO/pulmón', tone: 'amber', pct }
}

export function classifyRf(fraction) {
  const pct = fraction * 100
  if (pct > 30) return { label: 'Recirculación significativa', tone: 'red', pct }
  if (pct > 15) return { label: 'Vigilar recirculación', tone: 'amber', pct }
  return { label: 'Recirculación baja', tone: 'emerald', pct }
}

export function computeVentilatorTfModel({
  vtMl,
  pplat,
  peep,
  fr,
  paco2,
  pbw,
  pao2,
  saO2,
  fio2,
  shuntCalc,
}) {
  const vtL = vtMl / 1000
  const dp = pplat - peep
  const crs = safeDiv(vtMl, dp, 0)
  const ve = vtL * fr
  const mp =
    crs !== 0 && vtMl !== 0
      ? 0.098 * fr * vtL * (dp + safeDiv(vtL, vtMl, 0) * peep)
      : 0
  const vr = safeDiv(ve * paco2, pbw * 100 * 37.5, 0)
  const pfRatio = safeDiv(pao2, fio2, 0)
  const vtPerPbw = safeDiv(vtMl, pbw, 0)

  const tfCrs = Math.min(1, crs / 100)
  const tfDp = Math.min(1, Math.max(0, (20 - dp) / 20 + 0.1))
  const smp = safeDiv(mp, crs, 0)

  const o2TfFactor =
    shuntCalc && shuntCalc.do2Total !== 0
      ? safeDiv(shuntCalc.do2Lung, shuntCalc.do2Total, 0) *
        safeDiv(shuntCalc.spNat, shuntCalc.saO2Ideal, 0)
      : 0
  const tfCombined = 0.6 * Math.min(1, crs / 100) + 0.4 * o2TfFactor

  return {
    crs,
    dp,
    ve,
    mp,
    vr,
    pfRatio,
    vtPerPbw,
    tfCrs,
    tfDp,
    smp,
    tfCombined,
    o2TfFactor,
  }
}

export function interpretTfFraction(fraction) {
  if (fraction >= 0.5) return 'BIEN: >50% tejido funcional'
  if (fraction >= 0.25) return 'MODERADO: 25–50% tejido funcional'
  return 'GRAVE: <25% tejido funcional'
}

export function interpretDrivingPressure(dp) {
  if (dp < 10) return 'ÓPTIMO (<10 cmH₂O)'
  if (dp < 14) return 'ACEPTABLE (10–14 cmH₂O)'
  return 'ELEVADO: riesgo VILI (>14 cmH₂O)'
}

export function interpretSmp(smp) {
  return smp < 0.53
    ? 'BAJO RIESGO (<0.53)'
    : 'ALTO RIESGO (>0.53): mortalidad 63%'
}

export function interpretVentilatoryRatio(vr) {
  if (vr < 1.6) return 'NORMAL (<1.6): buen dead space'
  if (vr < 1.75) return 'ELEVADO (1.6–1.75): vigilar weaning'
  return 'CRÍTICO (>1.75): fallo weaning probable'
}

export function interpretPfRatio(pf) {
  if (pf > 200) return 'LEVE/NORMAL (>200)'
  if (pf > 100) return 'MODERADO (100–200)'
  return 'GRAVE SDRA (<100)'
}

export function formatPercent(fraction, digits = 1) {
  if (!Number.isFinite(fraction)) return '—'
  return `${(fraction * 100).toFixed(digits)} %`
}

export function formatNumber(value, digits = 2, unit = '') {
  if (!Number.isFinite(value)) return '—'
  const core = value.toFixed(digits)
  return unit ? `${core} ${unit}` : core
}
