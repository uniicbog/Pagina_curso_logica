import React from 'react';
import conceptMaps from '../data/conceptMaps.json';
import cases from '../data/casosReales.json';
import mappings from '../data/pseudocodeMappings.json';
import GlossaryTooltip from './GlossaryTooltip';

const TopicLearningToolkit = ({ sectionKey, title }) => {
  const map = conceptMaps[sectionKey];
  const topicCases = cases[sectionKey] || [];
  const pseudoMap = mappings[sectionKey];

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="space-y-4 mb-6">
      {map ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-100">{map.title}</h3>
            <button
              type="button"
              onClick={handlePrintSummary}
              className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Resumen PDF/Imprimir
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {map.nodes.map((node) => (
              <span key={node} className="text-xs px-2 py-1 rounded-full border border-slate-600 bg-slate-800 text-slate-300">
                {node}
              </span>
            ))}
          </div>
          <ul className="mt-2 text-xs text-slate-400 space-y-1">
            {map.links.map((link) => (
              <li key={link}>• {link}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {topicCases.length ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-2">Casos reales del tema</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {topicCases.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <h4 className="text-xs font-semibold text-slate-200">{item.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
                <pre className="mt-2 text-[11px] text-slate-300 font-mono whitespace-pre-wrap">{item.snippet}</pre>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {pseudoMap ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-2">Explicación automática pseudocódigo → JavaScript</h3>
          <div className="grid lg:grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">Pseudocódigo</p>
              <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap">{pseudoMap.pseudocode}</pre>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-wider text-slate-500 mb-1">JavaScript</p>
              <pre className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap">{pseudoMap.javascript}</pre>
            </div>
          </div>
          <ul className="mt-2 text-xs text-slate-400 space-y-1">
            {pseudoMap.mapping.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-2">Glosario contextual</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          En este tema de <strong>{title}</strong> aparecen conceptos como{' '}
          <GlossaryTooltip termId="variable">variable</GlossaryTooltip>,{' '}
          <GlossaryTooltip termId="condicional">condicional</GlossaryTooltip>,{' '}
          <GlossaryTooltip termId="iteracion">iteración</GlossaryTooltip> y{' '}
          <GlossaryTooltip termId="funcion">función</GlossaryTooltip>.
        </p>
      </div>
    </div>
  );
};

export default TopicLearningToolkit;
