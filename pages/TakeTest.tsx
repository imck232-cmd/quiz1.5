import React, { useState, useEffect } from 'react';
import { Test, TestSession } from '../types';
import { Timer, CheckCircle, AlertCircle } from 'lucide-react';

interface TakeTestProps {
  test: Test;
  studentId: string;
  onSubmit: (session: TestSession) => void;
  onExit: () => void;
}

export const TakeTest: React.FC<TakeTestProps> = ({ test, studentId, onSubmit, onExit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(test.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleSelect = (choiceId: string) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [test.questions[currentQIndex].id]: choiceId });
  };

  const handleSubmit = () => {
    let calculatedScore = 0;
    test.questions.forEach(q => {
      const selectedId = answers[q.id];
      // For now, simple matching of choice ID. 
      // More complex types (essay, matching) would need robust grading logic in a backend.
      const correctChoice = q.choices.find(c => c.isCorrect);
      if (correctChoice && correctChoice.id === selectedId) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);
    setIsSubmitted(true);
  };

  const finishSession = () => {
    const session: TestSession = {
      id: `sess-${Date.now()}`,
      studentId,
      testId: test.id,
      answers,
      score,
      totalQuestions: test.questions.length,
      completedAt: new Date().toISOString()
    };
    onSubmit(session);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = ((currentQIndex + 1) / test.questions.length) * 100;

  if (isSubmitted) {
    const percentage = Math.round((score / test.questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg text-center mt-10">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">تم تسليم الاختبار!</h2>
        <p className="text-gray-500 mb-8">شكراً لك، تم تسجيل إجاباتك بنجاح.</p>
        
        <div className="bg-gray-50 p-6 rounded-xl mb-8">
          <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">النتيجة النهائية</p>
          <div className="text-5xl font-extrabold text-primary-600 mb-2">{percentage}%</div>
          <p className="text-gray-600">أجبت بشكل صحيح على {score} من أصل {test.questions.length} سؤال</p>
        </div>

        <button 
          onClick={finishSession}
          className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors w-full font-bold"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex justify-between items-center sticky top-0 z-10">
        <div>
          <h2 className="font-bold text-gray-800">{test.title}</h2>
          <div className="flex gap-2 text-xs text-gray-500 mt-1">
             <span className="bg-gray-100 px-2 py-0.5 rounded">{test.subject}</span>
             <span>•</span>
             <span>سؤال {currentQIndex + 1} من {test.questions.length}</span>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-blue-50 text-blue-700'}`}>
          <Timer size={20} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
        <div className="bg-primary-500 h-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded">{currentQuestion.type}</span>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3 flex-1">
          {currentQuestion.choices.length > 0 ? (
            currentQuestion.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleSelect(choice.id)}
                className={`w-full text-right p-4 rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion.id] === choice.id
                    ? 'border-primary-500 bg-primary-50 text-primary-800'
                    : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answers[currentQuestion.id] === choice.id ? 'border-primary-500' : 'border-gray-300'
                  }`}>
                    {answers[currentQuestion.id] === choice.id && <div className="w-3 h-3 bg-primary-500 rounded-full" />}
                  </div>
                  {choice.text}
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
               <AlertCircle className="mx-auto mb-2 opacity-50" />
               <p>هذا النوع من الأسئلة ({currentQuestion.type}) يتطلب إجابة نصية أو تفاعلية لم يتم تفعيلها في هذا الإصدار التجريبي.</p>
               <p className="text-xs mt-2">يرجى اختيار الإجابة الافتراضية للمتابعة.</p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
            disabled={currentQIndex === 0}
            className="text-gray-500 px-6 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            السابق
          </button>
          
          {currentQIndex === test.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-md shadow-green-200"
            >
              تسليم الاختبار
            </button>
          ) : (
            <button
              onClick={() => setCurrentQIndex(Math.min(test.questions.length - 1, currentQIndex + 1))}
              className="bg-primary-600 text-white px-8 py-2 rounded-lg hover:bg-primary-700 transition-colors font-bold shadow-md shadow-blue-200"
            >
              التالي
            </button>
          )}
        </div>
      </div>
    </div>
  );
};