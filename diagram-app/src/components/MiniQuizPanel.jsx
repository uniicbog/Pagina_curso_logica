import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import quizzes from '../data/quizzes.json';
import { getQuizResultsBySection, saveQuizResult } from '../modules/storage';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="mt-8 rounded-xl border border-slate-700 bg-slate-900/60 p-5"
    >
      <motion.h3 className="text-lg font-semibold text-white mb-1" variants={itemVariants}>{quiz.title}</motion.h3>
      <motion.p className="text-sm text-slate-400 mb-4" variants={itemVariants}>Responde 3 preguntas para validar comprensión.</motion.p>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {quiz.questions.map((question, idx) => (
          <motion.div 
            key={question.id} 
            variants={itemVariants}
            className={`rounded-lg border p-4 transition-colors duration-300 ${
              submitted && !!answers[question.id] 
                ? (answers[question.id] === question.correctIndex ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-rose-500/50 bg-rose-950/20')
                : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <p className="text-sm font-medium text-slate-200 mb-3">{idx + 1}. {question.question}</p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <motion.label 
                  key={option} 
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer p-2 rounded-md hover:bg-slate-800/50 transition-colors"
                >
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === optionIndex}
                    onChange={() => setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))}
                    disabled={submitted}
                    className="accent-primary h-4 w-4"
                  />
                  <span>{option}</span>
                </motion.label>
              ))}
            </div>
            <AnimatePresence>
              {submitted && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className={`mt-3 p-3 rounded-md text-xs border ${
                    answers[question.id] === question.correctIndex 
                      ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/50' 
                      : 'bg-rose-950/40 text-rose-300 border-rose-800/50'
                  }`}>
                    <strong className="block mb-1">
                      {answers[question.id] === question.correctIndex ? '¡Correcto!' : 'Incorrecto.'}
                    </strong>
                    {question.explanation}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="mt-6 flex items-center justify-between gap-3 border-t border-slate-800 pt-4"
      >
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={submitted || Object.keys(answers).length < quiz.questions.length}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 rounded-md bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors shadow-lg shadow-primary/20"
        >
          {submitted ? 'Cuestionario Calificado' : 'Calificar quiz'}
        </motion.button>
        <AnimatePresence>
          {savedResult && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-400">Último resultado</span>
                <span className={`text-sm font-bold ${savedResult.score >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {savedResult.correct}/{savedResult.total} ({savedResult.score}%)
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
};

export default MiniQuizPanel;
