import React, { useMemo } from 'react';
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

      <div className="space-y-2">
        {selected.items.map((exercise) => (
          <div key={exercise.id} className="rounded border border-slate-800 bg-slate-950/60 p-2">
            <p className="text-xs text-slate-200 font-medium">{exercise.titulo}</p>
            <p className="text-xs text-slate-400 mt-1">{exercise.enunciado}</p>
            <button
              type="button"
              className="mt-2 text-xs px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
              onClick={() => onLoadCode?.(exercise.codigoBase || '')}
            >
              Cargar ejercicio
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdaptiveExerciseBank;
