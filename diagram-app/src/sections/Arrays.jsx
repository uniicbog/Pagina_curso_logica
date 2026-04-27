import React, { useState } from 'react';
import { Grid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';
import AdaptiveExerciseBank from '../components/AdaptiveExerciseBank';
import TopicLearningToolkit from '../components/TopicLearningToolkit';
import MiniQuizPanel from '../components/MiniQuizPanel';

const defaultCode = `// 6. Arrays (Arreglos)
// Listas ordenadas de datos

let frutas = ["Manzana", "Banana", "Cereza"];

// Visualiza el array completo
animarArray(frutas);

// Modifica un elemento
frutas[1] = "Uva";
animarArray(frutas);

// Agrega un elemento
frutas.push("Naranja");
animarArray(frutas);`;

const Arrays = () => {
  const [snapshots, setSnapshots] = useState([]);

  const validationFn = (state) => {
    if ((state.snapshots || 0) > 0) {
      return { success: true, message: `Excelente, capturaste ${state.snapshots} estados del arreglo.` };
    }
    return { success: false, message: 'Usa animarArray para visualizar cada cambio del arreglo.' };
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
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'arrays' });

  const handleRun = () => {
    setSnapshots([]);

    runCode((addToQueue, updateUserState) => {
      let snapshotCount = 0;
      return {
        animarArray: (arr) => {
          snapshotCount += 1;
          updateUserState({ snapshots: snapshotCount });
          addToQueue(() => {
            const snapshot = Array.isArray(arr) ? [...arr] : arr;
            setSnapshots((prev) => [...prev, snapshot]);
          });
        }
      };
    });
  };

  const handleReset = () => {
    setCode(defaultCode);
    setSnapshots([]);
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-cyan-400 mb-2">
          <Grid size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Concepto 06</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Arrays</h2>
        <p className="text-slate-400 mb-6">Organiza colecciones de datos en una sola variable.</p>
        <TopicLearningToolkit sectionKey="estructuras" title="Arrays" />

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">¿Qué es un Array?</h3>
                <p className="leading-relaxed">
              Imagina una lista de compras, una fila de casilleros en el colegio o un tren con varios vagones.
                    En todos estos casos, tienes una colección ordenada de elementos. Un <strong>Array</strong> (o arreglo) es exactamente eso en programación.
                </p>
            </div>
            
            <div>
                <p className="leading-relaxed">
              Es una variable especial que puede guardar múltiples valores al mismo tiempo. Cada valor tiene una posición numerada (índice),
                    empezando siempre desde el <strong>0</strong>.
                </p>
            <p className="leading-relaxed mt-3">
              La idea más importante es que índice y valor van juntos: primero decides qué posición quieres consultar o modificar,
              luego aplicas la operación (leer, actualizar, insertar o eliminar). Este modelo te permite manejar datos en bloque
              sin crear una variable distinta para cada elemento.
            </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Ejemplos concretos:
                </h4>
                <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Crear una lista</div>
                        <code className="text-sm font-mono text-slate-300">
                            let frutas = [<span className="text-green-400">"Manzana"</span>, <span className="text-green-400">"Banana"</span>, <span className="text-green-400">"Cereza"</span>];
                        </code>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800 p-3 rounded border border-slate-700">
                            <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Acceder (Índice 0)</div>
                            <code className="text-sm font-mono text-slate-300">
                                frutas[0] <span className="text-slate-500">// Es "Manzana"</span>
                            </code>
                        </div>
                        <div className="bg-slate-800 p-3 rounded border border-slate-700">
                            <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Modificar</div>
                            <code className="text-sm font-mono text-slate-300">
                                frutas[1] = <span className="text-green-400">"Pera"</span>;
                            </code>
                        </div>
                    </div>
                </div>
            </div>

              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                  Ejemplo en pseudocódigo:
                </h4>
                <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">
{`INICIO
  definir frutas como lista <- ["Manzana", "Banana", "Cereza"]
  mostrar frutas

  frutas[1] <- "Uva"
  mostrar frutas

  agregar "Naranja" a frutas
  mostrar frutas
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
              sectionKey="estructuras"
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
            <span className="text-slate-300 font-medium text-sm">Visualización de Arrays</span>
          </div>
          
          <div className="flex-1 p-6 bg-secondary/50 relative overflow-auto space-y-8">
            {snapshots.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 text-slate-600">
                <Grid size={48} className="mb-4 opacity-20" />
                <p>Ejecuta el código para ver los arrays</p>
              </div>
            ) : (
              snapshots.map((arr, snapIndex) => (
                <motion.div 
                  key={snapIndex} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-8 relative"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-xs text-cyan-400 uppercase tracking-widest font-bold bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-800/50 shadow-sm">
                      Estado {snapIndex + 1}
                    </div>
                    {snapIndex > 0 && <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-900/50 to-transparent"></div>}
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <AnimatePresence mode="popLayout">
                      {arr.map((item, index) => {
                        const prevSnapshot = snapIndex > 0 ? snapshots[snapIndex - 1] : [];
                        const isNew = prevSnapshot.length <= index;
                        const isModified = !isNew && prevSnapshot[index] !== item;

                        let borderClass = "border-slate-700";
                        let bgClass = "bg-slate-800/80";
                        let textClass = "text-cyan-300";

                        if (isNew) {
                          borderClass = "border-emerald-500/50";
                          bgClass = "bg-emerald-900/20";
                          textClass = "text-emerald-300";
                        } else if (isModified) {
                          borderClass = "border-amber-500/50";
                          bgClass = "bg-amber-900/20";
                          textClass = "text-amber-300";
                        }

                        return (
                          <motion.div 
                            key={`item-${index}`}
                            layout
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -20 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 400, 
                              damping: 25,
                              mass: 1,
                              delay: index * 0.05 
                            }}
                            className="flex flex-col items-center group"
                          >
                            <div className="relative">
                              {/* Glowing effect under the item */}
                              {(isNew || isModified) && (
                                <div className={`absolute inset-0 blur-md rounded-xl opacity-30 ${isNew ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                              )}
                              
                              {/* The Array element box */}
                              <motion.div 
                                whileHover={{ y: -5, scale: 1.05 }}
                                className={`h-14 min-w-[4rem] px-4 flex items-center justify-center border ${borderClass} ${bgClass} rounded-xl shadow-lg relative overflow-hidden transition-all cursor-default z-10 backdrop-blur-sm group-hover:shadow-cyan-900/20`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                
                                {/* Badge for New/Modified */}
                                {isNew && (
                                  <span className="absolute -top-0 -right-0 text-[8px] font-bold text-emerald-100 bg-emerald-600/80 px-1.5 py-0.5 rounded-bl-lg">
                                    +
                                  </span>
                                )}
                                {isModified && (
                                  <span className="absolute -top-0 -right-0 text-[8px] font-bold text-amber-100 bg-amber-600/80 px-1.5 py-0.5 rounded-bl-lg">
                                    ★
                                  </span>
                                )}
                                
                                <span className={`font-mono text-base font-medium ${textClass} relative z-10 drop-shadow-sm`}>
                                  {typeof item === 'string' ? `"${item}"` : item}
                                </span>
                              </motion.div>
                            </div>
                            
                            <div className="mt-2 text-[11px] font-mono font-bold text-slate-500 group-hover:text-cyan-400 transition-colors">
                              [{index}]
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <MiniQuizPanel sectionKey="estructuras" />
    </div>
  );
};

export default Arrays;
