import React, { useState } from 'react';
import { FunctionSquare, ArrowRight } from 'lucide-react';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';
import AdaptiveExerciseBank from '../components/AdaptiveExerciseBank';
import TopicLearningToolkit from '../components/TopicLearningToolkit';
import MiniQuizPanel from '../components/MiniQuizPanel';

const defaultCode = `// 7. Funciones
// Bloques de código reutilizables

function sumar(a, b) {
    let resultado = a + b;
    // Visualiza: (nombre, entradas, salida)
    animarFuncion("sumar", [a, b], resultado);
    return resultado;
}

sumar(5, 3);
sumar(10, 20);
sumar(-5, 8);`;

const Functions = () => {
  const [calls, setCalls] = useState([]);

  const validationFn = (state) => {
    if ((state.calls || 0) > 0) {
      return { success: true, message: `Perfecto, registraste ${state.calls} llamadas de función.` };
    }
    return { success: false, message: 'Define y ejecuta una función para ver el flujo de entrada y salida.' };
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
    breakpoints,
    setBreakpoints,
    attempts,
    recommendedDifficulty,
    predictionResult,
    error,
    feedback
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'functions' });

  const handleRun = () => {
    setCalls([]);

    runCode((addToQueue, updateUserState) => {
      let callCount = 0;
      return {
        animarFuncion: (nombre, entradas, salida) => {
          callCount += 1;
          updateUserState({ calls: callCount });
          addToQueue(() => {
            setCalls((prev) => [...prev, { nombre, entradas, salida }]);
          });
        }
      };
    });
  };

  const handleReset = () => {
    setCode(defaultCode);
    setCalls([]);
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-indigo-400 mb-2">
          <FunctionSquare size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Concepto 07</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Funciones</h2>
        <p className="text-slate-400 mb-6">Crea tus propias herramientas reutilizables.</p>
        <TopicLearningToolkit sectionKey="funciones" title="Funciones" />

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">¿Qué es una Función?</h3>
                <p className="leading-relaxed">
                    Imagina que tienes una receta de cocina para hacer un pastel. No necesitas reinventar la receta cada vez que quieres un pastel; simplemente sigues las instrucciones.
                    Una <strong>Función</strong> es como esa receta: un bloque de código que realiza una tarea específica y que puedes usar (llamar) tantas veces como quieras.
                </p>
            </div>
            
            <div>
                <p className="leading-relaxed">
                    Las funciones te ayudan a no repetir código, hacer tus programas más ordenados y fáciles de entender. Pueden recibir ingredientes (parámetros) y devolver un resultado (return).
                </p>
              <p className="leading-relaxed mt-3">
                También permiten dividir problemas grandes en tareas pequeñas. En vez de resolver todo en un solo bloque de código,
                defines funciones con una responsabilidad clara y luego las reutilizas en distintos lugares del programa.
                Esto mejora el mantenimiento y facilita encontrar errores.
              </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Ejemplo concreto:
                </h4>
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Calculadora simple</div>
                    <code className="text-sm block font-mono text-slate-300">
                        <span className="text-slate-500">// Definición de la función (La receta)</span><br/>
                        <span className="text-purple-400">function</span> sumar(a, b) {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-purple-400">return</span> a + b;<br/>
                        {'}'}<br/><br/>
                        <span className="text-slate-500">// Uso de la función (Cocinar)</span><br/>
                        let resultado = sumar(5, 3); <span className="text-slate-500">// resultado es 8</span>
                    </code>
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    Ejemplo en pseudocódigo:
                </h4>
                <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
{`INICIO
  FUNCIÓN sumar(a, b)
    resultado <- a + b
    RETORNAR resultado
  FIN_FUNCIÓN

  mostrar sumar(5, 3)
  mostrar sumar(10, 20)
FIN`}
                </pre>
            </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Editor Column */}
        <div className="flex flex-col bg-[#1e1e1e] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#252526] border-b border-slate-700">
            <span className="text-slate-300 font-medium text-sm">Editor de Código</span>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar relative">
            <PedagogicalEditor
              value={code}
              onChange={setCode}
              activeLine={currentLine}
            />
          </div>
          <div className="p-4 bg-[#252526] border-t border-slate-700">
            <ExecutionControls
              onRun={handleRun}
              onReset={handleReset}
              onStep={nextStep}
              onPause={pause}
              onResume={play}
              stepMode={stepMode}
              onStepModeChange={setStepMode}
              isPlaying={isPlaying}
              currentStep={currentStepIndex}
              totalSteps={totalSteps}
              currentLine={currentLine}
              breakpoints={breakpoints}
              onBreakpointsChange={setBreakpoints}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
            />
            <AdaptiveExerciseBank
              sectionKey="funciones"
              recommendedDifficulty={recommendedDifficulty}
              onLoadCode={setCode}
            />
            <Feedback feedback={feedback} error={error} predictionResult={predictionResult} />
            <ExecutionInsightsPanel
              currentLine={currentLine}
              narrationHistory={narrationHistory}
              variableTraces={variableTraces}
              stateDiffs={stateDiffs}
              attempts={attempts}
            />
          </div>
        </div>

        {/* Visualization Column */}
        <div className="flex flex-col bg-secondary rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <span className="text-slate-300 font-medium text-sm">Máquina de Procesamiento</span>
          </div>
          
          <div className="flex-1 p-6 bg-secondary/50 relative overflow-auto space-y-6">
            {calls.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <FunctionSquare size={48} className="mb-4 opacity-20" />
                <p>Ejecuta una función para verla en acción</p>
              </div>
            ) : (
              calls.map((call, index) => (
                <div key={index} className="flex items-center gap-4 animate-in slide-in-from-left duration-500 fade-in">
                  {/* Input */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-slate-300 font-mono text-sm mb-1">
                      {JSON.stringify(call.entradas)}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Entrada</span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={20} className="text-slate-600" />

                  {/* Machine */}
                  <div className="flex-1 bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    <FunctionSquare size={24} className="text-indigo-400 mb-2" />
                    <span className="font-mono font-bold text-indigo-300">{call.nombre}()</span>
                  </div>

                  {/* Arrow */}
                  <ArrowRight size={20} className="text-slate-600" />

                  {/* Output */}
                  <div className="flex flex-col items-center">
                    <div className="bg-slate-800 border border-slate-700 rounded px-3 py-2 text-green-400 font-mono text-sm mb-1 font-bold">
                      {JSON.stringify(call.salida)}
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Salida</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MiniQuizPanel sectionKey="funciones" />
    </div>
  );
};

export default Functions;
