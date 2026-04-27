import React, { useState } from 'react';
import { Split } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';
import AdaptiveExerciseBank from '../components/AdaptiveExerciseBank';
import TopicLearningToolkit from '../components/TopicLearningToolkit';
import MiniQuizPanel from '../components/MiniQuizPanel';

const defaultCode = `// 1. Define una condición
let edad = 18;

// 2. Toma una decisión
if (edad >= 18) {
    animarCondicional(true, "edad >= 18");
    console.log("Es mayor de edad");
} else {
    animarCondicional(false, "edad >= 18");
    console.log("Es menor de edad");
}`;

const Conditionals = () => {
  const [executionStep, setExecutionStep] = useState(null); // null, 'true', 'false'
  const [conditionText, setConditionText] = useState("Condición");

  const validationFn = (state) => {
      if (state.lastCondition !== undefined) {
          return { success: true, message: "¡Bien hecho! Has evaluado una condición correctamente." };
      }
      return { success: false, message: "Intenta ejecutar una condición usando animarCondicional." };
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
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'conditionals' });

  const handleRun = () => {
    setExecutionStep(null);
    
    runCode((addToQueue, updateUserState) => {
      return {
        animarCondicional: (condicion, texto) => {
            updateUserState({ lastCondition: condicion });
            addToQueue(() => {
                setConditionText(texto || "Condición");
                setExecutionStep(condicion ? 'true' : 'false');
            });
        },
        console: { log: () => {} }
      };
    });
  };

  const handleResetWrapper = () => {
    setExecutionStep(null);
    setConditionText("Condición");
    setCode(defaultCode);
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Split size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Concepto 02</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Condicionales</h2>
        <p className="text-slate-400 mb-6">Entiende cómo los programas toman decisiones (If / Else).</p>
        <TopicLearningToolkit sectionKey="condicionales" title="Condicionales" />

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">¿Qué son los condicionales?</h3>
                <p className="leading-relaxed">
              En la vida real, tomamos decisiones todo el tiempo basándonos en situaciones: "Si llueve, llevo paraguas", "Si tengo hambre, como algo".
                    Los condicionales permiten que nuestros programas hagan exactamente lo mismo: tomar decisiones.
                </p>
            </div>
            
            <div>
                <p className="leading-relaxed">
              La estructura más común es el <strong>if / else</strong> (si / si no). Funciona como una bifurcación en el camino:
                    el programa evalúa una pregunta (condición) que puede ser verdadera o falsa. Si es verdadera, toma un camino; si es falsa, puede tomar otro.
                </p>
            <p className="leading-relaxed mt-3">
              Un buen condicional debe tener una condición clara, ramas con acciones bien definidas y, de preferencia,
              un caso por defecto para evitar comportamientos ambiguos. Esto mejora la legibilidad y reduce errores lógicos.
            </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Ejemplos concretos:
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Ejemplo 1: Clima</div>
                        <code className="text-sm block font-mono">
                            <span className="text-purple-400">if</span> (estaLloviendo) {'{'}<br/>
                            &nbsp;&nbsp;usarParaguas();<br/>
                            {'}'} <span className="text-purple-400">else</span> {'{'}<br/>
                            &nbsp;&nbsp;usarGafasDeSol();<br/>
                            {'}'}
                        </code>
                    </div>
                    <div className="bg-slate-800 p-3 rounded border border-slate-700">
                        <div className="text-xs text-slate-500 uppercase mb-1 font-bold">Ejemplo 2: Acceso</div>
                        <code className="text-sm block font-mono">
                            <span className="text-purple-400">if</span> (edad &gt;= 18) {'{'}<br/>
                            &nbsp;&nbsp;permitirEntrada();<br/>
                            {'}'} <span className="text-purple-400">else</span> {'{'}<br/>
                            &nbsp;&nbsp;denegarEntrada();<br/>
                            {'}'}
                        </code>
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
  definir edad como entero <- 18

  SI edad >= 18 ENTONCES
    mostrar "Es mayor de edad"
  SINO
    mostrar "Es menor de edad"
  FIN_SI
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
               sectionKey="condicionales"
               recommendedDifficulty={recommendedDifficulty}
               onLoadCode={setCode}
             />
          </div>
        </div>

        {/* Visualization Column */}
        <div className="flex flex-col bg-secondary rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-800">
            <span className="text-slate-300 font-medium text-sm">Flujo del Programa</span>
          </div>
          
          <div className="flex-1 p-6 bg-secondary/50 relative overflow-auto flex flex-col items-center justify-start pt-10">
            {!executionStep ? (
              <div className="flex flex-col items-center justify-start pt-10 text-slate-600">
                <Split size={48} className="mb-4 opacity-20" />
                <p>Ejecuta el código para ver la decisión</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="flex flex-col items-center w-full max-w-lg relative"
              >
                
                {/* Start Node */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="px-5 py-2.5 bg-[#1e2330] rounded-full text-slate-200 shadow-md text-sm font-bold font-mono mb-2 border border-slate-600 z-10 uppercase tracking-widest"
                >
                  Inicio
                </motion.div>
                
                {/* Vertical Line */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "2rem" }}
                  className="w-0.5 bg-gradient-to-b from-slate-600 to-indigo-500/50"
                />

                {/* Condition Label */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs text-indigo-200 mb-1 font-mono font-bold bg-indigo-900/40 px-3 py-1 rounded shadow-sm border border-indigo-700/50 z-10"
                >
                  {conditionText}
                </motion.div>

                {/* Flowchart Container */}
                <div className="relative w-full mt-3">
                    {/* SVG Connections */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 0 }}>
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                            </marker>
                            <marker id="arrowhead-true" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#10b981" />
                            </marker>
                            <marker id="arrowhead-false" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#f43f5e" />
                            </marker>
                        </defs>
                        
                        {/* Dynamic Paths */}
                        <motion.line 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          x1="50%" y1="48" x2="20%" y2="48" 
                          stroke={executionStep === 'true' ? "#10b981" : "#475569"} 
                          strokeWidth={executionStep === 'true' ? "3" : "2"} 
                          strokeDasharray={executionStep === 'false' ? "5,5" : "none"}
                        />
                        <motion.line 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          x1="20%" y1="48" x2="20%" y2="100" 
                          stroke={executionStep === 'true' ? "#10b981" : "#475569"} 
                          strokeWidth={executionStep === 'true' ? "3" : "2"} 
                          strokeDasharray={executionStep === 'false' ? "5,5" : "none"}
                          markerEnd={executionStep === 'true' ? "url(#arrowhead-true)" : "url(#arrowhead)"} 
                        />
                        
                        <motion.line 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          x1="50%" y1="48" x2="80%" y2="48" 
                          stroke={executionStep === 'false' ? "#f43f5e" : "#475569"} 
                          strokeWidth={executionStep === 'false' ? "3" : "2"} 
                          strokeDasharray={executionStep === 'true' ? "5,5" : "none"}
                        />
                        <motion.line 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          x1="80%" y1="48" x2="80%" y2="100" 
                          stroke={executionStep === 'false' ? "#f43f5e" : "#475569"} 
                          strokeWidth={executionStep === 'false' ? "3" : "2"} 
                          strokeDasharray={executionStep === 'true' ? "5,5" : "none"}
                          markerEnd={executionStep === 'false' ? "url(#arrowhead-false)" : "url(#arrowhead)"} 
                        />
                    </svg>

                    {/* Content Layer */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Diamond */}
                        <motion.div 
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 45 }}
                          transition={{ type: 'spring', damping: 15, delay: 0.4 }}
                          className="w-24 h-24 bg-[#1a1625] border-2 border-amber-500 flex items-center justify-center mb-16 shadow-[0_0_20px_rgba(245,158,11,0.2)] rounded-lg"
                        >
                            <span className="-rotate-45 text-amber-400 font-black text-3xl font-mono leading-none flex items-center h-full justify-center pb-2">?</span>
                        </motion.div>
                        
                        {/* Branches */}
                        <div className="flex justify-between w-full px-4">
                            {/* True Branch */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ 
                                  y: 0, 
                                  opacity: executionStep === 'true' ? 1 : 0.3,
                                  scale: executionStep === 'true' ? 1.05 : 0.95
                                }}
                                transition={{ delay: 0.9 }}
                                className={`flex flex-col items-center w-[40%] ${executionStep === 'true' ? 'drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'grayscale'}`}
                                style={{ transformOrigin: 'top center' }}
                            >
                                <span className="text-[10px] font-black text-emerald-200 mb-2 bg-emerald-900/40 px-3 py-1 rounded-full border border-emerald-500/40 shadow-sm z-10 tracking-widest uppercase">VERDADERO</span>
                                <div className="px-4 py-4 bg-[#131f1c] border-2 border-emerald-500/40 rounded-xl text-emerald-300 text-sm font-bold font-mono w-full text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-emerald-500/10 transition-opacity"></div>
                                    Ejecutar Código IF
                                </div>
                            </motion.div>
                            
                            {/* False Branch */}
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ 
                                  y: 0, 
                                  opacity: executionStep === 'false' ? 1 : 0.3,
                                  scale: executionStep === 'false' ? 1.05 : 0.95
                                }}
                                transition={{ delay: 0.9 }}
                                className={`flex flex-col items-center w-[40%] ${executionStep === 'false' ? 'drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'grayscale'}`}
                                style={{ transformOrigin: 'top center' }}
                            >
                                <span className="text-[10px] font-black text-rose-200 mb-2 bg-rose-900/40 px-3 py-1 rounded-full border border-rose-500/40 shadow-sm z-10 tracking-widest uppercase">FALSO</span>
                                <div className="px-4 py-4 bg-[#201316] border-2 border-rose-500/40 rounded-xl text-rose-300 text-sm font-bold font-mono w-full text-center relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-rose-500/10 transition-opacity"></div>
                                    Ejecutar Código ELSE
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
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

      <MiniQuizPanel sectionKey="condicionales" />
    </div>
  );
};

export default Conditionals;
