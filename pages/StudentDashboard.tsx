import React, { useState } from 'react';
import { PlayCircle, Clock, Search } from 'lucide-react';
import { Test } from '../types';

interface StudentDashboardProps {
  tests: Test[];
  onStartTest: (testId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ tests, onStartTest }) => {
  const [code, setCode] = useState('');

  const availableTests = tests.filter(t => t.isActive);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-primary-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-4">مرحباً بك في رفيقك</h1>
          <p className="text-primary-100 mb-8 max-w-xl">أدخل كود الاختبار الذي قدمه لك المعلم للبدء فوراً.</p>
          
          <div className="flex max-w-md bg-white rounded-lg p-1 shadow-lg">
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="أدخل كود الاختبار (مثال: MATH101)" 
              className="flex-1 px-4 py-2 text-gray-800 outline-none rounded-md placeholder-gray-400"
            />
            <button 
              onClick={() => {
                const found = availableTests.find(t => t.accessCode === code);
                if (found) onStartTest(found.id);
                else alert("كود غير صحيح أو الاختبار غير متاح");
              }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              ابدأ
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search size={20} className="text-primary-600" />
          <span>الاختبارات المتاحة</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableTests.map((test) => (
            <div key={test.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">{test.title}</h3>
                <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded border border-blue-100">{test.questions.length} أسئلة</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{test.description}</p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <Clock size={16} />
                  <span>{test.durationMinutes} دقيقة</span>
                </div>
                <button 
                  onClick={() => onStartTest(test.id)}
                  className="flex items-center gap-2 text-primary-600 font-bold text-sm hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <span>بدء الاختبار</span>
                  <PlayCircle size={16} />
                </button>
              </div>
            </div>
          ))}
          {availableTests.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-8 bg-gray-50 rounded-lg">لا توجد اختبارات متاحة حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};