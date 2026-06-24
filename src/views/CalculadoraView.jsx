import { useEffect, useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  Filler,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react'
import {
  categoryOptions,
  computeAnthropometrics,
  computeResults,
  IMPORTANT_KEYS,
  INPUT_FIELD_GROUPS,
  INPUT_FIELDS,
  radarScores,
  REFERENCE_ROWS,
  RESULTS_META,
  SAMPLE_PRESETS,
  inputRangeStatus,
  statusFor,
} from '../lib/hemodynamicDashboard.js'
import { SHOCK_RADAR_AXES, shockRadarScores } from '../lib/shockRadar.js'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip)

function emptyInputs() {
  return Object.fromEntries(INPUT_FIELDS.map(([id]) => [id, '']))
}

function statusClass(cls, dark) {
  if (cls === 'ok')
    return dark ? 'text-emerald-400' : 'text-emerald-700'
  if (cls === 'warn')
    return dark ? 'text-amber-400' : 'text-amber-700'
  return dark ? 'text-red-400' : 'text-red-700'
}

/** Borde/fondo del campo según rango (vacío = estilo neutro). */
function inputFieldTone(rangeStatus, dark, neutralFieldBg) {
  if (rangeStatus === 'empty') return neutralFieldBg
  if (rangeStatus === 'low') {
    return dark
      ? 'border-amber-500/85 bg-amber-950/45 text-amber-50 ring-amber-500/35 placeholder:text-amber-600'
      : 'border-amber-400 bg-amber-50 text-slate-900 ring-amber-400/40 placeholder:text-slate-500'
  }
  if (rangeStatus === 'high') {
    return dark
      ? 'border-red-500/85 bg-red-950/40 text-red-50 ring-red-500/35 placeholder:text-red-400/70'
      : 'border-red-400 bg-red-50 text-slate-900 ring-red-400/35 placeholder:text-slate-500'
  }
  return dark
    ? 'border-emerald-500/80 bg-emerald-950/35 text-emerald-50 ring-emerald-500/30 placeholder:text-emerald-300/60'
    : 'border-emerald-500 bg-emerald-50 text-slate-900 ring-emerald-500/35 placeholder:text-slate-500'
}

/** Flecha por campo (misma leyenda que arriba en «Datos de entrada»). */
function inputRangeArrow(rangeStatus, dark) {
  if (rangeStatus === 'empty')
    return {
      Icon: ArrowLeft,
      iconClass: dark ? 'text-slate-400' : 'text-slate-500',
      hint: 'Sin dato o sin rango de referencia',
    }
  if (rangeStatus === 'low')
    return {
      Icon: ArrowDown,
      iconClass: dark ? 'text-amber-400' : 'text-amber-600',
      hint: 'Por debajo del rango de referencia',
    }
  if (rangeStatus === 'high')
    return {
      Icon: ArrowUp,
      iconClass: dark ? 'text-red-400' : 'text-red-600',
      hint: 'Por encima del rango de referencia',
    }
  return {
    Icon: ArrowRight,
    iconClass: dark ? 'text-emerald-400' : 'text-emerald-600',
    hint: 'Dentro del rango de referencia',
  }
}

/** Fórmula CaO₂ (misma base que `computeResults`: Hb g/dL, SpO₂ %, PaO₂ mmHg). */
function CaO2FormulaRich({ dark, className = '' }) {
  const red = dark ? 'text-red-400' : 'text-red-600'
  return (
    <span
      className={`font-mono font-bold ${dark ? 'text-slate-100' : 'text-slate-900'} ${className}`}
    >
      CaO₂ = (0,0138 × <span className={red}>Hb</span> × <span className={red}>SpO₂</span>) + (0,0031 ×{' '}
      <span className={red}>PaO₂</span>)
    </span>
  )
}

function ReferenceTableRows({ filter, dark }) {
  const filtered =
    filter === 'Todas'
      ? REFERENCE_ROWS
      : REFERENCE_ROWS.filter((r) => r[0] === filter)

  const headCls = dark
    ? 'bg-slate-800 font-extrabold text-teal-300'
    : 'bg-teal-50 font-extrabold text-teal-900'

  let currentCategory = null
  const rows = []
  filtered.forEach((r, i) => {
    if (r[0] !== currentCategory) {
      currentCategory = r[0]
      rows.push(
        <tr key={`cat-${currentCategory}-${i}`}>
          <td className={`${headCls} rounded-none px-3 py-2`} colSpan={7}>
            {currentCategory}
          </td>
        </tr>,
      )
    }
    const borderCell = dark ? 'border-b border-slate-700' : 'border-b border-slate-200'
    rows.push(
      <tr
        key={`${r[1]}-${i}`}
        className={dark ? 'text-slate-200' : 'text-slate-800'}
      >
        <td className={`${borderCell} px-3 py-2 align-top text-sm`}>
          <span
            className={
              dark
                ? 'inline-block rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-400'
                : 'inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600'
            }
          >
            {r[0]}
          </span>
        </td>
        <td className={`${borderCell} px-3 py-2 align-top text-sm font-semibold`}>
          {r[1]}
        </td>
        <td className={`${borderCell} min-w-[10rem] px-3 py-2 align-top text-sm`}>
          {r[2]}
        </td>
        <td className={`${borderCell} px-3 py-2 align-top text-sm`}>
          {r[0] === 'Oxigenación' && r[1] === 'CaO2' ? (
            <CaO2FormulaRich dark={dark} className="text-[13px] leading-snug" />
          ) : (
            r[3]
          )}
        </td>
        <td className={`${borderCell} px-3 py-2 align-top text-sm`}>{r[4]}</td>
        <td className={`${borderCell} px-3 py-2 align-top text-sm whitespace-nowrap`}>
          {r[5]}
        </td>
        <td className={`${borderCell} min-w-[12rem] max-w-[22rem] px-3 py-2 align-top text-sm leading-snug`}>
          {r[6] ?? ''}
        </td>
      </tr>,
    )
  })
  return rows
}

export function CalculadoraView() {
  const [inputs, setInputs] = useState(emptyInputs)
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [dark, setDark] = useState(false)
  const [examplePresetId, setExamplePresetId] = useState('')
  /** Si el usuario escribe ASC a mano (o carga un ejemplo con ASC), no lo sobrescribe el Du Bois. */
  const [ascOverridden, setAscOverridden] = useState(false)

  const results = useMemo(() => computeResults(inputs), [inputs])

  const anthropo = useMemo(() => computeAnthropometrics(inputs), [inputs])

  useEffect(() => {
    if (ascOverridden) return
    const d = anthropo.ascDuBois
    if (d == null) {
      setInputs((prev) => {
        if (prev.asc.trim() === '') return prev
        return { ...prev, asc: '' }
      })
      return
    }
    const nextStr = String(d)
    setInputs((prev) => {
      const cur = parseFloat(prev.asc)
      if (Number.isFinite(cur) && Math.abs(cur - d) < 0.0005) return prev
      if (prev.asc === nextStr) return prev
      return { ...prev, asc: nextStr }
    })
  }, [anthropo.ascDuBois, ascOverridden])

  const chartData = useMemo(() => {
    const primary = dark ? '#5fd4cb' : '#0f766e'
    const scores = radarScores(results)
    return {
      labels: ['Perfusión', 'Flujo', 'CaO2', 'DO2', 'VD', 'Poscarga'],
      datasets: [
        {
          data: scores,
          label: 'Perfil clínico',
          borderColor: primary,
          backgroundColor: dark ? 'rgba(95,212,203,0.22)' : 'rgba(15,118,110,0.18)',
          borderWidth: 2,
          pointRadius: 3,
        },
      ],
    }
  }, [results, dark])

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: {
            color: dark ? 'rgba(148,163,184,0.35)' : 'rgba(100,116,139,0.28)',
          },
          pointLabels: {
            color: dark ? '#e2e8f0' : '#334155',
            font: { size: 12, weight: '600' },
          },
        },
      },
      plugins: { legend: { display: false } },
    }),
    [dark],
  )

  const shockChartData = useMemo(() => {
    const accent = dark ? '#fbbf24' : '#d97706'
    const scores = shockRadarScores(results, inputs)
    return {
      labels: SHOCK_RADAR_AXES.map((a) => a.shortLabel),
      datasets: [
        {
          data: scores,
          label: 'Semejanza (0–100)',
          borderColor: accent,
          backgroundColor: dark ? 'rgba(251,191,36,0.2)' : 'rgba(217,119,6,0.16)',
          borderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    }
  }, [results, inputs, dark])

  const shockChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false },
          grid: {
            color: dark ? 'rgba(148,163,184,0.35)' : 'rgba(100,116,139,0.28)',
          },
          pointLabels: {
            color: dark ? '#e2e8f0' : '#334155',
            font: { size: 11, weight: '600' },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title(items) {
              const i = items[0]?.dataIndex
              if (i == null) return ''
              return SHOCK_RADAR_AXES[i]?.label ?? ''
            },
            label(ctx) {
              return `Semejanza: ${ctx.raw}`
            },
          },
        },
      },
    }),
    [dark],
  )

  const setField = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }))
  }

  const recalc = () => setInputs((prev) => ({ ...prev }))

  const loadPreset = (presetId) => {
    const preset = SAMPLE_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    const next = emptyInputs()
    Object.entries(preset.values).forEach(([k, v]) => {
      next[k] = String(v)
    })
    setInputs(next)
    setExamplePresetId(presetId)
    setAscOverridden(true)
  }

  const clearAll = () => {
    setInputs(emptyInputs())
    setExamplePresetId('')
    setAscOverridden(false)
  }

  const panel = dark
    ? 'rounded-[18px] border border-slate-700 bg-slate-900/90 shadow-lg shadow-black/20'
    : 'rounded-[18px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(27,31,35,0.08)]'

  const innerMuted = dark ? 'text-slate-400' : 'text-slate-500'
  const fieldBg = dark
    ? 'border-slate-600 bg-slate-800 text-slate-100 placeholder:text-slate-500'
    : 'border-[#d8d2c8] bg-[#f1efe9] text-slate-900'

  return (
    <div
      className={
        dark
          ? 'text-slate-100'
          : 'text-slate-900'
      }
    >
      <div className="mx-auto flex max-w-[1450px] flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={
                dark
                  ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-teal-500 to-teal-300 text-lg font-extrabold text-white shadow-lg shadow-black/30'
                  : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-teal-700 to-teal-900 text-lg font-extrabold text-white shadow-[0_10px_30px_rgba(27,31,35,0.12)]'
              }
              aria-hidden
            >
              HD
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight md:text-2xl">
                Dashboard hemodinámico y de oxigenación
              </h2>
              <p className={`mt-1 text-sm ${innerMuted}`}>
                Calculadora interactiva a partir de la tabla del manual adjunto.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={
                dark
                  ? 'rounded-xl border border-slate-600 bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700'
                  : 'rounded-xl border border-[#d8d2c8] bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50'
              }
              onClick={() => setDark((d) => !d)}
            >
              {dark ? 'Modo claro' : 'Modo oscuro'}
            </button>
            <label className="flex items-center gap-2">
              <span className={`sr-only`}>Cargar ejemplo</span>
              <select
                aria-label="Cargar ejemplo hemodinámico"
                value={examplePresetId}
                onChange={(e) => {
                  const id = e.target.value
                  if (id) loadPreset(id)
                }}
                className={
                  dark
                    ? 'min-w-[min(100%,280px)] rounded-xl border border-slate-600 bg-slate-800 py-2.5 pl-3 pr-8 text-sm font-semibold text-slate-100 hover:bg-slate-700'
                    : 'min-w-[min(100%,280px)] rounded-xl border border-[#d8d2c8] bg-white py-2.5 pl-3 pr-8 text-sm font-semibold text-slate-800 hover:bg-slate-50'
                }
              >
                <option value="">Cargar ejemplo…</option>
                {SAMPLE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className={
                dark
                  ? 'rounded-xl border border-slate-600 bg-slate-800 px-3.5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-700'
                  : 'rounded-xl border border-[#d8d2c8] bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50'
              }
              onClick={clearAll}
            >
              Limpiar
            </button>
            <button
              type="button"
              className={
                dark
                  ? 'rounded-xl border border-teal-500 bg-teal-600 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500'
                  : 'rounded-xl border border-teal-700 bg-teal-700 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-teal-800'
              }
              onClick={recalc}
            >
              Recalcular
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <section className={panel}>
            <div
              className={
                dark
                  ? 'border-b border-slate-700 px-5 pb-2.5 pt-[18px]'
                  : 'border-b border-[#d8d2c8] px-5 pb-2.5 pt-[18px]'
              }
            >
              <h3 className="text-[1.08rem] font-semibold">Datos de entrada</h3>
            </div>
            <div className="px-5 pb-5 pt-[18px]">
              <div
                className="mb-4 flex flex-wrap items-center justify-center gap-10 py-1"
                role="img"
                aria-label="Rango normal: flecha derecha verde. Por debajo: flecha abajo amarilla. Por encima: flecha arriba roja. Sin dato: flecha izquierda gris."
              >
                <ArrowRight
                  className={dark ? 'text-emerald-400' : 'text-emerald-600'}
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden
                />
                <ArrowDown
                  className={dark ? 'text-amber-400' : 'text-amber-600'}
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden
                />
                <ArrowUp
                  className={dark ? 'text-red-400' : 'text-red-600'}
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden
                />
                <ArrowLeft
                  className={dark ? 'text-slate-500' : 'text-slate-500'}
                  size={22}
                  strokeWidth={2.5}
                  aria-hidden
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
                {INPUT_FIELD_GROUPS.map((group) => (
                  <div
                    key={group.id}
                    className={
                      dark
                        ? 'flex min-h-0 min-w-0 flex-col rounded-xl border border-slate-700 bg-slate-900/55 p-3 shadow-inner'
                        : 'flex min-h-0 min-w-0 flex-col rounded-xl border border-slate-200 bg-slate-50/90 p-3 shadow-inner'
                    }
                  >
                    <h4
                      className={
                        dark
                          ? 'mb-2.5 shrink-0 border-b border-slate-700 pb-2 text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-teal-300'
                          : 'mb-2.5 shrink-0 border-b border-slate-200 pb-2 text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.14em] text-teal-800'
                      }
                    >
                      {group.title}
                    </h4>
                    <div className="grid min-w-0 grid-cols-3 gap-x-2 gap-y-2.5">
                      {group.fields.map(([id, label, unit]) => {
                        const rs = inputRangeStatus(id, inputs[id])
                        const tone = inputFieldTone(rs, dark, fieldBg)
                        const { Icon: RangeIcon, iconClass, hint } = inputRangeArrow(rs, dark)
                        return (
                          <label key={id} className="flex min-w-0 max-w-full flex-col gap-1">
                            <span
                              className={`truncate text-[0.72rem] font-semibold leading-tight ${innerMuted}`}
                              title={label}
                            >
                              {label}
                            </span>
                            <div className="flex min-w-0 items-stretch gap-1">
                              <span
                                className={
                                  dark
                                    ? 'flex w-7 shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/90'
                                    : 'flex w-7 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white'
                                }
                                title={hint}
                              >
                                <RangeIcon
                                  size={15}
                                  strokeWidth={2.5}
                                  className={`shrink-0 ${iconClass}`}
                                  aria-hidden
                                />
                              </span>
                              <input
                                id={id}
                                name={id}
                                type="number"
                                step="any"
                                placeholder={unit}
                                value={inputs[id]}
                                onChange={(e) => {
                                  const v = e.target.value
                                  if (id === 'asc') setAscOverridden(v.trim() !== '')
                                  setField(id, v)
                                }}
                                className={`min-w-0 flex-1 rounded-lg border px-2 py-1.5 text-xs outline-none focus:ring-2 ${tone}`}
                              />
                            </div>
                          </label>
                        )
                      })}
                    </div>
                    {group.id === 'pressure_fc' && (
                      <div
                        className={
                          dark
                            ? 'mt-3 rounded-lg border border-slate-600 bg-slate-800/60 p-2.5'
                            : 'mt-3 rounded-lg border border-slate-200 bg-white/85 p-2.5'
                        }
                      >
                        <div
                          className={`text-[0.65rem] font-extrabold uppercase tracking-wide ${innerMuted}`}
                        >
                          TAM (automática)
                        </div>
                        <div
                          className={`font-mono text-sm font-bold tabular-nums ${dark ? 'text-slate-100' : 'text-slate-900'}`}
                        >
                          {results.tam != null ? `${results.tam} mmHg` : '—'}
                        </div>
                        <p className={`mt-0.5 text-[0.68rem] leading-snug ${innerMuted}`}>
                          Tensión arterial media: (PAS + 2 × PAD) / 3. Introduce PAS y PAD.
                        </p>
                      </div>
                    )}
                    {group.id === 'anthropometry' && (
                      <div
                        className={
                          dark
                            ? 'mt-3 grid grid-cols-1 gap-2.5 rounded-lg border border-slate-600 bg-slate-800/60 p-2.5 sm:grid-cols-2'
                            : 'mt-3 grid grid-cols-1 gap-2.5 rounded-lg border border-slate-200 bg-white/85 p-2.5 sm:grid-cols-2'
                        }
                      >
                        <div className="min-w-0">
                          <div
                            className={`text-[0.65rem] font-extrabold uppercase tracking-wide ${innerMuted}`}
                          >
                            IMC (automático)
                          </div>
                          <div
                            className={`font-mono text-sm font-bold tabular-nums ${dark ? 'text-slate-100' : 'text-slate-900'}`}
                          >
                            {anthropo.imc != null ? `${anthropo.imc} kg/m²` : '—'}
                          </div>
                          <p className={`mt-0.5 text-[0.68rem] leading-snug ${innerMuted}`}>
                            Peso (kg) ÷ altura (m)².
                          </p>
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-[0.65rem] font-extrabold uppercase tracking-wide ${innerMuted}`}
                          >
                            ASC Du Bois (automático)
                          </div>
                          <div
                            className={`font-mono text-sm font-bold tabular-nums ${dark ? 'text-slate-100' : 'text-slate-900'}`}
                          >
                            {anthropo.ascDuBois != null ? `${anthropo.ascDuBois} m²` : '—'}
                          </div>
                          <p className={`mt-0.5 text-[0.68rem] leading-snug ${innerMuted}`}>
                            {ascOverridden
                              ? 'Has indicado ASC a mano en el bloque inferior: los índices usan ese valor.'
                              : anthropo.ascDuBois != null
                                ? 'El ASC del bloque inferior se completa solo (Du Bois) según peso y altura.'
                                : 'Indica peso y altura para estimar ASC, o escribe ASC a mano abajo.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div
                className={
                  dark
                    ? 'mt-4 rounded-xl border border-red-900/40 bg-red-950/35 p-3.5'
                    : 'mt-4 rounded-xl border border-red-100 bg-red-50/90 p-3.5'
                }
              >
                <p
                  className={
                    dark
                      ? 'mb-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-red-300/95'
                      : 'mb-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-red-800'
                  }
                >
                  Oxigenación — contenido arterial (CaO₂)
                </p>
                <CaO2FormulaRich dark={dark} className="text-xs leading-relaxed md:text-sm" />
                <p
                  className={
                    dark
                      ? 'mt-2 text-[0.78rem] leading-snug text-slate-400'
                      : 'mt-2 text-[0.78rem] leading-snug text-slate-600'
                  }
                >
                  Coeficientes según manual de la calculadora; SpO₂ en escala 0–100&nbsp;%.
                </p>
              </div>
              <div
                className={
                  dark
                    ? 'mt-3.5 rounded-xl bg-slate-800 p-3.5 text-[0.88rem] text-slate-400'
                    : 'mt-3.5 rounded-xl bg-[#f1efe9] p-3.5 text-[0.88rem] text-slate-600'
                }
              >
                Introduce solo los datos disponibles. Con peso y altura se calculan IMC y ASC (Du
                Bois); el ASC estimado se escribe automáticamente en el campo ASC salvo que lo
                edites a mano o cargues un ejemplo. La edad queda registrada para contexto clínico.
                El panel calculará TAM, GC, IC, VS, IVS, RVS, IRVS, RVP, IRVP, PAPI, CaO2, DO2, DO2I,
                VO2, O2ER y delta PCO2 cuando existan variables suficientes.
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-5">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 min-[400px]:gap-3 sm:gap-3.5">
              {IMPORTANT_KEYS.map((k) => {
                const meta = RESULTS_META[k]
                const s = statusFor(k, results[k])
                return (
                  <div key={k} className={`${panel} min-w-0 p-2.5 sm:p-4`}>
                    <div
                      className={`mb-1 truncate text-[0.65rem] font-semibold leading-tight sm:mb-1.5 sm:text-[0.82rem] ${innerMuted}`}
                      title={meta.label}
                    >
                      {meta.label}
                    </div>
                    <div className="truncate text-lg font-extrabold tracking-tight sm:text-2xl">
                      {results[k] ?? '—'}{' '}
                      <span className="text-xs font-semibold sm:text-base">{meta.unit}</span>
                    </div>
                    <div
                      className={`mt-1 line-clamp-2 text-[0.7rem] font-bold leading-snug sm:mt-2 sm:text-[0.85rem] ${statusClass(s.cls, dark)}`}
                      title={s.txt}
                    >
                      {s.txt}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_1fr]">
              <div className={panel}>
                <div
                  className={
                    dark
                      ? 'border-b border-slate-700 px-5 pb-2.5 pt-[18px]'
                      : 'border-b border-[#d8d2c8] px-5 pb-2.5 pt-[18px]'
                  }
                >
                  <h3 className="text-[1.08rem] font-semibold">Resultados calculados</h3>
                </div>
                <div className="overflow-x-auto px-5 pb-5 pt-[18px]">
                  <table className="w-full min-w-[520px] border-collapse text-left text-[0.93rem]">
                    <thead>
                      <tr className={innerMuted}>
                        <th className="pb-2 pr-3 font-bold">Parámetro</th>
                        <th className="pb-2 pr-3 font-bold">Valor</th>
                        <th className="pb-2 pr-3 font-bold">Referencia</th>
                        <th className="pb-2 font-bold">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(RESULTS_META).map(([key, meta]) => {
                        const s = statusFor(key, results[key])
                        return (
                          <tr
                            key={key}
                            className={
                              dark ? 'border-b border-slate-700' : 'border-b border-[#d8d2c8]'
                            }
                          >
                            <td className="py-2.5 pr-3 align-top">{meta.label}</td>
                            <td className="py-2.5 pr-3 align-top">
                              <strong>{results[key] ?? '—'}</strong> {meta.unit}
                            </td>
                            <td className="py-2.5 pr-3 align-top">{meta.ref}</td>
                            <td className={`py-2.5 align-top font-semibold ${statusClass(s.cls, dark)}`}>
                              {s.txt}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                <div className={`${panel} min-w-0`}>
                  <div
                    className={
                      dark
                        ? 'border-b border-slate-700 px-5 pb-2.5 pt-[18px]'
                        : 'border-b border-[#d8d2c8] px-5 pb-2.5 pt-[18px]'
                    }
                  >
                    <h3 className="text-[1.08rem] font-semibold">Perfil rápido</h3>
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <div className="h-[260px] w-full min-[480px]:h-[280px]">
                      <Radar data={chartData} options={chartOptions} />
                    </div>
                    <p className={`mt-3.5 text-[0.84rem] ${innerMuted}`}>
                      El radar resume perfusión, poscarga, función de VD y oxigenación con una
                      escala clínica simplificada de 0 a 100.
                    </p>
                  </div>
                </div>

                <div className={`${panel} min-w-0`}>
                  <div
                    className={
                      dark
                        ? 'border-b border-slate-700 px-5 pb-2.5 pt-[18px]'
                        : 'border-b border-[#d8d2c8] px-5 pb-2.5 pt-[18px]'
                    }
                  >
                    <h3 className="text-[1.08rem] font-semibold">
                      Mapa de shock (patrones hemodinámicos)
                    </h3>
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <div className="h-[260px] w-full min-[480px]:h-[280px]">
                      <Radar data={shockChartData} options={shockChartOptions} />
                    </div>
                    <p className={`mt-3.5 text-[0.84rem] ${innerMuted}`}>
                      Cada vértice corresponde a un tipo de shock de la tabla de referencia (GC,
                      RVS sistémica, precarga/PVC, PAM, SvO₂ o ScvO₂). La forma se actualiza con
                      los datos introducidos; la puntuación (0–100) refleja la semejanza con el
                      patrón cualitativo típico, no el diagnóstico definitivo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={panel}>
              <div
                className={
                  dark
                    ? 'border-b border-slate-700 px-5 pb-2.5 pt-[18px]'
                    : 'border-b border-[#d8d2c8] px-5 pb-2.5 pt-[18px]'
                }
              >
                <h3 className="text-[1.08rem] font-semibold">Tabla de referencia</h3>
              </div>
              <div className="px-5 pb-5 pt-[18px]">
                <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
                  <label htmlFor="categoryFilter" className={`text-sm font-bold ${innerMuted}`}>
                    Agrupar / filtrar:
                  </label>
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className={`min-w-[220px] rounded-xl px-3 py-2.5 text-sm outline-none ring-teal-600/30 focus:ring-2 ${fieldBg}`}
                  >
                    <option value="Todas">Todas las categorías</option>
                    {categoryOptions().map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1020px] border-collapse text-left">
                    <thead>
                      <tr className={innerMuted}>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">Categoría</th>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">Sigla</th>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">
                          Nombre del parámetro
                        </th>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">Fórmula / origen</th>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">Normal</th>
                        <th className="pb-2 pr-3 text-[0.93rem] font-bold">Unidad</th>
                        <th className="pb-2 text-[0.93rem] font-bold">Significado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <ReferenceTableRows filter={categoryFilter} dark={dark} />
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
