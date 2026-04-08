import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

export const ExecutionControls = ({ 
  onRun, 
  onReset, 
  onPause,
  onResume,
  onStep,
  isPlaying, 
  currentStep,
  totalSteps,
  stepMode = false,
  onStepModeChange,
  playbackSpeed = 1,
  onSpeedChange,
  currentLine,
  breakpoints = [],
  onBreakpointsChange
}) => {
  const canStep = totalSteps > 0 && currentStep < totalSteps && typeof onStep === 'function';
  const [breakpointInput, setBreakpointInput] = useState('');

  useEffect(() => {
    setBreakpointInput(Array.isArray(breakpoints) && breakpoints.length ? breakpoints.join(', ') : '');
  }, [breakpoints]);

  const applyBreakpoints = () => {
    if (typeof onBreakpointsChange !== 'function') {
      return;
    }
    const values = breakpointInput
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => Number.isInteger(item) && item > 0);
    onBreakpointsChange(values);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
      <button 
        onClick={onRun}
        disabled={isPlaying}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Play size={16} />
        Ejecutar
      </button>

      {isPlaying ? (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md font-medium transition-colors"
        >
          <Pause size={16} />
          Pausar
        </button>
      ) : (
        <button
          onClick={onResume}
          disabled={totalSteps === 0 || currentStep >= totalSteps}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={16} />
          Reanudar
        </button>
      )}

      <button
        onClick={onStep}
        disabled={!canStep}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Paso
      </button>

      <button 
        onClick={onReset}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
        title="Reiniciar"
      >
        <RotateCcw size={18} />
      </button>

      <label className="flex items-center gap-2 text-xs text-slate-300 px-2 py-1 rounded border border-slate-700 bg-slate-900/60">
        <input
          type="checkbox"
          checked={stepMode}
          disabled={typeof onStepModeChange !== 'function'}
          onChange={(event) => onStepModeChange?.(event.target.checked)}
          className="accent-primary"
        />
        Paso a paso
      </label>

      <label className="text-xs text-slate-400 ml-2">Velocidad</label>
      <select
        value={playbackSpeed}
        onChange={(event) => onSpeedChange?.(Number(event.target.value))}
        disabled={stepMode}
        className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs"
      >
        <option value={0.75}>0.75x</option>
        <option value={1}>1x</option>
        <option value={1.5}>1.5x</option>
        <option value={2}>2x</option>
      </select>

      <label className="text-xs text-slate-400 ml-2">Breakpoints</label>
      <input
        value={breakpointInput}
        onChange={(event) => setBreakpointInput(event.target.value)}
        onBlur={applyBreakpoints}
        placeholder="Ej: 4, 8, 12"
        className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 text-xs w-36"
      />
      <button
        type="button"
        onClick={applyBreakpoints}
        className="px-2 py-1 text-xs rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
      >
        Aplicar
      </button>

      <div className="text-xs px-2 py-1 rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 font-mono">
        Línea: {currentLine || '-'}
      </div>

      <div className="ml-auto text-xs text-slate-500 font-mono">
        {totalSteps > 0 ? `Paso ${currentStep} / ${totalSteps}` : 'Listo para ejecutar'}
      </div>
    </div>
  );
};

export const Feedback = ({ feedback, error, predictionResult }) => {
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
        <AlertCircle className="shrink-0 mt-0.5" size={18} />
        <div>
          <h4 className="font-semibold mb-1">Error de Ejecución</h4>
          <p className="text-sm opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  if (feedback) {
    return (
      <div className="space-y-3 mt-4">
        <div className={`p-4 rounded-lg flex items-start gap-3 border ${
          feedback.success 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
        }`}>
          {feedback.success ? (
            <CheckCircle className="shrink-0 mt-0.5" size={18} />
          ) : (
            <AlertCircle className="shrink-0 mt-0.5" size={18} />
          )}
          <div>
            <h4 className="font-semibold mb-1">
              {feedback.success ? '¡Excelente!' : 'Sugerencia'}
            </h4>
            <p className="text-sm opacity-90">{feedback.message}</p>
          </div>
        </div>

        {predictionResult ? (
          <div className={`p-4 rounded-lg flex items-start gap-3 border ${
            predictionResult.ok
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
          }`}>
            {predictionResult.ok ? (
              <CheckCircle className="shrink-0 mt-0.5" size={18} />
            ) : (
              <AlertCircle className="shrink-0 mt-0.5" size={18} />
            )}
            <div>
              <h4 className="font-semibold mb-1">Predicción</h4>
              <p className="text-sm opacity-90">{predictionResult.message}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (predictionResult) {
    return (
      <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 border ${
        predictionResult.ok
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          : 'bg-orange-500/10 border-orange-500/20 text-orange-400'
      }`}>
        {predictionResult.ok ? (
          <CheckCircle className="shrink-0 mt-0.5" size={18} />
        ) : (
          <AlertCircle className="shrink-0 mt-0.5" size={18} />
        )}
        <div>
          <h4 className="font-semibold mb-1">Predicción</h4>
          <p className="text-sm opacity-90">{predictionResult.message}</p>
        </div>
      </div>
    );
  }

  return null;
};
