import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import ejercicios from '../data/ejercicios.json';

const LEVEL_ORDER = ['basico', 'intermedio', 'reto'];

function pickBestLevel(levels, desired) {
  if (levels.includes(desired)) {
    return desired;
  }
  const desiredIndex = LEVEL_ORDER.indexOf(desired);
  const sorted = levels.slice().sort((a, b) => LEVEL_ORDER.indexOf(a) - LEVEL_ORDER.indexOf(b));
  const fallback = sorted.find((level) => LEVEL_ORDER.indexOf(level) >= desiredIndex);
  return fallback || sorted[0];
}

const AdaptiveExerciseBank = ({ sectionKey, recommendedDifficulty, onLoadCode }) => {
  const exercises = ejercicios.secciones?.[sectionKey] || [];
  const [showAnswerFor, setShowAnswerFor] = useState({});

  const toggleAnswer = (id) => {
    setShowAnswerFor(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const selected = useMemo(() => {
    if (!exercises.length) {
      return { level: null, items: [] };
    }

    const levels = Array.from(new Set(exercises.map((item) => item.nivel)));
    const level = pickBestLevel(levels, recommendedDifficulty || 'basico');

    return {
      level,
      items: exercises.filter((item) => item.nivel === level)
    };
  }, [exercises, recommendedDifficulty]);

  if (!exercises.length) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-700 bg-slate-900/60 p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-200">Banco de ejercicios adaptativo</h4>
        <span className="text-xs px-2 py-1 rounded bg-sky-500/20 border border-sky-500/30 text-sky-300 uppercase tracking-wider">
          Nivel sugerido: {selected.level}
        </span>
      </div>

      <div className="space-y-4">
        {selected.items.map((exercise) => (
          <div key={exercise.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 shadow-md hover:border-slate-700 transition-colors">
            <h5 className="text-sm font-bold text-slate-200 mb-1">{exercise.titulo}</h5>
            <p className="text-xs text-slate-400 mb-3">{exercise.enunciado}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                className="text-xs px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-medium transition-all shadow-sm shadow-emerald-900/50"
                onClick={() => onLoadCode?.(exercise.codigoBase || '')}
              >
                Cargar ejercicio
              </button>

              <button
                type="button"
                onClick={() => toggleAnswer(exercise.id)}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border transition-all active:scale-95 ${
                  showAnswerFor[exercise.id] 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                }`}
              >
                <Eye size={12} />
                {showAnswerFor[exercise.id] ? 'Ocultar respuesta' : 'Mostrar respuesta'}
                {showAnswerFor[exercise.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            </div>

            <AnimatePresence>
              {showAnswerFor[exercise.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-[#1e1e1e] rounded-md border border-slate-700 shadow-inner">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Solución Sugerida</span>
                      <button 
                        onClick={() => {
                          onLoadCode?.(exercise.respuesta || '');
                        }}
                        className="text-[10px] px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        Copiar al editor
                      </button>
                    </div>
                    <pre className="text-xs font-mono text-emerald-300 overflow-x-auto custom-scrollbar leading-relaxed">
                      <code>{exercise.respuesta || '/* Solución no disponible */'}</code>
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdaptiveExerciseBank;
