const KEYWORDS = [
  { value: 'if', insert: 'if (condicion) {\n  \n}', hint: 'Estructura condicional' },
  { value: 'for', insert: 'for (let i = 0; i < total; i++) {\n  \n}', hint: 'Ciclo con contador' },
  { value: 'while', insert: 'while (condicion) {\n  \n}', hint: 'Ciclo condicionado' },
  { value: 'function', insert: 'function nombre(parametro) {\n  return parametro;\n}', hint: 'Declarar función' },
  { value: 'console.log', insert: 'console.log();', hint: 'Mostrar información en consola' },
  { value: 'let', insert: 'let nombre = valor;', hint: 'Declarar variable mutable' },
  { value: 'const', insert: 'const nombre = valor;', hint: 'Declarar constante' },
  { value: 'return', insert: 'return valor;', hint: 'Devolver resultado' },
  { value: 'animarCicloFor', insert: 'animarCicloFor(i, total);', hint: 'Animación de ciclo for' },
  { value: 'animarCicloWhile', insert: 'animarCicloWhile(condicion, valor);', hint: 'Animación de ciclo while' },
  { value: 'animarArray', insert: 'animarArray(arreglo);', hint: 'Animación de array' },
  { value: 'animarFuncion', insert: 'animarFuncion("nombre", [entrada], salida);', hint: 'Animación de función' },
  { value: 'crearVariable', insert: 'crearVariable("nombre", valor);', hint: 'Visualizar variable' }
];

function getWordAtPosition(code, cursorPosition) {
  const left = code.slice(0, cursorPosition);
  const match = left.match(/[a-zA-Z_$][\w$.]*$/);
  return match ? match[0] : '';
}

function extractVariables(code) {
  const names = new Set();
  const regex = /\b(?:let|const|var)\s+([a-zA-Z_$][\w$]*)/g;
  let match = regex.exec(code);
  while (match) {
    names.add(match[1]);
    match = regex.exec(code);
  }
  return Array.from(names);
}

export function getSuggestions(code, cursorPosition) {
  const word = getWordAtPosition(code, cursorPosition).toLowerCase();

  const variableSuggestions = extractVariables(code).map((name) => ({
    value: name,
    insert: name,
    hint: 'Variable declarada en tu código'
  }));

  const base = [...KEYWORDS, ...variableSuggestions];
  if (!word) {
    return base.slice(0, 8);
  }

  return base
    .filter((item) => item.value.toLowerCase().includes(word))
    .slice(0, 10);
}

export function applySuggestion(code, cursorStart, cursorEnd, suggestion) {
  const left = code.slice(0, cursorStart);
  const right = code.slice(cursorEnd);
  const wordMatch = left.match(/[a-zA-Z_$][\w$.]*$/);
  const wordStart = wordMatch ? cursorStart - wordMatch[0].length : cursorStart;

  const nextCode = `${code.slice(0, wordStart)}${suggestion.insert}${right}`;
  const nextCursor = wordStart + suggestion.insert.length;

  return {
    code: nextCode,
    cursor: nextCursor
  };
}
