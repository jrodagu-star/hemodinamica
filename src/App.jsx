import { useState } from 'react'
import {
  Activity,
  BookOpen,
  Calculator,
  Cpu,
  Layers,
} from 'lucide-react'
import { TabButton } from './components/ui.jsx'
import { CalculadoraView } from './views/CalculadoraView.jsx'
import { AtlasView } from './views/AtlasView.jsx'
import { MethodsView } from './views/MethodsView.jsx'
import { SupportView } from './views/SupportView 17.jsx'

function App() {
  const [activeTab, setActiveTab] = useState('calc')
  const [selectedEduTopic, setSelectedEduTopic] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [selectedSupport, setSelectedSupport] = useState(null)

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
        {activeTab === 'calc' && <CalculadoraView />}
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
