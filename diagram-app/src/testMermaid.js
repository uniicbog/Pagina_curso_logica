import { parseCodeToFlow } from './FlowParser.js';

const sanitize = (s = '') => String(s).replace(/["'()]/g, '').trim();

const generateMermaidFromParse = (result) => {
  const { nodes: nds, edges: eds } = result;
  const idMap = {};
  nds.forEach((n, i) => { idMap[n.id] = `N${i}`; });

  const nodeLines = nds.map((n, i) => {
    const id = idMap[n.id];
    let label = sanitize(n.data?.label || n.label || n.data?.text || n.id);
    let shapeStart = '['; let shapeEnd = ']';
    
    if (n.type === 'startEnd') {
      if (n.data?.isMerge) {
          // If label string is empty, we must be careful with quotes in mermaid
         return `${id}(( )):::merge`; 
      }
      shapeStart = '(['; shapeEnd = '])';
    } else if (n.type === 'io') {
      shapeStart = '[/'; shapeEnd = '/]';
    } else if (n.type === 'decision') {
      shapeStart = '{'; shapeEnd = '}';
    }

    let styleClass = '';
    if (n.type === 'startEnd' && !n.data?.isMerge) styleClass = ':::startEnd';
    if (n.type === 'process') styleClass = ':::process';
    if (n.type === 'io') styleClass = ':::io';
    if (n.type === 'decision') styleClass = ':::decision';

    return `${id}${shapeStart}"${label}"${shapeEnd}${styleClass}`;
  });

  const edgeLines = eds.map((e) => {
    const from = idMap[e.source];
    const to = idMap[e.target];
    let label = e.label || '';
    if (!label && (e.sourceHandle || e.targetHandle)) {
      const handle = e.sourceHandle || e.targetHandle;
      if (handle && handle.toLowerCase().includes('true')) label = 'Sí';
      if (handle && handle.toLowerCase().includes('false')) label = 'No';
    }
    return label ? `${from} -->|"${label}"| ${to}` : `${from} --> ${to}`;
  });

  return `flowchart TD
${nodeLines.join('\n')}
${edgeLines.join('\n')}`;
};

const code = `// Tu algoritmo aquí
let edad = 18;

if (edad >= 18) {
  console.log("Es mayor");
} else {
  console.log("Es menor");
}

console.log("Fin");`;

const result = parseCodeToFlow(code);
console.log(generateMermaidFromParse(result));
