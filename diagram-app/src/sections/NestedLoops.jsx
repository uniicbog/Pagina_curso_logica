import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useExecutionEngine } from '../hooks/useExecutionEngine';
import { ExecutionControls, Feedback } from '../components/ExecutionControls';
import PedagogicalEditor from '../components/PedagogicalEditor';
import ExecutionInsightsPanel from '../components/ExecutionInsightsPanel';
import AdaptiveExerciseBank from '../components/AdaptiveExerciseBank';
import TopicLearningToolkit from '../components/TopicLearningToolkit';
import MiniQuizPanel from '../components/MiniQuizPanel';

const defaultCode = `// 5. Ciclos Anidados
// Un ciclo dentro de otro (Filas y Columnas)

const filas = 3;
const columnas = 4;

for (let f = 0; f < filas; f++) {
    for (let c = 0; c < columnas; c++) {
        // Visualiza: (fila, columna, totalFilas, totalColumnas)
        animarAnidado(f, c, filas, columnas);
        console.log("Posición: " + f + "," + c);
    }
}`;

const NestedLoops = () => {
  const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });
  const [visitedCells, setVisitedCells] = useState([]);

  const validationFn = (state) => {
    if ((state.visited || 0) > 0) {
      return { success: true, message: `Recorriste ${state.visited} celdas del grid.` };
    }
    return { success: false, message: 'Ejecuta un ciclo anidado para explorar el grid.' };
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
  } = useExecutionEngine(defaultCode, validationFn, { sectionKey: 'nested-loops' });

  const handleRun = () => {
    setVisitedCells([]);
    setGridSize({ rows: 0, cols: 0 });

    runCode((addToQueue, updateUserState) => {
      let visited = 0;
      return {
        animarAnidado: (f, c, totalF, totalC) => {
          visited += 1;
          updateUserState({ visited, totalF, totalC });
          addToQueue(() => {
            setGridSize((prev) => ({
              rows: Math.max(prev.rows, Number(totalF) || 0),
              cols: Math.max(prev.cols, Number(totalC) || 0)
            }));
            setVisitedCells((prev) => [...prev, { r: f, c }]);
          });
        }
      };
    });
  };

  const handleReset = () => {
    setCode(defaultCode);
    setVisitedCells([]);
    setGridSize({ rows: 0, cols: 0 });
    reset();
  };

  return (
    <div className="learning-section p-8 lg:p-10 max-w-7xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <div className="flex items-center gap-2 text-pink-400 mb-2">
          <Layers size={20} />
          <span className="font-bold uppercase tracking-wider text-sm">Concepto 05</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Ciclos Anidados</h2>
        <p className="text-slate-400 mb-6">Recorre estructuras de dos dimensiones (como una tabla).</p>
        <TopicLearningToolkit sectionKey="anidados" title="Ciclos Anidados" />

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-slate-300 space-y-4 shadow-lg">
            <div>
                <h3 className="text-xl font-semibold text-white mb-2">¿Qué son los Ciclos Anidados?</h3>
                <p className="leading-relaxed">
                    Es simplemente poner un ciclo dentro de otro. Imagina un reloj: por cada hora que pasa (ciclo externo), los minutos tienen que dar una vuelta completa de 0 a 59 (ciclo interno).
                </p>
            </div>
            
            <div>
                <p className="leading-relaxed">
                    Son fundamentales para trabajar con datos en dos dimensiones, como una hoja de cálculo (filas y columnas), un tablero de ajedrez o una imagen (píxeles).
                    El ciclo interno se ejecuta completamente por cada sola iteración del ciclo externo.
                </p>
                <p className="leading-relaxed mt-3">
                  Una forma útil de pensarlo es por niveles: el ciclo externo selecciona una fila y el interno recorre todas las columnas de esa fila.
                  Cuando termina, el externo avanza a la siguiente fila y el proceso se repite. Este patrón aparece mucho en matrices, tablas y reportes.
                </p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Ejemplo concreto: Tablas de multiplicar
                </h4>
                <div className="bg-slate-800 p-3 rounded border border-slate-700">
                    <code className="text-sm block font-mono text-slate-300">
                        <span className="text-purple-400">for</span> (let i = 1; i &lt;= 3; i++) {'{'}<br/>
                        &nbsp;&nbsp;<span className="text-slate-500">// Ciclo externo (Tablas del 1 al 3)</span><br/>
                        &nbsp;&nbsp;<span className="text-purple-400">for</span> (let j = 1; j &lt;= 10; j++) {'{'}<br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500">// Ciclo interno (Multiplicador)</span><br/>
                        &nbsp;&nbsp;&nbsp;&nbsp;console.log(i + " x " + j + " = " + (i*j));<br/>
                        &nbsp;&nbsp;{'}'}<br/>
                        {'}'}
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
  definir filas como entero <- 3
  definir columnas como entero <- 4

  PARA f <- 0 HASTA filas - 1 HACER
    PARA c <- 0 HASTA columnas - 1 HACER
      mostrar "Posición: (" + f + "," + c + ")"
    FIN_PARA
  FIN_PARA
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
              sectionKey="anidados"
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
            <span className="text-slate-300 font-medium text-sm">Grid de Coordenadas</span>
          </div>
          
          <div className="flex-1 p-6 bg-slate-900/50 relative overflow-auto flex items-center justify-center">
            {visitedCells.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-slate-600">
                <Layers size={48} className="mb-4 opacity-20" />
                <p>Ejecuta el código para generar el grid</p>
              </div>
            ) : (
              <div 
                className="grid gap-2 p-4 bg-slate-800/50 rounded-xl border border-slate-700"
                style={{
                  gridTemplateColumns: `repeat(${gridSize.cols}, minmax(60px, 1fr))`
                }}
              >
                {Array.from({ length: gridSize.rows * gridSize.cols }).map((_, index) => {
                  const r = Math.floor(index / gridSize.cols);
                  const c = index % gridSize.cols;
                  
                  // Find if this cell was visited and at what step
                  const visitIndex = visitedCells.findIndex(v => v.r === r && v.c === c);
                  const isVisited = visitIndex !== -1;
                  const isLast = visitIndex === visitedCells.length - 1;

                  return (
                    <div 
                      key={`${r}-${c}`}
                      className={`
                        aspect-square flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-500
                        ${isLast 
                          ? 'bg-pink-600 border-pink-400 text-white shadow-[0_0_15px_rgba(219,39,119,0.5)] scale-110 z-10' 
                          : isVisited 
                            ? 'bg-pink-900/20 border-pink-500/30 text-pink-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-600'
                        }
                      `}
                    >
                      <span className="text-xs font-mono opacity-50 mb-1">[{r},{c}]</span>
                      {isVisited && (
                        <span className="text-lg font-bold">{visitIndex + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <MiniQuizPanel sectionKey="anidados" />
    </div>
  );
};

export default NestedLoops;
