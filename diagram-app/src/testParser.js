import { parseCodeToFlow } from './FlowParser.js';

const defaultCode = `let numero = 5;
while (numero > 0) {
  console.log(numero);
  numero = numero - 1;
}`;


console.log(JSON.stringify(parseCodeToFlow({}), null, 2));
