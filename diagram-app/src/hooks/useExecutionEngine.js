import { useState, useRef, useEffect, useCallback } from 'react';
import { runInSandbox } from '../modules/sandboxRunner';
import {
  addAttempt,
  getAdaptiveDifficulty,
  getAttemptHistory,
  getSavedCode,
  saveCode,
  setAdaptiveDifficulty
} from '../modules/storage';
import { translateError } from '../modules/errorTranslator';
import { instrumentCode } from '../modules/codeInstrumenter';
import { describeLine } from '../modules/executionNarrator';

function cloneState(value) {
  try {
    return JSON.parse(JSON.stringify(value || {}));
  } catch (_error) {
    return { ...(value || {}) };
  }
}

function getChangedKeys(before, after) {
  const keys = new Set([
    ...Object.keys(before || {}),
    ...Object.keys(after || {})
  ]);

  return Array.from(keys).filter((key) => {
    return JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key]);
  });
}

function normalizeBreakpoints(values) {
  const list = Array.isArray(values) ? values : [];
  const normalized = list
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0);
  return Array.from(new Set(normalized)).sort((a, b) => a - b);
}

function computeAdaptiveDifficulty(attempts) {
  if (!attempts.length) {
    return 'basico';
  }

  const recent = attempts.slice(-6);
  const successRate = recent.filter((item) => item.success).length / recent.length;
  const avgTime = recent.reduce((acc, item) => acc + Number(item.timeMs || 0), 0) / recent.length;

  if (recent.length >= 5 && successRate >= 0.85 && avgTime <= 45000) {
    return 'reto';
  }

  if (recent.length >= 3 && successRate >= 0.6) {
    return 'intermedio';
  }

  return 'basico';
}

export const useExecutionEngine = (initialCode, validationFn, options = {}) => {
  const { sectionKey = 'general' } = options;
  const persistedCode = getSavedCode(sectionKey);

  const [code, setCodeState] = useState(persistedCode ?? initialCode);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [consoleMessages, setConsoleMessages] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepMode, setStepMode] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentLine, setCurrentLine] = useState(null);
  const [narrationHistory, setNarrationHistory] = useState([]);
  const [variableTraces, setVariableTraces] = useState([]);
  const [stateDiffs, setStateDiffs] = useState([]);
  const [breakpoints, setBreakpointsState] = useState([]);
  const [attempts, setAttempts] = useState(() => getAttemptHistory(sectionKey));
  const [recommendedDifficulty, setRecommendedDifficulty] = useState(() => getAdaptiveDifficulty(sectionKey));
  const [predictionResult, setPredictionResult] = useState(null);

  const queueRef = useRef([]);
  const userStateRef = useRef({});
  const currentLineRef = useRef(null);
  const latestNarrationRef = useRef('');
  const breakpointsRef = useRef([]);
  const runStartedAtRef = useRef(0);

  useEffect(() => {
    breakpointsRef.current = breakpoints;
  }, [breakpoints]);

  const setCode = useCallback((nextCode) => {
    setCodeState(nextCode);
    saveCode(sectionKey, nextCode);
  }, [sectionKey]);

  const setBreakpoints = useCallback((nextBreakpoints) => {
    setBreakpointsState(normalizeBreakpoints(nextBreakpoints));
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setPredictionResult(null);
    setFeedback(null);
    setConsoleMessages([]);
    setCurrentStepIndex(0);
    setTotalSteps(0);
    setIsPlaying(false);
    setCurrentLine(null);
    setNarrationHistory([]);
    setVariableTraces([]);
    setStateDiffs([]);
    queueRef.current = [];
    userStateRef.current = {};
    currentLineRef.current = null;
    latestNarrationRef.current = '';
  }, []);

  const addToQueue = useCallback((action) => {
    queueRef.current.push(action);
  }, []);

  const updateUserState = useCallback((newState) => {
    userStateRef.current = { ...userStateRef.current, ...newState };
  }, []);

  const runCode = useCallback((setupContextFn) => {
    reset();
    runStartedAtRef.current = Date.now();
// Basic heuristic prediction
    if (code) {
      let prediction = null;
      // Infinite loop basic heuristic: while without var mutation
      if (/while\s*\([^)]+\)\s*\{[^}]*\}/.test(code)) {
        if (!/(\+\+|--|\+=|-=|=.*[+*/-])/.test(code.match(/while\s*\([^)]+\)\s*\{([^}]*)\}/)?.[1] || '')) {
          prediction = { type: 'warning', message: 'Posible bucle infinito detectado: tu ciclo while parece no modificar la variable de control.' };
        }
      }
      if (!prediction && /for\s*\([^;]+;[^;]+;\s*\)/.test(code)) {
         prediction = { type: 'warning', message: 'Estructura de for mal formada detectada, ¿olvidaste el incremento?' };
      }
      setPredictionResult(prediction);
    }

    
    const context = setupContextFn(addToQueue, updateUserState) || {};
    const handlers = {};

    Object.entries(context).forEach(([name, value]) => {
      if (typeof value === 'function') {
        handlers[name] = value;
      }

      if (value && typeof value === 'object') {
        Object.entries(value).forEach(([method, handler]) => {
          if (typeof handler === 'function') {
            handlers[`${name}.${method}`] = handler;
          }
        });
      }
    });

    handlers.__traceLine = (line, text) => {
      const traceAction = () => {
        const lineNumber = Number(line) || null;
        currentLineRef.current = lineNumber;
        setCurrentLine(lineNumber);

        const narrationText = describeLine(sectionKey, lineNumber, text);
        latestNarrationRef.current = narrationText;

        setNarrationHistory((prev) => [
          ...prev,
          {
            line: lineNumber,
            text: narrationText,
            raw: text,
            timestamp: Date.now()
          }
        ]);
      };
      
      traceAction.isTraceLine = true;
      traceAction.traceLineNumber = Number(line) || null;
      
      addToQueue(traceAction);
    };

    runInSandbox({
      code: instrumentCode(code),
      handlers,
      onConsole: (entry) => {
        setConsoleMessages((prev) => [...prev, entry]);
      },
      onError: (message) => {
        const translated = translateError(message);
        setError(translated);

        const attempt = {
          timestamp: Date.now(),
          code,
          success: false,
          timeMs: Date.now() - runStartedAtRef.current,
          totalSteps: queueRef.current.length,
          error: translated
        };

        addAttempt(sectionKey, attempt);
        const nextAttempts = getAttemptHistory(sectionKey);
        setAttempts(nextAttempts);

        const nextDifficulty = computeAdaptiveDifficulty(nextAttempts);
        setAdaptiveDifficulty(sectionKey, nextDifficulty);
        setRecommendedDifficulty(nextDifficulty);
      },
      onComplete: () => {
        let success = true;
        if (validationFn) {
          const result = validationFn(userStateRef.current);
          setFeedback(result);
          success = Boolean(result?.success);
        }

        setTotalSteps(queueRef.current.length);
        setIsPlaying(!stepMode);

        const attempt = {
          timestamp: Date.now(),
          code,
          success,
          timeMs: Date.now() - runStartedAtRef.current,
          totalSteps: queueRef.current.length,
          error: null
        };

        addAttempt(sectionKey, attempt);
        const nextAttempts = getAttemptHistory(sectionKey);
        setAttempts(nextAttempts);

        const nextDifficulty = computeAdaptiveDifficulty(nextAttempts);
        setAdaptiveDifficulty(sectionKey, nextDifficulty);
        setRecommendedDifficulty(nextDifficulty);
      }
    });
    return true;
  }, [
    code,
    reset,
    addToQueue,
    updateUserState,
    validationFn,
    stepMode,
    sectionKey
  ]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < queueRef.current.length) {
      const action = queueRef.current[currentStepIndex];
      const before = cloneState(userStateRef.current);

      try {
        action();
      } catch (_error) {
        setError('No se pudo ejecutar un paso de la animacion.');
      }

      const after = cloneState(userStateRef.current);
      const changedKeys = getChangedKeys(before, after);
      const step = currentStepIndex + 1;
      const line = currentLineRef.current;

      setStateDiffs((prev) => [
        ...prev,
        {
          step,
          line,
          before,
          after,
          changedKeys,
          narration: latestNarrationRef.current || null
        }
      ]);

      setVariableTraces((prev) => [
        ...prev,
        {
          step,
          line,
          state: after,
          changedKeys
        }
      ]);

      setCurrentStepIndex((prev) => prev + 1);

      if (action.isTraceLine && action.traceLineNumber && breakpointsRef.current.includes(action.traceLineNumber)) {
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(false);
    }
  }, [currentStepIndex]);

  const pause = useCallback(() => setIsPlaying(false), []);
  const play = useCallback(() => {
    if (!stepMode && currentStepIndex < totalSteps) {
      setIsPlaying(true);
    }
  }, [currentStepIndex, totalSteps, stepMode]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStepIndex < totalSteps) {
      const delay = Math.max(80, Math.floor(800 / playbackSpeed));
      timer = setTimeout(() => {
        nextStep();
      }, delay);
    } else if (currentStepIndex >= totalSteps) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, playbackSpeed, nextStep]);

  useEffect(() => {
    if (stepMode) {
      setIsPlaying(false);
    }
  }, [stepMode]);

  return {
    code,
    setCode,
    runCode,
    reset,
    nextStep,
    pause,
    play,
    playbackSpeed,
    setPlaybackSpeed,
    stepMode,
    setStepMode,
    isDebugMode: false,
    setIsDebugMode: () => {},
    isPlaying,
    currentStepIndex,
    totalSteps,
    consoleMessages,
    currentLine,
    narrationHistory,
    variableTraces,
    stateDiffs,
    breakpoints,
    setBreakpoints,
    attempts,
    recommendedDifficulty,
    predictionResult: null,
    error,
    feedback
  };
};
