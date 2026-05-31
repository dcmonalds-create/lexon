import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { QuizQuestion } from '../types';

interface Props {
  toolColor: string;
  questions: QuizQuestion[];
  onComplete: (assembled: string) => void;
  onSwitchToManual: () => void;
}

function assemblePrompt(questions: QuizQuestion[], answers: Record<string, string | string[]>): string {
  return questions
    .map((q) => {
      const ans = answers[q.id];
      if (!ans || (Array.isArray(ans) && ans.length === 0)) return null;
      const value = Array.isArray(ans) ? ans.join(', ') : (ans as string).trim();
      if (!value) return null;
      return `${q.fieldLabel}: ${value}`;
    })
    .filter(Boolean)
    .join('\n');
}

export default function QuizForm({ toolColor, questions, onComplete, onSwitchToManual }: Props) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const q = questions[step];
  const isLast = step === questions.length - 1;

  const currentAnswer = answers[q.id] ?? (q.type === 'multiselect' ? [] : '');

  const hasValue =
    q.type === 'multiselect'
      ? ((answers[q.id] as string[] | undefined) ?? []).length > 0
      : ((answers[q.id] as string | undefined) ?? '').trim().length > 0;

  const canProceed = q.required === false ? true : hasValue;

  const setAnswer = (val: string | string[]) =>
    setAnswers((prev) => ({ ...prev, [q.id]: val }));

  const toggleMulti = (opt: string) => {
    const current = (answers[q.id] as string[]) || [];
    const next = current.includes(opt)
      ? current.filter((v) => v !== opt)
      : [...current, opt];
    setAnswer(next);
  };

  const advance = () => {
    if (isLast) {
      onComplete(assemblePrompt(questions, answers));
    } else {
      setStep((s) => s + 1);
    }
  };

  const accentClass = toolColor.includes('emerald')
    ? 'ring-emerald-500 bg-emerald-50 border-emerald-500 text-emerald-800 bg-emerald-500'
    : toolColor.includes('amber')
    ? 'ring-amber-500 bg-amber-50 border-amber-500 text-amber-800 bg-amber-500'
    : toolColor.includes('purple')
    ? 'ring-purple-500 bg-purple-50 border-purple-500 text-purple-800 bg-purple-500'
    : toolColor.includes('blue')
    ? 'ring-blue-500 bg-blue-50 border-blue-500 text-blue-800 bg-blue-500'
    : toolColor.includes('red')
    ? 'ring-red-500 bg-red-50 border-red-500 text-red-800 bg-red-500'
    : toolColor.includes('yellow')
    ? 'ring-yellow-500 bg-yellow-50 border-yellow-500 text-yellow-800 bg-yellow-500'
    : toolColor.includes('teal')
    ? 'ring-teal-500 bg-teal-50 border-teal-500 text-teal-800 bg-teal-500'
    : toolColor.includes('violet')
    ? 'ring-violet-500 bg-violet-50 border-violet-500 text-violet-800 bg-violet-500'
    : 'ring-emerald-500 bg-emerald-50 border-emerald-500 text-emerald-800 bg-emerald-500';

  // Parse out individual color tokens from accentClass
  const [ringClass, bgLightClass, borderClass, textClass, bgSolidClass] =
    accentClass.split(' ');

  const selectedItemClass = `${borderClass} ${bgLightClass} ${textClass} font-medium`;
  const checkboxSelectedClass = `${bgSolidClass} ${borderClass}`;
  const progressBarClass = bgSolidClass;
  const submitBtnBg = 'bg-[#1D4035] hover:bg-[#164030]';

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">
            Question {step + 1} of {questions.length}
          </span>
          <button
            type="button"
            onClick={onSwitchToManual}
            className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
          >
            Type manually
          </button>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${progressBarClass}`}
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{q.question}</h3>

        {q.type === 'select' && (
          <div className="space-y-2">
            {q.options!.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setAnswer(opt)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                  currentAnswer === opt
                    ? selectedItemClass
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {q.type === 'multiselect' && (
          <div className="space-y-2">
            <p className="text-xs text-gray-400">Select all that apply</p>
            {q.options!.map((opt) => {
              const selected = ((answers[q.id] as string[]) || []).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleMulti(opt)}
                  className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-colors ${
                    selected
                      ? selectedItemClass
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded border transition-colors ${
                      selected ? checkboxSelectedClass : 'border-gray-300 bg-white'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {q.type === 'text' && (
          <input
            type="text"
            value={currentAnswer as string}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canProceed && advance()}
            placeholder={q.placeholder}
            className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${ringClass} focus:border-transparent`}
            autoFocus
          />
        )}

        {q.type === 'textarea' && (
          <textarea
            value={currentAnswer as string}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={q.placeholder}
            rows={4}
            className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${ringClass} focus:border-transparent resize-none`}
            autoFocus
          />
        )}

        {q.required === false && (
          <p className="text-xs text-gray-400">Optional — tap Next to skip</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="flex items-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}

        <button
          type="button"
          onClick={advance}
          disabled={!canProceed}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed ${
            isLast ? `${submitBtnBg} text-white` : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          {isLast ? (
            <>
              Analyze <Check className="w-4 h-4" />
            </>
          ) : (
            <>
              Next <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
