import { useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Gauge,
  HeartPulse,
  Info,
  Microscope,
  Percent,
  ScanLine,
  ShieldAlert,
  Syringe,
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

export function MethodsView({ selectedMethod, setSelectedMethod }) {
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
          disabled
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
