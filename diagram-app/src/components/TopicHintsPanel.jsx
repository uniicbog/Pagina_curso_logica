import React, { useMemo, useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { TOPIC_HINTS } from '../data/topicHints';
import { markHintUsed } from '../modules/storage';

const TopicHintsPanel = ({ activeSection }) => {
  const hints = TOPIC_HINTS[activeSection] || [];
  const [hintIndexBySection, setHintIndexBySection] = useState({});

  const currentIndex = hintIndexBySection[activeSection] || 0;
  const currentHint = useMemo(() => {
    if (currentIndex === 0 || hints.length === 0) {
      return '';
    }
    return hints[currentIndex - 1] || '';
  }, [currentIndex, hints]);

  useEffect(() => {
    if (!hints.length) {
      return;
    }
    setHintIndexBySection((prev) => {
      if (typeof prev[activeSection] === 'number') {
        return prev;
      }
      return { ...prev, [activeSection]: 0 };
    });
  }, [activeSection, hints]);

  if (hints.length === 0) {
    return null;
  }

  const showNextHint = () => {
    setHintIndexBySection((prev) => {
      const current = prev[activeSection] || 0;
      const next = Math.min(current + 1, hints.length);
      if (next > 0) {
        markHintUsed(`topic-${activeSection}`, next - 1);
      }
      return { ...prev, [activeSection]: next };
    });
  };

  const resetHints = () => {
    setHintIndexBySection((prev) => ({ ...prev, [activeSection]: 0 }));
  };

  return (
    <aside className="hidden xl:block fixed right-4 bottom-4 w-[340px] z-30">
      <div className="rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-amber-300">
            <Lightbulb size={18} />
            <span className="font-semibold text-sm">Pistas progresivas</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{Math.min(currentIndex, hints.length)}/{hints.length}</span>
        </div>

        <div className="min-h-[54px] text-sm text-slate-300 leading-relaxed mb-3">
          {currentHint || 'Pulsa "Siguiente pista" para recibir ayuda contextual del tema actual.'}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
            onClick={showNextHint}
          >
            Siguiente pista
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
            onClick={resetHints}
          >
            Reiniciar
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TopicHintsPanel;
