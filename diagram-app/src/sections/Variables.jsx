import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';
import AdaptiveExerciseBank from '../components/AdaptiveExerciseBank';
import TopicLearningToolkit from '../components/TopicLearningToolkit';
import MiniQuizPanel from '../components/MiniQuizPanel';

const defaultCode = `// 1. Declara tus variables
let heroe = "Link";
let vidas = 3;
let tieneEspada = true;

// 2. ¡Visualízalas!
crearVariable("heroe", heroe);
crearVariable("vidas", vidas);
crearVariable("tieneEspada", tieneEspada);`;

const Variables = () => {
  const [variables, setVariables] = useState([]);

  const validationFn = (state) => {
    if (state.heroe === 'Link' && state.vidas === 3) {
      return { success: true, message: "¡Correcto! Has definido al héroe y sus vidas." };
    }
    return { success: false, message: "Asegúrate de definir 'heroe' como 'Link' y 'vidas' como 3." };
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
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'variables' });

  const handleRun = () => {
    setVariables([]);
    
    runCode((addToQueue, updateUserState) => {
      return {
        crearVariable: (nombre, valor) => {
          updateUserState({ [nombre]: valor });
          addToQueue(() => {
            setVariables((prev) => [...prev, { nombre, valor }]);
          });
        }
      };
    });
  };

  const handleResetWrapper = () => {
    setCode(defaultCode);
    setVariables([]);
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-primary mb-2">
          <Box size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Concepto 01</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Variables</h2>
        <p className="text-slate-400 mb-6">Las variables son como cajas con nombre donde guardamos datos.</p>
        <TopicLearningToolkit sectionKey="variables" title="Variables" />
        
        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">¿Qué es una variable?</h3>
                <p className="leading-relaxed">
              Imagina que estás organizando tu habitación. Tienes varias cajas y necesitas saber qué hay dentro de cada una sin tener que abrirlas constantemente.
              ¿Qué haces? Les pones una etiqueta con un nombre descriptivo, por ejemplo: "Libros", "Juguetes" o "Ropa".
                </p>
            </div>
            
            <div>
                <p className="leading-relaxed">
              En programación, una <strong>variable</strong> funciona exactamente igual. Es un espacio reservado en la memoria de la computadora
              donde guardamos información (un dato) y le asignamos un nombre (identificador) para poder referirnos a ella, usar su valor o modificarlo más adelante en nuestro programa.
            </p>
            <p className="leading-relaxed mt-3">
              Cuando programas con variables estás trabajando con tres acciones clave:
              <strong> declarar</strong> (crear la caja), <strong>asignar</strong> (guardar un valor) y <strong>usar</strong> ese valor
              para tomar decisiones o producir resultados. Dominar esto es la base para entender todo lo demás: condicionales, ciclos, arreglos y funciones.
                </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Ejemplos concretos:
                </h4>
                <ul className="space-y-2 text-slate-400">
                    <li className="flex items-center gap-3">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-700">Texto (String)</span>
                        <span><code className="text-blue-400 font-bold">let nombreHeroe</code> = "Link";</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-700">Número (Number)</span>
                        <span><code className="text-orange-400 font-bold">let vidas</code> = 3;</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="bg-slate-800 px-2 py-1 rounded text-xs font-mono border border-slate-700">Booleano (Boolean)</span>
                        <span><code className="text-purple-400 font-bold">let tieneEspada</code> = true;</span>
                    </li>
                </ul>
            </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                  <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                    Ejemplo en pseudocódigo:
                  </h4>
                  <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
{`INICIO
  definir heroe como texto <- "Link"
  definir vidas como entero <- 3
  definir tieneEspada como lógico <- VERDADERO

  mostrar "Héroe:", heroe
  mostrar "Vidas:", vidas
  mostrar "¿Tiene espada?:", tieneEspada
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
          
          {/* Controls Area */}
          <div className="p-4 bg-[#252526] border-t border-slate-700">
             <ExecutionControls 
                onRun={handleRun}
                onReset={handleResetWrapper}
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
               sectionKey="variables"
               recommendedDifficulty={recommendedDifficulty}
               onLoadCode={setCode}
             />
          </div>
        </div>

        {/* Visualization Column */}
        <div className="flex flex-col bg-secondary rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <span className="text-slate-300 font-medium text-sm">Memoria del Programa</span>
          </div>
          
          <div className="flex-1 p-6 bg-secondary/50 relative overflow-auto">
            {variables.length === 0 && !error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600">
                <Box size={48} className="mb-4 opacity-20" />
                <p>Ejecuta el código para ver las variables</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
                {variables.map((variable, index) => (
                  <div 
                    key={index}
                    className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 animate-in fade-in zoom-in-95"
                  >
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Nombre</div>
                    <div className="font-mono text-blue-400 font-bold text-lg mb-3">{variable.nombre}</div>
                    
                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Valor</div>
                    <div className={`font-mono text-lg p-2 rounded bg-slate-900/50 border border-slate-700/50 ${
                      typeof variable.valor === 'string' ? 'text-green-400' : 
                      typeof variable.valor === 'number' ? 'text-orange-400' : 
                      typeof variable.valor === 'boolean' ? 'text-purple-400' : 'text-slate-300'
                    }`}>
                      {typeof variable.valor === 'string' ? `"${variable.valor}"` : String(variable.valor)}
                    </div>
                    <div className="mt-2 text-xs text-slate-600 text-right font-mono">
                      Tipo: {typeof variable.valor}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
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
      </div>

      <MiniQuizPanel sectionKey="variables" />
    </div>
  );
};

export default Variables;
