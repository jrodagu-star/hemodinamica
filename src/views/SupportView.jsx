import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Droplets,
  Gauge,
  RotateCw,
  ScanLine,
  Settings2,
  ShieldAlert,
  Syringe,
  Thermometer,
  WindArrowDown,
  X,
  Zap,
} from 'lucide-react'
import { SectionHeader, SupportCard } from '../components/ui.jsx'
import { publicAsset } from '../lib/publicAsset.js'

const BIAC_IMG = (name) => publicAsset(`BIAC/${name}`)

const IMG_ECMO_PRESIONES = publicAsset('ecmo/presiones-consola.png')

const IMG_BIAC_SINCRO = encodeURI(BIAC_IMG('BIAC sincro.png'))
const IMG_BIAC_SINCRO2 = encodeURI(BIAC_IMG('BIAC sincro2.png'))
const IMG_MONTAJE_BIAC = BIAC_IMG('montajeBIAC.png')
const IMG_MONTAJE_BIAC1 = BIAC_IMG('montajeBIAC1.png')
const IMG_INFLADO_PRE = BIAC_IMG('infladopre.png')
const IMG_INFLADO_TARDIO = BIAC_IMG('infladotardio.png')
const IMG_DESINFLADO_PRE = BIAC_IMG('desinfladopre.png')
const IMG_DESINFLADO_TAR = BIAC_IMG('desinfladotar.png')
const IMG_SANGRE_BIAC = BIAC_IMG('sangreBIAC.png')

const SUPPORT_DATA = {
  biac: {
    title: 'BIAC',
    mechanism: 'Contrapulsación diastólica: inflado en diástole, desinflado en sístole.',
    indications: ['Shock cardiogénico refractario', 'Soporte peri-IAM complicado'],
    contra: ['Insuficiencia aórtica significativa', 'Disección aórtica', 'Sepsis grave sin viabilidad'],
    headerClass: 'bg-indigo-700',
  },
  impella: {
    title: 'Impella',
    mechanism: 'Bomba microaxial que descarga el VI y aumenta el gasto.',
    indications: ['Shock cardiogénico', 'Puente a decisión / cirugía'],
    contra: ['Trombo intracavitario', 'Estenosis aórtica grave no tratada', 'Anillo ≥ native según dispositivo'],
    headerClass: 'bg-amber-600',
  },
  ecmo: {
    title: 'ECMO',
    mechanism: 'Oxigenación / circulación extracorpórea (VV o VA según indicación).',
    indications: ['Fallo respiratorio grave', 'Shock refractario (VA)', 'Puente a trasplante / recuperación'],
    contra: ['Hemorragia activa no controlada', 'Daño neurológico irreversible en ciertos contextos', 'Contraindicación absoluta según protocolo'],
    headerClass: 'bg-red-700',
  },
}

export function SupportView({ selectedSupport, setSelectedSupport }) {
  if (selectedSupport === 'ecmo') {
    return <EcmoDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport === 'biac') {
    return <BiacDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport) {
    return (
      <SupportDetailView
        support={selectedSupport}
        onBack={() => setSelectedSupport(null)}
      />
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 pb-20 pt-4 text-center">
      <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">
        Soporte hemodinámico
      </h2>
      <p className="mx-auto max-w-2xl text-sm text-slate-600">
        Resumen orientativo; las decisiones son siempre según guías locales y el
        caso clínico.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-8 text-left lg:grid-cols-3">
        <SupportCard
          title="BIAC"
          fullName="Balón intraaórtico"
          icon={Activity}
          description="Mejora la perfusión coronaria y reduce la poscarga."
          pros={['Dispositivo establecido', 'Colocación relativamente rápida']}
          color="border-indigo-500"
          onClick={() => setSelectedSupport('biac')}
        />
        <SupportCard
          title="Impella"
          fullName="Bomba microaxial"
          icon={Zap}
          description="Soporte activo de gasto desde el ventrículo izquierdo."
          pros={['Flujo continuo', 'Útil en shock cardiogénico seleccionado']}
          color="border-amber-500"
          onClick={() => setSelectedSupport('impella')}
        />
        <SupportCard
          title="ECMO"
          fullName="Membrana extracorpórea"
          icon={WindArrowDown}
          description="Soporte respiratorio y/o circulatorio intensivo."
          pros={['Rescate', 'Puente temporal']}
          color="border-red-500"
          onClick={() => setSelectedSupport('ecmo')}
        />
      </div>
    </div>
  )
}

function EcmoDetailView({ onBack }) {
  const data = SUPPORT_DATA.ecmo

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a soporte
      </button>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className={`flex flex-col gap-6 p-10 text-white md:flex-row md:items-center md:justify-between ${data.headerClass}`}>
          <div className="flex items-start gap-4 text-left">
            <WindArrowDown className="mt-1 shrink-0 text-red-200" size={40} aria-hidden />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-red-200 uppercase">
                Cardiohelp (Maquet) · referencia
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                {data.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-red-100">
                {data.mechanism}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12 p-8 text-left md:p-10">
          <p className="text-sm leading-relaxed text-slate-700">
            Para el control y monitorización de un sistema{' '}
            <strong className="text-slate-900">ECMO tipo Cardiohelp (Maquet)</strong>, conviene
            vigilar de forma continuada las{' '}
            <strong className="text-slate-900">presiones del circuito</strong> y los{' '}
            <strong className="text-slate-900">niveles de saturación</strong>: los sensores de la
            consola permiten anticipar complicaciones técnicas y valorar la perfusión del paciente.
          </p>

          <section>
            <SectionHeader title="Presiones del circuito (Cardiohelp)" icon={Gauge} />
            <div className="mt-4 overflow-x-auto rounded-3xl border border-red-100 bg-red-50/40">
              <table className="w-full min-w-[640px] border-collapse text-sm text-slate-800">
                <thead>
                  <tr className="border-b border-red-100 bg-red-50/90 text-left text-xs font-bold uppercase tracking-wide text-red-950">
                    <th className="px-4 py-3">Parámetro</th>
                    <th className="px-4 py-3">Valor óptimo / habitual</th>
                    <th className="px-4 py-3">Significado y alertas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100/80">
                  <tr className="bg-white/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      P1: presión de succión (inlet / venosa)
                    </td>
                    <td className="px-4 py-3 text-slate-800">−20 a −80 mmHg</td>
                    <td className="px-4 py-3 leading-relaxed text-slate-700">
                      Facilidad para extraer sangre. Si es muy negativa (p. ej. &lt; −60 / −70 mmHg),
                      puede aparecer «cabeceo» (chattering) por hipovolemia o acodamiento de líneas.
                      Valores extremos aumentan riesgo de hemólisis.
                    </td>
                  </tr>
                  <tr className="bg-white/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      P2: presión pre-membrana (interna)
                    </td>
                    <td className="px-4 py-3 text-slate-800">&lt; 250 mmHg</td>
                    <td className="px-4 py-3 leading-relaxed text-slate-700">
                      Zona de mayor presión positiva. Si supera ~300 mmHg, sugiere resistencia elevada
                      antes de salir del oxigenador.
                    </td>
                  </tr>
                  <tr className="bg-white/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      P3: presión post-membrana (arterial)
                    </td>
                    <td className="px-4 py-3 text-slate-800">&lt; 250 mmHg</td>
                    <td className="px-4 py-3 leading-relaxed text-slate-700">
                      Resistencia en la cánula de retorno y el lecho arterial. Evitar valores muy
                      elevados (p. ej. 400–500 mmHg) por riesgo para la integridad del circuito.
                    </td>
                  </tr>
                  <tr className="bg-white/80">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      Gradiente (ΔP = P2 − P3)
                    </td>
                    <td className="px-4 py-3 text-slate-800">&lt; 20 mmHg</td>
                    <td className="px-4 py-3 leading-relaxed text-slate-700">
                      Refleja la resistencia del oxigenador. Un aumento progresivo (p. ej. hacia ~50 mmHg)
                      puede indicar trombos o depósito de fibrina en la membrana.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <figure className="mt-6 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-inner">
              <img
                src={IMG_ECMO_PRESIONES}
                alt="Consola ECMO Cardiohelp: presiones de drenaje P venosa (Pven), pre-membrana (Pint), post-membrana (Part), gradiente Δp entre P2 y P3, flujo, RPM, temperatura arterial y SvO₂."
                className="w-full object-contain"
                loading="lazy"
              />
              <figcaption className="border-t border-red-100 bg-red-50/70 px-4 py-3 text-center text-[11px] leading-relaxed text-slate-600">
                Lectura en consola: P<sub>ven</sub> (succión), P<sub>int</sub> (pre-oxigenador),
                P<sub>Art</sub> (post-membrana), Δp, caudal (lpm), revoluciones (rpm), T y SvO₂ (los
                recuadros azules del ejemplo resumen rangos habituales).
              </figcaption>
            </figure>
          </section>

          <section>
            <SectionHeader title="Objetivos de saturación" icon={Activity} />
            <div className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-8 text-sm leading-relaxed text-slate-800">
              <p>
                La lectura difiere según modalidad{' '}
                <strong className="text-slate-900">veno-arterial (VA)</strong> o{' '}
                <strong className="text-slate-900">veno-venosa (VV)</strong>.
              </p>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-red-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wide text-red-900">
                    Saturación pre-membrana (entrada al oxigenador)
                  </p>
                  <p className="mt-2 leading-relaxed">
                    Es la saturación de la sangre que llega a la membrana (tramo venoso/mixto del
                    circuito). Debe integrarse con la SvO₂/Satv medida en catéter cuando el punto de
                    muestreo sea comparable.
                  </p>
                  <ul className="mt-3 list-inside list-disc space-y-2">
                    <li>
                      <strong>ECMO VA:</strong> objetivo habitual alineado con perfusión adecuada, en
                      la práctica en torno a <strong>65–75&nbsp;%</strong>.
                    </li>
                    <li>
                      <strong>ECMO VV:</strong> suele buscarse <strong>&gt; 80&nbsp;%</strong>.
                    </li>
                  </ul>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                    Valores persistentemente más bajos obligan a revisar flujo ECMO, Hb, consumo
                    (fiebre, trabajo respiratorio) y fugas/ recirculación en VV.
                  </p>
                </div>
                <div className="rounded-2xl border border-red-200/80 bg-white p-5 shadow-sm">
                  <p className="text-xs font-black uppercase tracking-wide text-red-900">
                    Saturación post-membrana (salida del oxigenador)
                  </p>
                  <p className="mt-2 leading-relaxed">
                    Sangre ya oxigenada tras pasar la membrana; refleja la eficacia del intercambio
                    gasoso con el barrido de gas (sweep).
                  </p>
                  <p className="mt-3">
                    Objetivo habitual <strong>≥ 95&nbsp;%</strong>; en condiciones estables es frecuente
                    ver <strong>96–100&nbsp;%</strong> si el oxigenador y el blend de O₂ son adecuados.
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
                    Una caída brusca o sostenida sugiere fallo del oxigenador, trombos/fibrina,
                    problemas de gas (mezcla, fugas) o muestreo erróneo; según protocolo del centro.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wide text-red-900">
                  Saturación venosa (SvO₂ / SatvO₂)
                </p>
                <p className="mt-2">
                  Indicador clave del balance entre transporte de oxígeno y consumo tisular.
                </p>
                <ul className="mt-3 list-inside list-disc space-y-2">
                  <li>
                    <strong>ECMO VA:</strong> objetivo habitual <strong>65–75&nbsp;%</strong>.
                  </li>
                  <li>
                    <strong>ECMO VV:</strong> objetivo suele ser <strong>&gt; 80&nbsp;%</strong>.
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wide text-red-900">
                  Saturación arterial (SaO₂)
                </p>
                <p className="mt-2">
                  Objetivo general <strong>&gt; 95&nbsp;%</strong> cuando el contexto lo permite.
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 p-4">
                <ShieldAlert className="mt-0.5 shrink-0 text-amber-700" size={22} aria-hidden />
                <p className="min-w-0">
                  <strong className="text-amber-950">ECMO VA periférico · síndrome de Arlequín:</strong>{' '}
                  monitorizar la saturación en el <strong>miembro superior derecho</strong> (p. ej.
                  radial): sangre desaturada podría perfundir cerebro y corazón. Objetivo orientativo{' '}
                  <strong>&gt; 90&nbsp;%</strong>; si cae <strong>&lt; 88&nbsp;%</strong>, valorar
                  intervención según protocolo.
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Otros parámetros críticos en consola" icon={Settings2} />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <Droplets className="mt-0.5 shrink-0 text-red-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Flujo (L/min)</strong>
                  <p className="mt-1 text-slate-700">
                    Sangre efectivamente impulsada; depende de precarga y postcarga del circuito.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <RotateCw className="mt-0.5 shrink-0 text-red-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">RPM (bomba centrífuga)</strong>
                  <p className="mt-1 text-slate-700">
                    Velocidad de giro (órdenes habituales hasta ~5000 rpm según dispositivo y
                    protocolo).
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <Activity className="mt-0.5 shrink-0 text-red-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Hemoglobina (Hb)</strong>
                  <p className="mt-1 text-slate-700">
                    Muchas consolas registran Hb vía sensores ópticos para estimar transporte de
                    oxígeno.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5">
                <Thermometer className="mt-0.5 shrink-0 text-red-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Temperatura</strong>
                  <p className="mt-1 text-slate-700">
                    Control vía intercambiador de calor; suele buscarse{' '}
                    <strong>normotermia (~37&nbsp;°C)</strong> salvo indicación contraria.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-300 bg-slate-100/80 p-5 text-sm leading-relaxed text-slate-800">
              <strong className="text-slate-900">Nota de seguridad:</strong> realizar calibración del
              sistema (especialmente SvO₂) según protocolo — muchos centros revisan cada{' '}
              <strong>24&nbsp;h</strong> con gases pre-membrana — para mantener fiabilidad de los datos
              mostrados por la consola.
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-3xl border border-red-100 bg-red-50/50 p-6 md:grid-cols-2 md:p-8">
            <div>
              <strong className="text-red-950">Indicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-red-950/95">
                {data.indications.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-red-950">Contraindicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-red-950/95">
                {data.contra.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </section>

          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
            Contenido educativo basado en protocolos y guías de referencia; adaptar siempre a guías y
            check-list de tu centro.
          </p>
        </div>
      </div>
    </div>
  )
}

const BIAC_CONTRA_ABSOLUTAS = [
  'Estenosis aórtica',
  'Disección aórtica',
  'Aneurisma de aorta abdominal o torácico',
  'Regurgitación aórtica severa',
]

const BIAC_CONTRA_RELATIVAS = [
  'Enfermedad vascular periférica severa',
  'Injertos aorto-ilíacos o iliofemorales',
  'CI para anticoagulantes',
  'Regurgitación aórtica moderada',
  'Taquicardias sostenidas incontrolables',
]

function BiacDetailView({ onBack }) {
  const data = SUPPORT_DATA.biac
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
    <div className="mx-auto max-w-5xl space-y-10 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a soporte
      </button>

      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
        <div className={`flex flex-col gap-6 p-10 text-white md:flex-row md:items-center md:justify-between ${data.headerClass}`}>
          <div className="flex items-start gap-4 text-left">
            <Activity className="mt-1 shrink-0 text-indigo-200" size={40} aria-hidden />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-indigo-200 uppercase">
                Balón intraaórtico
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                {data.title}
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-relaxed text-indigo-100">
                {data.mechanism}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12 p-8 md:p-10">
          <section className="rounded-3xl border border-emerald-100 bg-emerald-50/80 p-6 md:p-8">
            <h3 className="text-xs font-black tracking-widest text-emerald-900 uppercase">
              Indicaciones (ejemplos)
            </h3>
            <ul className="mt-4 list-inside list-disc space-y-2 text-sm leading-relaxed text-emerald-950/90">
              {data.indications.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </section>

          <section className="text-left">
            <SectionHeader title="Montaje y elección" icon={Settings2} />
            <div className="space-y-6 rounded-3xl border border-indigo-100 bg-indigo-50/60 p-6 md:p-8">
              <div className="flex flex-wrap items-start gap-4">
                <div className="rounded-2xl bg-white p-3 text-indigo-700 shadow-sm">
                  <Syringe size={22} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-3 text-sm leading-relaxed text-slate-800">
                  <p>
                    <strong className="text-indigo-950">Balón introductor:</strong>{' '}
                    8–9,5 F (según protocolo y vía).
                  </p>
                  <p>
                    <strong className="text-indigo-950">Capacidad del balón:</strong>{' '}
                    25, 40 o 50 cc según tamaño aórtico y criterio del fabricante.
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-black tracking-wide text-indigo-900 uppercase">
                  Orientación por talla (referencia orientativa)
                </p>
                <div className="mt-3 overflow-x-auto rounded-2xl border border-indigo-200/80 bg-white">
                  <table className="w-full min-w-[280px] text-left text-sm text-slate-800">
                    <thead>
                      <tr className="border-b border-indigo-100 bg-indigo-50/80 text-xs font-bold tracking-wide text-indigo-950 uppercase">
                        <th className="px-4 py-3">Estatura</th>
                        <th className="px-4 py-3">Volumen habitual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3">&lt; 152 cm</td>
                        <td className="px-4 py-3 font-medium">25 ml</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">163–183 cm</td>
                        <td className="px-4 py-3 font-medium">40 ml</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">&gt; 180 cm</td>
                        <td className="px-4 py-3 font-medium">50 ml</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                  Entre <strong>180 y 183 cm</strong> puede haber solapamiento entre criterios de 40 y 50 ml;
                  la elección final depende del calibre aórtico y del protocolo local.
                </p>
              </div>

              <div className="border-t border-indigo-200/80 pt-8">
                <h4 className="text-xs font-black tracking-wide text-indigo-900 uppercase">
                  Cómo insertar BIAC
                </h4>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-600">
                  Secuencia orientativa de montaje; pulsa cada imagen para ampliar.
                </p>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <figure className="flex min-w-0 flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: IMG_MONTAJE_BIAC,
                          alt:
                            'Inserción y montaje del balón intraaórtico: referencia visual 1.',
                        })
                      }
                      className="group flex min-h-[180px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Ampliar imagen: montaje BIAC (1)"
                    >
                      <img
                        src={IMG_MONTAJE_BIAC}
                        alt=""
                        className="mx-auto max-h-[280px] w-full object-contain"
                        loading="lazy"
                      />
                    </button>
                    <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">
                      Montaje / inserción (1).{' '}
                      <span className="text-indigo-600">Pulsa para ampliar.</span>
                    </figcaption>
                  </figure>
                  <figure className="flex min-w-0 flex-col">
                    <button
                      type="button"
                      onClick={() =>
                        setLightbox({
                          src: IMG_MONTAJE_BIAC1,
                          alt:
                            'Inserción y montaje del balón intraaórtico: referencia visual 2.',
                        })
                      }
                      className="group flex min-h-[180px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-indigo-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label="Ampliar imagen: montaje BIAC (2)"
                    >
                      <img
                        src={IMG_MONTAJE_BIAC1}
                        alt=""
                        className="mx-auto max-h-[280px] w-full object-contain"
                        loading="lazy"
                      />
                    </button>
                    <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">
                      Montaje / inserción (2).{' '}
                      <span className="text-indigo-600">Pulsa para ampliar.</span>
                    </figcaption>
                  </figure>
                </div>
              </div>
            </div>
          </section>

          <section className="text-left">
            <SectionHeader title="Utilización" icon={Gauge} />
            <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-8 text-sm leading-relaxed text-slate-800">
              <p>
                <strong className="text-slate-900">Anticoagulación:</strong> el paciente debe ir
                anticoagulado durante el soporte.{' '}
                <strong>Excepción habitual:</strong> las primeras{' '}
                <strong>12–24 h</strong> tras cirugía cardiaca, o hasta que disminuya el sangrado por
                drenajes torácicos, según criterio del equipo.
              </p>
              <p>
                <strong className="text-slate-900">Sincronía con el ECG:</strong> se{' '}
                <strong>infla en diástole</strong>, en la onda <strong>T</strong> del ECG (cuando se
                cierra la válvula aórtica); se <strong>desinfla en sístole</strong>, en la onda{' '}
                <strong>R</strong> (cuando se abre la válvula aórtica).
              </p>
              <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 md:p-6">
                <p className="text-xs font-black tracking-wide text-indigo-900 uppercase">
                  Inflado y desinflado (referencia en el ECG)
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      src: IMG_INFLADO_PRE,
                      alt: 'Balón intraaórtico: inflado precoz respecto al ciclo cardíaco en el ECG.',
                      cap: 'Inflado precoz',
                      aria: 'Ampliar: inflado precoz',
                    },
                    {
                      src: IMG_INFLADO_TARDIO,
                      alt: 'Balón intraaórtico: inflado tardío respecto al ciclo cardíaco en el ECG.',
                      cap: 'Inflado tardío',
                      aria: 'Ampliar: inflado tardío',
                    },
                    {
                      src: IMG_DESINFLADO_PRE,
                      alt: 'Balón intraaórtico: desinflado precoz respecto al ciclo cardíaco en el ECG.',
                      cap: 'Desinflado precoz',
                      aria: 'Ampliar: desinflado precoz',
                    },
                    {
                      src: IMG_DESINFLADO_TAR,
                      alt: 'Balón intraaórtico: desinflado tardío respecto al ciclo cardíaco en el ECG.',
                      cap: 'Desinflado tardío',
                      aria: 'Ampliar: desinflado tardío',
                    },
                  ].map(({ src, alt, cap, aria }) => (
                    <figure key={cap} className="flex min-w-0 flex-col">
                      <button
                        type="button"
                        onClick={() => setLightbox({ src, alt })}
                        className="group flex min-h-[140px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        aria-label={aria}
                      >
                        <img
                          src={src}
                          alt=""
                          className="mx-auto max-h-[220px] w-full object-contain"
                          loading="lazy"
                        />
                      </button>
                      <figcaption className="mt-2 text-center text-[10px] leading-snug text-slate-600">
                        {cap}. <span className="text-indigo-600">Pulsa para ampliar.</span>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Referencias generales de sincronía (pulsa para ampliar):
              </p>
              <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                <figure className="flex min-w-0 flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: IMG_BIAC_SINCRO,
                        alt:
                          'Traza ECG y sincronía del balón intraaórtico con la onda de contrapulsación (referencia 1).',
                      })
                    }
                    className="group flex min-h-[200px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Ampliar imagen: sincronía BIAC con ECG (referencia 1)"
                  >
                    <img
                      src={IMG_BIAC_SINCRO}
                      alt=""
                      className="mx-auto max-h-[320px] w-full object-contain"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">
                    Sincronía BIAC con el ECG (referencia 1).{' '}
                    <span className="text-indigo-600">Pulsa para ampliar.</span>
                  </figcaption>
                </figure>
                <figure className="flex min-w-0 flex-col">
                  <button
                    type="button"
                    onClick={() =>
                      setLightbox({
                        src: IMG_BIAC_SINCRO2,
                        alt:
                          'Traza ECG y sincronía del balón intraaórtico con la onda de contrapulsación (referencia 2).',
                      })
                    }
                    className="group flex min-h-[200px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    aria-label="Ampliar imagen: sincronía BIAC con ECG (referencia 2)"
                  >
                    <img
                      src={IMG_BIAC_SINCRO2}
                      alt=""
                      className="mx-auto max-h-[320px] w-full object-contain"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">
                    Sincronía BIAC con el ECG (referencia 2).{' '}
                    <span className="text-indigo-600">Pulsa para ampliar.</span>
                  </figcaption>
                </figure>
              </div>
              <figure className="mx-auto mt-6 w-full max-w-md">
                <button
                  type="button"
                  onClick={() =>
                    setLightbox({
                      src: IMG_SANGRE_BIAC,
                      alt:
                        'Esquema de contrapulsación y relación con el gasto y la perfusión coronaria en balón intraaórtico.',
                    })
                  }
                  className="group flex min-h-[100px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-indigo-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Ampliar imagen: sangre / contrapulsación BIAC"
                >
                  <img
                    src={IMG_SANGRE_BIAC}
                    alt=""
                    className="mx-auto max-h-[160px] w-full object-contain"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-2 text-center text-[11px] leading-snug text-slate-600">
                  Sangre / contrapulsación (referencia visual).{' '}
                  <span className="text-indigo-600">Pulsa para ampliar.</span>
                </figcaption>
              </figure>
              <p>
                <strong className="text-slate-900">Cateterismo:</strong> valorar colocación{' '}
                <strong>profiláctica</strong> en el cateterismo cuando hay afectación de{' '}
                <strong>tronco coronario</strong> y <strong>coronaria derecha ocluida</strong>.
              </p>
              <p>
                <strong className="text-slate-900">Frecuencia cardiaca:</strong> rango de funcionamiento
                óptimo aproximado <strong>80–130 lpm</strong>. La eficacia es menor si la FC es{' '}
                <strong>&gt; 130 lpm</strong> (valorar pasar a modo <strong>1:2</strong> o{' '}
                <strong>1:3</strong>) o en <strong>FA rápida</strong>. En{' '}
                <strong>bradicardia</strong>, valorar <strong>marcapasos secuencial AV</strong> (ritmo
                adecuado para sincronía).
              </p>
              <p>
                <strong className="text-slate-900">Presión:</strong> monitorizar sobre todo la{' '}
                <strong>TA media</strong>; la <strong>sistólica invasiva puede estar artefactada</strong>{' '}
                por el balón (subestimación / forma de onda alterada).
              </p>
              <div className="flex flex-wrap items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                <ScanLine className="mt-0.5 shrink-0 text-indigo-600" size={20} aria-hidden />
                <p className="min-w-0">
                  <strong className="text-slate-900">Comprobación de colocación:</strong> punta en el{' '}
                  <strong>3.º espacio intercostal izquierdo</strong> (referencia clínica) o en la{' '}
                  <strong>radiografía de tórax</strong> unos <strong>2 cm por encima de la carina</strong>.
                </p>
              </div>
            </div>
          </section>

          <section className="text-left">
            <SectionHeader title="Contraindicaciones" icon={ShieldAlert} />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="rounded-3xl border-2 border-red-200 bg-red-50/90 p-6 md:p-8">
                <h4 className="text-sm font-black tracking-wide text-red-900 uppercase">
                  Absolutas
                </h4>
                <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-red-950/95">
                  {BIAC_CONTRA_ABSOLUTAS.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border-2 border-amber-200 bg-amber-50/90 p-6 md:p-8">
                <h4 className="text-sm font-black tracking-wide text-amber-950 uppercase">
                  Relativas
                </h4>
                <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-amber-950/95">
                  {BIAC_CONTRA_RELATIVAS.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
              Referencia educativa; confirma siempre con guías y protocolos de tu centro.
            </p>
          </section>
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

function SupportDetailView({ support, onBack }) {
  const data = SUPPORT_DATA[support]
  if (!data) return null

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-20">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver a soporte
      </button>
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white text-center shadow-sm">
        <div className={`p-10 text-white ${data.headerClass}`}>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">
            {data.title}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-sm italic opacity-95">
            {data.mechanism}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-10 p-10 text-left md:grid-cols-2">
          <div className="rounded-3xl bg-emerald-50 p-6">
            <strong className="text-emerald-900">Indicaciones (ejemplos)</strong>
            <ul className="mt-3 list-inside list-disc space-y-2 text-xs text-emerald-900/90 italic">
              {data.indications.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-red-50 p-6">
            <strong className="text-red-900">Contraindicaciones (ejemplos)</strong>
            <ul className="mt-3 list-inside list-disc space-y-2 text-xs text-red-900/90 italic">
              {data.contra.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
