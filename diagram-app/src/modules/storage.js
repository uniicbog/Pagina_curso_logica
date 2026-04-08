const STORAGE_KEY = 'labLogicaReactState';

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

function getState() {
  const base = {
    savedCode: {},
    progress: {},
    completedChallenges: {},
    usedHints: {},
    attemptHistory: {},
    adaptiveDifficultyBySection: {},
    quizResultsBySection: {}
  };

  const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
  if (!parsed || typeof parsed !== 'object') {
    return base;
  }

  return {
    ...base,
    ...parsed
  };
}

function setState(nextState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function updateState(updater) {
  const state = getState();
  const next = updater(state);
  setState(next);
  return next;
}

export function getSavedCode(sectionKey) {
  return getState().savedCode[sectionKey] ?? null;
}

export function saveCode(sectionKey, code) {
  updateState((state) => ({
    ...state,
    savedCode: {
      ...state.savedCode,
      [sectionKey]: code
    }
  }));
}

export function setProgress(sectionKey, value) {
  const normalized = Math.max(0, Math.min(100, Math.round(value)));
  updateState((state) => ({
    ...state,
    progress: {
      ...state.progress,
      [sectionKey]: normalized
    }
  }));
  return normalized;
}

export function getProgress(sectionKey) {
  return getState().progress[sectionKey] ?? 0;
}

export function markChallengeCompleted(challengeId) {
  updateState((state) => ({
    ...state,
    completedChallenges: {
      ...state.completedChallenges,
      [challengeId]: true
    }
  }));
}

export function markHintUsed(challengeId, hintIndex) {
  updateState((state) => ({
    ...state,
    usedHints: {
      ...state.usedHints,
      [challengeId]: Math.max(state.usedHints[challengeId] ?? -1, hintIndex)
    }
  }));
}

export function getAttemptHistory(sectionKey) {
  const attempts = getState().attemptHistory[sectionKey];
  return Array.isArray(attempts) ? attempts : [];
}

export function addAttempt(sectionKey, attempt) {
  updateState((state) => {
    const attempts = Array.isArray(state.attemptHistory[sectionKey])
      ? state.attemptHistory[sectionKey]
      : [];

    const nextAttempts = [...attempts, attempt].slice(-20);

    return {
      ...state,
      attemptHistory: {
        ...state.attemptHistory,
        [sectionKey]: nextAttempts
      }
    };
  });
}

export function getAdaptiveDifficulty(sectionKey) {
  return getState().adaptiveDifficultyBySection[sectionKey] ?? 'basico';
}

export function setAdaptiveDifficulty(sectionKey, level) {
  updateState((state) => ({
    ...state,
    adaptiveDifficultyBySection: {
      ...state.adaptiveDifficultyBySection,
      [sectionKey]: level
    }
  }));
}

export function saveQuizResult(sectionKey, result) {
  updateState((state) => ({
    ...state,
    quizResultsBySection: {
      ...state.quizResultsBySection,
      [sectionKey]: result
    }
  }));
}

export function getQuizResultsBySection(sectionKey) {
  return getState().quizResultsBySection[sectionKey] ?? null;
}
