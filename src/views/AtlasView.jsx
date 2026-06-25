import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Droplets,
  Gauge,
  Info,
  Layers,
  ListOrdered,
  ScanHeart,
  Wind,
  X,
  Zap,
} from 'lucide-react'
import { atlasParameters } from '../data/atlasParameters.js'
import { publicAsset } from '../lib/publicAsset.js'
import { FilterBtn, MenuCard, SectionHeader } from '../components/ui.jsx'
import { EcmoVvShuntCalculatorView } from './EcmoVvShuntCalculatorView.jsx'

const TABLA_PRECARGA_DIN = encodeURI(publicAsset('tabla precarga.png'))

const IMG_SHOCK_CARDIOGENICO_ESTADIOS = publicAsset('atlas/shock-cardiogenico-estadios.png')

const ALT_SHOCK_CARDIOGENICO_ESTADIOS =
  'Escala SCAI de shock cardiogénico: clasificación por estadios (A en riesgo, B pre-shock, C shock clásico, D deterioro, E extremo), pirámide con descripciones. Adaptado de Catheter Cardiovasc Interv. 2019.'

const IMG_INTERMACS_CLASIFICACION = publicAsset('atlas/intermacs-clasificacion.png')

const ALT_INTERMACS_CLASIFICACION =
  'INTERMACS: tabla de perfiles 1 a 7 con definición y descripción en español, y diagrama de selección de pacientes con insuficiencia cardíaca Stage D frente a guías AHA/ACC y clases NYHA.'

const IMG_ALGORITMO_CHOQUE_AHS = publicAsset('atlas/algoritmo-choque-cardiogenico-ahs.png')

const ALT_ALGORITMO_CHOQUE_AHS =
  'Algoritmo de choque cardiogénico AHS: criterios de inclusión, activación de laboratorio, perfil hemodinámico según presión en AD (RA) y cuña (PCWP), ramificación por PAPi y umbral de CPO para soporte circulatorio mecánico.'

const IMG_ECHO_RV_PARAMETERS_PANELS = publicAsset('atlas/echo-parametros-vd-referencia.png')
const ALT_ECHO_RV_PARAMETERS_PANELS =
  'Parámetros ecocardiográficos del ventrículo derecho: infografía en paneles A a L (derrame pericárdico, grosor parietal del VD, VCI y colapso inspiratorio, velocidad pico de insuficiencia tricúspide, TAPSE, dilatación del VD, fracción de área del VD, interdependencia ventricular y septo en D, S\' anular en TDI, strain longitudinal de la pared libre del VD, índice de rendimiento miocárdico RIMP por TDI, FEVI del VD en 3D).'

/** Hoja estática: noradrenalina / vasopresina, línea de tiempo (public/ecmo/Vasopresors.html). */
const URL_ECMO_VASOPRESSORS = publicAsset('ecmo/Vasopresors.html')

/** Gasto cardíaco, VTI LVOT, área LVOT y contractilidad del VI (public/ecmo/ETTCONTRACT.html). */
const URL_ECMO_ETT_CONTRACT_VI = publicAsset('ecmo/ETTCONTRACT.html')

const FILTERS = [
  { id: 'all', label: 'Todos', color: 'bg-slate-600' },
  { id: 'precarga', label: 'Precarga', color: 'bg-blue-600' },
  { id: 'contractilidad', label: 'Contractilidad', color: 'bg-violet-600' },
  { id: 'poscarga', label: 'Poscarga', color: 'bg-orange-600' },
  { id: 'oxigenacion', label: 'Oxigenación', color: 'bg-red-600' },
]

export function AtlasView({ selectedTopic, setSelectedTopic }) {
  if (selectedTopic === 'balance') {
    return <OxygenBalanceDetail onBack={() => setSelectedTopic(null)} />
  }
  if (selectedTopic === 'masterTable') {
    return <MasterHemodynamicTable onBack={() => setSelectedTopic(null)} />
  }
  if (selectedTopic === 'echoParams') {
    return <EchocardiographicParamsDetail onBack={() => setSelectedTopic(null)} />
  }
  if (selectedTopic === 'cardiogenicShock') {
    return <CardiogenicShockDetail onBack={() => setSelectedTopic(null)} />
  }
  if (selectedTopic === 'shuntCalc') {
    return <EcmoVvShuntCalculatorView onBack={() => setSelectedTopic(null)} />
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-20 pt-4 text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-800 uppercase italic">
          Atlas
        </h2>
        <p className="mt-2 font-medium tracking-tight text-slate-500">
          Conceptos y valores de referencia para optimización hemodinámica.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 px-4 md:grid-cols-2">
        <MenuCard
          onClick={() => setSelectedTopic('masterTable')}
          icon={Layers}
          title="Parámetros hemodinámicos"
          desc="Parámetros habituales y rangos orientativos."
          theme="blue"
        />
        <MenuCard
          onClick={() => setSelectedTopic('balance')}
          icon={Droplets}
          title="Parámetros oxigenación"
          desc="Transporte, demanda y extracción."
          theme="red"
        />
        <MenuCard
          onClick={() => setSelectedTopic('echoParams')}
          icon={ScanHeart}
          title="Parámetros ecocardiográficos"
          desc="Función VI/VD, volúmenes y flujos de referencia."
          theme="violet"
        />
        <MenuCard
          onClick={() => setSelectedTopic('cardiogenicShock')}
          icon={AlertTriangle}
          title="Shock cardiogénico"
          desc="Perfil hemodinámico, INTERMACS, criterios y tratamiento."
          theme="amber"
        />
        <MenuCard
          onClick={() => setSelectedTopic('shuntCalc')}
          icon={Wind}
          title="Cálculo de shunt"
          desc="Shunt intrapulmonar y tejido pulmonar funcional en ECMO VV."
          theme="teal"
        />
      </div>
    </div>
  )
}

const ALT_TABLA_PRECARGA =
  'Tabla resumen de parámetros dinámicos de precarga y respuesta a volumen.'

function MasterHemodynamicTable({ onBack }) {
  const [filter, setFilter] = useState('all')
  const [precargaLightbox, setPrecargaLightbox] = useState(false)
  const filteredParams =
    filter === 'all'
      ? atlasParameters
      : atlasParameters.filter((p) => p.cat === filter)

  useEffect(() => {
    if (!precargaLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setPrecargaLightbox(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [precargaLightbox])

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 text-left">
      <button
        type="button"
        onClick={onBack}
        className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver al menú
      </button>

      <section className="space-y-4">
        <SectionHeader
          title="Tabla parámetros hemodinámicos"
          icon={Layers}
        />
        <div className="rounded-[2rem] border-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 p-4 shadow-md md:p-6">
        <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-1.5 border-b border-slate-200 bg-slate-50 px-3 py-2.5 md:gap-2 md:px-4">
            {FILTERS.map((f) => (
              <FilterBtn
                key={f.id}
                active={filter === f.id}
                onClick={() => setFilter(f.id)}
                label={f.label}
                color={f.color}
              />
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-[13px]">
              <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase md:text-[10px]">
                <tr>
                  <th className="px-3 py-2 md:px-4">Sigla / nombre</th>
                  <th className="px-3 py-2 md:px-4">Referencia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParams.map((p) => (
                  <tr key={p.sigla} className="hover:bg-blue-50/50">
                    <td className="px-3 py-2 md:px-4">
                      <strong className="text-xs md:text-[13px]">{p.sigla}</strong>
                      <div className="text-[9px] leading-tight text-slate-500 md:text-[10px]">
                        {p.nombre}
                      </div>
                    </td>
                    <td className="px-3 py-2 md:px-4">
                      {p.valor} {p.unidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader title="Valoración de precarga" icon={Gauge} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
            Parámetros estáticos
          </h3>
          <div className="mb-5 rounded-xl border border-amber-100 bg-amber-50/90 p-4 text-sm leading-relaxed text-amber-950">
            <strong className="uppercase tracking-wide">Limitación:</strong> son{' '}
            <strong>malos predictores aislados</strong>: para un mismo valor de
            precarga, la respuesta al volumen depende de{' '}
            <strong>en qué tramo de la curva de función ventricular</strong> se
            encuentre el paciente (Frank-Starling).
          </div>

          <h4 className="mt-6 text-xs font-black uppercase tracking-wide text-slate-700">
            Presiones de llenado
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <strong>PVC</strong>, <strong>PAOP</strong> (presión de oclusión de la
            arteria pulmonar / POAP).
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Solo los valores <strong>muy bajos</strong> (p. ej.{' '}
            <strong>&lt;5 mmHg</strong> en el contexto clínico descrito) suelen
            asociarse de forma más consistente con{' '}
            <strong>respuesta al volumen</strong>; en el rango intermedio la
            interpretación es limitada.
          </p>

          <h4 className="mt-6 text-xs font-black uppercase tracking-wide text-slate-700">
            Volúmenes
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            En general se consideran <strong>mejor guía que las presiones</strong>{' '}
            porque no quedan tan alterados por el <strong>ciclo respiratorio</strong>.
          </p>
          <ul className="mt-4 list-inside list-disc space-y-3 text-sm text-slate-700">
            <li>
              <strong>VTDGi</strong> — volumen telediastólico global indexado (por
              termodilución transpulmonar): evalúa precarga{' '}
              <strong>biventricular</strong>. Umbrales citados en la práctica (según
              fuente) para perfil de respondedor incluyen valores del orden de{' '}
              <strong>&lt;600 mL/m²</strong> — contrastar con protocolo y monitor.
            </li>
            <li>
              <strong>VTDVDi</strong> — volumen telediastólico del ventrículo derecho
              (catéter de arteria pulmonar). Referencias habituales del orden de{' '}
              <strong>&lt;90 mL/m²</strong> según bibliografía del servicio.
            </li>
            <li>
              <strong>Ecocardiografía:</strong> valores telediastólicos según planos y
              fórmulas utilizadas.
            </li>
          </ul>
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
            <strong>STDVD / STDVI &gt; 1:</strong> relación entre superficie
            telediastólica del VD y del VI; un valor <strong>&gt;1</strong> sugiere{' '}
            <strong>dilatación relevante del VD</strong>, situación en la que debe
            valorarse con cautela la <strong>expansión volemica</strong> (riesgo de
            sobrecarga derecha).
          </p>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50/40 p-6 shadow-sm md:p-8">
          <h3 className="mb-4 flex items-center gap-2 border-b border-blue-100 pb-3 text-sm font-black uppercase tracking-wide text-blue-950">
            <Zap size={20} className="shrink-0 text-blue-600" aria-hidden />
            Parámetros dinámicos
          </h3>
          <p className="text-sm leading-relaxed text-slate-800">
            A diferencia de los estáticos, ofrecen una{' '}
            <strong>valoración funcional del rendimiento cardíaco</strong>. En la
            práctica <strong>no estiman la precarga absoluta</strong>, sino la{' '}
            <strong>probabilidad de respuesta</strong> del corazón ante cambios de
            precarga — es decir, situar <strong>en qué zona de la curva ventricular</strong>{' '}
            se trabaja (respuesta a variaciones de precarga).
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-800">
            Se basan en el <strong>análisis del cambio del volumen sistólico (VS)</strong>{' '}
            y de la <strong>presión arterial</strong> durante la{' '}
            <strong>respiración</strong> (p. ej. variaciones del pulso en ventilación
            mecánica).
          </p>
          <p className="mt-4 rounded-xl border border-blue-100 bg-white p-4 text-sm font-semibold text-blue-950">
            En conjunto suelen ser <strong>más fiables que los parámetros estáticos</strong>{' '}
            para decidir respuesta a líquidos cuando se cumplen las condiciones de
            medición (ritmo regular, VM controlada según índice, etc.).
          </p>

          <figure className="mt-6">
            <button
              type="button"
              onClick={() => setPrecargaLightbox(true)}
              className="group flex w-full max-w-xs cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-blue-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:max-w-sm"
              aria-label="Ampliar tabla de parámetros dinámicos de precarga"
            >
              <span className="flex max-h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 p-2 md:max-h-48">
                <img
                  src={TABLA_PRECARGA_DIN}
                  alt=""
                  className="max-h-40 w-auto max-w-full object-contain md:max-h-44"
                  loading="lazy"
                />
              </span>
              <figcaption className="mt-2 px-1 text-center text-[10px] leading-relaxed text-slate-600 group-hover:text-blue-700">
                Parámetros dinámicos de precarga.{' '}
                <span className="text-blue-600">Pulsa para ampliar.</span>
              </figcaption>
            </button>
          </figure>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeader title="Ciclo cardíaco" icon={Activity} />
        <figure className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
          <img
            src={publicAsset('ciclocardiaco.png')}
            alt="Diagrama del ciclo cardíaco y relación con la dinámica hemodinámica."
            className="mx-auto h-auto w-full max-h-[420px] rounded-lg object-contain md:max-h-[480px]"
            loading="lazy"
          />
          <figcaption className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">
            Referencia visual del ciclo cardíaco en relación con la monitorización.
          </figcaption>
        </figure>
      </section>

      {precargaLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada tabla precarga"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setPrecargaLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setPrecargaLightbox(false)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={TABLA_PRECARGA_DIN}
            alt={ALT_TABLA_PRECARGA}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

function OxygenBalanceDetail({ onBack }) {
  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-10 text-left">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver al menú
      </button>

      <header className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
        <Droplets size={56} className="mx-auto mb-4 text-red-500" aria-hidden />
        <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase">
          Balance de oxígeno
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
          Indicadores de <strong>transporte</strong>, <strong>consumo</strong> y{' '}
          <strong>extracción</strong> de oxígeno: fórmulas habituales, rangos orientativos
          y lectura clínica cuando se alejan de la normalidad.
        </p>
        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-left">
            <h3 className="text-xs font-black tracking-widest text-red-800 uppercase">
              DO₂i — oferta indexada
            </h3>
            <p className="mt-2 text-2xl font-black text-red-900">
              520–570 <span className="text-sm font-normal">mL/min/m²</span>
            </p>
            <p className="mt-2 text-[11px] text-red-800/90">
              Con gasto cardíaco total (~900 mL/min orden de magnitud según GC y CaO₂).
            </p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-6 text-left">
            <h3 className="text-xs font-black tracking-widest text-amber-900 uppercase">
              VO₂ — demanda
            </h3>
            <p className="mt-2 text-2xl font-black text-amber-950">
              110–160 <span className="text-sm font-normal">mL/min</span>
            </p>
            <p className="mt-2 text-[11px] text-amber-950/90">
              &lt;110 sugiere déficit de oxigenación tisular respecto a la demanda.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          DO₂ — transporte / aporte (oxygen delivery)
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Cantidad de oxígeno transportada por la sangre arterial hacia los tejidos por
          unidad de tiempo (reserva de oxigenación).
        </p>
        <div className="mt-4 space-y-2 rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-800 md:text-sm">
          <p>
            DO₂ <span className="text-slate-500">(mL/min)</span> = CaO₂ × GC × 10
          </p>
          <p>
            DO₂i <span className="text-slate-500">(mL/min/m²)</span> = CaO₂ × IC × 10 =
            DO₂ / ASC
          </p>
        </div>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>
            <strong>Referencia indexada:</strong> 520–570 mL/min/m².
          </li>
          <li>
            Con <strong>GC</strong> en L/min y CaO₂ en mL/dL, el factor 10 convierte
            unidades coherentes a mL/min.
          </li>
          <li>
            <strong>Si es bajo:</strong> menor reserva de transporte (anemia, hipoxia,
            hipoperfusión, GC insuficiente según contexto).
          </li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          CaO₂ y contenido de O₂ en sangre
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          El <strong>contenido de O₂</strong> en sangre (mL/dL) depende de la hemoglobina
          y de la disolución plasmática.
        </p>
        <div className="mt-4 space-y-3 rounded-xl bg-red-50/80 p-4 text-sm text-slate-800">
          <p className="font-mono text-xs font-bold text-slate-900 md:text-sm">
            CaO₂ = (1,34 ×{' '}
            <span className="text-red-600">Hb</span> × <span className="text-red-600">SpO₂</span>) +
            (0,0031 × <span className="text-red-600">PaO₂</span>){' '}
            <span className="font-sans font-normal text-slate-600">
              (algunos textos usan 1,39 en lugar de 1,34)
            </span>
          </p>
          <p className="text-xs text-slate-600">
            Valor orientativo de CaO₂ en condiciones habituales del orden de{' '}
            <strong>~20 mL/dL</strong> (depende de Hb y gasometría).
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-700">
          Resume el estado de <strong>oxigenación arterial</strong>; si CaO₂ es bajo,
          limita DO₂ aunque el GC sea normal.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          VO₂ — consumo / captación
        </h3>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>
            <strong>Rango habitual:</strong> 110–160 mL/min.
          </li>
          <li>
            <strong>&lt; 110 mL/min:</strong> compatible con <strong>déficit de O₂</strong>{' '}
            en los tejidos respecto a la demanda metabólica (interpretar con lactato,
            perfusión y causa).
          </li>
        </ul>
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 font-mono text-xs text-slate-800 md:text-sm">
          <p>VO₂ = avDO₂ × GC × 10</p>
          <p className="mt-2 text-[11px] font-sans text-slate-600">
            avDO₂ = CaO₂ − CvO₂ (diferencia arteriovenosa de contenido, mL/dL)
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          AO₂ — aporte desde pulmón
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-slate-700">
          Velocidad a la que el oxígeno es transportado desde los pulmones hacia los
          tejidos (concepto global de «aporte»). En la práctica se relaciona con DO₂;
          valores del orden de <strong>~1000 mL/min</strong> o{' '}
          <strong>~500 mL/min</strong> ajustados al tamaño corporal aparecen en textos
          como orden de magnitud — el dato útil en cabecera suele ser{' '}
          <strong>DO₂/DO₂i</strong> y <strong>VO₂</strong>.
        </p>
        <p className="mt-4 rounded-xl border border-slate-100 bg-white p-4 font-mono text-xs text-slate-800">
          VO₂ = AO₂ × PEO₂{' '}
          <span className="font-sans text-[11px] text-slate-600">
            (modelo en que PEO₂ representa la fracción de extracción / captación)
          </span>
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          SvO₂ y ScvO₂ (venosas mixta vs central)
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-blue-50/80 p-4">
            <h4 className="text-xs font-bold uppercase text-blue-900">SvO₂</h4>
            <p className="mt-2 text-sm text-slate-700">
              Saturación venosa <strong>mixta</strong> (catéter de arteria pulmonar).
              Referencia habitual <strong>65–75 %</strong>.
            </p>
            <p className="mt-2 text-sm font-semibold text-blue-950">
              Refleja el equilibrio entre oferta y demanda de O₂: en conjunto,{' '}
              <strong>DO₂/VO₂ alto → SvO₂ más alta</strong>; <strong>DO₂/VO₂ bajo → SvO₂ más baja</strong>{' '}
              (mayor extracción tisular).
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Por debajo de lo esperado: aporte DO₂ insuficiente frente a VO₂ o distribución alterada.
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50/80 p-4">
            <h4 className="text-xs font-bold uppercase text-indigo-900">ScvO₂</h4>
            <p className="mt-2 text-sm text-slate-700">
              Saturación venosa <strong>central</strong> (vía cava superior). Suele ser{' '}
              <strong>unos 5 % menor</strong> que SvO₂ en condiciones estables.
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Objetivos habituales en protocolos suelen situar <strong>&lt;70 %</strong> como zona de
              alerta por posible hipoperfusión; <strong>&lt;65 %</strong> sugiere DO₂ inefectivo;{' '}
              <strong>&gt;75 %</strong> puede asociarse a VO₂ inefectivo o shunt/captación reducida
              según contexto.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-blue-200/80 bg-gradient-to-b from-slate-50 to-blue-50/40 p-4 md:p-5">
          <h4 className="text-center text-[11px] font-black uppercase tracking-[0.12em] text-blue-900">
            SvO₂ · lectura esquemática (DO₂/VO₂)
          </h4>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] leading-relaxed text-slate-600 md:text-xs">
            Rangos orientativos; integrar con lactato, hemodinámica y causa. Pasa el cursor sobre cada
            fila para leer el significado clínico.
          </p>

          <div className="mx-auto mt-5 max-w-4xl overflow-x-auto rounded-lg border border-slate-200/90 bg-white text-[11px] shadow-sm md:text-xs">
            <div className="min-w-[520px] space-y-0">
              <div className="border-b border-slate-200 bg-slate-50/90 px-3 py-2 text-center text-[11px] font-semibold leading-snug text-slate-700 md:text-xs">
                <span className="font-mono text-red-800">DO₂</span> = Transporte
                <span className="mx-2 text-slate-300" aria-hidden>
                  |
                </span>
                <span className="font-mono text-amber-800">VO₂</span> = Consumo
              </div>
              <div className="grid grid-cols-[4.5rem_7.2rem_minmax(11rem,1fr)_auto] items-center gap-2 border-b border-slate-100 bg-slate-50 px-2 py-1.5 font-bold uppercase tracking-wide text-slate-500 md:grid-cols-[5.5rem_8.5rem_minmax(12rem,1fr)_auto] md:px-3">
                <span>SvO₂</span>
                <span>Extracción</span>
                <span className="text-center">DO₂/VO₂ → SvO₂</span>
                <span className="text-right">Lac⁻</span>
              </div>

              <div
                className="grid grid-cols-[4.5rem_7.2rem_minmax(11rem,1fr)_auto] items-center gap-2 border-b border-emerald-100 bg-emerald-50/60 px-2 py-2.5 md:grid-cols-[5.5rem_8.5rem_minmax(12rem,1fr)_auto] md:px-3"
                title="Extracción normal: disponibilidad de O₂ mayor que la demanda."
              >
                <span className="font-black tabular-nums text-emerald-900">&gt;75&nbsp;%</span>
                <span className="text-[10px] font-bold leading-tight text-emerald-950 md:text-[11px]">
                  Normal
                </span>
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] font-bold text-emerald-950 md:text-xs">
                  <span>
                    DO₂/VO₂ <span className="text-emerald-600">↑↑</span>
                  </span>
                  <span className="text-emerald-700">⟶</span>
                  <span>
                    SvO₂ <span className="text-emerald-600">↑↑</span>
                  </span>
                </div>
                <span className="text-right font-mono text-slate-400" title="Sin alarma por lactato">
                  —
                </span>
              </div>

              <div
                className="grid grid-cols-[4.5rem_7.2rem_minmax(11rem,1fr)_auto] items-center gap-2 border-b border-amber-100 bg-amber-50/50 px-2 py-2.5 md:grid-cols-[5.5rem_8.5rem_minmax(12rem,1fr)_auto] md:px-3"
                title="Extracción compensada: aumento de demanda de O₂ con descenso de disponibilidad."
              >
                <span className="font-black tabular-nums text-amber-950">50–70&nbsp;%</span>
                <span className="text-[10px] font-bold leading-tight text-amber-950 md:text-[11px]">
                  Compensatoria
                </span>
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] font-bold text-amber-950 md:text-xs">
                  <span>
                    DO₂/VO₂ <span className="text-amber-700">↓</span>
                  </span>
                  <span className="text-amber-700">⟶</span>
                  <span>
                    SvO₂ <span className="text-amber-700">↓</span>
                  </span>
                </div>
                <span className="text-right font-mono text-amber-800" title="Lactato en vigilancia">
                  ↑?
                </span>
              </div>

              <div
                className="grid grid-cols-[4.5rem_7.2rem_minmax(11rem,1fr)_auto] items-center gap-2 border-b border-orange-100 bg-orange-50/55 px-2 py-2.5 md:grid-cols-[5.5rem_8.5rem_minmax(12rem,1fr)_auto] md:px-3"
                title="Extracción máxima: disponibilidad de O₂ menor que la demanda; inicio de acidosis láctica."
              >
                <span className="font-black tabular-nums text-orange-950">30–50&nbsp;%</span>
                <span className="text-[10px] font-bold leading-tight text-orange-950 md:text-[11px]">
                  Máxima
                </span>
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] font-bold text-orange-950 md:text-xs">
                  <span>
                    DO₂/VO₂ <span className="text-orange-700">↓↓</span>
                  </span>
                  <span className="text-orange-700">⟶</span>
                  <span>
                    SvO₂ <span className="text-orange-700">↓↓</span>
                  </span>
                </div>
                <span className="text-right font-mono font-bold text-orange-700" title="Lactato en ascenso">
                  ↑
                </span>
              </div>

              <div
                className="grid grid-cols-[4.5rem_7.2rem_minmax(11rem,1fr)_auto] items-center gap-2 bg-red-50/70 px-2 py-2.5 md:grid-cols-[5.5rem_8.5rem_minmax(12rem,1fr)_auto] md:px-3"
                title="Acidosis láctica manifiesta en contexto de hipoperfusión / desequilibrio DO₂–VO₂."
              >
                <span className="font-black tabular-nums text-red-900">25–30&nbsp;%</span>
                <span className="text-[10px] font-bold leading-tight text-red-950 md:text-[11px]">
                  Acidosis láctica
                </span>
                <div className="flex flex-wrap items-center justify-center gap-x-1.5 font-mono text-[11px] font-bold text-red-950 md:text-xs">
                  <span>
                    DO₂/VO₂ <span className="text-red-600">↓↓↓</span>
                  </span>
                  <span className="text-red-600">⟶</span>
                  <span>
                    SvO₂ <span className="text-red-600">↓↓↓</span>
                  </span>
                </div>
                <span className="text-right font-mono font-bold text-red-700" title="Acidosis láctica">
                  ↑↑
                </span>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-3 max-w-4xl text-center font-mono text-[10px] leading-relaxed text-slate-500 md:text-[11px]">
            ⟶ transición · ↑/↓ intensidad · Lac⁻ = lactato (↑? vigilancia) · columna Extracción = perfil
            global.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          O₂ER / «extracción» (PEO₂)
        </h3>
        <p className="mt-4 text-sm text-slate-700">
          Proporción de oxígeno extraído respecto al transportado. Es el mismo cociente que{' '}
          <strong>VO₂/DO₂</strong> expresado en porcentaje: cuánto del oxígeno entregado capta el
          organismo. Referencia habitual <strong>~20–30 %</strong>; valores centrados en{' '}
          <strong>~25 %</strong> en textos clásicos.
        </p>
        <div className="mt-4 space-y-2 rounded-xl bg-amber-50 p-4 font-mono text-xs text-amber-950 md:text-sm">
          <p>O₂ER = (CaO₂ − CvO₂) / CaO₂ × 100</p>
          <p>
            O₂ER = VO₂ / DO₂ × 100 <span className="font-sans text-[11px] text-amber-900/90">(mismo ratio)</span>
          </p>
          <p className="border-t border-amber-200/80 pt-2 text-[11px] leading-relaxed md:text-xs">
            Ej. en reposo: DO₂ ≈ 1000 mL O₂/min y VO₂ ≈ 250 mL O₂/min → VO₂/DO₂ = 250/1000 ={' '}
            <strong>0,25</strong> → <strong>O₂ER = 25 %</strong>.
          </p>
          <p className="text-[11px] font-sans">
            Aproximación con saturaciones: relacionado con (SaO₂ − SvO₂) en ausencia de
            shunt y con constancia de Hb.
          </p>
        </div>
        <p className="mt-4 text-sm text-slate-700">
          <strong>&gt;50 %:</strong> marcador de <strong>disoxia tisular</strong> /
          extracción exagerada (contexto de mal perfusión o demanda muy alta).
        </p>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 md:p-8">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-950">
          <Info size={18} aria-hidden />
          Fórmulas resumen (coherencia de unidades)
        </h3>
        <div className="mt-4 space-y-3 font-mono text-[11px] leading-relaxed text-slate-900 md:text-xs">
          <p>CvO₂ = (1,39 × Hb × SvO₂) + (PvO₂ × 0,003)</p>
          <p className="font-sans text-slate-600">
            (equivalente con 1,34 según fuente; PvO₂ = PO₂ venoso/mixto)
          </p>
          <p>CaO₂ × GC × 10 = DO₂ (mL/min)</p>
          <p>avDO₂ = CaO₂ − CvO₂ (mL O₂ / 100 mL sangre)</p>
          <p>VO₂ = avDO₂ × GC × 10</p>
          <p>O₂ER = VO₂ / DO₂ × 100 = ratio de extracción (%)</p>
          <p className="font-sans text-slate-700">
            Relación conceptual: <strong>VO₂ ≈ aporte × fracción extraída</strong>{' '}
            (según modelos que relacionan transporte y extracción).
          </p>
        </div>
      </section>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Coeficientes 1,34 vs 1,39 y factores 0,003 / 0,0031 dependen del libro y del
        sistema de unidades; contrastar siempre con el calculador o monitor del servicio.
      </p>
    </div>
  )
}

function EchocardiographicParamsDetail({ onBack }) {
  const [rvEchoLightbox, setRvEchoLightbox] = useState(null)

  useEffect(() => {
    if (!rvEchoLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setRvEchoLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [rvEchoLightbox])

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-10 text-left">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver al menú
      </button>

      <header className="rounded-[2rem] border border-violet-200 bg-gradient-to-b from-violet-50 to-white p-8 text-center shadow-sm md:p-10">
        <ScanHeart size={52} className="mx-auto mb-4 text-violet-600" aria-hidden />
        <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase md:text-3xl">
          Parámetros ecocardiográficos
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Valores orientativos en adultos; la interpretación depende de la técnica (apical,
          subcostal), ritmo, carga y comorbilidad. Contrastar con guías y protocolo ecográfico del
          servicio.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Función del ventrículo izquierdo" icon={Activity} />
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-slate-700">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[280px] text-left text-xs md:text-sm">
              <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2 md:px-4">Parámetro</th>
                  <th className="px-3 py-2 md:px-4">Referencia habitual</th>
                  <th className="px-3 py-2 md:px-4">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">FE (Simpson / biplane)</td>
                  <td className="px-3 py-2 md:px-4">≥ 52–55 % (mujer / varón, aprox.)</td>
                  <td className="px-3 py-2 text-slate-600 md:px-4">Deprimida si &lt;40 % (FE reducida según consenso).</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">GLS (strain longitudinal global)</td>
                  <td className="px-3 py-2 md:px-4">≤ −18 % (orden de magnitud)</td>
                  <td className="px-3 py-2 text-slate-600 md:px-4">Menos negativo = disfunción subclínica; vendor-dependent.</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">VTI LVOT + área LVOT</td>
                  <td className="px-3 py-2 md:px-4">—</td>
                  <td className="px-3 py-2 text-slate-600 md:px-4">
                    GC estimado ≈ (0,785 × d²<sub>LVOT</sub>) × VTI × FC; útil en shock si ventana adecuada.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
            <a
              href={URL_ECMO_ETT_CONTRACT_VI}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-700 underline decoration-violet-300 underline-offset-2 hover:text-violet-900"
            >
              Gasto cardíaco y contractilidad del ventrículo izquierdo
            </a>
            {' '}
            — guía ampliada (VTI, área LVOT, consola, anexos). Archivo estático{' '}
            <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-slate-800">
              ecmo/ETTCONTRACT.html
            </code>
            .
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Ventrículo derecho y precarga" icon={Gauge} />
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[280px] text-left text-xs md:text-sm">
            <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2 md:px-4">Parámetro</th>
                <th className="px-3 py-2 md:px-4">Referencia habitual</th>
                <th className="px-3 py-2 md:px-4">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">TAPSE</td>
                <td className="px-3 py-2 md:px-4">≥ 16–17 mm</td>
                <td className="px-3 py-2 text-slate-600 md:px-4">Menor: disfunción longitudinal del VD.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">s&apos; TDI anular VD</td>
                <td className="px-3 py-2 md:px-4">≥ 9,5 cm/s (aprox.)</td>
                <td className="px-3 py-2 text-slate-600 md:px-4">Carga y ángulo pueden sesgar la medida.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">FAC (fracción de área del VD)</td>
                <td className="px-3 py-2 md:px-4">≥ 35 %</td>
                <td className="px-3 py-2 text-slate-600 md:px-4">Vista enfocada en VD en 4 cámaras.</td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold text-slate-900 md:px-4">DTDVI indexado</td>
                <td className="px-3 py-2 md:px-4">22–27 mm/m² (adulto)</td>
                <td className="px-3 py-2 text-slate-600 md:px-4">Dilatación si por encima del límite superior del laboratorio.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <figure className="mt-8 flex flex-row items-start gap-3 sm:gap-5">
          <button
            type="button"
            onClick={() =>
              setRvEchoLightbox({
                src: IMG_ECHO_RV_PARAMETERS_PANELS,
                alt: ALT_ECHO_RV_PARAMETERS_PANELS,
              })
            }
            className="group w-[min(38vw,140px)] shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border border-violet-200 bg-violet-50/40 p-1.5 shadow-inner transition hover:ring-2 hover:ring-violet-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 sm:w-[200px] sm:p-2"
            aria-label="Ampliar infografía de parámetros ecocardiográficos del ventrículo derecho"
          >
            <img
              src={IMG_ECHO_RV_PARAMETERS_PANELS}
              alt=""
              className="h-auto max-h-[120px] w-full object-contain sm:max-h-[220px]"
              loading="lazy"
            />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-left text-xs leading-relaxed text-slate-600 md:text-sm">
              Resumen visual de criterios y umbrales frecuentemente citados para el{' '}
              <strong className="text-slate-800">VD</strong> (orientación educativa; técnica y población
              dependientes).
            </p>
            <p className="mt-3 text-left text-[10px] leading-relaxed text-slate-600 sm:text-[11px]">
              Paneles A–L: derrame, espesor parietal, VCI, TR, TAPSE, dilatación, FAC, interdependencia,
              S&apos; TDI, strain, RIMP, FEVI 3D.{' '}
              <span className="font-medium text-violet-800">Pulsa para ampliar.</span>
            </p>
          </div>
        </figure>
      </section>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-6 md:p-8">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-violet-950">
          <Info size={18} aria-hidden />
          Llenado y válvulas (recordatorio)
        </h3>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
          <li>
            <strong>E/A, deceleración, E/e&apos;:</strong> estimación de presiones de llenado y
            elevación de PCP cuando la ventana y ritmo lo permiten.
          </li>
          <li>
            <strong>Insuficiencia mitral / aórtica significativa:</strong> alteran VTI y estimaciones de
            gasto; integrar con clínica y catéter si procede.
          </li>
        </ul>
      </section>

      <p className="text-center text-[11px] text-slate-500">
        Umbrales según ASE/ESC y tablas locales; en ritmos arrítmicos o ventanas pobres, priorizar
        tendencia y multimodalidad.
      </p>

      {rvEchoLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setRvEchoLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setRvEchoLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={rvEchoLightbox.src}
            alt={rvEchoLightbox.alt}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}

/** Preparación, mezcla, dosis «mesa» y ml/h a 70 kg según hoja UCI vasopresores/inotrópicos (FARMACOSUCI). */
const SHOCK_CARDIO_UCI_PHARMA = [
  {
    key: 'norad',
    trClass: 'border-b border-rose-100 bg-rose-50/90',
    badge: { label: 'VASO', className: 'bg-rose-500' },
    moa: 'α₁+ · β₁+',
    farmaco: 'Noradrenalina',
    comercial: '(Norages)',
    prep:
      'Amp. 1 mg/ml, 4 ml · 16 mg en 4 amp.\nDiluir en 100 ml SG 5 % → mezcla 0,16 mg/ml.',
    dosis: '0,25–0,5 µg/Kg/min (dosis objetivo hoja); titular según PAM y guía.',
    mlh70: '7–13 ml/h',
    equipo: 'PVC OK · Luz NO · >24 h OK · Pref. CVC',
    uso: 'Hipotensión; primera línea de soporte perfusor.',
  },
  {
    key: 'vasopr',
    trClass: 'border-b border-rose-100 bg-rose-50/90',
    badge: { label: 'ADJ', className: 'bg-amber-500' },
    moa: 'V₁+',
    farmaco: 'Vasopresina',
    comercial: '(Empressin)',
    prep:
      'Amp. 20 UI/ml (1 y 2 ml) · 40 UI en 2 amp.\nDiluir en 50 ml SSF 0,9 % → mezcla 0,8 UI/ml.',
    dosis: '0,03–0,04 UI/min (hoja); otras guías inician 0,01–0,04 UI/min.',
    mlh70: '2,3–3 ml/h (igual en todos los pesos)',
    equipo: 'PVC OK · Luz NO · >24 h OK · Pref. CVC',
    uso: 'Shock catecolamina-refractario; reducir catecolaminas.',
  },
  {
    key: 'adr',
    trClass: 'border-b border-rose-100 bg-rose-50/90',
    badge: { label: 'VASO', className: 'bg-rose-500' },
    moa: 'α₁+ · β₁+ · β₂+',
    farmaco: 'Adrenalina',
    comercial: '(epinefrina)',
    prep:
      'Amp. 1 mg/ml, 1 ml · 10 mg en 10 amp.\nDiluir en 100 ml SG 5 % → mezcla 0,1 mg/ml.',
    dosis: '0,05–0,3 µg/Kg/min (hoja).',
    mlh70: '2–13 ml/h',
    equipo: 'PVC OK · Luz NO · >24 h OK · Pref. CVC',
    uso: 'Shock refractario / paro; arritmia y consumo O₂.',
  },
  {
    key: 'dobu',
    trClass: 'border-b border-emerald-100 bg-emerald-50/85',
    badge: { label: 'INO', className: 'bg-indigo-600' },
    moa: 'β₁+ > β₂+',
    farmaco: 'Dobutamina',
    comercial: '',
    prep:
      'Amp. 250 mg / 20 ml (12,5 mg/ml) · 500 mg en 2 amp.\nDiluir en 250 ml SG 5 % → mezcla 2 mg/ml.',
    dosis: '2–20 µg/Kg/min (hoja).',
    mlh70: '4–42 ml/h',
    equipo: 'PVC OK · Luz NO · >24 h OK · Perif. OK',
    uso: 'Bajo gasto con TA aceptable; inotropía.',
  },
  {
    key: 'mil',
    trClass: 'border-b border-emerald-100 bg-emerald-50/85',
    badge: { label: 'INODIL', className: 'bg-teal-500' },
    moa: 'PDE3−',
    farmaco: 'Milrinona',
    comercial: '(Corotrope)',
    prep:
      'Amp. 10 mg / 10 ml (1 mg/ml) · 20 mg en 2 amp.\nDiluir en 80 ml SG 5 % o SSF 0,9 % (según FT) → mezcla 0,2 mg/ml.\nNevera / cadena de frío según presentación.',
    dosis: '0,25–0,75 µg/Kg/min (hoja). Bolus 25–50 µg/Kg según protocolo local.',
    mlh70: '5–16 ml/h',
    equipo: 'PVC OK · Luz NO · >24 h OK · Pref. CVC',
    uso: 'Inodilatador; RVS baja; si respuesta insuficiente a β.',
  },
  {
    key: 'levo',
    trClass: 'border-b border-violet-100 bg-violet-50/80',
    badge: { label: 'INODIL', className: 'bg-teal-500' },
    moa: 'Sensibilizador Ca²⁺ · apertura K-ATP',
    farmaco: 'Levosimendán',
    comercial: '',
    prep:
      'Presentación y dilución según FT del centro.\nNo consta en la tabla «vasopresores-inotrópicos» FARMACOSUCI adjunta.',
    dosis: '0,05–0,2 µg/Kg/min; bolus 6–12 µg/Kg opcional según tolerancia.',
    mlh70: '—',
    equipo: 'Según FT (PVC, luz, estabilidad, vía).',
    uso: 'Fallo cardiaco agudo; facilitar descenso de catecolaminas.',
  },
  {
    key: 'dopa',
    trClass: 'bg-teal-50/90',
    badge: { label: 'OTRO', className: 'bg-amber-500' },
    moa: 'D₁+ · β₁+ · α₁+',
    farmaco: 'Dopamina',
    comercial: '',
    prep:
      'Amp. 200 mg / 5 ml (40 mg/ml) · 400 mg en 2 amp.\nDiluir en 250 ml SG 5 % → mezcla 1,6 mg/ml (400 mg/250 ml).',
    dosis: '2–20 µg/Kg/min (hoja; dosis altas efecto α según FT).',
    mlh70: '5,3–52,5 ml/h',
    equipo: 'PVC OK · Luz NO · >24 h OK · Perif. OK',
    uso: 'Uso limitado; bradicardia con hipotensión u otros criterios locales.',
  },
]

function CardiogenicShockDetail({ onBack }) {
  const [figureLightbox, setFigureLightbox] = useState(null)

  useEffect(() => {
    if (!figureLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setFigureLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [figureLightbox])

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 pb-24 pt-10 text-left">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver al menú
      </button>

      <header className="rounded-[2rem] border border-amber-200 bg-gradient-to-b from-amber-50 to-white p-8 text-center shadow-sm md:p-10">
        <AlertTriangle size={52} className="mx-auto mb-4 text-amber-600" aria-hidden />
        <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase md:text-3xl">
          Shock cardiogénico
        </h2>
        <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-8 md:text-left">
          <figure className="flex shrink-0 flex-col items-center md:items-start">
            <button
              type="button"
              onClick={() =>
                setFigureLightbox({
                  src: IMG_SHOCK_CARDIOGENICO_ESTADIOS,
                  alt: ALT_SHOCK_CARDIOGENICO_ESTADIOS,
                  ariaLabel: 'Vista ampliada: escala SCAI de shock cardiogénico',
                })
              }
              className="group flex cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-amber-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 md:items-start"
              aria-label="Ampliar esquema de la escala SCAI de shock cardiogénico"
            >
              <img
                src={IMG_SHOCK_CARDIOGENICO_ESTADIOS}
                alt=""
                className="max-h-[130px] w-auto max-w-[min(100%,280px)] object-contain sm:max-h-[150px]"
                loading="lazy"
              />
            </button>
            <figcaption className="mt-2 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-500 md:text-left">
              <span className="font-semibold text-slate-700">Escala SCAI</span> (estadios del shock
              cardiogénico). Adaptado de: Catheter Cardiovasc Interv. 2019 Jul 1;94(1):29-37.{' '}
              <span className="font-medium text-amber-800">Pulsa para ampliar.</span>
            </figcaption>
          </figure>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 md:min-w-0 md:flex-1 md:pt-1">
            Estado de <strong>hipoperfusión tisular</strong> por <strong>disfunción cardíaca</strong> que
            compromete el aporte de oxígeno a pesar del volumen intravascular (o con requerimiento de
            soporte para mantener perfusión). Requiere abordaje inmediato y causa etiológica.
          </p>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Criterios y perfil hemodinámico" icon={Gauge} />
        <ul className="mt-4 list-inside list-disc space-y-3 text-sm leading-relaxed text-slate-700">
          <li>
            <strong>Hipotensión sostenida</strong> (p. ej. TA sistólica &lt;90 mmHg o necesidad de
            vasopresores) con signos de <strong>hipoperfusión</strong> (piel fría, oliguria, alteración
            del sensorio, lactato elevado).
          </li>
          <li>
            <strong>Gasto cardíaco bajo</strong> con <strong>resistencias vasculares elevadas</strong>{' '}
            (perfil «frío y mojado») es el patrón clásico; puede coexistir hipovolemia relativa o
            vasoplejia en fases avanzadas.
          </li>
          <li>
            <strong>PCWP / PAOP elevada</strong> y presiones de llenado VD altas apoyan congestión y
            disfunción cardíaca frente a shock exclusivamente distributivo.
          </li>
        </ul>

        <figure className="mt-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() =>
              setFigureLightbox({
                src: IMG_ALGORITMO_CHOQUE_AHS,
                alt: ALT_ALGORITMO_CHOQUE_AHS,
                ariaLabel: 'Vista ampliada: algoritmo de choque cardiogénico AHS',
              })
            }
            className="group flex w-full max-w-4xl cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-amber-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Ampliar algoritmo de choque cardiogénico AHS"
          >
            <img
              src={IMG_ALGORITMO_CHOQUE_AHS}
              alt=""
              className="h-auto w-full max-h-[min(70vh,520px)] object-contain object-top"
              loading="lazy"
            />
          </button>
          <figcaption className="mt-2 max-w-4xl text-center text-[10px] leading-relaxed text-slate-500 sm:text-[11px]">
            <span className="font-semibold text-slate-700">Algoritmo de choque cardiogénico AHS</span>
            : perfil hemodinámico (RA, PCWP, PAPi, CPO) y vías de soporte circulatorio mecánico.{' '}
            <span className="font-medium text-amber-800">Pulsa para ampliar.</span>
          </figcaption>
        </figure>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Diagnóstico diferencial (orientativo)" icon={Activity} />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <strong className="text-slate-900">Favor cardiogénico</strong>
            <p className="mt-2">
              IAM complicado, miocardiopatía descompensada, arritmia mal tolerada, taponamiento,
              embolismo masivo, disfunción valvular aguda.
            </p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
            <strong className="text-slate-900">Pensar en otros mecanismos</strong>
            <p className="mt-2">
              Sepsis, anafilaxia, hemorragia, TEP obstructivo, disfunción adrenal — integrar ecocardio,
              lactato, venas centrales y respuesta al volumen guiada.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 md:p-8">
        <SectionHeader title="Tratamiento — líneas generales" icon={Zap} />
        <ol className="mt-4 list-inside list-decimal space-y-3 text-sm leading-relaxed text-slate-800">
          <li>
            <strong>Reanimación y monitorización:</strong> acceso vascular, ECG continuo, balance
            estricto, gasometrías y lactato seriados.
          </li>
          <li>
            <strong>Corregir causa reversible:</strong> revascularización percutanea/cirugía según IAM,
            drenaje de taponamiento, cardioversión si taquiarritmia, etc.
          </li>
          <li>
            <strong>Optimizar precarga:</strong> volumen cauteloso solo si hay criterios de
            respondedor; evitar sobrecarga en congestión franca.
          </li>
          <li>
            <strong>Inotrópicos y vasopresores</strong> según tensión arterial, perfusión y
            congestión (noradrenalina ± dobutamina/milrinona según protocolo).
          </li>
          <li>
            <strong>Soporte mecánico</strong> (BIAC, Impella, ECMO VA/VV) en shock refractario o como
            puente a procedimiento/recuperación, según equipos y guías.
          </li>
        </ol>

        <div className="relative mt-10 border-t border-amber-200/70 pt-8 print:mt-6 print:border-amber-300 print:pt-6">
          <h3 className="text-base font-black tracking-tight text-blue-700 md:text-lg">
            Fármacos en shock cardiogénico — Esquema rápido
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Preparación, mezcla, dosis «mesa» de la hoja y <strong>ml/h a 70 kg</strong> según la tabla
            UCI <strong>vasopresores e inotrópicos</strong> (proyecto FARMACOSUCI). Titulación real según
            PAM, lactato, función renal y guía local. Consultar siempre con cardiología / UCI.
          </p>

          <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-start print:grid-cols-1">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-collapse text-left text-[12px] leading-snug text-slate-800 md:text-[13px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-blue-50/40 text-[9px] font-black uppercase tracking-wide text-slate-700 md:text-[10px]">
                      <th className="px-2 py-2 md:px-3">Tipo / MoA</th>
                      <th className="px-2 py-2 md:px-3">Fármaco</th>
                      <th className="min-w-[200px] px-2 py-2 md:px-3">Preparación y dilución</th>
                      <th className="min-w-[9.5rem] px-2 py-2 md:px-3">Dosis perfusión</th>
                      <th className="whitespace-nowrap px-2 py-2 md:px-3">ml/h 70 kg</th>
                      <th className="min-w-[7.5rem] px-2 py-2 md:px-3">PVC · Luz · 24h · Vía</th>
                      <th className="min-w-[8rem] px-2 py-2 md:px-3">Shock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SHOCK_CARDIO_UCI_PHARMA.map((row) => (
                      <tr key={row.key} className={row.trClass}>
                        <td className="px-2 py-2 align-top md:px-3">
                          <span
                            className={`mr-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-bold text-white md:text-[10px] ${row.badge.className}`}
                          >
                            {row.badge.label}
                          </span>
                          <span className="block text-[11px] font-semibold text-slate-700 md:inline md:text-xs">
                            {row.moa}
                          </span>
                        </td>
                        <td className="px-2 py-2 align-top font-semibold text-slate-900 md:px-3">
                          {row.farmaco}{' '}
                          {row.comercial ? (
                            <span className="block text-[11px] font-normal text-slate-600 md:inline">
                              {row.comercial}
                            </span>
                          ) : null}
                        </td>
                        <td className="whitespace-pre-line px-2 py-2 text-slate-600 md:px-3">
                          {row.prep}
                        </td>
                        <td className="px-2 py-2 text-slate-700 md:px-3">{row.dosis}</td>
                        <td className="whitespace-nowrap px-2 py-2 font-mono text-xs font-bold text-slate-800 md:px-3">
                          {row.mlh70}
                        </td>
                        <td className="whitespace-pre-line px-2 py-2 text-[11px] text-slate-600 md:px-3">
                          {row.equipo}
                        </td>
                        <td className="px-2 py-2 text-[11px] text-slate-600 md:px-3">{row.uso}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="border-t border-slate-100 px-3 py-3 text-[12px] leading-relaxed text-slate-600 md:px-4 md:text-[13px]">
                <strong className="text-slate-800">Notas:</strong> los rangos de ml/h corresponden a la
                columna <strong>70 kg</strong> de la hoja; interpolar según peso. Ajustar por función
                renal/hepática; monitorizar ECG, lactato y perfusión. Si la mezcla o presentación no
                coincide con su servicio, seguir siempre FT y farmacia clínica.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/90 p-3 shadow-sm md:p-4">
              <div className="mb-2.5 rounded-md border-l-[6px] border-slate-200 bg-white py-2.5 pl-3 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800">Algoritmo esquemático</h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">1.</span>{' '}
                  <strong>Si hipotensión con perfusión pobre:</strong> iniciar{' '}
                  <span className="inline-block rounded-full bg-rose-500 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Noradrenalina
                  </span>{' '}
                  y optimizar volumen.
                </p>
              </div>
              <div className="mb-2.5 rounded-md border-l-[6px] border-slate-200 bg-white py-2.5 pl-3 shadow-sm">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">2.</span>{' '}
                  <strong>Si bajo gasto cardíaco pese a PAM objetivo:</strong> añadir{' '}
                  <span className="inline-block rounded-full bg-indigo-600 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Dobutamina
                  </span>{' '}
                  o{' '}
                  <span className="inline-block rounded-full bg-teal-500 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Milrinona
                  </span>{' '}
                  según RVS y riesgo arritmia.
                </p>
              </div>
              <div className="mb-2.5 rounded-md border-l-[6px] border-slate-200 bg-white py-2.5 pl-3 shadow-sm">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">3.</span>{' '}
                  <strong>Shock refractario:</strong> considerar{' '}
                  <span className="inline-block rounded-full bg-rose-500 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Adrenalina
                  </span>
                  ,{' '}
                  <span className="inline-block rounded-full bg-amber-500 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Vasopresina
                  </span>{' '}
                  como adyuvantes y evaluación urgente de soporte mecánico (IABP/ECMO/VAD).
                </p>
              </div>
              <div className="mb-2.5 rounded-md border-l-[6px] border-slate-200 bg-white py-2.5 pl-3 shadow-sm">
                <p className="text-[13px] leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800">4.</span>{' '}
                  <strong>Si necesidad de reducir catecolaminas:</strong> valorar{' '}
                  <span className="inline-block rounded-full bg-teal-500 px-2 py-0.5 align-middle text-[11px] font-bold text-white">
                    Levosimendán
                  </span>{' '}
                  (según protocolo local).
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-200 pt-3">
                <div className="min-w-[120px] flex-1">
                  <div className="text-[13px] font-bold text-slate-800">Monitorización</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-slate-600">
                    PAM, gasto urinario, lactato, ECG, gases arteriales, perfusión periférica.
                  </div>
                </div>
                <div className="min-w-[120px] flex-1">
                  <div className="text-[13px] font-bold text-slate-800">Precauciones</div>
                  <div className="mt-1 text-[13px] leading-relaxed text-slate-600">
                    Arritmias, isquemia miocárdica, aumento consumo O₂, hipotensión con
                    inodilatadores.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-blue-200/90 bg-gradient-to-b from-slate-50 to-blue-50/30 p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wide text-blue-900">
                  Noradrenalina y vasopresina — línea de tiempo
                </h4>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600 md:text-sm">
                  Página del manual (<code className="rounded bg-white px-1 py-0.5 text-[11px] text-slate-800">ecmo/Vasopresors.html</code>): inicio,
                  titración, preparaciones y desescalado. Vista embebida; si no carga, ábrala en una pestaña nueva.
                </p>
              </div>
              <a
                href={URL_ECMO_VASOPRESSORS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs font-bold text-blue-900 shadow-sm transition hover:bg-blue-50"
              >
                Abrir en nueva pestaña
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-inner">
              <iframe
                title="Noradrenalina y vasopresina — esquema práctico en línea de tiempo"
                src={URL_ECMO_VASOPRESSORS}
                className="h-[min(75vh,720px)] w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-teal-200 bg-gradient-to-b from-teal-50/80 to-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Clasificación INTERMACS" icon={ListOrdered} />
        <div className="mt-6 flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
          <figure className="flex shrink-0 flex-col items-center md:items-start">
            <button
              type="button"
              onClick={() =>
                setFigureLightbox({
                  src: IMG_INTERMACS_CLASIFICACION,
                  alt: ALT_INTERMACS_CLASIFICACION,
                  ariaLabel: 'Vista ampliada INTERMACS',
                })
              }
              className="group flex cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-teal-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 md:items-start"
              aria-label="Ampliar figura INTERMACS: tabla y diagrama de perfiles"
            >
              <img
                src={IMG_INTERMACS_CLASIFICACION}
                alt=""
                className="max-h-[130px] w-auto max-w-[min(100%,280px)] object-contain object-top sm:max-h-[150px]"
                loading="lazy"
              />
            </button>
            <figcaption className="mt-2 max-w-[280px] text-center text-[10px] leading-relaxed text-slate-600 sm:text-[11px] md:text-left">
              Escala INTERMACS: tabla de perfiles (arriba) y diagrama de selección frente a NYHA / guías
              (abajo).{' '}
              <span className="font-semibold text-teal-700">Pulsa para ampliar.</span>
            </figcaption>
          </figure>
          <div className="min-w-0 w-full flex-1 space-y-5 md:pt-1">
            <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white/90 p-5 md:p-6">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 md:text-left">
                Interagency Registry for Mechanically Assisted Circulatory Support
              </p>
              <div className="space-y-4 text-sm leading-relaxed text-slate-700">
                <p>
                  Clasificación de pacientes con <strong className="text-slate-900">ICC avanzada</strong> en{' '}
                  <strong className="text-slate-900">7 niveles</strong> en función de su perfil{' '}
                  <strong className="text-slate-900">hemodinámico</strong> y del daño de{' '}
                  <strong className="text-slate-900">órganos diana</strong>.
                </p>
                <p>
                  Se definió en el marco de un <strong className="text-slate-900">registro multicéntrico</strong>{' '}
                  de dispositivos de asistencia para <strong className="text-slate-900">optimizar su manejo</strong>.
                </p>
                <p>
                  <strong className="text-slate-900">Predice mortalidad y complicaciones</strong>, así como el{' '}
                  <strong className="text-slate-900">pronóstico</strong>.
                </p>
              </div>
            </div>
            <p className="text-center text-[11px] leading-relaxed text-slate-600 md:text-left">
              INTERMACS es una herramienta de estratificación; la decisión terapéutica debe integrar comorbilidad,
              frágilidad y recursos del centro.
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Contenido educativo; las decisiones terapéuticas deben seguir los algoritmos y recursos de
        reanimación cardíaca y unidad de cuidados intensivos de tu hospital.
      </p>

      {figureLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={figureLightbox.ariaLabel}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setFigureLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setFigureLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={figureLightbox.src}
            alt={figureLightbox.alt}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  )
}
