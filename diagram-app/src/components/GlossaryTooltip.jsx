import React, { useMemo, useState } from 'react';
import glossary from '../data/glosario.json';

const GlossaryTooltip = ({ termId, children }) => {
  const [open, setOpen] = useState(false);
  const term = useMemo(
    () => glossary.terminos.find((item) => item.id === termId),
    [termId]
  );

  if (!term) {
    return children || null;
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1 underline decoration-dotted decoration-cyan-500 text-cyan-300 hover:text-cyan-200"
      >
        {children || term.termino}
      </button>
      {open ? (
        <span className="absolute z-30 mt-2 left-0 w-72 rounded-lg border border-slate-700 bg-slate-950 p-3 text-left shadow-2xl">
          <span className="block text-sm font-semibold text-white mb-1">{term.termino}</span>
          <span className="block text-xs text-slate-300 leading-relaxed">{term.definicion}</span>
          <span className="block mt-2 text-[11px] uppercase tracking-wider text-slate-500">{term.categoria}</span>
        </span>
      ) : null}
    </span>
  );
};

export default GlossaryTooltip;
