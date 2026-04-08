const RULES = [
  {
    check: (msg) => msg.includes('Unexpected end of input') || msg.includes('missing ) after argument list'),
    friendly: 'Parece que olvidaste cerrar una llave o un parentesis.'
  },
  {
    check: (msg) => msg.includes('Unexpected token'),
    friendly: 'Hay un simbolo inesperado. Revisa comas, parentesis y llaves.'
  },
  {
    check: (msg) => msg.includes('is not defined'),
    friendly: 'Estas usando un nombre que aun no fue declarado.'
  },
  {
    check: (msg) => msg.includes('Assignment to constant variable'),
    friendly: 'Intentaste modificar una constante. Cambia const por let si necesitas actualizar el valor.'
  },
  {
    check: (msg) => msg.includes('Cannot read properties of undefined'),
    friendly: 'Intentaste leer una propiedad de un valor que aun no existe.'
  }
];

export function translateError(rawMessage) {
  const message = String(rawMessage || 'Error de ejecucion no identificado.');
  const match = RULES.find((rule) => rule.check(message));
  return match ? match.friendly : message;
}
