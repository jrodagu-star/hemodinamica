import { useMemo, useState } from 'react'
import {
  Activity,
  BookOpen,
  Calculator,
  Cpu,
  Layers,
} from 'lucide-react'
import { TabButton } from './components/ui.jsx'
import { computeStats, surfaceAreaM2 } from './lib/hemodynamics.js'
import { CalculadoraView } from './views/CalculadoraView.jsx'
import { AtlasView } from './views/AtlasView.jsx'
import { MethodsView } from './views/MethodsView.jsx'
import { SupportView } from './views/SupportView.jsx'

const defaultInputs = {
  weight: 70,
  height: 170,
  hb: 10,
  sao2: 98,
  pao2: 80,
  pvo2: 40,
  svo2: 70,
  pvco2: 46,
  paco2: 40,
  gc: 5.0,
  fc: 80,
  pam: 70,
  pvc: 5,
  pcp: 10,
  paps: 25,
  papd: 12,
  elwi: 5,
}

function App() {
  const [activeTab, setActiveTab] = useState('calc')
  const [selectedEduTopic, setSelectedEduTopic] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [selectedSupport, setSelectedSupport] = useState(null)

  const [inputs, setInputs] = useState(defaultInputs)

  const asc = useMemo(
    () => surfaceAreaM2(inputs.weight, inputs.height),
    [inputs.weight, inputs.height],
  )

  const inputsWithAsc = useMemo(
    () => ({ ...inputs, asc }),
    [inputs, asc],
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const parsed = parseFloat(value)
    setInputs((prev) => ({
      ...prev,
      [name]: Number.isFinite(parsed) ? parsed : 0,
    }))
  }

  const stats = useMemo(
    () => computeStats(inputsWithAsc),
    [inputsWithAsc],
  )

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-4 md:flex-row">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" size={28} aria-hidden />
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight text-slate-800">
                Monitorización hemodinámica
              </h1>
              <p className="text-[11px] font-medium text-slate-500">
                Cálculos y apuntes clínicos
              </p>
            </div>
          </div>
          <nav className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
            <TabButton
              active={activeTab === 'calc'}
              onClick={() => setActiveTab('calc')}
              icon={Calculator}
              label="Calculadora"
            />
            <TabButton
              active={activeTab === 'edu'}
              onClick={() => {
                setActiveTab('edu')
                setSelectedEduTopic(null)
              }}
              icon={BookOpen}
              label="Atlas"
            />
            <TabButton
              active={activeTab === 'methods'}
              onClick={() => {
                setActiveTab('methods')
                setSelectedMethod(null)
              }}
              icon={Layers}
              label="Técnicas"
            />
            <TabButton
              active={activeTab === 'support'}
              onClick={() => {
                setActiveTab('support')
                setSelectedSupport(null)
              }}
              icon={Cpu}
              label="Soporte"
            />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4 md:p-8">
        {activeTab === 'calc' && (
          <CalculadoraView
            inputs={inputsWithAsc}
            stats={stats}
            handleInputChange={handleInputChange}
          />
        )}
        {activeTab === 'edu' && (
          <AtlasView
            selectedTopic={selectedEduTopic}
            setSelectedTopic={setSelectedEduTopic}
          />
        )}
        {activeTab === 'methods' && (
          <MethodsView
            selectedMethod={selectedMethod}
            setSelectedMethod={setSelectedMethod}
          />
        )}
        {activeTab === 'support' && (
          <SupportView
            selectedSupport={selectedSupport}
            setSelectedSupport={setSelectedSupport}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-[11px] text-slate-400">
        Solo fines educativos. No sustituye juicio clínico ni protocolos locales.
      </footer>
    </div>
  )
}

export default App
