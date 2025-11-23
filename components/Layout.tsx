import React from 'react';
import { LayoutDashboard, PlusCircle, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, currentView, onLogout }) => {
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-l border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            ر
          </div>
          <span className="text-lg font-bold text-gray-800">رفيقك في الاختبارات</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {user.role === 'teacher' ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard size={20} />
                <span>لوحة التحكم</span>
              </button>
              <button
                onClick={() => onNavigate('create-test')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'create-test' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <PlusCircle size={20} />
                <span>إنشاء اختبار جديد</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={20} />
              <span>الاختبارات المتاحة</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <UserIcon size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role === 'teacher' ? 'معلم' : 'طالب'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};