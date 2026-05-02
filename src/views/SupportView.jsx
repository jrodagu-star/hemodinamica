import { Activity, ArrowLeft, WindArrowDown, Zap } from 'lucide-react'
import { SupportCard } from '../components/ui.jsx'

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
