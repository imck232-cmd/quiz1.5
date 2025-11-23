import React, { useState, useRef } from 'react';
import { Sparkles, Save, Plus, Trash2, Loader2, Edit2, Upload, FileText, X } from 'lucide-react';
import { generateQuestionsWithAI } from '../services/geminiService';
import { Test, Question, Subject, GradeLevel, QuestionType } from '../types';
import { SUBJECTS, GRADES, QUESTION_TYPES } from '../services/mockData';

interface CreateTestProps {
  onSave: (test: Omit<Test, 'id' | 'createdAt' | 'teacherId'>) => void;
}

export const CreateTest: React.FC<CreateTestProps> = ({ onSave }) => {
  const [loading, setLoading] = useState(false);
  
  // Basic Info
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>(SUBJECTS[0]);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(GRADES[0]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(30);
  const [accessCode, setAccessCode] = useState('');

  // AI & Content
  const [sourceContent, setSourceContent] = useState('');
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>(['اختيار من متعدد']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Questions State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});

  // Handle File Upload (Text files mainly for browser stability)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          setSourceContent(prev => prev + "\n" + text);
        }
      };
      reader.readAsText(file);
    } else {
      // For PDF/Word, since we can't use heavy libs in browser easily without instability,
      // we show a helpful message.
      alert("عذراً، لتحليل ملفات PDF أو Word يرجى نسخ النص ولصقه في المربع أدناه لضمان الدقة والاستقرار.");
    }
  };

  const handleTypeToggle = (type: QuestionType) => {
    if (selectedQuestionTypes.includes(type)) {
      setSelectedQuestionTypes(prev => prev.filter(t => t !== type));
    } else {
      setSelectedQuestionTypes(prev => [...prev, type]);
    }
  };

  const handleGenerateAI = async () => {
    if (!sourceContent) {
      alert("يرجى إدخال نص أو محتوى لتحليله أولاً.");
      return;
    }
    if (selectedQuestionTypes.length === 0) {
      alert("يرجى اختيار نوع واحد من الأسئلة على الأقل.");
      return;
    }

    setLoading(true);
    try {
      const generatedQuestions = await generateQuestionsWithAI(sourceContent, 5, selectedQuestionTypes);
      setQuestions([...questions, ...generatedQuestions]);
    } catch (error: any) {
      alert(error.message || "فشل في توليد الأسئلة، يرجى المحاولة لاحقاً.");
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
      subject,
      gradeLevel,
      durationMinutes: duration,
      questions,
      accessCode,
      isActive: true,
      sourceContent
    });
  };

  // Manual Editing Logic
  const startEditing = (q: Question) => {
    setEditingQuestionId(q.id);
    setEditForm({ ...q });
  };

  const saveEditing = () => {
    if (!editForm.text) return;
    setQuestions(questions.map(q => q.id === editingQuestionId ? { ...q, ...editForm } as Question : q));
    setEditingQuestionId(null);
    setEditForm({});
  };

  const cancelEditing = () => {
    setEditingQuestionId(null);
    setEditForm({});
  };

  const updateChoice = (idx: number, field: 'text' | 'isCorrect', value: any) => {
    if (!editForm.choices) return;
    const newChoices = [...editForm.choices];
    newChoices[idx] = { ...newChoices[idx], [field]: value };
    // If setting correct, unset others for single choice logic (optional, but good UX)
    if (field === 'isCorrect' && value === true && (editForm.type === 'اختيار من متعدد' || editForm.type === 'صح / خطأ')) {
       newChoices.forEach((c, i) => { if (i !== idx) c.isCorrect = false; });
    }
    setEditForm({ ...editForm, choices: newChoices });
  };

  const addManualQuestion = () => {
    const newQ: Question = {
      id: Date.now().toString(),
      text: 'سؤال جديد',
      type: 'اختيار من متعدد',
      choices: [
        { id: '1', text: 'خيار 1', isCorrect: true },
        { id: '2', text: 'خيار 2', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQ]);
    startEditing(newQ); // Auto start editing
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إنشاء اختبار جديد</h1>
          <p className="text-gray-500">قم بإعداد تفاصيل الاختبار، تحليل المحتوى، وتوليد الأسئلة.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm font-bold"
        >
          <Save size={18} />
          <span>حفظ ونشر الاختبار</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* RIGHT COLUMN: Settings & Content Analysis (Width: 4/12) */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 1. Basic Settings */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <FileText size={18} className="text-primary-600"/>
              بيانات الاختبار
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان الاختبار</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="مثال: اختبار الوحدة الأولى"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المادة</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الصف</label>
                  <select 
                    value={gradeLevel} 
                    onChange={(e) => setGradeLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المدة (دقيقة)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">كود الدخول</label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dir-ltr text-right"
                    placeholder="CODE123"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف (اختياري)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* 2. Content Analysis & AI */}
          <div className="bg-gradient-to-br from-primary-900 to-primary-800 p-6 rounded-xl shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-400" />
              <h3 className="font-bold text-lg">التحليل الذكي للمحتوى</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-primary-200 mb-2">
                  أدخل النص هنا أو انسخ المحتوى من ملفاتك (PDF/Word) والصقه للتحليل:
                </label>
                <textarea
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-primary-300 focus:outline-none focus:bg-white/20 text-sm"
                  rows={6}
                  placeholder="الصق نص الدرس، المقالة، أو محتوى الكتاب هنا..."
                />
              </div>

              <div className="flex gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt"
                  onChange={handleFileUpload} 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  <span>رفع ملف نصي</span>
                </button>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs font-bold text-primary-200 mb-2">اختر أنواع الأسئلة المطلوبة:</p>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {QUESTION_TYPES.map(type => (
                    <label key={type} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-white/5 p-1 rounded">
                      <input 
                        type="checkbox" 
                        checked={selectedQuestionTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="truncate">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateAI}
                disabled={loading || !sourceContent}
                className="w-full py-3 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-md mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span>تحليل وتوليد الأسئلة</span>
              </button>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN: Questions List (Width: 8/12) */}
        <div className="xl:col-span-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">الأسئلة ({questions.length})</h3>
              <button 
                className="bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                onClick={addManualQuestion}
              >
                <Plus size={18} />
                <span>إضافة سؤال يدوياً</span>
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <p className="text-lg font-medium">قائمة الأسئلة فارغة</p>
                <p className="text-sm mt-2">استخدم المحلل الذكي أو أضف أسئلة يدوياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className={`p-5 border rounded-xl transition-all ${editingQuestionId === q.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50/30' : 'border-gray-200 hover:border-primary-300 hover:shadow-sm'}`}>
                    
                    {/* EDIT MODE */}
                    {editingQuestionId === q.id ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded">تعديل السؤال {idx + 1}</span>
                        </div>
                        
                        <input
                          type="text"
                          value={editForm.text}
                          onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 font-bold"
                          placeholder="نص السؤال"
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">نوع السؤال</label>
                            <select
                              value={editForm.type}
                              onChange={(e) => setEditForm({...editForm, type: e.target.value as QuestionType})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                              {QUESTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div>
                             <label className="text-xs font-bold text-gray-500 block mb-1">شرح الإجابة</label>
                             <input
                              type="text"
                              value={editForm.explanation || ''}
                              onChange={(e) => setEditForm({...editForm, explanation: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              placeholder="توضيح لماذا هذه الإجابة صحيحة"
                            />
                          </div>
                        </div>

                        <div className="space-y-2 mt-2">
                          <p className="text-xs font-bold text-gray-500">الخيارات</p>
                          {editForm.choices?.map((choice, cIdx) => (
                            <div key={cIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={choice.isCorrect}
                                onChange={(e) => updateChoice(cIdx, 'isCorrect', e.target.checked)}
                                className="w-4 h-4 text-primary-600 cursor-pointer"
                              />
                              <input
                                type="text"
                                value={choice.text}
                                onChange={(e) => updateChoice(cIdx, 'text', e.target.value)}
                                className={`flex-1 px-3 py-2 border rounded-lg text-sm ${choice.isCorrect ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                              />
                              <button 
                                onClick={() => {
                                  const newChoices = editForm.choices?.filter((_, i) => i !== cIdx);
                                  setEditForm({...editForm, choices: newChoices});
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button 
                            onClick={() => setEditForm({...editForm, choices: [...(editForm.choices || []), {id: Date.now().toString(), text: '', isCorrect: false}]})}
                            className="text-xs text-primary-600 font-bold flex items-center gap-1 mt-1 hover:underline"
                          >
                            <Plus size={14} /> إضافة خيار
                          </button>
                        </div>

                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-200">
                          <button onClick={cancelEditing} className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">إلغاء</button>
                          <button onClick={saveEditing} className="px-6 py-2 bg-primary-600 text-white text-sm font-bold rounded-lg hover:bg-primary-700">حفظ التعديلات</button>
                        </div>
                      </div>
                    ) : (
                      /* VIEW MODE */
                      <div className="group">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-3 items-start">
                            <span className="flex-shrink-0 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-700 mt-0.5">{idx + 1}</span>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">{q.type}</span>
                              </div>
                              <h4 className="font-bold text-gray-800 text-lg leading-snug">{q.text}</h4>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(q)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="تعديل">
                              <Edit2 size={18} />
                            </button>
                            <button onClick={() => setQuestions(questions.filter(qi => qi.id !== q.id))} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="حذف">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="pr-10 space-y-1.5">
                          {q.choices.map((c, i) => (
                            <div key={i} className={`flex items-center gap-2 text-sm ${c.isCorrect ? 'text-green-700 font-bold bg-green-50/50 p-1 rounded -mr-1 pr-1' : 'text-gray-600'}`}>
                              <div className={`w-2.5 h-2.5 rounded-full border ${c.isCorrect ? 'bg-green-500 border-green-600' : 'bg-transparent border-gray-300'}`} />
                              {c.text}
                            </div>
                          ))}
                          {q.explanation && (
                            <p className="text-xs text-gray-400 mt-2 pr-4 border-r-2 border-gray-200">شرح: {q.explanation}</p>
                          )}
                        </div>
                      </div>
                    )}
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