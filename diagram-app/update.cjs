const fs = require('fs');
const filePath = 'src/data/ejercicios.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const respuestas = {
  'var-basico-1': 'let nombre = "Ana";\nlet edad = 18;\nlet estudiante = true;\n\ncrearVariable(nombre, "Variable de texto");\ncrearVariable(edad, "Variable numerica");\ncrearVariable(estudiante, "Variable booleana");',
  'cond-int-1': 'let energia = 50;\n\nif (energia > 0) {\n  animarCondicional(true);\n} else {\n  animarCondicional(false);\n}',
  'for-reto-1': 'for (let i = 1; i <= 5; i++) {\n  animarCicloFor(i);\n}',
  'while-basico-1': 'let contador = 3;\n\nwhile (contador >= 0) {\n  animarCicloWhile(contador);\n  contador--;\n}',
  'anidados-intermedio-1': 'let matriz = [[1, 2], [3, 4]];\n\nfor (let i = 0; i < matriz.length; i++) {\n  for (let j = 0; j < matriz[i].length; j++) {\n    animarAnidado(matriz[i][j]);\n  }\n}',
  'arrays-basico-1': 'let numeros = [10, 20, 30, 40];\n\nanimarArray(numeros);',
  'func-reto-1': 'function duplicar(num) {\n  return num * 2;\n}\n\nlet resultado = duplicar(5);\nanimarFuncion(resultado);'
};

for (const seccion in data.secciones) {
  data.secciones[seccion].forEach((ejercicio) => {
    if (respuestas[ejercicio.id]) {
      ejercicio.respuesta = respuestas[ejercicio.id];
    }
  });
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log('Respuestas agregadas con exito!');
