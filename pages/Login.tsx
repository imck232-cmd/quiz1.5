import React from 'react';
import { GraduationCap, BookUser } from 'lucide-react';

interface LoginProps {
  onLogin: (role: 'teacher' | 'student') => void;
}

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Right Side (Visual) */}
        <div className="md:w-1/2 bg-primary-700 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
          <div className="relative z-10 h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">رفيقك في الاختبارات التعليمية</h1>
            <p className="text-primary-100 text-lg leading-relaxed mb-8">
              منصتك المتكاملة لإدارة الاختبارات التعليمية وتقييم الطلاب باستخدام أحدث تقنيات الذكاء الاصطناعي.
            </p>
            
            <div className="border-t border-white/20 pt-6 space-y-4">
              <div>
                <p className="text-primary-200 text-sm">إعداد المستشار الإداري والتربوي</p>
                <p className="font-bold text-yellow-300 text-xl mt-1">إبراهيم دخان</p>
              </div>
              
              <a 
                href="https://wa.me/967780804012"
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
              >
                <WhatsAppIcon />
                <div className="flex flex-col items-start text-sm">
                  <span>للتواصل عبر الواتس</span>
                  <span dir="ltr" className="font-mono font-bold">967 780 804 012</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Left Side (Login) */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">تسجيل الدخول</h2>
          
          <div className="space-y-4">
            <button
              onClick={() => onLogin('teacher')}
              className="w-full group relative flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <GraduationCap size={24} />
              </div>
              <div className="mr-4 text-right">
                <h3 className="font-bold text-gray-800">حساب معلم</h3>
                <p className="text-xs text-gray-500">لإنشاء الاختبارات ومتابعة النتائج</p>
              </div>
            </button>

            <button
              onClick={() => onLogin('student')}
              className="w-full group relative flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                <BookUser size={24} />
              </div>
              <div className="mr-4 text-right">
                <h3 className="font-bold text-gray-800">حساب طالب</h3>
                <p className="text-xs text-gray-500">لتقديم الاختبارات ومراجعة الأداء</p>
              </div>
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mt-8">الإصدار 1.0.0</p>
        </div>
      </div>
    </div>
  );
};