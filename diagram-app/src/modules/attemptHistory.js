function toMap(lines) {
  const map = new Map();
  lines.forEach((line, idx) => map.set(`${idx}:${line.trim()}`, true));
  return map;
}

export function summarizeCodeDiff(previousCode, nextCode) {
  const prevLines = String(previousCode || '').split('\n');
  const nextLines = String(nextCode || '').split('\n');

  const prevMap = toMap(prevLines);
  const nextMap = toMap(nextLines);

  let added = 0;
  let removed = 0;

  nextMap.forEach((_value, key) => {
    if (!prevMap.has(key)) added += 1;
  });

  prevMap.forEach((_value, key) => {
    if (!nextMap.has(key)) removed += 1;
  });

  return {
    added,
    removed,
    changed: added + removed
  };
}

export function getAttemptLabel(attempt, index) {
  if (!attempt) return `Intento ${index + 1}`;
  if (attempt.success) return `Intento ${index + 1} (exitoso)`;
  return `Intento ${index + 1}`;
}
