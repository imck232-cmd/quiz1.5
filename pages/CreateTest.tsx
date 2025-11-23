import React, { useState } from 'react';
import { Sparkles, Save, Plus, Trash2, Loader2 } from 'lucide-react';
import { generateQuestionsWithAI } from '../services/geminiService';
import { Test, Question } from '../types';

interface CreateTestProps {
  onSave: (test: Omit<Test, 'id' | 'createdAt' | 'teacherId'>) => void;
}

export const CreateTest: React.FC<CreateTestProps> = ({ onSave }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [accessCode, setAccessCode] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);

  const handleGenerateAI = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const generatedQuestions = await generateQuestionsWithAI(topic, 5);
      setQuestions([...questions, ...generatedQuestions]);
    } catch (error) {
      alert("فشل في توليد الأسئلة، يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!title || !accessCode || questions.length === 0) {
      alert("يرجى إكمال جميع الحقول وإضافة سؤال واحد على الأقل.");
      return;
    }
    onSave({
      title,
      description,
      durationMinutes: duration,
      questions,
      accessCode,
      isActive: true
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إنشاء اختبار جديد</h1>
          <p className="text-gray-500">قم بإعداد تفاصيل الاختبار وإضافة الأسئلة يدوياً أو باستخدام الذكاء الاصطناعي.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          <Save size={18} />
          <span>حفظ ونشر</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2">إعدادات الاختبار</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الاختبار</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="مثال: اختبار الفيزياء النصفي"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="وصف مختصر..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">كود الدخول</label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="MATH101"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary-900 to-primary-700 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-400" />
              <h3 className="font-bold text-lg">المساعد الذكي (Gemini)</h3>
            </div>
            <p className="text-primary-100 text-sm mb-4">اكتب موضوعاً وسيقوم الذكاء الاصطناعي بتوليد أسئلة احترافية لك.</p>
            <div className="space-y-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-primary-200 focus:outline-none focus:bg-white/20"
                placeholder="مثال: تاريخ الدولة العباسية"
              />
              <button
                onClick={handleGenerateAI}
                disabled={loading || !topic}
                className="w-full py-2 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>توليد الأسئلة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800">الأسئلة ({questions.length})</h3>
              <button 
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                onClick={() => setQuestions([...questions, { id: Date.now().toString(), text: 'سؤال جديد', type: 'multiple_choice', choices: [{id: '1', text: 'خيار 1', isCorrect: true}, {id: '2', text: 'خيار 2', isCorrect: false}] }])}
              >
                <Plus size={16} />
                <span>إضافة يدوية</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <Sparkles size={48} className="mb-4 text-gray-300" />
                <p>ابدأ بإضافة أسئلة أو استخدم المولد الذكي</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">{idx + 1}</span>
                        <h4 className="font-medium text-gray-800">{q.text}</h4>
                      </div>
                      <button 
                        onClick={() => setQuestions(questions.filter(qi => qi.id !== q.id))}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mr-9 space-y-1">
                      {q.choices.map((c) => (
                        <div key={c.id} className={`flex items-center gap-2 text-sm ${c.isCorrect ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                          <div className={`w-2 h-2 rounded-full ${c.isCorrect ? 'bg-green-500' : 'bg-gray-300'}`} />
                          {c.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
