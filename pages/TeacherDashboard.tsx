import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { Test } from '../types';

interface TeacherDashboardProps {
  tests: Test[];
}

const data = [
  { name: 'الرياضيات', score: 85 },
  { name: 'العلوم', score: 72 },
  { name: 'اللغة العربية', score: 90 },
  { name: 'التاريخ', score: 65 },
  { name: 'الإنجليزية', score: 78 },
];

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ tests }) => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">لوحة التحكم</h1>
        <p className="text-gray-500">أهلاً بك، إليك ملخص أداء الطلاب والاختبارات.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="إجمالي الطلاب" 
          value="1,240" 
          icon={<Users size={20} />} 
          trend="+12% مقارنة بالشهر الماضي"
          trendUp={true}
        />
        <StatsCard 
          title="الاختبارات النشطة" 
          value={tests.filter(t => t.isActive).length} 
          icon={<FileText size={20} />} 
        />
        <StatsCard 
          title="معدل النجاح" 
          value="78%" 
          icon={<CheckCircle size={20} />} 
          trend="+5% تحسن"
          trendUp={true}
        />
        <StatsCard 
          title="متوسط الوقت" 
          value="24 دقيقة" 
          icon={<Clock size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">متوسط الدرجات حسب المادة</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tests List */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-lg font-bold text-gray-800 mb-4">أحدث الاختبارات</h3>
          <div className="space-y-4">
            {tests.length === 0 ? (
              <p className="text-gray-400 text-sm">لا توجد اختبارات حتى الآن.</p>
            ) : (
              tests.map((test) => (
                <div key={test.id} className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-semibold text-gray-800">{test.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${test.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {test.isActive ? 'نشط' : 'مغلق'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{test.questions.length} أسئلة • {test.durationMinutes} دقيقة</p>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">الكود: <span className="font-mono bg-white px-1 border rounded">{test.accessCode}</span></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
