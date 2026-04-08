const OPENING = new Set(['(', '{', '[']);
const CLOSING_TO_OPENING = {
  ')': '(',
  '}': '{',
  ']': '['
};

function isLikelyStatement(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('//')) return false;
  if (trimmed.endsWith('{') || trimmed.endsWith('}')) return false;
  if (trimmed.startsWith('if ') || trimmed.startsWith('if(')) return false;
  if (trimmed.startsWith('for ') || trimmed.startsWith('for(')) return false;
  if (trimmed.startsWith('while ') || trimmed.startsWith('while(')) return false;
  if (trimmed.startsWith('else')) return false;
  return true;
}

function hasBalancedQuotes(line) {
  let single = 0;
  let double = 0;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    const prev = line[i - 1];
    if (ch === "'" && prev !== '\\') single += 1;
    if (ch === '"' && prev !== '\\') double += 1;
  }
  return single % 2 === 0 && double % 2 === 0;
}

function extractDeclarations(line) {
  const match = line.match(/\b(let|const|var)\s+([a-zA-Z_$][\w$]*)/g);
  if (!match) return [];
  return match
    .map((chunk) => chunk.split(/\s+/)[1])
    .filter(Boolean);
}

function extractIdentifiers(line) {
  const tokens = line.match(/[a-zA-Z_$][\w$]*/g) || [];
  return tokens.filter((token) => !['let', 'const', 'var', 'if', 'else', 'for', 'while', 'function', 'return', 'true', 'false', 'null', 'undefined', 'console'].includes(token));
}

export function lintCode(code) {
  const lines = String(code || '').split('\n');
  const warnings = [];
  const stack = [];
  const declared = new Set();
  const used = new Set();

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    if (!hasBalancedQuotes(line)) {
      warnings.push({
        line: lineNumber,
        severity: 'error',
        message: 'Parece que falta cerrar una comilla en esta línea.'
      });
    }

    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (OPENING.has(ch)) {
        stack.push({ ch, line: lineNumber });
      }
      if (Object.prototype.hasOwnProperty.call(CLOSING_TO_OPENING, ch)) {
        const expected = CLOSING_TO_OPENING[ch];
        const top = stack.pop();
        if (!top || top.ch !== expected) {
          warnings.push({
            line: lineNumber,
            severity: 'error',
            message: `Hay un cierre '${ch}' sin su apertura correspondiente.`
          });
        }
      }
    }

    const declarations = extractDeclarations(line);
    declarations.forEach((name) => declared.add(name));

    const ids = extractIdentifiers(line);
    ids.forEach((id) => {
      if (!declarations.includes(id)) {
        used.add(id);
      }
    });

    if (isLikelyStatement(line) && !line.trim().endsWith(';')) {
      warnings.push({
        line: lineNumber,
        severity: 'warning',
        message: 'Sugerencia: considera terminar esta instrucción con punto y coma (;).'
      });
    }

    if (/while\s*\(\s*true\s*\)/.test(line)) {
      warnings.push({
        line: lineNumber,
        severity: 'warning',
        message: 'Este while(true) podría volverse infinito si no tiene una salida clara.'
      });
    }
  });

  stack.forEach((item) => {
    warnings.push({
      line: item.line,
      severity: 'error',
      message: `Falta cerrar '${item.ch}' en el bloque abierto aquí.`
    });
  });

  declared.forEach((name) => {
    if (!used.has(name)) {
      warnings.push({
        line: 1,
        severity: 'info',
        message: `La variable '${name}' parece declarada pero no usada todavía.`
      });
    }
  });

  return warnings.sort((a, b) => a.line - b.line);
}
