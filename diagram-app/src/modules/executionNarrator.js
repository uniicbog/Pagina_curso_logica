export function describeLine(sectionKey, line, text) {
  const clean = String(text || '').trim();
  const base = `Línea ${line}: ${clean || 'instrucción ejecutada'}.`;

  if (/\bif\b/.test(clean)) {
    return `${base} Se está evaluando una condición.`;
  }

  if (/\bfor\b/.test(clean) || /\bwhile\b/.test(clean)) {
    return `${base} Se está avanzando en un ciclo de repetición.`;
  }

  if (/\breturn\b/.test(clean)) {
    return `${base} Se devuelve un resultado desde la función.`;
  }

  if (/\bconsole\.log\b/.test(clean)) {
    return `${base} Se envía información a la consola.`;
  }

  if (/\blet\b|\bconst\b|\bvar\b/.test(clean)) {
    return `${base} Se define o actualiza el estado de una variable.`;
  }

  return `${base} Paso ejecutado en ${sectionKey}.`;
}
