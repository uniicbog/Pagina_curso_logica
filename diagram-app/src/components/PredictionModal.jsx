import React from 'react';

const PredictionModal = ({
  isOpen,
  sectionKey,
  value,
  error,
  onChange,
  onCancel,
  onConfirm
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70"
        aria-label="Cerrar modal"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-xl border border-slate-700 bg-slate-900 p-5 shadow-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">Predicción antes de ejecutar</h3>
        <p className="text-slate-300 text-sm mb-3">
          Sección: <span className="font-mono text-primary">{sectionKey}</span>
        </p>
        <p className="text-slate-400 text-sm mb-4">
          Escribe qué salida esperas en consola. Puedes usar varias líneas.
        </p>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-h-[140px] rounded-lg border border-slate-700 bg-slate-950 text-slate-200 p-3 font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ejemplo:\nImprime 1\nImprime 2\nImprime 3"
          spellCheck={false}
        />

        <div className={`min-h-[20px] mt-2 text-sm ${error ? 'text-red-400' : 'text-slate-500'}`}>
          {error || 'Tip: usa Ctrl + Enter para confirmar rápidamente.'}
        </div>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-white hover:brightness-110 transition-colors"
            onClick={onConfirm}
          >
            Continuar y ejecutar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;
