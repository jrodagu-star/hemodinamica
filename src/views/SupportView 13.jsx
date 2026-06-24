import { useEffect, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  ExternalLink,
  Droplets,
  Gauge,
  Heart,
  Layers,
  RotateCw,
  ScanLine,
  Settings2,
  ShieldAlert,
  Syringe,
  Thermometer,
  Waypoints,
  WindArrowDown,
  X,
  Zap,
} from 'lucide-react'
import { SectionHeader, SupportCard } from '../components/ui.jsx'
import { publicAsset } from '../lib/publicAsset.js'

const BIAC_IMG = (name) => publicAsset(`BIAC/${name}`)

const MANUAL_ECMO_VV_HREF = publicAsset('ecmo/manual-ecmo-vv.html')

const IMG_ECMO_PRESIONES = publicAsset('ecmo/presiones-consola.png')

const ECMO_PRESIONES_ALT =
  'Consola ECMO Cardiohelp: presiones de drenaje P venosa (Pven), pre-membrana (Pint), post-membrana (Part), gradiente Δp entre P2 y P3, flujo, RPM, temperatura arterial y SvO₂.'

const IMG_ECMO_VV_PRESIONES_ESQUEMA = publicAsset('ecmo/ecmo-vv-presiones-esquema.png')

const ECMO_VV_PRESIONES_ALT =
  'Esquema ECMO veno-venoso: drenaje venoso con P1 y SvO₂ pre-bomba, P2 pre-membrana, oxigenador con gas (Air/O₂), P3 post-membrana y retorno al paciente (yugular).'

const IMG_ECMO_VA_FEMORAL = publicAsset('ecmo/ecmo-va-femoral-periferico.png')

const ECMO_VA_FEMORAL_ALT =
  'Esquema de ECMO veno-arterial periférico femoral: bomba, oxigenador, sangre desoxigenada desde la vena femoral y retorno oxigenado hacia la arteria femoral.'

const IMG_ECMO_VA_PERIF_FEMORAL_CONFIG = publicAsset(
  'ecmo/ecmo-va-periferico-femoral-ilustracion.png',
)

const ECMO_VA_PERIF_FEMORAL_CONFIG_ALT =
  'Ilustración de ECMO veno-arterial periférico femoral: tórax con corazón y grandes vasos, circuito externo con bomba y oxigenador, drenaje venoso femoral y retorno arterial femoral con flujo de sangre desoxigenada y oxigenada.'

const IMG_ECMO_VV_FEMORO_YUGULAR = publicAsset('ecmo/ecmo-vv-femoro-yugular.png')

const ECMO_VV_FEMORO_YUGULAR_ALT =
  'Esquema ECMO veno-venoso femoro-yugular (Vf–Vj): cánula de drenaje en vena femoral, bomba, consola, mezclador de gases con FiO₂, membrana u oxigenador, retorno de sangre oxigenada por cánula yugular; sensor de CO₂, flujo y presión en vía aérea.'

const IMG_ECMO_VENO_ARTERIAL_PERIFERICO = publicAsset(
  'ecmo/ecmo-veno-arterial-periferico-diagrama.png',
)

const ECMO_VENO_ARTERIAL_PERIFERICO_ALT =
  'Ilustración de ECMO veno-arterial periférico: torso con corazón y grandes vasos, circuito externo con bomba y oxigenador, sangre desoxigenada desde vena femoral y retorno oxigenado hacia arteria femoral.'

/** Ilustraciones de modalidades / montajes (miniatura + pie; ampliar con lightbox). */
const ECMO_CONFIGURACIONES_ITEMS = [
  {
    id: 'va-femoral-periferico',
    src: IMG_ECMO_VA_PERIF_FEMORAL_CONFIG,
    alt: ECMO_VA_PERIF_FEMORAL_CONFIG_ALT,
    caption: 'ECMO VA periférico femoral',
    description:
      'Configuración veno-arterial con cánulas periféricas en la región femoral: la sangre desoxigenada se extrae de la vena femoral, circula por bomba y oxigenador, y el retorno oxigenado se inyecta en la arteria femoral hacia la circulación arterial sistémica. Útil como referencia visual del flujo del circuito respecto al corazón y la aorta.',
  },
  {
    id: 'vv-femoro-yugular',
    src: IMG_ECMO_VV_FEMORO_YUGULAR,
    alt: ECMO_VV_FEMORO_YUGULAR_ALT,
    caption: 'ECMO VV FEMORO-YUGULAR',
    description:
      'ECMO veno-venoso con drenaje desde la vena femoral y retorno hacia la vena yugular interna: el circuito solo sustituye la función respiratoria (oxigenación y eliminación de CO₂) sin soporte mecánico directo del gasto cardíaco. Incluye bomba, membrana, mezclador de gas y monitorización asociada a vía aérea según el esquema.',
  },
  {
    id: 'va-periferico-diagrama',
    src: IMG_ECMO_VENO_ARTERIAL_PERIFERICO,
    alt: ECMO_VENO_ARTERIAL_PERIFERICO_ALT,
    caption: 'ECMO veno-arterial periférico',
    description:
      'Esquema de soporte veno-arterial con accesos periféricos femorales: bomba y oxigenador en circuito paralelo al corazón y los pulmones, con identificación explícita del trayecto de sangre desoxigenada (venosa) y oxigenada (arterial) en el montaje periférico.',
  },
]

const IMG_ECMO_ARLEQUIN = publicAsset('ecmo/sindrome-arlequin.png')

const ECMO_ARLEQUIN_ALT =
  'Síndrome de Arlequín en ECMO VA periférica: territorio superior hipoxémico por eyección del VI con pulmón disfuncionante, inferior oxigenado por el circuito; monitorizar SpO₂ en extremidad superior derecha (KTA).'

const ECMO_PARTES_ITEMS = [
  {
    src: publicAsset('ecmo/ecmo-parte-blender-calor.png'),
    alt:
      'Mezclador de gases bajo flujo Sechrist con caudalímetros O₂/aire y dial FiO₂; unidad Maquet Getinge de temperatura del circuito (calentamiento sangre).',
    caption: 'Mezcla de gases y temperatura',
  },
  {
    src: publicAsset('ecmo/ecmo-parte-gasometria-pre-post.png'),
    alt:
      'Oxigenador Maquet HLS Module Advanced con puntos de muestreo PRE (ante membrana) y POST (tras membrana) para gasometría y valoración del intercambio.',
    caption: 'Gasometría PRE / POST membrana',
  },
  {
    src: publicAsset('ecmo/ecmo-parte-sensor-pvo2.png'),
    alt:
      'Componente modular del circuito ECMO (sensor / acople); bomba de sangre y líneas en segundo plano.',
    caption: 'Sensor / módulo en circuito',
  },
  {
    src: publicAsset('ecmo/ecmo-parte-cardiohelp.png'),
    alt:
      'Consola portátil Maquet Cardiohelp Getinge: pantalla, mandos y panel de conexiones del sistema ECMO.',
    caption: 'Consola Cardiohelp',
  },
]

const IMG_MCS_OVERVIEW = publicAsset('support/asistencias-cardiacas-mcs.png')

const MCS_OVERVIEW_ALT =
  'Esquema de modalidades de soporte circulatorio mecánico: IABP, Impella, TandemHeart, ECMO VA, TandemHeart con cánula de doble lumen y Impella RP.'

const IMG_IMPELLA_IN_HEART = publicAsset('support/impella-in-heart-3d.png')

const ALT_IMPELLA_IN_HEART =
  'Ilustración 3D: catéter Impella atravesando la válvula aórtica con la punta en el ventrículo izquierdo, soporte de gasto desde el VI.'

const IMG_IMPELLA_5_PUMP = publicAsset('support/impella-5-heart-pump.png')

const ALT_IMPELLA_5_PUMP =
  'Impella 5.0 Heart Pump: sistema completo, diagrama de colocación en el corazón y detalle distal con pigtail, área de entrada, sensor de presión diferencial, salida y alojamiento del motor.'

const MCS_SUPPORT_OPTIONS = [
  {
    letter: 'A',
    name: 'IABP',
    subtitle: 'Balón intraaórtico',
    text: 'Catéter por arteria femoral; balón en aorta descendente (contrapulsación).',
  },
  {
    letter: 'B',
    name: 'Impella',
    subtitle: 'Microbomba axial',
    text: 'Acceso femoral; atraviesa la válvula aórtica y aspira sangre del VI.',
  },
  {
    letter: 'C',
    name: 'TandemHeart',
    subtitle: 'Bomba centrífuga extracorpórea',
    text: 'Entrada venosa femoral con acceso transseptal a AI; salida arterial femoral.',
  },
  {
    letter: 'D',
    name: 'ECMO',
    subtitle: 'VA periférico',
    text: 'Circuito con bomba y oxigenador: drenaje venoso femoral y retorno arterial femoral.',
  },
  {
    letter: 'E',
    name: 'TandemHeart',
    subtitle: 'Cánula de doble luz',
    text: 'Vía yugular interna con cánula única de doble luz hasta el corazón.',
  },
  {
    letter: 'F',
    name: 'Impella RP',
    subtitle: 'Soporte ventricular derecho',
    text: 'Acceso venoso femoral; catéter hasta arteria pulmonar.',
  },
]

/** Problemas graves del circuito ECMO (referencia educativa; seguir protocolo del centro). */
const ECMO_SEVERE_PROBLEMS = [
  {
    title: 'Embolismo aéreo',
    badge: 'Emergencia',
    presentation:
      'Aire en el circuito (burbujas en racores o líneas), caída brusca de saturación (especialmente post-membrana), inestabilidad hemodinámica o arritmias en contexto de introducción de aire.',
    action:
      'Identificar y corregir el punto de entrada (conexiones, cambios de bolsa, accesos); seguir secuencia de clamp / purga / aislamiento según IFU; valorar soporte hemodinámico y cambio de componente si hay riesgo clínico relevante.',
  },
  {
    title: 'Fallo de bomba',
    badge: 'Técnico / hemodinámico',
    presentation:
      'Cese o fluctuación del flujo pese a consigna, alarmas de bajo flujo o de dispositivo, aumento de potencia sin respuesta, ruido o vibración anómala; puede asociarse a trombosis, pinzamiento de línea o fallo eléctrico.',
    action:
      'Revisar alimentación y conectores; comprobar acodamientos y posición de cánulas; reducir RPM o flujo de forma controlada si indica el protocolo; valorar trombo en cabeza de bomba y circuito de recambio de urgencia.',
  },
  {
    title: 'Fallo de gas',
    badge: 'Oxigenación / CO₂',
    presentation:
      'Caída de saturación post-membrana con flujo conservado, aumento de CO₂ arterial pese a sweep adecuado, fugas en mezcla O₂/aire o presión de gas baja; alarma en blender o fuentes de O₂.',
    action:
      'Verificar conexiones del gas, presión de O₂ y aire, blender y humidificación; revisar fugas en membrana y tramos de gas; ajustar FiO₂ de mezcla y sweep según gasometría; cambiar componente de gas si está dañado.',
  },
  {
    title: 'Fallo de membrana',
    badge: 'Oxigenador',
    presentation:
      'Aumento progresivo del gradiente ΔP (P2−P3) con flujo similar, empeoramiento de intercambio (hipoxemia o hipercapnia refractaria al ajuste de gas), presiones post-membrana anómalas o signos de trombosis/fibrina.',
    action:
      'Confirmar con gasometrías pre/post y revisión visual del oxigenador; optimizar anticoagulación según guía; planificar cambio programado o urgente de membrana según gravedad y disponibilidad.',
  },
  {
    title: 'Drenaje insuficiente',
    badge: 'Precarga del circuito',
    presentation:
      'Presión de succión (P1) muy negativa, «chattering» o inestabilidad del flujo, caída del caudal pese a RPM altas.',
    causes: [
      'Hipovolemia',
      'Taponamiento cardíaco',
      'Neumotórax',
      'Acodamiento',
      'Trombosis o diámetro insuficiente de la cánula venosa',
    ],
    action:
      'Valorar volumen y función del VD; revisar posición de cánula (eco/Rx); descartar complicaciones torácicas; ajustar profundidad o decúbito; reducir flujo de forma transitoria si hay riesgo de cavitation/hemólisis hasta corregir causa.',
  },
]

/** Tendencia esperada: up = aumento / más extremo; down = descenso (según tabla de referencia). */
const ECMO_PRESION_TROUBLESHOOTING = [
  {
    situation: 'Resistencia a la aspiración aumentada',
    p1: 'up',
    p2: 'down',
    p3: 'down',
    dp: 'down',
    causes: [
      'Cánula venosa acodada',
      'Hipovolemia',
      'Taponamiento',
      'Neumo- o hemotórax',
    ],
  },
  {
    situation: 'Fallo de bomba',
    p1: 'down',
    p2: 'down',
    p3: 'down',
    dp: 'down',
    causes: ['Mecánico', 'Trombo en bomba'],
  },
  {
    situation: 'Fallo del oxigenador',
    p1: 'down',
    p2: 'up',
    p3: 'down',
    dp: 'up',
    causes: ['Trombo en oxigenador'],
  },
  {
    situation: 'Obstáculo a la eyección',
    p1: 'down',
    p2: 'up',
    p3: 'up',
    dp: 'down',
    causes: [
      'Cánula arterial acodada',
      'Paciente incorporado',
      'Obstrucción de cánula',
    ],
  },
]

function EcmoPressureTrend({ dir }) {
  const wrap = 'inline-flex items-center justify-center'
  if (dir === 'up') {
    return (
      <span className={wrap} title="Aumenta / se hace más extremo">
        <ArrowUp className="h-5 w-5 text-blue-900" strokeWidth={2.5} aria-hidden />
        <span className="sr-only">Aumenta</span>
      </span>
    )
  }
  return (
    <span className={wrap} title="Disminuye">
      <ArrowDown className="h-5 w-5 text-sky-600" strokeWidth={2.5} aria-hidden />
      <span className="sr-only">Disminuye</span>
    </span>
  )
}

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
  centrimag: {
    title: 'CentriMag',
    mechanism:
      'Bomba centrífuga de levitación magnética (Levitronix): sin cojinetes ni sellos mecánicos en contacto con la sangre; soporte ventricular de corta duración y uso frecuente integrada en circuitos de MCS o ECMO según montaje.',
    indications: [
      'Shock cardiogénico refractario (LVAD / RVAD / BiVAD de corto plazo)',
      'Puente a recuperación, decisión, trasplante o dispositivo de larga duración',
      'Soporte perioperatorio o rescate hemodinámico en pacientes seleccionados',
    ],
    contra: [
      'Hemorragia activa no controlada o CI severa a anticoagulación según contexto',
      'Ausencia de estrategia de destino consensuada con el equipo',
      'Limitaciones anatómicas / de cánulas o disfunción no abordable según protocolo',
    ],
    headerClass: 'bg-cyan-700',
  },
  tandemheart: {
    title: 'TandemHeart',
    mechanism:
      'Sistema de asistencia ventricular izquierda con bomba centrífuga extracorpórea: la sangre se aspira de la aurícula izquierda tras acceso venoso y punción transseptal y se reinfunde en la circulación arterial (habitual acceso femoral), descargando el VI sin atravesar la válvula aórtica.',
    indications: [
      'Shock cardiogénico refractario con necesidad de soporte LVAD de corto plazo',
      'Puente a recuperación, cirugía, decisión o dispositivo de larga duración',
      'Soporte hemodinámico en contextos de IAM complicado o bajo gasto severo seleccionados',
    ],
    contra: [
      'Trombo o masas en AI / orejuela izquierda según imagen',
      'Insuficiencia aórtica grave no tratada (regurgitación diastólica a VI)',
      'Alteraciones del tabique interauricular o vías de acceso no viables',
      'Hemorragia activa o contraindicación relevante a anticoagulación según protocolo',
    ],
    headerClass: 'bg-rose-700',
  },
}

export function SupportView({ selectedSupport, setSelectedSupport }) {
  const [overviewLightbox, setOverviewLightbox] = useState(null)

  useEffect(() => {
    if (!overviewLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOverviewLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [overviewLightbox])

  if (selectedSupport === 'ecmo') {
    return <EcmoDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport === 'biac') {
    return <BiacDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport === 'centrimag') {
    return <CentriMagDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport === 'tandemheart') {
    return <TandemHeartDetailView onBack={() => setSelectedSupport(null)} />
  }
  if (selectedSupport === 'impella') {
    return <ImpellaDetailView onBack={() => setSelectedSupport(null)} />
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
    <>
      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-20 pt-4 text-center">
      <h2 className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic">
        Soporte hemodinámico
      </h2>
      <p className="mx-auto max-w-2xl text-sm text-slate-600">
        Resumen orientativo; las decisiones son siempre según guías locales y el
        caso clínico.
      </p>

      <section className="mx-auto mt-10 max-w-5xl text-left">
        <h3 className="mb-4 flex items-center justify-center gap-2 text-center text-xs font-black uppercase tracking-widest text-slate-700 md:justify-start md:text-left">
          <Heart className="h-4 w-4 shrink-0 text-rose-600" aria-hidden />
          Modalidades de asistencia circulatoria (ejemplos)
        </h3>
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start md:gap-8">
          <div className="flex flex-col items-center md:items-start">
            <button
              type="button"
              onClick={() =>
                setOverviewLightbox({
                  src: IMG_MCS_OVERVIEW,
                  alt: MCS_OVERVIEW_ALT,
                })
              }
              className="group flex max-w-full cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
              aria-label="Ampliar esquema de modalidades de soporte circulatorio"
            >
              <img
                src={IMG_MCS_OVERVIEW}
                alt=""
                className="max-h-[130px] w-auto max-w-[min(100%,240px)] object-contain sm:max-h-[150px]"
                loading="lazy"
              />
            </button>
            <p className="mt-2 max-w-[240px] text-center text-[10px] text-slate-500 md:text-left">
              Esquema comparativo A–F.{' '}
              <span className="font-medium text-slate-700">Pulsa para ampliar.</span>
            </p>
          </div>
          <ul className="space-y-3 text-[13px] leading-relaxed text-slate-700">
            {MCS_SUPPORT_OPTIONS.map((opt) => (
              <li key={opt.letter}>
                <span className="font-black text-slate-900">{opt.letter}.</span>{' '}
                <strong className="text-slate-900">{opt.name}</strong>
                <span className="text-slate-500"> ({opt.subtitle})</span>
                <span className="text-slate-600"> — {opt.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-10 grid grid-cols-1 gap-8 text-left sm:grid-cols-2 lg:grid-cols-3">
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
        <SupportCard
          title="CentriMag"
          fullName="Levitronix · bomba centrífuga"
          icon={RotateCw}
          description="Levitación magnética; VAD de corto plazo o bomba en circuito MCS/ECMO."
          pros={['Bajo estrés hemolítico relativo', 'Flujo ajustable por RPM']}
          color="border-cyan-500"
          onClick={() => setSelectedSupport('centrimag')}
        />
        <SupportCard
          title="TandemHeart"
          fullName="Bomba centrífuga · drenaje AI"
          icon={Waypoints}
          description="Flujo AI → arterial; acceso transseptal y soporte de corto plazo."
          pros={['Descarga del VI', 'Alternativa a microaxial en seleccionados']}
          color="border-rose-500"
          onClick={() => setSelectedSupport('tandemheart')}
        />
      </div>
      </div>

      {overviewLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setOverviewLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setOverviewLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={overviewLightbox.src}
            alt={overviewLightbox.alt}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  )
}

function ImpellaDetailView({ onBack }) {
  const data = SUPPORT_DATA.impella
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
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">{data.title}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm italic opacity-95">{data.mechanism}</p>
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

      <section className="rounded-[2rem] border border-amber-100 bg-amber-50/30 p-6 shadow-sm md:p-8">
        <SectionHeader title="Colocación y dispositivo" icon={ScanLine} />
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Esquema anatómico y vista del sistema Impella 5.0. Referencia educativa; colocación, alarmas y
          límites según IFU y protocolo de tu centro.
        </p>
        <div className="mt-6 grid gap-8 md:grid-cols-2">
          <figure className="flex flex-col items-center">
            <button
              type="button"
              onClick={() =>
                setFigureLightbox({ src: IMG_IMPELLA_IN_HEART, alt: ALT_IMPELLA_IN_HEART })
              }
              className="group flex w-full max-w-md cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-amber-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Ampliar ilustración Impella en el corazón"
            >
              <img
                src={IMG_IMPELLA_IN_HEART}
                alt=""
                className="h-auto max-h-[260px] w-full object-contain"
                loading="lazy"
              />
            </button>
            <figcaption className="mt-2 max-w-md text-center text-[10px] leading-relaxed text-slate-600">
              Posición del catéter (aorta → válvula aórtica → VI).{' '}
              <span className="font-medium text-amber-800">Pulsa para ampliar.</span>
            </figcaption>
          </figure>
          <figure className="flex flex-col items-center">
            <button
              type="button"
              onClick={() =>
                setFigureLightbox({ src: IMG_IMPELLA_5_PUMP, alt: ALT_IMPELLA_5_PUMP })
              }
              className="group flex w-full max-w-md cursor-zoom-in flex-col items-center overflow-hidden rounded-2xl border border-amber-200 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Ampliar vista Impella 5.0 Heart Pump"
            >
              <img
                src={IMG_IMPELLA_5_PUMP}
                alt=""
                className="h-auto max-h-[260px] w-full object-contain"
                loading="lazy"
              />
            </button>
            <figcaption className="mt-2 max-w-md text-center text-[10px] leading-relaxed text-slate-600">
              Impella 5.0: conjunto, punta (pigtail, entrada, sensor ΔP, salida, motor).{' '}
              <span className="font-medium text-amber-800">Pulsa para ampliar.</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
        Contenido educativo; implante y manejo según formación, guías y comité de MCS de tu hospital.
      </p>

      {figureLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
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

function EcmoDetailView({ onBack }) {
  const data = SUPPORT_DATA.ecmo
  const [presionesLightbox, setPresionesLightbox] = useState(null)

  useEffect(() => {
    if (!presionesLightbox) return
    const onKey = (e) => {
      if (e.key === 'Escape') setPresionesLightbox(null)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [presionesLightbox])

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
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-8">
            <div className="flex shrink-0 flex-col items-center">
              <button
                type="button"
                onClick={() =>
                  setPresionesLightbox({
                    src: IMG_ECMO_VA_FEMORAL,
                    alt: ECMO_VA_FEMORAL_ALT,
                  })
                }
                className="group flex cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-red-100 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                aria-label="Ampliar esquema ECMO VA femoral periférico"
              >
                <img
                  src={IMG_ECMO_VA_FEMORAL}
                  alt=""
                  className="max-h-[120px] w-auto max-w-[200px] object-contain sm:max-h-[140px] sm:max-w-[220px]"
                  loading="lazy"
                />
              </button>
              <p className="mt-2 max-w-[220px] text-center text-[10px] text-slate-500">
                ECMO VA periférico (referencia).{' '}
                <span className="font-medium text-red-700">Pulsa para ampliar.</span>
              </p>
            </div>
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-700">
              Para el control y monitorización de un sistema{' '}
              <strong className="text-slate-900">ECMO tipo Cardiohelp (Maquet)</strong>, conviene
              vigilar de forma continuada las{' '}
              <strong className="text-slate-900">presiones del circuito</strong> y los{' '}
              <strong className="text-slate-900">niveles de saturación</strong>: los sensores de la
              consola permiten anticipar complicaciones técnicas y valorar la perfusión del paciente.
            </p>
          </div>

          <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm md:p-8">
            <SectionHeader title="CONFIGURACIONES ECMO" icon={Settings2} />
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-600">
              Esquemas orientativos de montaje. Pulsa cada imagen para ampliarla.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-2 min-[400px]:gap-3 min-[480px]:gap-4 sm:gap-6">
              {ECMO_CONFIGURACIONES_ITEMS.map((item) => (
                <figure key={item.id} className="flex min-w-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setPresionesLightbox({
                        src: item.src,
                        alt: item.alt,
                      })
                    }
                    className="group flex w-full max-w-full cursor-zoom-in justify-center overflow-hidden rounded-xl border border-red-100 bg-red-50/30 p-1 shadow-inner transition hover:ring-2 hover:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 min-[480px]:rounded-2xl min-[480px]:p-1.5 sm:p-3"
                    aria-label={`Ampliar: ${item.caption}`}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className="max-h-[88px] w-auto max-w-full object-contain min-[400px]:max-h-[100px] min-[480px]:max-h-[130px] sm:max-h-[160px]"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-1.5 w-full min-w-0 max-w-[11rem] text-center min-[480px]:max-w-none sm:mt-3">
                    <p className="text-[8px] font-black uppercase leading-tight tracking-wide text-red-900 min-[400px]:text-[9px] min-[480px]:text-[10px] sm:text-[11px]">
                      {item.caption}
                    </p>
                    <p className="mt-1 text-left text-[9px] leading-snug text-slate-700 min-[400px]:text-[10px] min-[480px]:mt-1.5 min-[480px]:text-[11px] min-[480px]:leading-relaxed sm:text-[12px]">
                      {item.description}
                    </p>
                    <p className="mt-1.5 text-center text-[10px] text-slate-500">
                      <span className="font-medium text-red-700">Pulsa la imagen para ampliar.</span>
                    </p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-red-200 bg-gradient-to-br from-red-50/90 to-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-900">
                  <BookOpen className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
                  Manual ECMO VV
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  Guía esquemática y operativa para <strong className="text-slate-900">ECMO venovenoso</strong>
                  en UCI: circuito y gas, oxigenación, ventilación mecánica protectora, anticoagulación,
                  retirada y checklist interactivo. Se abre en una pestaña nueva.
                </p>
              </div>
              <a
                href={MANUAL_ECMO_VV_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-red-700 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
              >
                Abrir manual ECMO VV
                <ExternalLink className="h-4 w-4 opacity-90" aria-hidden />
              </a>
            </div>
          </section>

          <section className="border-t border-red-100 pt-10">
            <SectionHeader title="Partes del ECMO" icon={Layers} />
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-600">
              Referencias visuales de componentes del sistema (mezcla de gases, temperatura, muestreos,
              sensores y consola). Pulsa cada miniatura para verla en grande.
            </p>
            <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3 md:gap-4">
              {ECMO_PARTES_ITEMS.map((item) => (
                <figure key={item.caption} className="flex min-w-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setPresionesLightbox({
                        src: item.src,
                        alt: item.alt,
                      })
                    }
                    className="group flex h-[100px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-inner transition hover:ring-2 hover:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:h-[112px] sm:p-2"
                    aria-label={`Ampliar imagen: ${item.caption}`}
                  >
                    <img
                      src={item.src}
                      alt=""
                      className="max-h-[84px] w-full object-contain sm:max-h-[96px]"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-2 w-full text-center text-[9px] leading-tight text-slate-600 sm:text-[10px] sm:leading-snug">
                    {item.caption}.{' '}
                    <span className="font-medium text-red-700">Pulsa para ampliar.</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

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
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-6">
              <figure className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setPresionesLightbox({
                      src: IMG_ECMO_PRESIONES,
                      alt: ECMO_PRESIONES_ALT,
                    })
                  }
                  className="group flex w-full max-w-full cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-red-100 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Ampliar imagen de consola de presiones ECMO"
                >
                  <img
                    src={IMG_ECMO_PRESIONES}
                    alt=""
                    className="max-h-[130px] w-auto max-w-full object-contain sm:max-h-[150px]"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-2 max-w-md text-center text-[11px] leading-relaxed text-slate-600">
                  <strong className="text-slate-800">Consola:</strong> P<sub>ven</sub>, P<sub>int</sub>,{' '}
                  P<sub>Art</sub>, Δp, caudal, rpm, T y SvO₂.{' '}
                  <span className="font-medium text-red-700">Pulsa para ampliar.</span>
                </figcaption>
              </figure>
              <figure className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() =>
                    setPresionesLightbox({
                      src: IMG_ECMO_VV_PRESIONES_ESQUEMA,
                      alt: ECMO_VV_PRESIONES_ALT,
                    })
                  }
                  className="group flex w-full max-w-full cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-red-100 bg-white p-3 shadow-inner transition hover:ring-2 hover:ring-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Ampliar esquema ECMO VV con puntos P1, P2 y P3"
                >
                  <img
                    src={IMG_ECMO_VV_PRESIONES_ESQUEMA}
                    alt=""
                    className="max-h-[130px] w-auto max-w-full object-contain sm:max-h-[150px]"
                    loading="lazy"
                  />
                </button>
                <figcaption className="mt-2 max-w-md text-center text-[11px] leading-relaxed text-slate-600">
                  <strong className="text-slate-800">Circuito VV (referencia):</strong> P1 / SvO₂ (drenaje),
                  P2 pre-membrana, P3 retorno.{' '}
                  <span className="font-medium text-red-700">Pulsa para ampliar.</span>
                </figcaption>
              </figure>
            </div>

            <div className="mt-12 border-t border-red-100 pt-10">
              <h4 className="text-xs font-black uppercase tracking-widest text-red-900">
                Monitorización de presiones (interpretación)
              </h4>
              <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-700">
                Referencia para relacionar el patrón de{' '}
                <strong className="text-slate-900">P1</strong>, <strong className="text-slate-900">P2</strong>,{' '}
                <strong className="text-slate-900">P3</strong> y{' '}
                <strong className="text-slate-900">P2 − P3</strong> (ΔP del oxigenador) con posibles
                causas. Las flechas indican la tendencia habitual del parámetro (↑ aumento / más extremo;
                ↓ descenso).
              </p>

              <div className="mt-5 overflow-x-auto rounded-3xl border border-red-100 bg-white shadow-inner">
                <table className="w-full min-w-[720px] border-collapse text-left text-sm text-slate-800">
                  <thead>
                    <tr className="border-b border-red-100 bg-red-50/95 text-xs font-bold uppercase tracking-wide text-red-950">
                      <th className="px-3 py-3 align-bottom md:px-4">
                        Situación / alteración
                      </th>
                      <th className="px-2 py-3 text-center align-bottom md:px-3">
                        P1
                        <span className="mt-1 block whitespace-normal text-[10px] font-semibold normal-case leading-tight tracking-normal text-red-800">
                          (ref. máx. −70 mmHg)
                        </span>
                      </th>
                      <th className="px-2 py-3 text-center align-bottom md:px-3">
                        P2
                        <span className="mt-1 block whitespace-normal text-[10px] font-semibold normal-case leading-tight tracking-normal text-red-800">
                          máx. 250–300 mmHg
                        </span>
                      </th>
                      <th className="px-2 py-3 text-center align-bottom md:px-3">
                        P3
                        <span className="mt-1 block whitespace-normal text-[10px] font-semibold normal-case leading-tight tracking-normal text-red-800">
                          máx. 250–300 mmHg
                        </span>
                      </th>
                      <th className="px-2 py-3 text-center align-bottom md:px-3">
                        P2 − P3
                        <span className="mt-1 block whitespace-normal text-[10px] font-semibold normal-case leading-tight tracking-normal text-red-800">
                          ΔP oxigenador
                        </span>
                      </th>
                      <th className="min-w-[180px] px-3 py-3 align-bottom md:px-4">
                        Posibles causas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    {ECMO_PRESION_TROUBLESHOOTING.map((row) => (
                      <tr key={row.situation} className="bg-white/90">
                        <td className="px-3 py-3 font-semibold text-slate-900 md:px-4">
                          {row.situation}
                        </td>
                        <td className="px-2 py-3 text-center md:px-3">
                          <EcmoPressureTrend dir={row.p1} />
                        </td>
                        <td className="px-2 py-3 text-center md:px-3">
                          <EcmoPressureTrend dir={row.p2} />
                        </td>
                        <td className="px-2 py-3 text-center md:px-3">
                          <EcmoPressureTrend dir={row.p3} />
                        </td>
                        <td className="px-2 py-3 text-center md:px-3">
                          <EcmoPressureTrend dir={row.dp} />
                        </td>
                        <td className="px-3 py-3 text-[13px] leading-snug text-slate-700 md:px-4">
                          <ul className="list-inside list-disc space-y-1">
                            {row.causes.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Objetivos de saturación" icon={Activity} />
            <div className="mt-4 space-y-5 rounded-3xl border border-slate-200 bg-slate-50/80 p-6 md:p-8 text-sm leading-relaxed text-slate-800">
              <p>
                Los objetivos dependen del{' '}
                <strong className="text-slate-900">modo ECMO</strong> y del punto del circuito (antes
                o después de la membrana). La SvO₂/Satv del paciente debe integrarse con la saturación
                pre-membrana cuando el muestreo sea comparable.
              </p>

              <div className="overflow-x-auto rounded-3xl border border-red-100 bg-white shadow-inner">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm text-slate-800">
                  <thead>
                    <tr className="border-b border-red-100 bg-red-50/95 text-xs font-bold uppercase tracking-wide text-red-950">
                      <th className="px-4 py-3 align-bottom">Modo ECMO</th>
                      <th className="min-w-[200px] px-4 py-3 align-bottom">
                        Pre-membrana
                        <span className="mt-1 block text-[10px] font-semibold normal-case leading-snug tracking-normal text-red-800">
                          Entrada al oxigenador (venoso/mixto en circuito)
                        </span>
                      </th>
                      <th className="min-w-[200px] px-4 py-3 align-bottom">
                        Post-membrana
                        <span className="mt-1 block text-[10px] font-semibold normal-case leading-snug tracking-normal text-red-800">
                          Salida del oxigenador (tras intercambio gasoso / sweep)
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-50">
                    <tr className="bg-white">
                      <td className="align-top px-4 py-4 font-semibold text-slate-900">
                        Veno-arterial (VA)
                      </td>
                      <td className="align-top px-4 py-4 text-[13px] leading-snug text-slate-700">
                        <p className="text-lg font-bold leading-none text-red-900">65–75&nbsp;%</p>
                        <p className="mt-2">
                          Indicador del balance transporte/consumo (similar criterio que SvO₂/Satv).
                          Por debajo: revisar flujo ECMO, Hb y consumo tisular.
                        </p>
                      </td>
                      <td className="align-top px-4 py-4 text-[13px] leading-snug text-slate-700" rowSpan={2}>
                        <p className="text-lg font-bold leading-none text-red-900">
                          ≥ 95&nbsp;% <span className="text-sm font-semibold text-slate-600">(habitual 96–100&nbsp;%)</span>
                        </p>
                        <p className="mt-2">
                          <strong className="text-slate-900">Ambos modos (VA y VV).</strong> Refleja la
                          eficacia del oxigenador y la mezcla de O₂; una caída brusca o sostenida
                          sugiere trombos/fibrina en membrana, fallo de gas (mezcla, fugas) o muestreo
                          erróneo — según protocolo.
                        </p>
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="align-top px-4 py-4 font-semibold text-slate-900">
                        Veno-venosa (VV)
                      </td>
                      <td className="align-top px-4 py-4 text-[13px] leading-snug text-slate-700">
                        <p className="text-lg font-bold leading-none text-red-900">&gt; 80&nbsp;%</p>
                        <p className="mt-2">
                          Si persiste bajo: valorar flujo, Hb, recirculación y fugas en el circuito VV.
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-black uppercase tracking-wide text-red-900">
                  Saturación arterial del paciente (SaO₂)
                </p>
                <p className="mt-2">
                  Objetivo general <strong>&gt; 95&nbsp;%</strong> cuando el contexto clínico lo permite
                  (independiente del modo ECMO).
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
            <SectionHeader title="Complicaciones" icon={AlertTriangle} />
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-amber-200 bg-amber-50/90 p-6 text-sm leading-relaxed text-slate-800 md:p-7">
                <h4 className="text-base font-black tracking-tight text-amber-950">
                  Síndrome de Arlequín
                </h4>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-amber-800">
                  ECMO VA periférica (p. ej. femorofemoral)
                </p>
                <figure className="mt-4 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setPresionesLightbox({
                        src: IMG_ECMO_ARLEQUIN,
                        alt: ECMO_ARLEQUIN_ALT,
                      })
                    }
                    className="group flex max-w-full cursor-zoom-in justify-center overflow-hidden rounded-2xl border border-amber-300/80 bg-white p-2 shadow-inner transition hover:ring-2 hover:ring-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    aria-label="Ampliar esquema del síndrome de Arlequín en ECMO VA periférica"
                  >
                    <img
                      src={IMG_ECMO_ARLEQUIN}
                      alt=""
                      className="max-h-[140px] w-auto max-w-full object-contain sm:max-h-[160px]"
                      loading="lazy"
                    />
                  </button>
                  <figcaption className="mt-2 max-w-md text-center text-[10px] leading-snug text-amber-950/85">
                    Circulación dual: superior desaturado / inferior oxigenado por el circuito.{' '}
                    <span className="font-semibold text-amber-950">Pulsa para ampliar.</span>
                  </figcaption>
                </figure>
                <p className="mt-5">
                  El <strong className="text-slate-900">hemicuerpo superior</strong> queda{' '}
                  <strong className="text-slate-900">hipoxémico / cianótico</strong> y el inferior mejor
                  oxigenado. Suele asociarse a <strong className="text-slate-900">función ventricular
                  conservada</strong> con <strong className="text-slate-900">pulmón muy disfuncionante</strong>:
                  la sangre oxigenada del circuito perfunde preferentemente el territorio distal del retorno
                  arterial; la sangre que atraviesa el pulmón en mal estado y se eyecta por el VI aporta
                  desaturación al lecho superior (coronario y cerebral), con riesgo de isquemia.
                </p>
                <p className="mt-4 text-xs font-black uppercase tracking-wide text-amber-950">
                  Cómo detectarlo
                </p>
                <p className="mt-2">
                  Monitorizar la <strong className="text-slate-900">saturación arterial del miembro superior
                  derecho</strong> (p. ej. oximetría en mano derecha) como aviso precoz frente a la del
                  miembro inferior.
                </p>
                <p className="mt-4 text-xs font-black uppercase tracking-wide text-amber-950">
                  Qué hacer
                </p>
                <ul className="mt-2 list-inside list-disc space-y-2 text-[13px] text-slate-700">
                  <li>
                    Aumentar <strong className="text-slate-900">FiO₂</strong> y/o{' '}
                    <strong className="text-slate-900">PEEP</strong> en ventilación para intentar mantener
                    SaO₂ del miembro superior <strong>&gt; 90&nbsp;%</strong>.
                  </li>
                  <li>
                    Si cae <strong>&lt; 88&nbsp;%</strong>, valorar <strong className="text-slate-900">aumentar
                    el flujo</strong> del ECMO (según protocolo).
                  </li>
                  <li>
                    Si persiste: valorar <strong className="text-slate-900">canulación central</strong> u otras
                    estrategias según guía del centro.
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-sky-200 bg-sky-50/90 p-6 text-sm leading-relaxed text-slate-800 md:p-7">
                <h4 className="text-base font-black tracking-tight text-sky-950">Recirculación</h4>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-sky-800">
                  ECMO V–V
                </p>
                <p className="mt-4">
                  Parte de la sangre <strong className="text-slate-900">ya oxigenada</strong> del circuito es
                  aspirada de nuevo por la cánula de drenaje antes de mezclarse de forma útil: el paciente
                  puede seguir <strong className="text-slate-900">hipoxémico</strong> a pesar de un flujo de
                  ECMO aparentemente adecuado.
                </p>
                <p className="mt-4 text-xs font-black uppercase tracking-wide text-sky-950">
                  Cómo confirmar / prevenir (posición)
                </p>
                <ul className="mt-2 list-inside list-disc space-y-2 text-[13px] text-slate-700">
                  <li>
                    Revisar colocación con <strong className="text-slate-900">ecocardiografía</strong>,{' '}
                    <strong className="text-slate-900">fluoroscopia</strong> o mediciones en{' '}
                    <strong className="text-slate-900">radiografía de tórax</strong>.
                  </li>
                  <li>
                    Con <strong className="text-slate-900">dos cánulas</strong>: separar las puntas al menos{' '}
                    <strong>~10&nbsp;cm</strong>.
                  </li>
                  <li>
                    Con <strong className="text-slate-900">cánula de doble luz</strong>: comprobar que el puerto
                    de reinfusión queda orientado hacia la <strong className="text-slate-900">válvula
                    tricúspide</strong>.
                  </li>
                </ul>
                <p className="mt-4 text-xs font-black uppercase tracking-wide text-sky-950">
                  Factores que la modulan
                </p>
                <p className="mt-2">
                  Profundidad y posición de <strong className="text-slate-900">drenaje</strong> y{' '}
                  <strong className="text-slate-900">retorno</strong> en el sistema venoso,{' '}
                  <strong className="text-slate-900">flujo</strong> de la bomba y{' '}
                  <strong className="text-slate-900">gasto cardíaco</strong> (según situación hemodinámica).
                </p>
              </div>
            </div>
          </section>

          <section>
            <SectionHeader title="Problemas graves" icon={ShieldAlert} />
            <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-700">
              Complemento a las complicaciones descritas (<strong className="text-slate-900">síndrome de
              Arlequín</strong> y <strong className="text-slate-900">recirculación</strong> en la sección
              anterior). Situaciones de alto riesgo para el paciente o la integridad del circuito; actuar
              siempre según algoritmos y simulacros del servicio.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              {ECMO_SEVERE_PROBLEMS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-red-200/90 bg-gradient-to-b from-red-50/90 to-white p-6 text-sm leading-relaxed text-slate-800 shadow-sm md:p-7"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-red-100 pb-3">
                    <h4 className="text-base font-black tracking-tight text-red-950">{item.title}</h4>
                    <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-900">
                      {item.badge}
                    </span>
                  </div>
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-red-900">
                    Presentación / monitor
                  </p>
                  <p className="mt-2 text-[13px] text-slate-700">{item.presentation}</p>
                  {item.causes?.length ? (
                    <>
                      <p className="mt-4 text-xs font-black uppercase tracking-wide text-red-900">
                        Causas a buscar
                      </p>
                      <ul className="mt-2 list-inside list-disc space-y-1.5 text-[13px] text-slate-700">
                        {item.causes.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-red-900">
                    Enfoque (orientativo)
                  </p>
                  <p className="mt-2 text-[13px] text-slate-700">{item.action}</p>
                </div>
              ))}
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

      {presionesLightbox ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-[2px]"
          onClick={() => setPresionesLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setPresionesLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <X size={28} strokeWidth={2} aria-hidden />
          </button>
          <img
            src={presionesLightbox.src}
            alt={presionesLightbox.alt}
            className="max-h-[min(92vh,900px)] max-w-full object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
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

function CentriMagDetailView({ onBack }) {
  const data = SUPPORT_DATA.centrimag

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
            <RotateCw className="mt-1 shrink-0 text-cyan-200" size={40} aria-hidden />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-cyan-200 uppercase">
                Levitronix
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                {data.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-cyan-100">
                {data.mechanism}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 p-8 text-left md:p-10">
          <section>
            <SectionHeader title="Características del sistema" icon={Settings2} />
            <div className="mt-4 rounded-3xl border border-cyan-100 bg-cyan-50/50 p-6 text-sm leading-relaxed text-slate-800 md:p-8">
              <ul className="list-inside list-disc space-y-3">
                <li>
                  <strong className="text-slate-900">Levitación magnética:</strong> rotor sin contacto
                  mecánico con superficies estacionarias en la cámara de bombeo, lo que reduce calor,
                  desgaste y fuentes de hemólisis asociadas a rodamientos clásicos.
                </li>
                <li>
                  <strong className="text-slate-900">Flujo continuo:</strong> el gasto depende de la{' '}
                  <strong>velocidad de giro (RPM)</strong> fijada, de la{' '}
                  <strong>precarga y postcarga</strong> del circuito y del estado hemodinámico del
                  paciente.
                </li>
                <li>
                  <strong className="text-slate-900">Modularidad:</strong> puede integrarse en montajes de{' '}
                  <strong>soporte ventricular aislado</strong> (sin oxigenador) o en{' '}
                  <strong>circuito con membrana</strong> (p. ej. configuraciones tipo ECMO) según
                  indicación y protocolo del centro.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <SectionHeader title="Monitorización y consola (referencia)" icon={Gauge} />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner">
                <Droplets className="mt-0.5 shrink-0 text-cyan-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Caudal (L/min)</strong>
                  <p className="mt-1 text-slate-700">
                    Valor principal de rendimiento; variaciones bruscas sugieren cambios de
                    precarga/postcarga, posición de cánulas o eventos en el circuito.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner">
                <RotateCw className="mt-0.5 shrink-0 text-cyan-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">RPM / consigna de velocidad</strong>
                  <p className="mt-1 text-slate-700">
                    Ajuste bajo protocolo; límites y alarmas dependen del módulo y versión de software
                    — revisar manual y formación del fabricante.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner md:col-span-2">
                <Zap className="mt-0.5 shrink-0 text-cyan-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Potencia eléctrica</strong>
                  <p className="mt-1 text-slate-700">
                    Tendencia o saltos anómalos pueden alertar sobre cambios de carga del rotor,
                    trombosis incipiente o problemas de acople según criterios del servicio.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-[13px] leading-relaxed text-amber-950">
              <strong>Anticoagulación:</strong> el circuito extracorpóneo requiere estrategia
              antitrombótica según guía local (similar filosofía a otros MCS); monitorizar hemograma,
              hemostasia y signos de sangrado.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6 md:grid-cols-2 md:p-8">
            <div>
              <strong className="text-cyan-950">Indicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-cyan-950/95">
                {data.indications.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-cyan-950">Contraindicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-cyan-950/95">
                {data.contra.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </section>

          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
            Contenido educativo; configuración de consola, alarmas y rangos exactos según IFU Levitronix
            / Abbott y protocolos de tu hospital.
          </p>
        </div>
      </div>
    </div>
  )
}

function TandemHeartDetailView({ onBack }) {
  const data = SUPPORT_DATA.tandemheart

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
            <Waypoints className="mt-1 shrink-0 text-rose-200" size={40} aria-hidden />
            <div>
              <p className="text-[10px] font-bold tracking-widest text-rose-200 uppercase">
                Soporte ventricular de corto plazo
              </p>
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                {data.title}
              </h2>
              <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-rose-100">
                {data.mechanism}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-10 p-8 text-left md:p-10">
          <section>
            <SectionHeader title="Fisiopatología y circuito" icon={Layers} />
            <div className="mt-4 rounded-3xl border border-rose-100 bg-rose-50/50 p-6 text-sm leading-relaxed text-slate-800 md:p-8">
              <ul className="list-inside list-disc space-y-3">
                <li>
                  <strong className="text-slate-900">Drenaje auricular izquierdo:</strong> mediante
                  catéter venoso (p. ej. femoral) y{' '}
                  <strong className="text-slate-900">punción transseptal</strong> con guía, se sitúa la
                  entrada de aspiración en la <strong>AI</strong>, reduciendo la precarga del{' '}
                  <strong>VI</strong>.
                </li>
                <li>
                  <strong className="text-slate-900">Retorno arterial:</strong> sangre impulsada por la
                  bomba centrífuga extracorpórea hacia la <strong>arteria femoral</strong> u otra vía
                  arterial según montaje, aumentando el gasto sistémico.
                </li>
                <li>
                  <strong className="text-slate-900">Sin oxigenador en el básico:</strong> el sistema
                  clásico no incluye membrana de gas; la oxigenación depende del pulmón del paciente.
                  Existen <strong>variantes / combinaciones</strong> con soporte respiratorio según
                  protocolo y dispositivo.
                </li>
                <li>
                  <strong className="text-slate-900">Cánula de doble luz (yugular):</strong> en algunos
                  montajes se usa una vía única con separación aspiración/reinfusión — verificar posición
                  por imagen (eco / Rx) según guía del servicio.
                </li>
              </ul>
            </div>
          </section>

          <section>
            <SectionHeader title="Monitorización clínica" icon={Gauge} />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner">
                <Droplets className="mt-0.5 shrink-0 text-rose-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Caudal del circuito</strong>
                  <p className="mt-1 text-slate-700">
                    Objetivo habitual según perfusión, lactato y función renal; integrar con presión
                    arterial invasiva y relleno.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner">
                <Activity className="mt-0.5 shrink-0 text-rose-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Función del VI y válvulas</strong>
                  <p className="mt-1 text-slate-700">
                    Ecocardiografía seriada: vaciamiento de AI, competencia aórtica, posición de guías y
                    signos de maladaptación al flujo del dispositivo.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-inner md:col-span-2">
                <ShieldAlert className="mt-0.5 shrink-0 text-rose-600" size={22} aria-hidden />
                <div className="text-sm leading-relaxed text-slate-800">
                  <strong className="text-slate-900">Acceso y sitio transseptal</strong>
                  <p className="mt-1 text-slate-700">
                    Vigilar sangrado en puntos de punción, hematomas y perfusión distal del miembro de
                    retorno arterial; comprobar integridad del tabique y estabilidad de cánulas según
                    protocolo.
                  </p>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-[13px] leading-relaxed text-amber-950">
              <strong>Anticoagulación:</strong> necesaria durante el soporte; seguir objetivos de ACT / aPTT
              o anti-Xa del centro y revisar equilibrio hemorrágico.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-8 rounded-3xl border border-rose-100 bg-rose-50/40 p-6 md:grid-cols-2 md:p-8">
            <div>
              <strong className="text-rose-950">Indicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-rose-950/95">
                {data.indications.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div>
              <strong className="text-rose-950">Contraindicaciones (ejemplos)</strong>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-rose-950/95">
                {data.contra.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </section>

          <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center text-[11px] leading-relaxed text-slate-600">
            Contenido educativo; montajes específicos, alarmas y límites de flujo según IFU del fabricante y
            comité de MCS de tu hospital.
          </p>
        </div>
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
