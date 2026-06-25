import { ArrowRight, ArrowUpRight } from 'lucide-react'

export function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all sm:px-5 ${active ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
    >
      <Icon size={18} aria-hidden />
      {label}
    </button>
  )
}

export function InputGroup({ label, name, value, onChange, highlight = false }) {
  return (
    <div className="text-left">
      <label
        className={`mb-1 block text-[10px] font-black uppercase ${highlight ? 'text-blue-600' : 'text-slate-400'}`}
        htmlFor={name}
      >
        {label}
      </label>
      <input
        id={name}
        type="number"
        name={name}
        value={Number.isFinite(value) ? value : ''}
        onChange={onChange}
        className={`w-full rounded-xl border px-3 py-2 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none ${highlight ? 'border-blue-200 bg-white shadow-sm' : 'border-slate-200 bg-slate-50'}`}
        step="any"
      />
    </div>
  )
}

export function ParameterCard({ title, value, unit, min, max, color }) {
  const safe =
    typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : '—'
  return (
    <div
      className={`rounded-2xl border bg-white p-5 text-left shadow-sm ${color} border-l-[6px]`}
    >
      <span className="mb-2 block text-[9px] leading-none font-black tracking-widest text-slate-400 uppercase">
        {title}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tighter text-slate-800">
          {safe}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">
          {unit}
        </span>
      </div>
      <div className="mt-2 font-mono text-[8px] tracking-tighter text-slate-400">
        REF: {min}–{max}
      </div>
    </div>
  )
}

export function QuickAlert({ label, value, threshold, unit, inverse = false }) {
  const ok = typeof value === 'number' && Number.isFinite(value)
  const isWarning = ok && (inverse ? value > threshold : value < threshold)
  const display = ok ? value.toFixed(1) : '—'
  return (
    <div className="flex items-center justify-between rounded-lg bg-black/20 p-2 text-[10px]">
      <span className="font-black text-slate-400 uppercase">{label}:</span>
      <span
        className={`font-black ${!ok ? 'text-slate-400' : isWarning ? 'text-red-400' : 'text-green-400'}`}
      >
        {display} {unit}
      </span>
    </div>
  )
}

export function ResultSection({ icon: Icon, title, color, children }) {
  return (
    <div>
      <h3
        className={`mb-4 flex items-center gap-2 border-b pb-2 text-[10px] font-black tracking-widest uppercase ${color}`}
      >
        <Icon size={16} aria-hidden />
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>
    </div>
  )
}

export function SectionHeader({ title, icon: Icon }) {
  return (
    <div className="mb-8 flex items-center gap-4 text-left">
      <div className="rounded-2xl bg-slate-100 p-3 text-slate-800">
        <Icon size={24} aria-hidden />
      </div>
      <h3 className="text-xl font-black tracking-tighter text-slate-800 uppercase">
        {title}
      </h3>
    </div>
  )
}

export function LumenInfo({ color, title, desc }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-transparent p-4 hover:bg-slate-50">
      <div className={`mt-1 h-4 w-4 shrink-0 rounded-full ${color}`} />
      <div>
        <h5 className="text-sm leading-tight font-bold text-slate-800">
          {title}
        </h5>
        <p className="text-xs leading-relaxed text-slate-500">{desc}</p>
      </div>
    </div>
  )
}

export function PressureCurveCard({ title, range, desc, curveType, small = false }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300">
      <h5 className="mb-1 text-[9px] leading-tight font-black tracking-widest text-slate-800 uppercase">
        {title}
      </h5>
      <div
        className={`mb-2 leading-none font-black text-blue-600 ${small ? 'text-sm' : 'text-lg'}`}
      >
        {range}{' '}
        <span className="text-[8px] leading-none font-bold tracking-tighter text-slate-400 uppercase">
          mmHg
        </span>
      </div>
      <div
        className={`mb-3 flex items-center justify-center overflow-hidden rounded-xl bg-slate-900 p-2 ${small ? 'h-16' : 'h-20'}`}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden
        >
          {curveType === 'ra' && (
            <path
              d="M0 30 Q 5 25, 10 30 Q 15 28, 20 30 T 40 30 T 60 30 T 80 30 T 100 30"
              stroke="#3b82f6"
              fill="none"
              strokeWidth="1.5"
            />
          )}
          {curveType === 'rv' && (
            <path
              d="M0 38 L 10 38 L 20 5 L 30 38 L 45 38 L 55 5 L 65 38 L 80 38 L 90 5 L 100 38"
              stroke="#f87171"
              fill="none"
              strokeWidth="1.5"
            />
          )}
          {curveType === 'pa' && (
            <path
              d="M0 20 L 15 5 Q 18 10, 20 18 L 22 25 L 35 20 L 50 5 Q 53 10, 55 18 L 57 25 L 70 20 L 85 5 Q 88 10, 90 18 L 92 25 L 100 20"
              stroke="#fbbf24"
              fill="none"
              strokeWidth="1.5"
            />
          )}
          {curveType === 'wedge' && (
            <path
              d="M0 25 Q 5 20, 10 25 Q 15 22, 20 25 T 40 25 T 60 25 T 80 25 T 100 25"
              stroke="#10b981"
              fill="none"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>
      <p className="text-[8px] leading-relaxed text-slate-500 italic">{desc}</p>
    </div>
  )
}

export function MethodCard({
  title,
  icon: Icon,
  type,
  description,
  parameters,
  onClick,
  color,
  disabled = false,
}) {
  const Comp = disabled ? 'div' : 'button'
  return (
    <Comp
      type={disabled ? undefined : 'button'}
      onClick={disabled ? undefined : onClick}
      className={`flex flex-col rounded-[2rem] border bg-white p-8 text-left shadow-sm ${color} ${disabled ? 'cursor-default opacity-75' : 'group cursor-pointer'}`}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">
          <Icon size={28} aria-hidden />
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="leading-none font-black text-slate-800 uppercase italic">
            {title}
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase">
            {type}
          </span>
        </div>
        {!disabled && (
          <ArrowUpRight
            size={20}
            className="text-slate-300 group-hover:text-blue-500"
            aria-hidden
          />
        )}
      </div>
      <p className="mb-6 flex-grow text-xs text-slate-600 italic">{description}</p>
      <div className="flex flex-wrap gap-2">
        {parameters.map((p) => (
          <span
            key={p}
            className="rounded-lg bg-slate-50 px-2.5 py-1 text-[9px] font-black text-slate-500 uppercase"
          >
            {p}
          </span>
        ))}
      </div>
      {disabled && (
        <p className="mt-4 text-[10px] font-bold text-slate-400">
          Contenido próximamente
        </p>
      )}
    </Comp>
  )
}

export function SupportCard({
  title,
  fullName,
  icon: Icon,
  description,
  pros,
  onClick,
  color,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex flex-col rounded-[2rem] border bg-white p-8 text-left shadow-sm ${color}`}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">
          <Icon size={28} aria-hidden />
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="leading-none font-black text-slate-800 uppercase italic">
            {title}
          </h3>
          <span className="text-[9px] font-black text-slate-400 uppercase">
            {fullName}
          </span>
        </div>
        <ArrowUpRight
          size={20}
          className="text-slate-300 group-hover:text-blue-500"
          aria-hidden
        />
      </div>
      <p className="mb-6 flex-grow text-xs text-slate-600 italic">{description}</p>
      <div className="flex flex-wrap gap-2">
        {pros.map((p) => (
          <span
            key={p}
            className="rounded-lg bg-slate-50 px-2.5 py-1 text-[9px] font-black text-slate-500 uppercase"
          >
            {p}
          </span>
        ))}
      </div>
    </button>
  )
}

const MENU_CARD_THEMES = {
  blue: { iconWrap: 'bg-blue-50 text-blue-600', footer: 'bg-blue-600' },
  red: { iconWrap: 'bg-red-50 text-red-600', footer: 'bg-red-600' },
  violet: { iconWrap: 'bg-violet-50 text-violet-600', footer: 'bg-violet-600' },
  amber: { iconWrap: 'bg-amber-50 text-amber-700', footer: 'bg-amber-600' },
  teal: { iconWrap: 'bg-teal-50 text-teal-600', footer: 'bg-teal-600' },
}

export function MenuCard({ onClick, icon: Icon, title, desc, theme = 'blue' }) {
  const t = MENU_CARD_THEMES[theme] ?? MENU_CARD_THEMES.blue
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm transition-all hover:shadow-xl"
    >
      <div className="flex flex-grow flex-col items-center p-10 text-center">
        <div className={`mb-6 rounded-3xl p-5 ${t.iconWrap}`}>
          <Icon size={48} aria-hidden />
        </div>
        <h3 className="mb-4 text-2xl font-black tracking-tighter text-slate-800 uppercase">
          {title}
        </h3>
        <p className="text-sm text-slate-500 italic">{desc}</p>
      </div>
      <div
        className={`flex items-center justify-center gap-2 p-4 font-bold text-white ${t.footer}`}
      >
        Explorar <ArrowRight size={20} aria-hidden />
      </div>
    </button>
  )
}

export function FilterBtn({ active, onClick, label, color = 'bg-slate-600' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all ${active ? `${color} text-white` : 'border border-slate-200 bg-white text-slate-400'}`}
    >
      {label}
    </button>
  )
}
