/** Solubilidad aproximada del O₂ en plasma (mL O₂ / dL / mmHg) */
const K_O2 = 0.0031

/**
 * Derivados hemodinámicos a partir de parámetros clínicos.
 * Unidades: Hb g/dL, GC L/min, presiones mmHg, ASC m².
 */
export function computeStats(inputs) {
  const asc = inputs.asc > 0 ? inputs.asc : 1
  const {
    hb,
    sao2,
    pao2,
    pvo2,
    svo2,
    pvco2,
    paco2,
    gc,
    fc,
    pam,
    pvc,
    pcp,
    paps,
    papd,
  } = inputs

  const cao2 = hb * 1.34 * (sao2 / 100) + pao2 * K_O2
  const cvo2 = hb * 1.34 * (svo2 / 100) + pvo2 * K_O2
  const do2 = gc * cao2 * 10
  const do2i = do2 / asc
  const vo2 = gc * Math.max(0, cao2 - cvo2) * 10
  const o2er = sao2 > 0 ? ((sao2 - svo2) / sao2) * 100 : 0
  const gapCo2 = pvco2 - paco2
  const ic = gc / asc
  const vs = fc > 0 ? (gc / fc) * 1000 : 0
  const ivs = vs / asc
  const cpo = (pam * gc) / 451
  const rvs = gc > 0 ? ((pam - pvc) * 80) / gc : 0
  const irvs = rvs * asc
  const itsvi = ivs * (pam - pcp) * 0.0136
  const papi = pvc > 0 ? (paps - papd) / pvc : 0
  const papm = (paps + 2 * papd) / 3

  return {
    cao2,
    cvo2,
    do2,
    do2i,
    vo2,
    o2er,
    gapCo2,
    ic,
    vs,
    ivs,
    cpo,
    rvs,
    irvs,
    itsvi,
    papi,
    papm,
  }
}

export function surfaceAreaM2(weightKg, heightCm) {
  return Math.sqrt((weightKg * heightCm) / 3600)
}
