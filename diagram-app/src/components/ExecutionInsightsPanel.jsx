import React from 'react';
import { getAttemptLabel, summarizeCodeDiff } from '../modules/attemptHistory';

const KeyValueTable = ({ rows }) => {
  if (!rows.length) {
    return <p className="text-xs text-slate-500">Sin datos para mostrar.</p>;
  }

  return (
    <div className="overflow-auto custom-scrollbar rounded border border-slate-700">
      <table className="w-full text-xs">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="text-left px-2 py-1">Clave</th>
            <th className="text-left px-2 py-1">Valor</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-slate-800">
              <td className="px-2 py-1 font-mono text-slate-300">{row.key}</td>
              <td className="px-2 py-1 text-slate-400 font-mono">{String(row.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExecutionInsightsPanel = ({
  currentLine,
  narrationHistory,
  variableTraces,
  stateDiffs,
  attempts
}) => {
  const latestNarration = narrationHistory[narrationHistory.length - 1];
  const latestTrace = variableTraces[variableTraces.length - 1];
  const latestDiff = stateDiffs[stateDiffs.length - 1];

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Narración paso a paso</h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {latestNarration?.text || 'Aún no hay narración. Ejecuta el código y avanza paso a paso.'}
        </p>
        <p className="text-[11px] text-slate-500 mt-2 font-mono">Línea actual: {currentLine || '-'}</p>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Trazas de variables por iteración</h4>
        <KeyValueTable
          rows={Object.entries(latestTrace?.state || {}).map(([key, value]) => ({ key, value }))}
        />
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Estado antes / después</h4>
        {latestDiff ? (
          <div className="text-xs text-slate-300 space-y-2">
            <p>
              Paso {latestDiff.step} · Línea {latestDiff.line || '-'}
            </p>
            <p className="text-slate-400">Cambios: {latestDiff.changedKeys.length ? latestDiff.changedKeys.join(', ') : 'sin cambios'}</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Antes</p>
                <pre className="text-[11px] bg-slate-950 p-2 rounded border border-slate-800 overflow-auto">{JSON.stringify(latestDiff.before, null, 2)}</pre>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Después</p>
                <pre className="text-[11px] bg-slate-950 p-2 rounded border border-slate-800 overflow-auto">{JSON.stringify(latestDiff.after, null, 2)}</pre>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">Sin comparaciones todavía.</p>
        )}
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
        <h4 className="text-sm font-semibold text-slate-200 mb-2">Historial de intentos</h4>
        {attempts.length === 0 ? (
          <p className="text-xs text-slate-500">Aún no hay intentos registrados.</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-auto custom-scrollbar pr-1">
            {attempts.slice().reverse().map((attempt, index) => {
              const prev = attempts[attempts.length - 2 - index];
              const diff = prev ? summarizeCodeDiff(prev.code, attempt.code) : null;
              return (
                <div key={attempt.timestamp} className="rounded border border-slate-800 bg-slate-950/60 p-2 text-xs">
                  <p className="text-slate-300 font-medium">{getAttemptLabel(attempt, attempts.length - 1 - index)}</p>
                  <p className="text-slate-500">Tiempo: {attempt.timeMs} ms · {attempt.success ? 'Correcto' : 'Con errores'}</p>
                  {diff ? (
                    <p className="text-slate-500">Cambios vs intento anterior: +{diff.added} / -{diff.removed}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionInsightsPanel;
