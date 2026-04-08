import React from 'react';

const AutocompletePanel = ({ suggestions, isOpen, onSelect }) => {
  if (!isOpen || !suggestions.length) {
    return null;
  }

  return (
    <div className="absolute left-3 right-3 bottom-3 z-20 rounded-lg border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden">
      <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 bg-slate-950 border-b border-slate-800">
        Sugerencias (Ctrl + Espacio)
      </div>
      <div className="max-h-56 overflow-auto custom-scrollbar">
        {suggestions.map((item) => (
          <button
            key={`${item.value}-${item.insert}`}
            type="button"
            onClick={() => onSelect(item)}
            className="w-full text-left px-3 py-2 border-b border-slate-800 last:border-b-0 hover:bg-slate-800 transition-colors"
          >
            <div className="text-sm text-slate-200 font-mono">{item.value}</div>
            <div className="text-xs text-slate-400">{item.hint}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutocompletePanel;
