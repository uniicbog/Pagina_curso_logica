# Laboratorio de Logica (React Unificado)

Este repositorio ahora usa una sola aplicacion activa: la app React en `diagram-app/`.

La version inicial en HTML/JS vanilla fue retirada para evitar despliegues duplicados o inconsistentes.

## Estructura actual

- `diagram-app/`: aplicacion principal (React + Vite)
- `index.html` (raiz): redireccion al build de React en `dist/index.html`
- `flow-diagram-editor/`: editor secundario (React + Vite)

## Comandos (desde la raiz)

- `npm run dev`: inicia la app React (`diagram-app`)
- `npm run build`: compila la app React
- `npm run preview`: publica una vista previa del build React

## Despliegue

Despliega el contenido compilado de `dist`.

## Nota

Si abres `index.html` en la raiz, redirige automaticamente al build React.

- Build de `diagram-app` -> `dist/` (en la raiz del proyecto).
- Build de `flow-diagram-editor` -> `flow-diagram-editor-dist/` (en la raiz del proyecto).
