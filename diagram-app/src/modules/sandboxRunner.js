const NAMESPACE = 'lab-logica-react-sandbox';

function createRunId() {
  return `run-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildSandboxHtml({ runId, code, functionNames }) {
  const serializedCode = JSON.stringify(code);
  const serializedFns = JSON.stringify(functionNames);

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body>
<script>
(() => {
  const RUN_ID = ${JSON.stringify(runId)};
  const NAMESPACE = ${JSON.stringify(NAMESPACE)};
  const functions = ${serializedFns};

  const post = (channel, payload) => {
    parent.postMessage({ namespace: NAMESPACE, runId: RUN_ID, channel, payload }, '*');
  };

  const callHost = (name, args) => post('call', { name, args });

  const hostConsole = {
    log: (...args) => post('console', { level: 'log', args: args.map(String) }),
    warn: (...args) => post('console', { level: 'warn', args: args.map(String) }),
    error: (...args) => post('console', { level: 'error', args: args.map(String) })
  };

  window.console = hostConsole;

  functions.forEach((name) => {
    if (name.includes('.')) {
      const [root, method] = name.split('.');
      window[root] = window[root] || {};
      window[root][method] = (...args) => callHost(name, args);
    } else {
      window[name] = (...args) => callHost(name, args);
    }
  });

  window.addEventListener('error', (event) => {
    post('error', { message: event.message || 'Error de ejecucion.' });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    post('error', { message: (reason && reason.message) || String(reason) || 'Promesa rechazada.' });
  });

  try {
    const sourceCode = ${serializedCode};
    new Function(sourceCode)();
    post('complete', { ok: true });
  } catch (error) {
    post('error', { message: error.message || String(error) });
  }
})();
<\/script>
</body>
</html>`;
}

export function runInSandbox({
  code,
  handlers,
  onConsole,
  onError,
  onComplete,
  timeoutMs = 2500
}) {
  const runId = createRunId();
  const functionNames = Object.keys(handlers);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.setAttribute('sandbox', 'allow-scripts');

  const cleanups = [];

  const cleanup = () => {
    while (cleanups.length > 0) {
      const fn = cleanups.pop();
      fn();
    }
  };

  const listener = (event) => {
    const data = event.data;
    if (!data || data.namespace !== NAMESPACE || data.runId !== runId) {
      return;
    }

    if (data.channel === 'call') {
      const { name, args } = data.payload || {};
      handlers[name]?.(...(args || []));
      return;
    }

    if (data.channel === 'console') {
      onConsole?.(data.payload || {});
      return;
    }

    if (data.channel === 'error') {
      onError?.(data.payload?.message || 'Error de ejecucion.');
      cleanup();
      return;
    }

    if (data.channel === 'complete') {
      onComplete?.();
      cleanup();
    }
  };

  window.addEventListener('message', listener);
  cleanups.push(() => window.removeEventListener('message', listener));

  const timeout = window.setTimeout(() => {
    onError?.('La ejecucion tardo demasiado. Revisa si hay un ciclo infinito.');
    cleanup();
  }, timeoutMs);
  cleanups.push(() => window.clearTimeout(timeout));

  iframe.srcdoc = buildSandboxHtml({ runId, code, functionNames });
  document.body.appendChild(iframe);
  cleanups.push(() => {
    if (iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  });

  return cleanup;
}
