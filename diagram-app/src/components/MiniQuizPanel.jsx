import React, { useMemo, useState } from 'react';
import quizzes from '../data/quizzes.json';
import { getQuizResultsBySection, saveQuizResult } from '../modules/storage';

const MiniQuizPanel = ({ sectionKey }) => {
  const quiz = useMemo(() => quizzes[sectionKey], [sectionKey]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [savedResult, setSavedResult] = useState(() => getQuizResultsBySection(sectionKey));

  if (!quiz) {
    return null;
  }

  const handleSubmit = () => {
    const total = quiz.questions.length;
    const correct = quiz.questions.reduce((acc, q) => {
      return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);

    const score = Math.round((correct / total) * 100);
    const result = {
      score,
      correct,
      total,
      timestamp: Date.now()
    };

    saveQuizResult(sectionKey, result);
    setSavedResult(result);
    setSubmitted(true);
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <h3 className="text-lg font-semibold text-white mb-1">{quiz.title}</h3>
      <p className="text-sm text-slate-400 mb-4">Responde 3 preguntas para validar comprensión.</p>

      <div className="space-y-4">
        {quiz.questions.map((question, idx) => (
          <div key={question.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-sm text-slate-200 mb-2">{idx + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <label key={option} className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                  />
                  {option}
                </label>
              ))}
            </div>
            {submitted ? (
              <p className="mt-2 text-xs text-slate-400">{question.explanation}</p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm"
        >
          Calificar quiz
        </button>
        {savedResult ? (
          <span className="text-xs text-slate-300">
            Último resultado: {savedResult.correct}/{savedResult.total} ({savedResult.score}%)
          </span>
        ) : null}
      </div>
    </section>
  );
};

export default MiniQuizPanel;
