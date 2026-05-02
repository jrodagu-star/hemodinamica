import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Droplets,
  Gauge,
  Info,
  Layers,
  X,
  Zap,
} from 'lucide-react'
import { atlasParameters } from '../data/atlasParameters.js'
import { publicAsset } from '../lib/publicAsset.js'
import { FilterBtn, MenuCard, SectionHeader } from '../components/ui.jsx'

const TABLA_PRECARGA_DIN = encodeURI(publicAsset('tabla precarga.png'))

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
          <p className="font-mono text-xs md:text-sm">
            CaO₂ = (1,34 × Hb × SaO₂) + (0,0031 × PaO₂){' '}
            <span className="font-sans text-slate-600">
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
            <p className="mt-2 text-xs text-slate-600">
              Por debajo de lo esperado: aporte DO₂ insuficiente frente a VO₂ o
              distribución alterada.
            </p>
          </div>
          <div className="rounded-xl bg-indigo-50/80 p-4">
            <h4 className="text-xs font-bold uppercase text-indigo-900">ScvO₂</h4>
            <p className="mt-2 text-sm text-slate-700">
              Saturación venosa <strong>central</strong> (vía cava superior). Suele ser{' '}
              <strong>unos 5 % menor</strong> que SvO₂ en condiciones estables.
            </p>
            <p className="mt-2 text-xs text-slate-600">
              Objetivos habituales en protocolos suelen situar <strong>&lt;70 %</strong>{' '}
              como zona de alerta por posible hipoperfusión; <strong>&lt;65 %</strong>{' '}
              sugiere DO₂ inefectivo; <strong>&gt;75 %</strong> puede asociarse a VO₂
              inefectivo o shunt/captación reducida según contexto.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h3 className="border-b border-slate-100 pb-3 text-sm font-black uppercase tracking-wide text-slate-800">
          O₂ER / «extracción» (PEO₂)
        </h3>
        <p className="mt-4 text-sm text-slate-700">
          Proporción de oxígeno extraído respecto al transportado. Referencia habitual{' '}
          <strong>~20–30 %</strong>; valores centrados en <strong>~25 %</strong> en
          textos clásicos.
        </p>
        <div className="mt-4 space-y-2 rounded-xl bg-amber-50 p-4 font-mono text-xs text-amber-950 md:text-sm">
          <p>O₂ER = (CaO₂ − CvO₂) / CaO₂ × 100</p>
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
          <p>VO₂ / DO₂ = ratio de extracción (≈ O₂ER en %)</p>
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
