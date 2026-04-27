import React, { useState } from 'react';
import { Briefcase } from 'lucide-react';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';

const defaultCode = `// Proyecto: Calculadora Básica
// Crea variables, usa condicionales o funciones para operaciones

let operacion = "suma"; // "suma", "resta", "multiplicacion", "division"
let a = 10;
let b = 5;
let resultado = 0;

if (operacion === "suma") {
  resultado = a + b;
} else if (operacion === "resta") {
  resultado = a - b;
} else if (operacion === "multiplicacion") {
  resultado = a * b;
} else if (operacion === "division") {
  resultado = a / b;
}

// Visualizar resultado
mostrarResultado(resultado);
`;

const GuidedProjects = () => {
  const [salida, setSalida] = useState(null);

  const validationFn = (state) => {
    if (state.resultado !== undefined && typeof state.resultado === 'number') {
      return { success: true, message: "¡Buen trabajo! Has implementado la lógica básica del proyecto." };
    }
    return { success: false, message: "Asegúrate de calcular y almacenar el valor en 'resultado'." };
  };

  const { 
    code, 
    setCode, 
    runCode, 
    reset,
    nextStep,
    pause,
    play,
    stepMode,
    setStepMode,
    playbackSpeed,
    setPlaybackSpeed,
    isPlaying, 
    currentStepIndex, 
    totalSteps,
    currentLine,
    narrationHistory,
    variableTraces,
    stateDiffs,
    attempts,
    error, 
    feedback 
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'proyectos' });

  const handleRun = () => {
    setSalida(null);
    runCode((addToQueue, updateUserState) => {
      return {
        mostrarResultado: (valor) => {
          updateUserState({ resultado: valor });
          addToQueue(() => {
            setSalida(valor);
          });
        }
      };
    });
  };

  const handleReset = () => {
    setCode(defaultCode);
    setSalida(null);
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Briefcase size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Proyecto 01</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Proyectos Guiados</h2>
        <p className="text-slate-400 mb-6">Integra todo lo aprendido en un solo lugar y construye aplicaciones reales paso a paso.</p>
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg mb-6">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">Rúbrica: Calculadora Básica</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Declarar variables para los operandos y la operación.</li>
                  <li>Utilizar estructuras condicionales (if/else) para decidir la operación.</li>
                  <li>Almacenar el valor calculado en la variable <code>resultado</code>.</li>
                  <li>Usar la función provista <code>mostrarResultado(resultado)</code>.</li>
                </ul>
            </div>
            <div className="bg-primary/20 border border-primary/30 p-4 rounded-lg mt-4">
                <p className="text-sm text-primary">
                    <strong>Pista:</strong> Puedes cambiar el valor de la variable <code>operacion</code> para probar distintos casos: "suma", "resta", "multiplicacion", "division".
                </p>
            </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <section className="flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="bg-slate-800 px-4 py-3 flex gap-2 items-center border-b border-slate-700">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span className="text-sm font-medium text-slate-400 ml-2">App.js</span>
          </div>
          
          <div className="flex-1 overflow-auto relative">
            <PedagogicalEditor 
              value={code} 
              onChange={setCode}
              activeLine={currentLine} 
            />
          </div>
        </section>

        <section className="flex-1 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Salida del Sistema
            </h3>
            
            <div className="h-32 bg-slate-800 rounded-xl p-6 flex flex-col items-center justify-center border border-slate-700 transition-all">
              {salida !== null ? (
                <div className="text-center animate-in zoom-in duration-300">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">
                    {salida}
                  </div>
                  <div className="text-sm text-slate-400 mt-2">Resultado final</div>
                </div>
              ) : (
                <div className="text-slate-500 text-sm animate-pulse">Esperando ejecución...</div>
              )}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
             <ExecutionControls
              onRun={handleRun}
              onReset={handleReset}
              isPlaying={isPlaying}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              onStepModeChange={setStepMode}
              stepMode={stepMode}
              onStep={nextStep}
              onPause={pause}
              onResume={play}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />
            {error && <Feedback type="error" message={error} />}
            {feedback && <Feedback type={feedback.success ? 'success' : 'warning'} message={feedback.message} />}
          </div>
          
          {(narrationHistory.length > 0 || stateDiffs.length > 0) && (
            <ExecutionInsightsPanel 
              currentLine={currentLine}
              narrationHistory={narrationHistory}
              variableTraces={variableTraces}
              stateDiffs={stateDiffs}
              attempts={attempts}
            />
          )}

        </section>
      </div>
    </div>
  );
};

export default GuidedProjects;