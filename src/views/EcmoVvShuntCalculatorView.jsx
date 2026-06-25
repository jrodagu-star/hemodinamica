import { useMemo, useState } from 'react'
import { ArrowLeft, Calculator, Info, Wind } from 'lucide-react'
import { FilterBtn, SectionHeader } from '../components/ui.jsx'
import {
  classifyFEcmo,
  classifyQsQt,
  classifyRf,
  computeEcmoVvShuntCalc,
  computeVentilatorTfModel,
  formatNumber,
  formatPercent,
  interpretDrivingPressure,
  interpretPfRatio,
  interpretSmp,
  interpretTfFraction,
  interpretVentilatoryRatio,
  parseCalcNumber,
} from '../lib/ecmoVvShuntCalculator.js'

const TONE_CLASS = {
  emerald: 'border-emerald-300 bg-emerald-50 text-emerald-950',
  amber: 'border-amber-300 bg-amber-50 text-amber-950',
  red: 'border-red-300 bg-red-50 text-red-950',
  slate: 'border-slate-200 bg-slate-50 text-slate-700',
}

function CalcInput({ id, label, unit, hint, value, onChange, step = 'any', min, max }) {
  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-1 block text-[11px] font-bold text-slate-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step={step}
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-12 pl-3 text-right text-sm font-bold tabular-nums text-slate-900 focus:ring-2 focus:ring-teal-400 focus:outline-none"
        />
        {unit ? (
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-[10px] leading-snug text-slate-500">{hint}</p> : null}
    </div>
  )
}

function ResultRow({ label, value, interpretation, equation, tone = 'slate' }) {
  return (
    <tr className="border-t border-slate-100 align-top">
      <td className="py-3 pr-3 font-semibold text-slate-800">{label}</td>
      <td className={`py-3 pr-3 text-right font-black tabular-nums ${tone !== 'slate' ? TONE_CLASS[tone].split(' ').find((c) => c.startsWith('text-')) : 'text-slate-900'}`}>
        {value}
      </td>
      <td className="py-3 pr-3 text-xs text-slate-600">{interpretation}</td>
      <td className="py-3 font-mono text-[10px] leading-relaxed text-slate-500">{equation}</td>
    </tr>
  )
}

function IntermediateRow({ label, value, unit, description }) {
  return (
    <tr className="border-t border-slate-100">
      <td className="py-2.5 pr-3 text-sm text-slate-700">{label}</td>
      <td className="py-2.5 pr-3 text-right text-sm font-bold tabular-nums text-slate-900">
        {value}
        {unit ? <span className="ml-1 text-[10px] font-medium text-slate-400">{unit}</span> : null}
      </td>
      <td className="py-2.5 text-xs text-slate-500">{description}</td>
    </tr>
  )
}

function ShuntCalculatorTab({ inputs, setInputs, result }) {
  const qsClass = result ? classifyQsQt(result.qsQt) : null
  const fEcmoClass = result ? classifyFEcmo(result.fEcmo) : null
  const rfClass = result ? classifyRf(result.rf) : null

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Parámetros de entrada" icon={Calculator} />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CalcInput
            id="svcO2"
            label="SvcO₂ — Sat. venosa central"
            unit="%"
            hint="Muestra venosa del circuito (60–70 % ref.)"
            value={inputs.svcO2}
            onChange={(v) => setInputs((s) => ({ ...s, svcO2: v }))}
          />
          <CalcInput
            id="saO2"
            label="SaO₂ — Sat. arterial sistémica"
            unit="%"
            hint="Gasometría arterial (≥88 % ref.)"
            value={inputs.saO2}
            onChange={(v) => setInputs((s) => ({ ...s, saO2: v }))}
          />
          <CalcInput
            id="spost"
            label="Spost — Sat. post-membrana"
            unit="%"
            hint="Salida oxigenada del circuito ECMO (≥98 % ref.)"
            value={inputs.spost}
            onChange={(v) => setInputs((s) => ({ ...s, spost: v }))}
          />
          <CalcInput
            id="qecmo"
            label="Qecmo — Flujo ECMO"
            unit="L/min"
            hint="Flujo sanguíneo del circuito (2–6 L/min ref.)"
            value={inputs.qecmo}
            onChange={(v) => setInputs((s) => ({ ...s, qecmo: v }))}
          />
          <CalcInput
            id="qt"
            label="Qt — Gasto cardíaco total"
            unit="L/min"
            hint="PiCCO / termodilución / ecocardio (4–8 L/min ref.)"
            value={inputs.qt}
            onChange={(v) => setInputs((s) => ({ ...s, qt: v }))}
          />
          <CalcInput
            id="fio2"
            label="FiO₂ — Ventilador"
            unit=""
            hint="Fracción inspirada (0,21–1,0)"
            value={inputs.fio2}
            step="0.01"
            min="0.21"
            max="1"
            onChange={(v) => setInputs((s) => ({ ...s, fio2: v }))}
          />
          <CalcInput
            id="sweep"
            label="Sweep — Flujo de barrido"
            unit="L/min"
            hint="Contexto CO₂; no entra en ecuaciones de shunt O₂"
            value={inputs.sweep}
            onChange={(v) => setInputs((s) => ({ ...s, sweep: v }))}
          />
        </div>
      </section>

      {result ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Variables intermedias" icon={Info} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    <th className="pb-2">Variable</th>
                    <th className="pb-2 text-right">Valor</th>
                    <th className="pb-2">Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  <IntermediateRow
                    label="ΔSat ECMO (Spost − SvcO₂)"
                    value={formatNumber(result.deltaSatEcmo, 1)}
                    unit="%"
                    description="Diferencia de saturación a través de la membrana ECMO"
                  />
                  <IntermediateRow
                    label="ΔSat sistémica (SaO₂ − SvcO₂)"
                    value={formatNumber(result.deltaSatSystemic, 1)}
                    unit="%"
                    description="Diferencia arteriovenosa sistémica"
                  />
                  <IntermediateRow
                    label="Qt nativo (Qt − Qecmo)"
                    value={formatNumber(result.qtNative, 2)}
                    unit="L/min"
                    description="Flujo que no pasa por el circuito ECMO"
                  />
                  <IntermediateRow
                    label="SpNat — Sat. post-pulmón nativo"
                    value={formatNumber(result.spNat, 1)}
                    unit="%"
                    description="[Qt×SaO₂ − Qecmo×Spost] / (Qt − Qecmo)"
                  />
                  <IntermediateRow
                    label="SaO₂ ideal"
                    value={formatNumber(result.saO2Ideal, 1)}
                    unit="%"
                    description="min(100, 97 + FiO₂×3)"
                  />
                  <IntermediateRow
                    label="DO₂ relativo ECMO"
                    value={formatNumber(result.do2Ecmo, 2)}
                    unit="L/min·%"
                    description="Qecmo × (Spost − SvcO₂)"
                  />
                  <IntermediateRow
                    label="DO₂ relativo pulmón"
                    value={formatNumber(result.do2Lung, 2)}
                    unit="L/min·%"
                    description="(Qt−Qecmo) × (SpNat − SvcO₂)"
                  />
                  <IntermediateRow
                    label="DO₂ relativo total"
                    value={formatNumber(result.do2Total, 2)}
                    unit="L/min·%"
                    description="Suma de aportes ECMO y pulmón"
                  />
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50/80 to-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Resultados principales" icon={Wind} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    <th className="pb-2">Resultado</th>
                    <th className="pb-2 text-right">Valor</th>
                    <th className="pb-2">Interpretación</th>
                    <th className="pb-2">Ecuación</th>
                  </tr>
                </thead>
                <tbody>
                  <ResultRow
                    label="Fracción de shunt intrapulmonar (Qs/Qt)"
                    value={formatPercent(result.qsQt)}
                    interpretation={
                      qsClass
                        ? `${qsClass.label} — Normal <10 % · Moderado 10–20 % · Grave >20 %`
                        : '—'
                    }
                    equation="(SaO₂_ideal − SaO₂) / (SaO₂_ideal − SvcO₂)"
                    tone={qsClass?.tone}
                  />
                  <ResultRow
                    label="Shunt pulmón nativo (Qs_nat/Qt_nat)"
                    value={formatPercent(result.qsNatQtNat)}
                    interpretation="Intercambio del parénquima nativo aisladamente"
                    equation="(SaO₂_ideal − SpNat) / (SaO₂_ideal − SvcO₂)"
                  />
                  <ResultRow
                    label="Fracción de oxigenación ECMO (F_ECMO)"
                    value={formatPercent(result.fEcmo)}
                    interpretation={fEcmoClass?.label ?? '—'}
                    equation="DO₂_ECMO / DO₂_total"
                    tone={fEcmoClass?.tone}
                  />
                  <ResultRow
                    label="Fracción de oxigenación pulmón (F_Pulm)"
                    value={formatPercent(result.fPulm)}
                    interpretation="Creciente con recuperación pulmonar; monitorizar en weaning"
                    equation="DO₂_pulmón / DO₂_total"
                  />
                  <ResultRow
                    label="Tejido pulmonar funcional (TF%)"
                    value={formatPercent(result.tfPct)}
                    interpretation="Estimación indirecta del parénquima participante"
                    equation="F_Pulm × (SpNat / SaO₂_ideal)"
                  />
                  <ResultRow
                    label="SpNat (confirmación)"
                    value={formatNumber(result.spNat, 1, '%')}
                    interpretation={
                      result.spNat > parseCalcNumber(inputs.saO2)
                        ? 'SpNat > SaO₂: valorar recirculación o error de medición'
                        : 'SpNat ≤ SaO₂: coherente con balance de masa'
                    }
                    equation="[Qt×SaO₂ − Qecmo×Spost] / (Qt − Qecmo)"
                    tone={result.spNat > parseCalcNumber(inputs.saO2) ? 'amber' : 'slate'}
                  />
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-sky-200 bg-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Estimación de recirculación" icon={Info} />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                className={`rounded-xl border p-4 ${rfClass ? TONE_CLASS[rfClass.tone] : TONE_CLASS.slate}`}
              >
                <p className="text-[10px] font-black uppercase tracking-wide opacity-80">
                  Índice de recirculación (Rf)
                </p>
                <p className="mt-2 text-2xl font-black tabular-nums">
                  {formatPercent(result.rf)}
                </p>
                <p className="mt-1 text-xs">{rfClass?.label ?? '—'}</p>
                <p className="mt-2 font-mono text-[10px] opacity-70">
                  max(0, (SvcO₂ − 65) / (Spost − 65))
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">
                  Ratio Qecmo / Qt
                </p>
                <p className="mt-2 text-2xl font-black tabular-nums text-slate-900">
                  {formatPercent(result.qecmoQt, 0)}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {result.qecmoQt > 0.7
                    ? 'El ECMO maneja la mayor parte del flujo sistémico'
                    : 'Contribución nativa relevante al gasto'}
                </p>
              </div>
            </div>
          </section>
        </>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Introduce valores numéricos válidos en todos los campos obligatorios (SvcO₂, SaO₂, Spost,
          Qecmo, Qt, FiO₂) para calcular.
        </p>
      )}

      <LimitationsBlock variant="calc" />
    </div>
  )
}

function VentilatorShuntTab({ ventInputs, setVentInputs, shuntResult, ventResult }) {
  return (
    <div className="space-y-8">
      <p className="rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950">
        <strong>Tejido pulmonar funcional — modelo ventilatorio integrado.</strong> Las celdas (*)
        leen SaO₂ y FiO₂ de la pestaña <strong>Calculadora</strong>.
      </p>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <SectionHeader title="Entradas ventilatorias" icon={Wind} />
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CalcInput
            id="vt"
            label="Vt — Volumen tidal"
            unit="mL"
            hint="4–8 mL/kg PBW"
            value={ventInputs.vtMl}
            onChange={(v) => setVentInputs((s) => ({ ...s, vtMl: v }))}
          />
          <CalcInput
            id="pplat"
            label="Pplat — Presión plateau"
            unit="cmH₂O"
            hint="Pausa inspiratoria (≤25 cmH₂O ref.)"
            value={ventInputs.pplat}
            onChange={(v) => setVentInputs((s) => ({ ...s, pplat: v }))}
          />
          <CalcInput
            id="peep"
            label="PEEP"
            unit="cmH₂O"
            hint="PEEP total (8–16 cmH₂O en ECMO ref.)"
            value={ventInputs.peep}
            onChange={(v) => setVentInputs((s) => ({ ...s, peep: v }))}
          />
          <CalcInput
            id="fr"
            label="FR — Frecuencia respiratoria"
            unit="rpm"
            hint="Ultra-protectiva en ECMO (4–12 rpm ref.)"
            value={ventInputs.fr}
            onChange={(v) => setVentInputs((s) => ({ ...s, fr: v }))}
          />
          <CalcInput
            id="paco2"
            label="PaCO₂"
            unit="mmHg"
            hint="Gasometría arterial reciente"
            value={ventInputs.paco2}
            onChange={(v) => setVentInputs((s) => ({ ...s, paco2: v }))}
          />
          <CalcInput
            id="pbw"
            label="PBW — Peso predicho"
            unit="kg"
            hint="H: 50+0,91×(talla−152,4) · M: 45,5+0,91×(talla−152,4)"
            value={ventInputs.pbw}
            onChange={(v) => setVentInputs((s) => ({ ...s, pbw: v }))}
          />
          <CalcInput
            id="pao2"
            label="PaO₂"
            unit="mmHg"
            hint="Gasometría arterial"
            value={ventInputs.pao2}
            onChange={(v) => setVentInputs((s) => ({ ...s, pao2: v }))}
          />
          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3">
            <p className="text-[10px] font-black uppercase text-teal-800">SaO₂ (*) de Calculadora</p>
            <p className="mt-1 text-xl font-black tabular-nums text-teal-950">
              {ventInputs.saO2Linked ? `${ventInputs.saO2Linked} %` : '—'}
            </p>
            <p className="mt-1 text-[10px] text-teal-700">Valor enlazado desde pestaña Calculadora</p>
          </div>
          <div className="rounded-xl border border-teal-200 bg-teal-50/60 p-3">
            <p className="text-[10px] font-black uppercase text-teal-800">FiO₂ (*) de Calculadora</p>
            <p className="mt-1 text-xl font-black tabular-nums text-teal-950">
              {ventInputs.fio2Linked || '—'}
            </p>
          </div>
        </div>
      </section>

      {ventResult ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Variables intermedias" icon={Info} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <tbody>
                  <IntermediateRow label="Compliance (C_rs)" value={formatNumber(ventResult.crs, 1)} unit="mL/cmH₂O" description="Vt / (Pplat − PEEP)" />
                  <IntermediateRow label="Driving pressure (dP)" value={formatNumber(ventResult.dp, 1)} unit="cmH₂O" description="Pplat − PEEP" />
                  <IntermediateRow label="Volumen minuto (VE)" value={formatNumber(ventResult.ve, 2)} unit="L/min" description="Vt (L) × FR" />
                  <IntermediateRow label="Potencia mecánica (MP)" value={formatNumber(ventResult.mp, 2)} unit="J/min" description="Gattinoni simplificado" />
                  <IntermediateRow label="Ventilatory ratio (VR)" value={formatNumber(ventResult.vr, 2)} unit="" description="(VE × PaCO₂) / (PBW × 100 × 37,5)" />
                  <IntermediateRow label="P/F ratio" value={formatNumber(ventResult.pfRatio, 1)} unit="mmHg" description="PaO₂ / FiO₂" />
                  <IntermediateRow label="Vt / PBW" value={formatNumber(ventResult.vtPerPbw, 1)} unit="mL/kg" description="Volumen corriente normalizado" />
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/80 to-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Estimadores de tejido pulmonar funcional" icon={Wind} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wide text-slate-400">
                    <th className="pb-2">Estimador</th>
                    <th className="pb-2 text-right">Valor</th>
                    <th className="pb-2">Umbral / interpretación</th>
                  </tr>
                </thead>
                <tbody>
                  <ResultRow label="TF% por compliance (TF_Crs)" value={formatPercent(ventResult.tfCrs)} interpretation="Regla 1:1 Gattinoni: C_rs ~ % pulmón abierto" equation="min(1, C_rs / 100)" />
                  <ResultRow label="TF% por driving pressure" value={formatPercent(ventResult.tfDp)} interpretation="dP &lt;10: pulmón grande · dP &gt;20: baby lung severo" equation="min(1, max(0, (20−dP)/20 + 0,1))" />
                  <ResultRow label="Specific mechanical power (SMP)" value={formatNumber(ventResult.smp, 2)} interpretation={interpretSmp(ventResult.smp)} equation="MP / C_rs" />
                  <ResultRow label="Ventilatory ratio" value={formatNumber(ventResult.vr, 2)} interpretation={interpretVentilatoryRatio(ventResult.vr)} equation="VR" />
                  <ResultRow label="P/F ratio" value={formatNumber(ventResult.pfRatio, 1, 'mmHg')} interpretation={interpretPfRatio(ventResult.pfRatio)} equation="PaO₂ / FiO₂" />
                  <ResultRow label="TF% combinada O₂ + compliance" value={formatPercent(ventResult.tfCombined)} interpretation="60 % C_rs + 40 % balance O₂ (tendencia)" equation="0,6×TF_Crs + 0,4×factor O₂" tone="amber" />
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <SectionHeader title="Resumen integrado de estado pulmonar" icon={Info} />
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>
                <strong>Tejido funcional por compliance:</strong>{' '}
                {formatPercent(ventResult.tfCrs)} — {interpretTfFraction(ventResult.tfCrs)}
              </li>
              <li>
                <strong>Tejido funcional por driving pressure:</strong>{' '}
                {formatPercent(ventResult.tfDp)} — {interpretTfFraction(ventResult.tfDp)}
              </li>
              <li>
                <strong>TF% combinada:</strong> {formatPercent(ventResult.tfCombined)} —{' '}
                {interpretTfFraction(ventResult.tfCombined)}
              </li>
              <li>
                <strong>Driving pressure:</strong> {formatNumber(ventResult.dp, 1, 'cmH₂O')} —{' '}
                {interpretDrivingPressure(ventResult.dp)}
              </li>
              <li>
                <strong>SMP:</strong> {formatNumber(ventResult.smp, 2)} — {interpretSmp(ventResult.smp)}
              </li>
              <li>
                <strong>Ventilatory ratio:</strong> {formatNumber(ventResult.vr, 2)} —{' '}
                {interpretVentilatoryRatio(ventResult.vr)}
              </li>
              <li>
                <strong>P/F:</strong> {formatNumber(ventResult.pfRatio, 1, 'mmHg')} —{' '}
                {interpretPfRatio(ventResult.pfRatio)}
              </li>
            </ul>
          </section>
        </>
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Completa las entradas ventilatorias y los parámetros de la pestaña Calculadora para obtener
          resultados.
        </p>
      )}

      <LimitationsBlock variant="vent" />
    </div>
  )
}

const LIMITATIONS_CALC = [
  'Inestabilidad hemodinámica: las ecuaciones asumen steady-state; en shock profundo o arritmias los resultados pueden ser inválidos.',
  'Recirculación ECMO VV: eleva SvcO₂ y subestima el shunt real; monitorizar Rf.',
  'Errores en Qt se propagan a SpNat y TF%.',
  'Modelo simplificado por saturaciones (sin Hb, PO₂ ni curva de disociación).',
  'TF%: estimación indirecta; usar como tendencia longitudinal, no como valor absoluto.',
  'Sweep: controla CO₂; no entra en ecuaciones de shunt O₂.',
]

const LIMITATIONS_VENT = [
  'Regla 1:1 (C_rs → TF%): correlación significativa pero con variabilidad individual; PEEP alta puede sobrestimar TF%.',
  'TF_dP: relación hiperbólica en la realidad; usar como tendencia.',
  'Potencia mecánica: fórmula simplificada de Gattinoni; SMP &gt;0,53 validado en cohorte VV-ECMO específica.',
  'VR: asume CO₂ basal 37,5 mmHg; alteraciones metabólicas pueden elevar VR falsamente.',
  'TF% combinada: peso 60/40 arbitrario; no usar para decisión de decanulación.',
]

function LimitationsBlock({ variant }) {
  const items = variant === 'vent' ? LIMITATIONS_VENT : LIMITATIONS_CALC
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
      <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-amber-900">
        <Info size={16} aria-hidden />
        Limitaciones y advertencias clínicas
      </h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-xs leading-relaxed text-amber-950">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

const DEFAULT_SHUNT_INPUTS = {
  svcO2: '78.9',
  saO2: '90',
  spost: '100',
  qecmo: '3.18',
  qt: '5',
  fio2: '0.8',
  sweep: '5.5',
}

const DEFAULT_VENT_INPUTS = {
  vtMl: '260',
  pplat: '23',
  peep: '8',
  fr: '10',
  paco2: '61',
  pbw: '70',
  pao2: '90',
}

export function EcmoVvShuntCalculatorView({ onBack }) {
  const [tab, setTab] = useState('calculadora')
  const [inputs, setInputs] = useState(DEFAULT_SHUNT_INPUTS)
  const [ventInputs, setVentInputs] = useState(DEFAULT_VENT_INPUTS)

  const shuntResult = useMemo(() => {
    const svcO2 = parseCalcNumber(inputs.svcO2)
    const saO2 = parseCalcNumber(inputs.saO2)
    const spost = parseCalcNumber(inputs.spost)
    const qecmo = parseCalcNumber(inputs.qecmo)
    const qt = parseCalcNumber(inputs.qt)
    const fio2 = parseCalcNumber(inputs.fio2)
    if ([svcO2, saO2, spost, qecmo, qt, fio2].some((v) => v == null)) return null
    if (qt <= qecmo) return null
    if (spost <= svcO2) return null
    return computeEcmoVvShuntCalc({ svcO2, saO2, spost, qecmo, qt, fio2 })
  }, [inputs])

  const ventResult = useMemo(() => {
    const vtMl = parseCalcNumber(ventInputs.vtMl)
    const pplat = parseCalcNumber(ventInputs.pplat)
    const peep = parseCalcNumber(ventInputs.peep)
    const fr = parseCalcNumber(ventInputs.fr)
    const paco2 = parseCalcNumber(ventInputs.paco2)
    const pbw = parseCalcNumber(ventInputs.pbw)
    const pao2 = parseCalcNumber(ventInputs.pao2)
    const saO2 = parseCalcNumber(inputs.saO2)
    const fio2 = parseCalcNumber(inputs.fio2)
    if ([vtMl, pplat, peep, fr, paco2, pbw, pao2, saO2, fio2].some((v) => v == null)) return null
    if (pplat <= peep) return null
    return computeVentilatorTfModel({
      vtMl,
      pplat,
      peep,
      fr,
      paco2,
      pbw,
      pao2,
      saO2,
      fio2,
      shuntCalc: shuntResult,
    })
  }, [ventInputs, inputs.saO2, inputs.fio2, shuntResult])

  const ventInputsLinked = {
    ...ventInputs,
    saO2Linked: inputs.saO2,
    fio2Linked: inputs.fio2,
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 pb-24 pt-10 text-left">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold tracking-wide text-blue-600 uppercase hover:text-blue-800"
      >
        <ArrowLeft size={16} aria-hidden />
        Volver al menú
      </button>

      <header className="rounded-[2rem] border border-teal-200 bg-gradient-to-b from-teal-50 to-white p-8 text-center shadow-sm md:p-10">
        <Wind size={52} className="mx-auto mb-4 text-teal-600" aria-hidden />
        <h2 className="text-2xl font-black tracking-tighter text-slate-800 uppercase md:text-3xl">
          Cálculo de shunt
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Calculadora de shunt intrapulmonar y tejido pulmonar funcional en ECMO VV — balance de masa
          de oxígeno (UCI).
        </p>
      </header>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-100/80 p-2">
        <FilterBtn
          active={tab === 'calculadora'}
          onClick={() => setTab('calculadora')}
          label="Calculadora"
          color="bg-teal-600"
        />
        <FilterBtn
          active={tab === 'shunt'}
          onClick={() => setTab('shunt')}
          label="Shunt"
          color="bg-teal-600"
        />
      </div>

      {tab === 'calculadora' ? (
        <ShuntCalculatorTab inputs={inputs} setInputs={setInputs} result={shuntResult} />
      ) : (
        <VentilatorShuntTab
          ventInputs={ventInputsLinked}
          setVentInputs={setVentInputs}
          shuntResult={shuntResult}
          ventResult={ventResult}
        />
      )}

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Calculadora clínica de uso interno UCI · Validar siempre con el contexto clínico del paciente.
      </p>
    </div>
  )
}
