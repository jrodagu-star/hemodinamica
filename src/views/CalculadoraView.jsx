import {
  Activity,
  Droplets,
  Search,
  Wind,
  Zap,
} from 'lucide-react'
import {
  InputGroup,
  ParameterCard,
  QuickAlert,
  ResultSection,
} from '../components/ui.jsx'

export function CalculadoraView({ inputs, stats, handleInputChange }) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <section className="space-y-6 lg:col-span-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 border-b pb-2 text-lg font-bold">
            <Search size={18} className="text-blue-500" aria-hidden />
            Datos de entrada
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <InputGroup
                label="Peso (kg)"
                name="weight"
                value={inputs.weight}
                onChange={handleInputChange}
              />
              <InputGroup
                label="Altura (cm)"
                name="height"
                value={inputs.height}
                onChange={handleInputChange}
              />
              <div className="col-span-2">
                <span className="mb-1 block text-[10px] font-bold tracking-tighter text-blue-600 uppercase">
                  Área sup. corp. (m²)
                </span>
                <div className="w-full rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700">
                  {inputs.asc.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="Hb (g/dL)"
                name="hb"
                value={inputs.hb}
                onChange={handleInputChange}
              />
              <InputGroup
                label="FC (lpm)"
                name="fc"
                value={inputs.fc}
                onChange={handleInputChange}
              />
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-4">
              <InputGroup
                label="GC (L/min)"
                name="gc"
                value={inputs.gc}
                onChange={handleInputChange}
                highlight
              />
              <InputGroup
                label="PAM (mmHg)"
                name="pam"
                value={inputs.pam}
                onChange={handleInputChange}
                highlight
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputGroup
                label="PVC (mmHg)"
                name="pvc"
                value={inputs.pvc}
                onChange={handleInputChange}
              />
              <InputGroup
                label="PCP (mmHg)"
                name="pcp"
                value={inputs.pcp}
                onChange={handleInputChange}
              />
            </div>

            <details className="rounded-xl border border-slate-200 bg-slate-50/80 open:bg-white">
              <summary className="cursor-pointer select-none px-4 py-3 text-xs font-black tracking-wide text-slate-600 uppercase">
                Oxigenación (SaO₂, SvO₂, gases)
              </summary>
              <div className="space-y-4 border-t border-slate-100 p-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="SaO₂ (%)"
                    name="sao2"
                    value={inputs.sao2}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="SvO₂ (%)"
                    name="svo2"
                    value={inputs.svo2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="PaO₂ (mmHg)"
                    name="pao2"
                    value={inputs.pao2}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="PvO₂ (mmHg)"
                    name="pvo2"
                    value={inputs.pvo2}
                    onChange={handleInputChange}
                  />
                </div>
                <p className="text-[10px] leading-relaxed text-slate-500">
                  CvO₂ usa PvO₂ (venoso/mixto). Si no dispones de PvO₂, ajusta el
                  valor estimado (p. ej. ~35–45 mmHg).
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="PvCO₂ (mmHg)"
                    name="pvco2"
                    value={inputs.pvco2}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="PaCO₂ (mmHg)"
                    name="paco2"
                    value={inputs.paco2}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </details>

            <details className="rounded-xl border border-slate-200 bg-slate-50/80 open:bg-white">
              <summary className="cursor-pointer select-none px-4 py-3 text-xs font-black tracking-wide text-slate-600 uppercase">
                Circulación pulmonar (PAP, ELWI)
              </summary>
              <div className="space-y-4 border-t border-slate-100 p-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="PAP sist (mmHg)"
                    name="paps"
                    value={inputs.paps}
                    onChange={handleInputChange}
                  />
                  <InputGroup
                    label="PAP diast (mmHg)"
                    name="papd"
                    value={inputs.papd}
                    onChange={handleInputChange}
                  />
                </div>
                <InputGroup
                  label="ELWI (mL/kg)"
                  name="elwi"
                  value={inputs.elwi}
                  onChange={handleInputChange}
                />
              </div>
            </details>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800 p-6 text-white shadow-lg">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-bold tracking-widest text-yellow-400 uppercase">
            <Zap size={18} aria-hidden />
            Perfusión — alertas rápidas
          </h3>
          <div className="space-y-3 text-left">
            <QuickAlert
              label="DO₂i"
              value={stats.do2i}
              threshold={520}
              unit="mL/min/m²"
            />
            <QuickAlert
              label="Gap CO₂"
              value={stats.gapCo2}
              threshold={6}
              unit="mmHg"
              inverse
            />
          </div>
          <div className="mt-4 border-t border-white/10 pt-4 text-[10px] text-slate-400">
            <div className="flex justify-between gap-2">
              <span>CaO₂</span>
              <span className="font-mono text-slate-200">
                {stats.cao2.toFixed(1)} mL/dL
              </span>
            </div>
            <div className="mt-1 flex justify-between gap-2">
              <span>CvO₂</span>
              <span className="font-mono text-slate-200">
                {stats.cvo2.toFixed(1)} mL/dL
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8 lg:col-span-8">
        <ResultSection
          icon={Droplets}
          title="I. Oxigenación y metabolismo"
          color="text-red-500"
        >
          <ParameterCard
            title="DO₂ indexado"
            value={stats.do2i}
            unit="mL/min/m²"
            min={520}
            max={570}
            color="border-red-500"
          />
          <ParameterCard
            title="VO₂ (consumo)"
            value={stats.vo2}
            unit="mL/min"
            min={110}
            max={160}
            color="border-red-400"
          />
          <ParameterCard
            title="Extracción (O₂ER)"
            value={stats.o2er}
            unit="%"
            min={20}
            max={30}
            color="border-orange-500"
          />
        </ResultSection>

        <ResultSection
          icon={Activity}
          title="II. Rendimiento mecánico"
          color="text-blue-500"
        >
          <ParameterCard
            title="Índice cardíaco"
            value={stats.ic}
            unit="L/min/m²"
            min={2.4}
            max={4.0}
            color="border-blue-500"
          />
          <ParameterCard
            title="Poder cardíaco"
            value={stats.cpo}
            unit="W"
            min={1.0}
            max={2.0}
            color="border-indigo-500"
          />
          <ParameterCard
            title="IRVS"
            value={stats.irvs}
            unit="din·s·m²"
            min={1600}
            max={2400}
            color="border-emerald-500"
          />
        </ResultSection>

        <ResultSection
          icon={Wind}
          title="III. Circulación pulmonar"
          color="text-cyan-500"
        >
          <ParameterCard
            title="Gap CO₂"
            value={stats.gapCo2}
            unit="mmHg"
            min={2}
            max={6}
            color="border-slate-800"
          />
          <ParameterCard
            title="PAPI"
            value={stats.papi}
            unit="índice"
            min={1.85}
            max={5.0}
            color="border-cyan-500"
          />
          <ParameterCard
            title="Agua pulmonar (ELWI)"
            value={inputs.elwi}
            unit="mL/kg"
            min={3}
            max={7}
            color="border-blue-300"
          />
        </ResultSection>

        <p className="rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-900">
          <strong className="font-bold">Nota:</strong> Los rangos de referencia son
          orientativos; la interpretación es clínica y depende del contexto
          (sedación, sepsis, soporte, etc.).
        </p>
      </section>
    </div>
  )
}
