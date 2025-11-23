import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { CreateTest } from './pages/CreateTest';
import { StudentDashboard } from './pages/StudentDashboard';
import { TakeTest } from './pages/TakeTest';
import { Login } from './pages/Login';
import { User, Test, TestSession } from './types';
import { MOCK_TEACHER, MOCK_STUDENT, INITIAL_TESTS } from './services/mockData';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState('login');
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  // Persistence simulation for tests
  useEffect(() => {
    const savedTests = localStorage.getItem('aqees_tests');
    if (savedTests) {
      setTests(JSON.parse(savedTests));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aqees_tests', JSON.stringify(tests));
  }, [tests]);

  const handleLogin = (role: 'teacher' | 'student') => {
    const userData = role === 'teacher' ? MOCK_TEACHER : MOCK_STUDENT;
    setUser(userData);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setActiveTestId(null);
  };

  const handleCreateTest = (newTest: Omit<Test, 'id' | 'createdAt' | 'teacherId'>) => {
    const test: Test = {
      ...newTest,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      teacherId: user?.id || 'unknown'
    };
    setTests([test, ...tests]);
    setView('dashboard');
  };

  const handleStartTest = (testId: string) => {
    setActiveTestId(testId);
    setView('take-test');
  };

  const handleSubmitTest = (session: TestSession) => {
    // In a real app, send to backend. Here just log and return to dashboard.
    console.log("Session Completed:", session);
    setActiveTestId(null);
    setView('dashboard');
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  // Full screen test view without standard layout
  if (view === 'take-test' && activeTestId && user?.role === 'student') {
    const test = tests.find(t => t.id === activeTestId);
    if (test) {
      return (
        <div className="min-h-screen bg-gray-50 p-6">
          <TakeTest 
            test={test} 
            studentId={user.id} 
            onSubmit={handleSubmitTest}
            onExit={() => setView('dashboard')}
          />
        </div>
      );
    }
  }

  return (
    <Layout 
      user={user} 
      currentView={view} 
      onNavigate={setView} 
      onLogout={handleLogout}
    >
      {view === 'dashboard' && user?.role === 'teacher' && (
        <TeacherDashboard tests={tests} />
      )}
      {view === 'create-test' && user?.role === 'teacher' && (
        <CreateTest onSave={handleCreateTest} />
      )}
      {view === 'dashboard' && user?.role === 'student' && (
        <StudentDashboard tests={tests} onStartTest={handleStartTest} />
      )}
    </Layout>
  );
}

export default App;
