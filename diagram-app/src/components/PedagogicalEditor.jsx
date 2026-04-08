import React, { useEffect, useMemo, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import AutocompletePanel from './AutocompletePanel';
import { lintCode } from '../modules/miniLinter';
import { applySuggestion, getSuggestions } from '../modules/codeCompletion';

function renderHighlighted(code, activeLine) {
  const rawLines = String(code || '').split('\n');
  return rawLines
    .map((line, index) => {
      const highlighted = highlight(line || ' ', languages.javascript);
      const lineClass = index + 1 === activeLine ? 'editor-active-line' : '';
      return `<span class="editor-line ${lineClass}">${highlighted}</span>`;
    })
    .join('\n');
}

const PedagogicalEditor = ({
  value,
  onChange,
  activeLine,
  enableLint = true,
  enableAutocomplete = true
}) => {
  const textareaId = useMemo(() => `pedagogical-editor-${Math.random().toString(36).slice(2, 9)}`, []);
  const [warnings, setWarnings] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const cursorRef = useRef({ start: 0, end: 0 });

  useEffect(() => {
    if (!enableLint) {
      setWarnings([]);
      return;
    }

    const timer = setTimeout(() => {
      setWarnings(lintCode(value).slice(0, 6));
    }, 450);

    return () => clearTimeout(timer);
  }, [value, enableLint]);

  const updateCursorFromTarget = (target) => {
    if (!target) return;
    cursorRef.current = {
      start: target.selectionStart ?? 0,
      end: target.selectionEnd ?? 0
    };
  };

  const openSuggestions = () => {
    if (!enableAutocomplete) return;
    const next = getSuggestions(value, cursorRef.current.start);
    setSuggestions(next);
    setIsOpen(next.length > 0);
  };

  const handleKeyDown = (event) => {
    updateCursorFromTarget(event.target);

    if (!enableAutocomplete) {
      return;
    }

    if (event.key === ' ' && event.ctrlKey) {
      event.preventDefault();
      openSuggestions();
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    const { code, cursor } = applySuggestion(
      value,
      cursorRef.current.start,
      cursorRef.current.end,
      suggestion
    );

    onChange(code);
    setIsOpen(false);

    window.setTimeout(() => {
      const textarea = document.getElementById(textareaId);
      if (!textarea) {
        return;
      }
      textarea.focus();
      textarea.selectionStart = cursor;
      textarea.selectionEnd = cursor;
      cursorRef.current = { start: cursor, end: cursor };
    }, 0);
  };

  return (
    <div className="relative">
      <Editor
        value={value}
        onValueChange={(next) => {
          onChange(next);
          if (enableAutocomplete) {
            const list = getSuggestions(next, cursorRef.current.start);
            setSuggestions(list);
            setIsOpen(false);
          }
        }}
        highlight={(code) => renderHighlighted(code, activeLine)}
        padding={20}
        textareaId={textareaId}
        onKeyDown={handleKeyDown}
        onClick={(event) => updateCursorFromTarget(event.target)}
        className="font-mono text-base min-h-full"
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 16,
          backgroundColor: '#1e1e1e',
          color: '#d4d4d4',
          minHeight: 260
        }}
      />

      <AutocompletePanel
        suggestions={suggestions}
        isOpen={isOpen}
        onSelect={handleSuggestion}
      />

      {activeLine ? (
        <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded bg-blue-500/20 border border-blue-500/40 text-blue-300 font-mono">
          Línea activa: {activeLine}
        </div>
      ) : null}

      {warnings.length > 0 ? (
        <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/70 overflow-hidden">
          <div className="px-3 py-2 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Mini lint pedagógico
          </div>
          <div className="max-h-36 overflow-auto custom-scrollbar">
            {warnings.map((warning, index) => (
              <div
                key={`${warning.line}-${warning.message}-${index}`}
                className="px-3 py-2 text-xs border-b border-slate-800 last:border-b-0"
              >
                <span className={`font-semibold ${
                  warning.severity === 'error'
                    ? 'text-red-400'
                    : warning.severity === 'warning'
                      ? 'text-yellow-400'
                      : 'text-sky-400'
                }`}>
                  Línea {warning.line}:
                </span>{' '}
                <span className="text-slate-300">{warning.message}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PedagogicalEditor;
