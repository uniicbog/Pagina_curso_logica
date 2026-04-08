function shouldTraceLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('//')) return false;
  if (trimmed.startsWith('/*') || trimmed.startsWith('*')) return false;
  if (trimmed === '{' || trimmed === '}') return false;
  if (trimmed.startsWith('else')) return false;
  if (trimmed.startsWith('catch')) return false;
  if (trimmed.startsWith('finally')) return false;
  return true;
}

export function instrumentCode(code) {
  const lines = String(code || '').split('\n');
  const transformed = lines.map((line, index) => {
    if (!shouldTraceLine(line)) {
      return line;
    }

    const safeLine = line.replace(/`/g, '\\`');
    const indent = line.match(/^\s*/)?.[0] || '';
    const trace = `${indent}__traceLine(${index + 1}, \`${safeLine.trim()}\`);`;
    return `${trace}\n${line}`;
  });

  return transformed.join('\n');
}
