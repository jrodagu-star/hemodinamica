import { Fragment, useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Cpu,
  Droplets,
  Gauge,
  HeartPulse,
  Info,
  Layers,
  Microscope,
  Percent,
  ScanLine,
  ShieldAlert,
  Syringe,
  Thermometer,
  Waves,
  X,
} from 'lucide-react'
import {
  LumenInfo,
  MethodCard,
  PressureCurveCard,
  SectionHeader,
} from '../components/ui.jsx'
import { publicAsset } from '../lib/publicAsset.js'

const SWAN_GANZ_SG_TABLE_HREF = publicAsset('ecmo/SG.html')

const IMG_PICCO_PULSION = publicAsset('monitoring/picco-pulsion-monitor.png')
const ALT_PICCO_PULSION =
  'Monitor PulsioFlex con módulo PiCCO (Pulsion): pantalla con CI, GEDVI, ELWI, PVPI, SVRI, onda arterial y tendencias de termodilución y contorno de pulso.'

const IMG_VOLUMEVIEW_EDWARDS = publicAsset('monitoring/volumeview-edwards-monitor.png')
const ALT_VOLUMEVIEW_EDWARDS =
  'Interfaz VolumeView (Edwards): esquema cardiopulmonar con GEDI, GEF, ELWI, PVPI, SVV, CI, SVI, ScvO₂, MAP y gauges de estado hemodinámico.'

const IMG_VOLUMEVIEW_MONTAJE = publicAsset('monitoring/volumeview-montaje.png')
const ALT_VOLUMEVIEW_MONTAJE =
  'Montaje del sistema VolumeView (Edwards): cánula venosa central, catéter arterial femoral con sensor, manifold termistor, transductor TruWave, data box y plataforma EV1000.'

const PICCO_PARAMETER_GROUPS = [
  {
    category: 'Precarga',
    headerClass: 'bg-blue-50 text-blue-900',
    rows: [
      {
        param: 'GEDVI',
        name: 'Volumen diastólico global indexado',
        normal: '680–800 mL/m²',
        td: true,
        continuous: false,
        note: 'Precarga biventricular; más útil que presiones para valorar volumen.',
      },
      {
        param: 'ITBVI',
        name: 'Volumen intratorácico de sangre indexado',
        normal: '850–1000 mL/m²',
        td: true,
        continuous: false,
        note: 'Sangre en tórax (corazón + grandes vasos pulmonares).',
      },
      {
        param: 'SVV / PPV',
        name: 'Variación VS / variación presión de pulso',
        normal: 'SVV <10–15 % (VM controlada)',
        td: false,
        continuous: true,
        note: 'Respuesta dinámica a volumen; requiere VM controlada y ritmo regular.',
      },
    ],
  },
  {
    category: 'Contractilidad',
    headerClass: 'bg-rose-50 text-rose-900',
    rows: [
      {
        param: 'CI / GC',
        name: 'Índice / gasto cardíaco',
        normal: 'IC 2,4–4,0 L/min/m² · GC 3–5 L/min',
        td: true,
        continuous: true,
        note: 'Calibración por termodilución; seguimiento continuo por contorno de pulso.',
      },
      {
        param: 'GEF',
        name: 'Fracción de eyección global',
        normal: '25–35 % (orientativo)',
        td: true,
        continuous: false,
        note: 'Relación SV/GEDV; disponible en VolumeView tras termodilución.',
      },
      {
        param: 'dPmx / CPI',
        name: 'Contractilidad / potencia cardíaca indexada',
        normal: 'CPI >0,5 W/m² (orientativo)',
        td: false,
        continuous: true,
        note: 'Proxies hemodinámicos; interpretar con cautela en soporte mecánico.',
      },
    ],
  },
  {
    category: 'Postcarga',
    headerClass: 'bg-violet-50 text-violet-900',
    rows: [
      {
        param: 'SVRI',
        name: 'Índice de resistencia vascular sistémica',
        normal: '1700–2400 dyn·s·cm⁻⁵·m²',
        td: false,
        continuous: true,
        note: 'Derivado del contorno de pulso entre calibraciones.',
      },
    ],
  },
  {
    category: 'Pulmón',
    headerClass: 'bg-cyan-50 text-cyan-900',
    rows: [
      {
        param: 'ELWI',
        name: 'Agua pulmonar extravascular indexada',
        normal: '3–7 mL/kg peso ideal',
        td: true,
        continuous: false,
        note: 'Congestión pulmonar / edema; >10 sugiere edema relevante.',
      },
      {
        param: 'PVPI',
        name: 'Índice de permeabilidad vascular pulmonar',
        normal: '1,0–3,0',
        td: true,
        continuous: false,
        note: 'ELWI/GEDVI; ayuda a distinguir permeabilidad vs hidrostático.',
      },
    ],
  },
]

/** Fiabilidad del parámetro PiCCO/VolumeView según soporte: high | medium | none */
const PICCO_SUPPORT_RELIABILITY_ROWS = [
  { category: 'Precarga', param: 'GEDVI', biac: 'high', ecmoVv: 'high', ecmoVa: 'high', impella: 'high' },
  { category: 'Precarga', param: 'ITBVI', biac: 'high', ecmoVv: 'medium', ecmoVa: 'medium', impella: 'medium' },
  { category: 'Precarga', param: 'SVV / PPV', biac: 'none', ecmoVv: 'medium', ecmoVa: 'none', impella: 'none' },
  { category: 'Contractilidad', param: 'CI / GC', biac: 'medium', ecmoVv: 'medium', ecmoVa: 'none', impella: 'medium' },
  { category: 'Contractilidad', param: 'GEF', biac: 'medium', ecmoVv: 'medium', ecmoVa: 'medium', impella: 'medium' },
  { category: 'Contractilidad', param: 'dPmx / CPI', biac: 'none', ecmoVv: 'none', ecmoVa: 'none', impella: 'none' },
  { category: 'Postcarga', param: 'SVRI', biac: 'none', ecmoVv: 'medium', ecmoVa: 'none', impella: 'none' },
  { category: 'Pulmón', param: 'ELWI', biac: 'high', ecmoVv: 'high', ecmoVa: 'high', impella: 'high' },
  { category: 'Pulmón', param: 'PVPI', biac: 'high', ecmoVv: 'high', ecmoVa: 'high', impella: 'high' },
]

const PICCO_RELIABILITY_CELL = {
  high: {
    label: 'Muy fiable',
    className: 'bg-emerald-100 font-bold text-emerald-950 ring-1 ring-inset ring-emerald-200',
  },
  medium: {
    label: 'Menos fiable',
    className: 'bg-amber-100 font-semibold text-amber-950 ring-1 ring-inset ring-amber-200',
  },
  none: {
    label: 'No fiable',
    className: 'bg-red-100 font-semibold text-red-950 ring-1 ring-inset ring-red-200',
  },
}

function PiccoReliabilityCell({ level }) {
  const cfg = PICCO_RELIABILITY_CELL[level]
  return (
    <td className="px-2 py-2 text-center">
      <span
        className={`inline-block min-w-[5.5rem] rounded-lg px-2 py-1 text-[10px] leading-tight ${cfg.className}`}
      >
        {cfg.label}
      </span>
    </td>
  )
}

const PICCO_SUPPORT_NOTES = [
  {
    title: 'BIAC',
    text: 'Priorizar termodilución (GEDVI, ELWI). Recalibrar tras cambiar relación de asistencia.',
  },
  {
    title: 'ECMO VV',
    text: 'CI refleja circulación nativa, no flujo ECMO total. SVV/PPV solo con VM controlada y sin arritmias.',
  },
  {
    title: 'ECMO VA',
    text: 'ELWI y GEDVI muy útiles para congestión y distensión del VI. Evitar contorno de pulso continuo.',
  },
  {
    title: 'Impella',
    text: 'Termodilución para volúmenes y ELWI; contorno de pulso invalidado mientras la bomba esté activa.',
  },
]

export function MethodsView({ selectedMethod, setSelectedMethod }) {
  if (selectedMethod === 'picco') {
    return <PiccoVolumeViewDetailView onBack={() => setSelectedMethod(null)} />
  }
  if (selectedMethod === 'swan') {
    return <SwanGanzDetailView onBack={() => setSelectedMethod(null)} />
  }
  if (selectedMethod === 'pai') {
    return <InvasiveArterialDetailView onBack={() => setSelectedMethod(null)} />
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-20 pt-4 text-center">
      <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">
        Técnicas de monitorización
      </h2>
      <p className="mx-auto max-w-2xl text-sm text-slate-600">
        Tarjetas con parámetros típicos; entra en Swan-Ganz para ver morfología de
        ondas y apuntes de seguridad.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-2 lg:grid-cols-3">
        <MethodCard
          title="Swan-Ganz (CAP)"
          icon={Microscope}
          type="Invasivo"
          description="Presiones de cavidades derechas, PCP y SvO₂ mixta."
          parameters={['PCP', 'SvO₂ mixta', 'PAP']}
          color="border-blue-500"
          onClick={() => setSelectedMethod('swan')}
        />
        <MethodCard
          title="PiCCO / VolumeView"
          icon={Gauge}
          type="Invasivo"
          description="Termodilución transpulmonar y volumen preload."
          parameters={['GEDI', 'ELWI', 'GCc']}
          color="border-emerald-500"
          onClick={() => setSelectedMethod('picco')}
        />
        <MethodCard
          title="Vigileo (FloTrac)"
          icon={Activity}
          type="Mín. invasivo"
          description="Estimación de GC y variación del pulso a partir de arteria radial."
          parameters={['SVV', 'GCc', 'RVS']}
          color="border-orange-500"
          disabled
        />
        <MethodCard
          title="Presión arterial invasiva"
          icon={Gauge}
          type="Invasivo"
          description="Onda continua, PAM y derivadas."
          parameters={['PAM', 'PAS/PAD']}
          color="border-red-500"
          onClick={() => setSelectedMethod('pai')}
        />
        <MethodCard
          title="Curva de PVC"
          icon={Waves}
          type="Invasivo"
          description="Ondas a, c, v y relación con el ciclo cardíaco."
          parameters={['PVC media']}
          color="border-slate-500"
          disabled
        />
      </div>
    </div>
  )
}

function PiccoVolumeViewDetailView({ onBack }) {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a técnicas
      </button>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-emerald-700 to-teal-900 p-10 text-white">
          <h2 className="flex flex-col items-center gap-4 text-3xl font-black tracking-tighter uppercase md:flex-row md:items-center md:justify-start">
            <Gauge size={40} className="text-emerald-200" aria-hidden />
            PiCCO / VolumeView
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed font-medium text-emerald-100">
            Monitorización hemodinámica avanzada por{' '}
            <strong className="text-white">termodilución transpulmonar (TDTP)</strong> y análisis
            continuo del <strong className="text-white">contorno de pulso arterial</strong>. Requiere
            catéter arterial (habitual femoral) con termistor y acceso venoso central para el bolo de
            indicador.
          </p>
        </div>

        <div className="space-y-12 p-8 md:p-10">
          <section>
            <SectionHeader title="Montaje VolumeView (Edwards)" icon={Syringe} />
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              Esquema del <strong className="text-slate-900">montaje del sistema VolumeView</strong>:
              acceso venoso central para el bolo de termodilución, catéter arterial femoral con sensor,
              transductor de presión y conexión a la plataforma EV1000.
            </p>
            <figure className="mt-5">
              <button
                type="button"
                onClick={() =>
                  setLightbox({ src: IMG_VOLUMEVIEW_MONTAJE, alt: ALT_VOLUMEVIEW_MONTAJE })
                }
                className="group flex w-full cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-teal-200 bg-white p-4 shadow-inner transition hover:ring-2 hover:ring-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                aria-label="Ampliar esquema de montaje VolumeView"
              >
                <img
                  src={IMG_VOLUMEVIEW_MONTAJE}
                  alt=""
                  className="max-h-[min(70vh,520px)] w-auto max-w-full object-contain"
                  loading="lazy"
                />
              </button>
              <figcaption className="mt-3 text-center text-[11px] leading-relaxed text-slate-600">
                Sensor VolumeView, cánula femoral arterial, manifold termistor, vía venosa central,
                transductor TruWave, data box y monitor EV1000.{' '}
                <span className="font-medium text-teal-700">Pulsa para ampliar.</span>
              </figcaption>
            </figure>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader title="Consolas PiCCO y VolumeView" icon={ScanLine} />
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              Referencia visual de las interfaces de monitor. Pulsa cada miniatura para verla en grande.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <figure className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({ src: IMG_PICCO_PULSION, alt: ALT_PICCO_PULSION })
                  }
                  className="group flex h-36 w-full max-w-xs cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-emerald-200 bg-slate-50 p-2 shadow-inner transition hover:ring-2 hover:ring-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:h-40"
                  aria-label="Ampliar monitor PiCCO Pulsion"
                >
                  <img
                    src={IMG_PICCO_PULSION}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-2 max-w-xs text-center text-[10px] leading-snug text-slate-600">
                  <strong className="text-emerald-900">PiCCO · Pulsion</strong> — PulsioFlex y módulo
                  PiCCO. <span className="font-medium text-emerald-700">Ampliar</span>
                </figcaption>
              </figure>
              <figure className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({ src: IMG_VOLUMEVIEW_EDWARDS, alt: ALT_VOLUMEVIEW_EDWARDS })
                  }
                  className="group flex h-36 w-full max-w-xs cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-teal-200 bg-slate-50 p-2 shadow-inner transition hover:ring-2 hover:ring-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:h-40"
                  aria-label="Ampliar interfaz VolumeView Edwards"
                >
                  <img
                    src={IMG_VOLUMEVIEW_EDWARDS}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-2 max-w-xs text-center text-[10px] leading-snug text-slate-600">
                  <strong className="text-teal-900">VolumeView · Edwards</strong> — pantalla con
                  parámetros y semáforos. <span className="font-medium text-teal-700">Ampliar</span>
                </figcaption>
              </figure>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader title="Cómo funciona" icon={HeartPulse} />
            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm leading-relaxed text-slate-700">
                <p className="font-bold text-emerald-950">1 · Termodilución transpulmonar (intermitente)</p>
                <p className="mt-2">
                  Se inyecta un <strong>bolo de suero frío</strong> (típicamente 15 mL) por vía venosa
                  central. El indicador atraviesa el corazón derecho, pulmón y corazón izquierdo hasta
                  detectarse en el <strong>termistor del catéter arterial</strong> (curva de dilución
                  transpulmonar).
                </p>
                <p className="mt-2">
                  A partir de la forma y el área bajo la curva se calculan{' '}
                  <strong>gasto cardíaco</strong>, <strong>volumen diastólico global (GEDV)</strong>,{' '}
                  <strong>volumen intratorácico de sangre (ITBV)</strong> y{' '}
                  <strong>agua pulmonar extravascular (EVLW)</strong>.
                </p>
              </div>
              <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5 text-sm leading-relaxed text-slate-700">
                <p className="font-bold text-teal-950">2 · Contorno de pulso (continuo)</p>
                <p className="mt-2">
                  Tras cada calibración por termodilución, el sistema analiza la{' '}
                  <strong>onda de presión arterial</strong> para estimar de forma continua el gasto,
                  variaciones del volumen sistólico (SVV), resistencias y proxies de contractilidad.
                </p>
                <p className="mt-2">
                  La precisión del modo continuo depende de la{' '}
                  <strong>calidad de la onda</strong>, la frecuencia de recalibración y las condiciones
                  del paciente (ritmo, asistencia mecánica, etc.).
                </p>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader title="Qué es la termodilución" icon={Thermometer} />
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                La <strong>termodilución</strong> cuantifica el gasto cardíaco midiendo el cambio de
                temperatura sanguínea tras inyectar un volumen conocido de fluido a temperatura distinta
                (habitualmente <strong>suero a 0–4 °C</strong>).
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-blue-900">
                    Swan-Ganz (pulmonar)
                  </p>
                  <p className="mt-2 text-[13px]">
                    Bolo en vía proximal del CAP; termistor en arteria pulmonar. Mide el gasto que pasa
                    por la AP.
                  </p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-900">
                    PiCCO / VolumeView (transpulmonar)
                  </p>
                  <p className="mt-2 text-[13px]">
                    Bolo en vía central; termistor en <strong>arteria femoral</strong>. El indicador
                    cruza pulmón y permite estimar también{' '}
                    <strong>volúmenes y agua extravascular pulmonar</strong>.
                  </p>
                </div>
              </div>
              <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px]">
                En la práctica se realizan <strong>3 bolos consecutivos</strong> (descartando el primero
                si el protocolo lo indica) y se promedia. Repetir tras cambios hemodinámicos relevantes,
                reorientación del paciente o intervenciones (líquidos, vasopresores, soporte mecánico).
              </p>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader title="Parámetros, método de medición y valores normales" icon={Layers} />
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              Referencia orientativa para adultos; contrastar con protocolo del servicio y versión del
              monitor (PiCCO, VolumeView).
            </p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-inner">
              <table className="w-full min-w-[920px] border-collapse text-left text-[12px] text-slate-800">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-600">
                    <th className="px-3 py-2.5">Sigla</th>
                    <th className="px-3 py-2.5">Parámetro</th>
                    <th className="px-3 py-2.5">Referencia</th>
                    <th className="px-3 py-2.5 text-center">TDTP</th>
                    <th className="px-3 py-2.5 text-center">Continuo</th>
                    <th className="px-3 py-2.5">Notas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PICCO_PARAMETER_GROUPS.map((group) => (
                    <Fragment key={group.category}>
                      <tr className={group.headerClass}>
                        <td
                          colSpan={6}
                          className="px-3 py-2 text-[11px] font-black uppercase tracking-wide"
                        >
                          {group.category}
                        </td>
                      </tr>
                      {group.rows.map((row) => (
                        <tr key={row.param} className="bg-white align-top">
                          <td className="px-3 py-2.5 font-mono font-bold text-emerald-900">
                            {row.param}
                          </td>
                          <td className="px-3 py-2.5 font-medium">{row.name}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-slate-600">
                            {row.normal}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {row.td ? (
                              <span className="font-bold text-emerald-700">✓</span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {row.continuous ? (
                              <span className="font-bold text-teal-700">✓</span>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2.5 leading-snug text-slate-600">{row.note}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11px] italic text-slate-500">
              TDTP = termodilución transpulmonar (bolo frío). Continuo = análisis del contorno de pulso
              entre calibraciones.
            </p>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader
              title="Termodilución vs monitorización continua"
              icon={Droplets}
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h4 className="text-xs font-black uppercase tracking-wide text-emerald-900">
                  Con termodilución (bolo)
                </h4>
                <ul className="mt-3 list-inside list-disc space-y-1.5 text-[13px] leading-snug text-slate-700">
                  <li>CI / GC</li>
                  <li>GEDV / GEDVI</li>
                  <li>ITBV / ITBVI</li>
                  <li>EVLW / ELWI</li>
                  <li>PVPI</li>
                  <li>Calibración del algoritmo de contorno de pulso</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5">
                <h4 className="text-xs font-black uppercase tracking-wide text-teal-900">
                  De forma continua (entre bolos)
                </h4>
                <ul className="mt-3 list-inside list-disc space-y-1.5 text-[13px] leading-snug text-slate-700">
                  <li>CCI / SV / SVI</li>
                  <li>SVV y PPV (respuesta dinámica a volumen)</li>
                  <li>SVR / SVRI</li>
                  <li>dPmx, CPI (contractilidad / potencia)</li>
                  <li>Tendencias de gasto y poscarga</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-10">
            <SectionHeader title="Uso con soporte mecánico circulatorio" icon={Cpu} />
            <p className="mt-3 text-[13px] leading-relaxed text-slate-600">
              Fiabilidad orientativa de cada parámetro según el dispositivo de soporte. La termodilución
              suele mantener más valor que el contorno de pulso continuo cuando la onda arterial está
              alterada. Combinar siempre con eco y contexto clínico.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide">
              <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-emerald-950 ring-1 ring-emerald-200">
                Muy fiable
              </span>
              <span className="rounded-lg bg-amber-100 px-2.5 py-1 text-amber-950 ring-1 ring-amber-200">
                Menos fiable
              </span>
              <span className="rounded-lg bg-red-100 px-2.5 py-1 text-red-950 ring-1 ring-red-200">
                No fiable
              </span>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-inner">
              <table className="w-full min-w-[760px] border-collapse text-left text-[12px] text-slate-800">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-600">
                    <th className="px-3 py-2.5">Categoría</th>
                    <th className="px-3 py-2.5">Parámetro</th>
                    <th className="px-2 py-2.5 text-center">BIAC</th>
                    <th className="px-2 py-2.5 text-center">ECMO VV</th>
                    <th className="px-2 py-2.5 text-center">ECMO VA</th>
                    <th className="px-2 py-2.5 text-center">Impella</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PICCO_SUPPORT_RELIABILITY_ROWS.map((row) => (
                    <tr key={row.param} className="bg-white align-middle">
                      <td className="px-3 py-2.5 text-[11px] font-semibold text-slate-500">
                        {row.category}
                      </td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{row.param}</td>
                      <PiccoReliabilityCell level={row.biac} />
                      <PiccoReliabilityCell level={row.ecmoVv} />
                      <PiccoReliabilityCell level={row.ecmoVa} />
                      <PiccoReliabilityCell level={row.impella} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PICCO_SUPPORT_NOTES.map((note) => (
                <p
                  key={note.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12px] leading-relaxed text-slate-700"
                >
                  <strong className="text-slate-900">{note.title}:</strong> {note.text}
                </p>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 border-t border-slate-200 pt-10 md:grid-cols-2">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-800">
                <AlertCircle size={16} aria-hidden />
                Limitaciones generales
              </h4>
              <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-amber-950/90">
                <li>Arritmias: invalidan SVV/PPV y pueden alterar curvas de termodilución.</li>
                <li>TEP o shunts importantes: distorsionan volúmenes pulmonares y EVLW.</li>
                <li>Fugas aórticas, IM severa o IA: afectan el contorno de pulso.</li>
                <li>Recalibrar tras líquidos, cambios de PEEP, posición o soporte mecánico.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-700">
                <Info size={16} aria-hidden />
                Requisitos técnicos
              </h4>
              <ul className="mt-3 list-inside list-disc space-y-2 text-xs leading-relaxed text-slate-700">
                <li>Catéter arterial con termistor (femoral recomendado en muchos protocolos).</li>
                <li>Vía venosa central para bolos (misma vía y técnica estandarizada).</li>
                <li>Transductor arterial calibrado y fast flush correcto.</li>
                <li>Evitar bolos durante cambios bruscos de vasopresores o VM.</li>
              </ul>
            </div>
          </section>

          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
            Contenido educativo. PiCCO y VolumeView son marcas de Pulsion/Getinge; seguir IFU y protocolo
            de monitorización hemodinámica de tu hospital.
          </p>
        </div>
      </div>

      {lightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

function SwanGanzDetailView({ onBack }) {
  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a técnicas
      </button>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-8 bg-blue-700 p-10 text-white md:flex-row">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="flex flex-col items-center gap-4 text-3xl font-black tracking-tighter uppercase md:flex-row md:items-center md:justify-start">
              <Microscope size={40} className="text-blue-300" aria-hidden />
              Catéter de arteria pulmonar (Swan-Ganz)
            </h2>
            <p className="mt-4 text-sm leading-relaxed font-medium text-blue-100 italic">
              Monitorización invasiva guiada por la morfología de la onda de
              presión durante el avance del catéter.
            </p>
          </div>
        </div>

        <div className="space-y-12 p-8">
          <section>
            <SectionHeader title="Morfología de ondas en la inserción" icon={Waves} />
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-[2rem] border-4 border-slate-800 bg-slate-950 p-6 shadow-2xl">
                  <div className="mb-4 flex items-center justify-between font-mono text-[10px] text-blue-400/80">
                    <span className="tracking-widest uppercase">
                      Monitor de inserción
                    </span>
                    <span className="text-slate-500">0 – 30 mmHg</span>
                  </div>

                  <div className="relative h-64 rounded-xl border border-white/5 bg-slate-900/20">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 400 150"
                      preserveAspectRatio="none"
                      className="relative z-10"
                      aria-hidden
                    >
                      <path
                        d="M0 130 Q 5 125, 10 130 Q 15 127, 20 130 T 40 130 T 60 130 T 80 130"
                        stroke="#3b82f6"
                        fill="none"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M80 130 L 95 15 L 105 145 L 125 15 L 135 145 L 155 15 L 165 145 L 175 15 L 180 145"
                        stroke="#f87171"
                        fill="none"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M180 145 L 195 15 Q 200 35, 205 60 L 208 75 L 225 15 Q 230 35, 235 60 L 238 75 L 255 15 Q 260 35, 265 60 L 268 75"
                        stroke="#fbbf24"
                        fill="none"
                        strokeWidth="2.5"
                      />
                      <path
                        d="M268 75 L 285 75 Q 290 70, 295 75 Q 300 73, 305 75 T 330 75 T 355 75 T 380 75 T 400 75"
                        stroke="#10b981"
                        fill="none"
                        strokeWidth="2.5"
                      />

                      <line
                        x1="95"
                        y1="15"
                        x2="255"
                        y2="15"
                        stroke="white"
                        strokeWidth="1"
                        strokeDasharray="4"
                        opacity="0.2"
                      />
                      <line
                        x1="208"
                        y1="75"
                        x2="330"
                        y2="75"
                        stroke="white"
                        strokeWidth="1"
                        strokeDasharray="4"
                        opacity="0.2"
                      />

                      <g className="fill-white/40 font-black text-[10px] uppercase tracking-tighter">
                        <text x="25" y="145">
                          AD
                        </text>
                        <text x="110" y="145">
                          VD
                        </text>
                        <text x="210" y="145">
                          AP
                        </text>
                        <text x="325" y="145">
                          PCP
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:col-span-5">
                <PressureCurveCard
                  title="AD (PVC)"
                  range="2 – 8"
                  desc="Venosa"
                  curveType="ra"
                  small
                />
                <PressureCurveCard
                  title="VD"
                  range="25 / 5"
                  desc="Pico sistólico"
                  curveType="rv"
                  small
                />
                <PressureCurveCard
                  title="Arteria pulmonar"
                  range="25 / 10"
                  desc="Sistólica ≈ VD"
                  curveType="pa"
                  small
                />
                <PressureCurveCard
                  title="PCP"
                  range="6 – 12"
                  desc="Nivel diastólico AP"
                  curveType="wedge"
                  small
                />
              </div>

              <figure className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm lg:col-span-7">
                <img
                  src={publicAsset('Curvas_SG.png')}
                  alt="ECG y trazado de presión durante inserción del catéter Swan-Ganz: aurícula derecha, ventrículo derecho, arteria pulmonar, inflado del balón y cuña."
                  className="mx-auto h-64 w-full rounded-lg bg-white object-contain object-center shadow-inner"
                  loading="lazy"
                />
                <figcaption className="mt-2 text-center text-xs leading-relaxed text-slate-600">
                  Misma morfología en trazado clínico (referencia).
                </figcaption>
              </figure>
            </div>

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-blue-900">
                    Parámetros Swan-Ganz (tabla de referencia)
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600 md:text-sm">
                    Contenido de{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800">
                      ecmo/SG.html
                    </code>
                    : valores normales y unidades. Vista embebida; si no carga, ábrala en una pestaña
                    nueva.
                  </p>
                </div>
                <a
                  href={SWAN_GANZ_SG_TABLE_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-bold text-blue-900 shadow-sm transition hover:bg-blue-50"
                >
                  Abrir en nueva pestaña
                </a>
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
                <iframe
                  title="Parámetros medidos con catéter de arteria pulmonar (Swan-Ganz)"
                  src={SWAN_GANZ_SG_TABLE_HREF}
                  className="h-[min(75vh,720px)] w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 pt-12">
            <SectionHeader
              title="Cómo se inserta: introductor y avance del CAP"
              icon={Syringe}
            />
            <div className="space-y-8 text-left">
              <p className="rounded-2xl border border-blue-100 bg-blue-50/80 p-5 text-sm leading-relaxed text-slate-800">
                <strong>Inserción del introductor</strong> en el acceso venoso
                escogido (<strong>técnica de Seldinger modificada</strong>).
              </p>

              <ul className="space-y-4 text-sm leading-relaxed text-slate-700">
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    Orientar la curva del CAP y conectar la luz distal al
                    transductor de presión.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    Conocer la distancia estimada desde el acceso venoso hasta la
                    AD, donde se inflará el balón para continuar avanzando (
                    <strong>volumen máximo de inflado del balón: 1,5 mL</strong>
                    ).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    Balón <strong>completamente inflado</strong> al avanzar y{' '}
                    <strong>completamente desinflado</strong> al retirar.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    Recordar la <strong>regla de los 10–15 cm</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    <strong>Punta en VD:</strong> aumenta la presión sistólica;
                    posibles arritmias. <strong>Avanzar sin demora.</strong>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    <strong>Punta en AP:</strong> aumenta la presión diastólica y
                    aparece la <strong>muesca dícrota</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>Avanzar hasta obtener el trazado de PCP.</span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                    aria-hidden
                  />
                  <span>
                    Al desinflar el balón debe reaparecer la curva de PAP; si no es
                    así, retirar lentamente el CAP hasta que reaparezca la curva
                    PAP.
                  </span>
                </li>
              </ul>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h4 className="mb-4 text-xs font-black tracking-wide text-slate-800 uppercase">
                  Si existen dudas
                </h4>
                <ul className="space-y-4 text-sm text-slate-700">
                  <li>
                    <strong className="text-slate-900">Registro ECG simultáneo:</strong>{' '}
                    el pico sistólico en AP aparece{' '}
                    <strong>antes</strong> que la onda T; la onda «v» en PCP
                    aparece <strong>después</strong> de la onda T.
                  </li>
                  <li>
                    <strong className="text-slate-900">
                      Análisis de muestra de sangre de la luz distal con balón
                      inflado:
                    </strong>
                    <ul className="mt-3 space-y-2 border-l-2 border-blue-200 pl-4 text-slate-600">
                      <li>PcO₂ &gt; 19 mmHg respecto a PaO₂</li>
                      <li>PcCO₂ &lt; 11 mmHg respecto a PaCO₂</li>
                      <li>pHc &gt; 0,008 respecto a pHa</li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6">
                <h4 className="mb-4 text-xs font-black tracking-wide text-emerald-900 uppercase">
                  Posición final
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed text-emerald-950/90">
                  <li className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>
                      Curva de PCP obtenida con un{' '}
                      <strong>75–100 % de 1,5 mL</strong> (volumen máximo de
                      inflado del balón).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>
                      Si <strong>&lt; 1 mL</strong>: punta demasiado distal.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>
                      Si no se consigue PCP con 1,5 mL o tarda{' '}
                      <strong>2–3 s</strong>: punta demasiado proximal.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>
                      Adecuada sujeción, apósito estéril y{' '}
                      <strong>anotar la distancia</strong> de inserción.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span aria-hidden>•</span>
                    <span>
                      <strong>Control radiológico</strong> inmediato y diario.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <figure className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-100 bg-white p-6 shadow-inner md:p-10">
              <img
                src={publicAsset('SG_luces.png')}
                alt="Catéter de Swan-Ganz con etiquetas en español: vía proximal, termistor, vías de medicación, vía distal, vía del balón con jeringa y punta del balón."
                className="h-auto w-full max-w-xl rounded-2xl object-contain"
                loading="lazy"
              />
              <figcaption className="mt-4 max-w-xl text-center text-[11px] text-slate-500">
                Puertos y marcaje en centímetros del cuerpo del catéter.
              </figcaption>
            </figure>
            <div className="space-y-4 text-left">
              <LumenInfo
                color="bg-yellow-400"
                title="Puerto distal (AP)"
                desc="PAP y muestra / SvO₂ mixta según configuración."
              />
              <LumenInfo
                color="bg-blue-500"
                title="Puerto proximal (AD)"
                desc="PVC habitualmente; vía para bolos termodilución."
              />
              <LumenInfo
                color="bg-red-400"
                title="Balón"
                desc="Inflado guiado (típico ~1,5 mL) para avanzar y wedging."
              />
              <LumenInfo
                color="bg-green-500"
                title="Termistor"
                desc="Sensor de temperatura para GC por termodilución."
              />
            </div>
          </section>

          <section className="border-t border-slate-200 pt-12">
            <SectionHeader
              title="Radiología: comprobación del Swan-Ganz"
              icon={ScanLine}
            />
            <figure className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-[3rem] border border-slate-100 bg-white p-6 shadow-inner md:p-10">
              <div className="w-full rounded-xl bg-slate-950 p-2 shadow-inner">
                <img
                  src={publicAsset('SG_Rxtx.png')}
                  alt="Radiografía de tórax con catéter de arteria pulmonar (Swan-Ganz): trayectoria y punta respecto a silueta cardíaca y campos pulmonares."
                  className="mx-auto h-auto w-full rounded-lg object-contain"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-4 max-w-xl text-center text-[11px] leading-relaxed text-slate-500">
                Imagen de referencia para valorar curso y posición del CAP; el
                control radiológico inmediato y seriado forma parte del seguimiento
                según protocolo.
              </figcaption>
            </figure>
          </section>

          <section className="grid grid-cols-1 gap-8 pt-8 text-left md:grid-cols-2">
            <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-8">
              <h4 className="mb-6 flex items-center gap-2 text-xs font-black tracking-wide text-red-700 uppercase">
                <ShieldAlert size={18} aria-hidden />
                Contraindicaciones (ejemplos)
              </h4>
              <ul className="space-y-3 text-xs text-red-800 italic">
                <li>• Prótesis valvular derecha mecánica (riesgo de enredo).</li>
                <li>• Bloqueo de rama izquierda (riesgo arrítmico al paso de cable).</li>
                <li>• Masas o vegetaciones en VD/AD.</li>
              </ul>
            </div>
            <div className="rounded-[2.5rem] border border-amber-100 bg-amber-50 p-8">
              <h4 className="mb-6 flex items-center gap-2 text-xs font-black tracking-wide text-amber-700 uppercase">
                <AlertCircle size={18} aria-hidden />
                Complicaciones (ejemplos)
              </h4>
              <ul className="space-y-3 text-xs text-amber-800 italic">
                <li>• Hemorragia o ruptura vascular (balón sobreinfundido / wedging prolongado).</li>
                <li>• Arritmias ventriculares al paso por VD.</li>
                <li>• Infarto pulmonar por enclavamiento distal prolongado.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

const IMG_TA_INVASIVA2 = encodeURI(publicAsset('Ta invasiva2.png'))
const IMG_VARIACION_PULSO = publicAsset('Var_pulso.png')

function InvasiveArterialDetailView({ onBack }) {
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a técnicas
      </button>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-red-700 to-rose-900 p-10 text-white">
          <h2 className="flex flex-col items-center gap-4 text-3xl font-black tracking-tighter uppercase md:flex-row md:items-center md:justify-start">
            <Gauge size={40} className="text-red-200" aria-hidden />
            Presión arterial invasiva (línea arterial)
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed font-medium text-red-100">
            Monitorización continua de la presión arterial mediante catéter en
            una arteria periférica o central; la señal analógica se digitaliza y
            muestra como onda y valores numéricos.
          </p>
        </div>

        <div className="space-y-10 p-8 md:p-10">
          <section>
            <SectionHeader title="Qué es y qué mide" icon={HeartPulse} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:items-stretch sm:gap-6 lg:gap-8">
              <figure className="flex min-w-0 flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: publicAsset('TAI.png'),
                      alt:
                        'Esquema de sistema de presión arterial invasiva: catéter arterial, transductor y monitorización de la onda y valores.',
                    })
                  }
                  className="group flex h-[220px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-inner transition hover:ring-2 hover:ring-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Ampliar imagen: montaje de línea arterial"
                >
                  <img
                    src={publicAsset('TAI.png')}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-3 text-center text-[10px] leading-snug text-slate-500 sm:text-[11px]">
                  Montaje típico de línea arterial con transductor para lectura continua
                  de presión. <span className="text-blue-600">Pulsa para ampliar.</span>
                </figcaption>
              </figure>
              <figure className="flex min-w-0 flex-col">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: IMG_TA_INVASIVA2,
                      alt:
                        'Fast flush test: comprobación de la respuesta dinámica del sistema de medición de presión arterial invasiva y calidad del trazado.',
                    })
                  }
                  className="group flex h-[220px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-red-100 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Ampliar imagen: fast flush test"
                >
                  <img
                    src={IMG_TA_INVASIVA2}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-3 text-center text-[10px] leading-snug text-slate-600">
                  <strong className="text-slate-700">Fast flush test:</strong>{' '}
                  validación del sistema (respuesta en frecuencia / amortiguación)
                  y aspecto de la onda cuadrada para asegurar monitorización fiable.{' '}
                  <span className="text-blue-600">Pulsa para ampliar.</span>
                </figcaption>
              </figure>
            </div>

            {lightbox ? (
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Vista ampliada"
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
                onClick={() => setLightbox(null)}
              >
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                  aria-label="Cerrar"
                >
                  <X size={28} strokeWidth={2} aria-hidden />
                </button>
                <img
                  src={lightbox.src}
                  alt={lightbox.alt}
                  className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : null}

            <div className="mt-8 space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                La <strong>presión arterial invasiva</strong> consiste en canalizar
                una arteria (habitualmente <strong>radial</strong>, también braquial,
                femoral u otras según contexto) con un catéter conectado mediante
                tubuladura rígida a un <strong>transductor</strong> de presión,
                calibrado y puesto a cero en el nivel aproximado de la aurícula
                derecha (referencia de «nivel cardíaco»).
                </p>
                <p>
                Permite registrar la <strong>forma de onda arterial</strong> en
                tiempo real y valores derivados:
                </p>
                <ul className="ml-4 list-inside list-disc space-y-2 border-l-4 border-red-200 pl-4">
                <li>
                  <strong>PAS</strong> (presión sistólica) y{' '}
                  <strong>PAD</strong> (presión diastólica).
                </li>
                <li>
                  <strong>PAM</strong> (presión arterial media), habitualmente
                  estimada como{' '}
                  <span className="font-mono text-xs">
                    PAD + (PAS − PAD) / 3
                  </span>{' '}
                  en ritmo regular (o calculada por integración del trazado).
                </li>
                <li>
                  Morfología útil: ascenso sistólico,{' '}
                  <strong>muesca dícrota</strong>, ritmo dicrótico y relación con el
                  ciclo respiratorio.
                </li>
                </ul>
                <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-slate-600">
                La línea arterial es referencia para perfusión sistémica y,
                indirectamente, para algoritmos que estiman gasto y respuesta a
                volumen cuando se analiza la variación del pulso respecto al ciclo
                respiratorio (ver abajo).
                </p>
            </div>
          </section>

          <section>
            <SectionHeader title="Presión de pulso" icon={Activity} />
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                La <strong>presión de pulso</strong> (<strong>PP</strong>) es la
                diferencia entre la presión sistólica y la diastólica:
              </p>
              <p className="rounded-xl bg-red-50 px-4 py-3 text-center font-mono text-base font-bold text-red-900">
                PP = PAS − PAD
              </p>
              <p>
                Refleja de forma integrada el volumen de eyección del ventrículo
                izquierdo (de forma imperfecta), la{' '}
                <strong>distensibilidad arterial</strong> y factores como la
                frecuencia cardíaca y la poscarga. Valores muy bajos pueden asociarse
                a gasto bajo o vasoconstricción periférica marcada; valores muy
                elevados sugieren hipertensión de pulso (p. ej. insuficiencia aórtica
                grave, alteraciones de compliance), siempre en contexto clínico.
              </p>
            </div>
          </section>

          <section>
            <SectionHeader title="Variación de la presión de pulso" icon={Info} />
            <div className="space-y-4 text-sm leading-relaxed text-slate-700">
              <p>
                Durante la ventilación mecánica, las variaciones intratorácicas
                modulan el retorno venoso y, con ello, el volumen diastólico del VI,
                lo que se traduce en{' '}
                <strong>cambios periódicos en PAS, PAD y en la PP</strong> a lo
                largo del ciclo respiratorio.
              </p>
              <p>
                La <strong>variación de presión de pulso</strong> (
                <strong>PPV</strong>, del inglés{' '}
                <span className="italic">pulse pressure variation</span>) cuantifica
                esa oscilación de la PP entre el momento de mayor y menor PP en un
                ciclo respiratorio. Una forma habitual de expresarla en porcentaje
                es:
              </p>
              <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-center font-mono text-xs leading-relaxed text-amber-950 md:text-sm">
                PPV (%) ≈ 100 × (PP<sub>máx</sub> − PP<sub>mín</sub>) / [(PP
                <sub>máx</sub> + PP<sub>mín</sub>) / 2]
              </p>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-6">
                <figure className="mx-auto w-full max-w-xs shrink-0 rounded-2xl border border-amber-100 bg-amber-50/50 p-3 sm:max-w-sm lg:col-span-4 lg:mx-0 lg:max-w-none">
                  <img
                    src={IMG_VARIACION_PULSO}
                    alt="Esquema de variación de la presión de pulso durante el ciclo respiratorio en relación con ventilación mecánica."
                    className="mx-auto h-auto w-full rounded-lg object-contain"
                    loading="lazy"
                  />
                  <figcaption className="mt-2 text-center text-[10px] leading-relaxed text-slate-600 lg:text-left">
                    Ilustración de la variación del pulso arterial / presión de pulso en
                    función del ciclo respiratorio (interpretación junto al texto).
                  </figcaption>
                </figure>

                <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-8">
                <h4 className="mb-3 text-xs font-black tracking-wide text-slate-800 uppercase">
                  Valores orientativos (respuesta a volumen en VM)
                </h4>
                <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                  Umbrales habituales en la literatura para pacientes en{' '}
                  <strong>ventilación mecánica controlada</strong>,{' '}
                  <strong>ritmo sinusal</strong> y variación respiratoriosa clara; la
                  definición exacta del índice y el dispositivo modifican el número.
                  No son «normales» fisiológicos globales, sino referencias para decidir
                  prueba de volumen.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[280px] text-left text-xs text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-200 font-black uppercase tracking-wider text-[10px] text-slate-500">
                        <th className="py-2 pr-3">Índice</th>
                        <th className="py-2 pr-3">Umbral típico</th>
                        <th className="py-2">Interpretación habitual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="align-top">
                        <td className="py-3 pr-3 font-semibold">
                          PPV
                          <div className="font-normal text-[10px] text-slate-500">
                            Variación de presión de pulso
                          </div>
                        </td>
                        <td className="py-3 pr-3 font-mono text-[11px]">
                          ≈≥12–13 %
                          <div className="mt-1 font-sans text-[10px] font-normal text-slate-500">
                            ≤~9 %: baja probabilidad de respuesta
                          </div>
                        </td>
                        <td className="py-3">
                          Mayor oscilación de PP con la respiración → mayor
                          probabilidad de <strong>responder</strong> a líquidos si el
                          VI es sensible al preload.
                        </td>
                      </tr>
                      <tr className="align-top">
                        <td className="py-3 pr-3 font-semibold">
                          SVV
                          <div className="font-normal text-[10px] text-slate-500">
                            Variación del volumen sistólico
                          </div>
                        </td>
                        <td className="py-3 pr-3 font-mono text-[11px]">
                          ≈≥10–13 %
                          <div className="mt-1 font-sans text-[10px] font-normal text-slate-500">
                            Según monitor / algoritmo
                          </div>
                        </td>
                        <td className="py-3">
                          Índice derivado del contorno de pulso (p. ej. FloTrac,
                          PiCCO); mismo concepto de variación con el ciclo
                          respiratorio.
                        </td>
                      </tr>
                      <tr className="align-top">
                        <td className="py-3 pr-3 font-semibold">
                          SPV
                          <div className="font-normal text-[10px] text-slate-500">
                            Variación de presión sistólica
                          </div>
                        </td>
                        <td className="py-3 pr-3 font-mono text-[11px]">
                          ≈≥10–15 %
                          <div className="mt-1 font-sans text-[10px] font-normal text-slate-500">
                            Según definición (ΔPS %)
                          </div>
                        </td>
                        <td className="py-3">
                          Oscilación de la PAS entre inspiración y espiración; umbrales
                          dependen de cómo se normalice la variación.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-[10px] italic leading-relaxed text-slate-500">
                  Zonas grises intermedias son frecuentes. Integrar VT, PEEP, posición,
                  sedación y poscarga; validar con prueba controlada de volumen cuando
                  proceda.
                </p>
                </div>
              </div>

              <p>
                Valores altos de PPV en pacientes en{' '}
                <strong>ventilación controlada y ritmo regular</strong> sugieren que
                el gasto es sensible al preload (
                <strong>probable responder</strong> a líquidos); valores bajos
                sugieren menor variación hemodinámica con la respiración (
                <strong>probable no responder</strong>). Es un{' '}
                <strong>marcador dinámico</strong>, no un sustituto del juicio
                clínico.
              </p>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6 text-xs leading-relaxed text-amber-950">
                <strong className="uppercase tracking-wide">Limitaciones</strong>
                <ul className="mt-3 list-inside list-disc space-y-2">
                  <li>
                    Arritmias (especialmente fibrilación auricular), espontaneidad
                    respiratoria marcada o VT baja.
                  </li>
                  <li>
                    Cambios en poscarga / vasopresores que alteran la PP sin reflejar
                    solo preload.
                  </li>
                  <li>
                    Ventilación espontánea: otros índices (p. ej. variación del
                    volumen sistólico o del pulso) pueden ser más estudiados según
                    dispositivo.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader
              title="Variación del volumen sistólico (SVV)"
              icon={Percent}
            />
            <div className="space-y-5 text-sm leading-relaxed text-slate-700">
              <p>
                Es un fenómeno natural por el que la presión del pulso arterial{' '}
                <strong>desciende durante la inspiración</strong> y{' '}
                <strong>asciende durante la espiración</strong> en la{' '}
                <strong>respiración espontánea</strong>, por las variaciones de la
                presión intratorácica secundarias a la ventilación con{' '}
                <strong>presión negativa</strong>.
              </p>
              <p>
                Las variaciones por encima de <strong>10 mmHg</strong> se denominan{' '}
                <strong>pulsos paradójicos</strong>.
              </p>
              <p>
                El rango habitual de variación en pacientes con{' '}
                <strong>respiración espontánea</strong> descrito en la literatura se
                ha situado en torno a <strong>5–10 mmHg</strong> (según técnica de
                medición y contexto).
              </p>

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5">
                <h4 className="mb-2 text-xs font-black uppercase tracking-wide text-blue-900">
                  Ventilación mecánica
                </h4>
                <p className="text-sm text-slate-800">
                  La presión arterial tiende a <strong>subir durante la inspiración</strong>{' '}
                  y <strong>descender durante la espiración</strong>, por los cambios
                  en la presión intratorácica propios de la ventilación con{' '}
                  <strong>presión positiva</strong> (patrón distinto del espontáneo).
                </p>
              </div>

              <p>
                La <strong>SVV</strong> (variación del volumen sistólico; en algunos
                textos «VVS») suele calcularse a partir del volumen sistólico máximo y
                mínimo respecto al volumen sistólico medio en un ciclo respiratorio (o
                el intervalo que defina el monitor), por ejemplo:
              </p>
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center font-mono text-xs text-slate-900 md:text-sm">
                SVV (%) ≈ 100 × (VS<sub>máx</sub> − VS<sub>mín</sub>) / VS
                <sub>medio</sub>
              </p>
              <p>
                Los valores habituales en <strong>ventilación mecánica controlada</strong>{' '}
                se consideran <strong>inferiores al 10–15 %</strong> cuando no hay
                hipervariación con la respiración (los umbrales dependen del dispositivo
                y de la definición exacta). La SVV puede ayudar a guiar el control de
                la <strong>precarga</strong>; sus principales limitaciones son que se
                interpreta mejor con <strong>VM controlada</strong> y con{' '}
                <strong>ausencia de arritmias</strong> relevantes.
              </p>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/90 p-6 text-xs leading-relaxed text-rose-950">
                <strong className="uppercase tracking-wide">Limitaciones</strong>
                <ul className="mt-3 list-inside list-disc space-y-3">
                  <li>
                    <strong>Valores derivados del contorno / onda de pulso:</strong>{' '}
                    no válidos con <strong>BIAC</strong> (balón intraaórtico); aplicables
                    en pacientes en <strong>VM</strong> en las condiciones descritas y
                    sin arritmias que invaliden el cálculo.
                  </li>
                  <li>
                    <strong>Parámetros por termodilución transpulmonar (TDTP)</strong>{' '}
                    / monitorización asociada: pueden no ser válidos en situaciones como{' '}
                    <strong>TEP</strong> (tromboembolismo pulmonar) relevante o{' '}
                    <strong>circulación extracorpórea</strong>; según protocolo y
                    dispositivo.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
