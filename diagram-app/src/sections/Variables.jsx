import React, { useState } from 'react';
import { Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
              <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 text-slate-600">
                <Box size={48} className="mb-4 opacity-20" />
                <p>Ejecuta el código para ver las variables</p>
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1 } 
                  }
                }}
              >
                <AnimatePresence>
                  {variables.map((variable, index) => {
                    const isString = typeof variable.valor === 'string';
                    const isNumber = typeof variable.valor === 'number';
                    const isBoolean = typeof variable.valor === 'boolean';

                    return (
                      <motion.div 
                        key={`${variable.nombre}-${index}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="bg-[#1e2330] rounded-xl p-5 border border-slate-700/50 shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-indigo-500/40 relative overflow-hidden backdrop-blur-md group"
                      >
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Identificador</div>
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest bg-slate-800 border border-slate-600 text-slate-400 font-mono">
                              var
                            </span>
                          </div>
                          
                          <div className="font-mono text-indigo-400 font-bold text-xl mb-6 truncate px-1">
                            {variable.nombre}
                          </div>
                          
                          <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-2">Valor Actual</div>
                          
                          <div className="font-mono text-[17px] p-3 rounded bg-[#10121a] border border-slate-800 shadow-inner flex items-center justify-between transition-colors group-hover:border-indigo-500/20">
                            <span className={`truncate ${
                              isString ? 'text-emerald-400' : 
                              isNumber ? 'text-amber-400' : 
                              isBoolean ? 'text-rose-400' : 'text-slate-300'
                            }`}>
                              {isString ? `"${variable.valor}"` : String(variable.valor)}
                            </span>
                            <span className="text-[10px] opacity-40 uppercase tracking-wide">
                              {typeof variable.valor}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
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
