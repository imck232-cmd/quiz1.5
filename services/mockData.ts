import { Test, User } from "../types";

export const MOCK_TEACHER: User = {
  id: "t-1",
  name: "أ. أحمد محمد",
  email: "teacher@aqees.com",
  role: "teacher",
  schoolId: "s-1"
};

export const MOCK_STUDENT: User = {
  id: "s-1",
  name: "سالم علي",
  email: "student@aqees.com",
  role: "student",
  schoolId: "s-1"
};

export const INITIAL_TESTS: Test[] = [
  {
    id: "test-1",
    title: "اختبار الرياضيات: الجبر",
    description: "اختبار قصير يغطي المعادلات الخطية والتربيعية.",
    durationMinutes: 15,
    teacherId: "t-1",
    isActive: true,
    createdAt: new Date().toISOString(),
    accessCode: "MATH101",
    questions: [
      {
        id: "q1",
        text: "ما هي قيمة س في المعادلة: 2س + 4 = 10؟",
        type: "multiple_choice",
        choices: [
          { id: "c1", text: "2", isCorrect: false },
          { id: "c2", text: "3", isCorrect: true },
          { id: "c3", text: "4", isCorrect: false },
          { id: "c4", text: "5", isCorrect: false },
        ],
        explanation: "نطرح 4 من الطرفين فتصبح 2س = 6، ثم نقسم على 2 فتصبح س = 3."
      },
      {
        id: "q2",
        text: "أي مما يلي يعتبر عدداً أولياً؟",
        type: "multiple_choice",
        choices: [
          { id: "c1", text: "4", isCorrect: false },
          { id: "c2", text: "9", isCorrect: false },
          { id: "c3", text: "7", isCorrect: true },
          { id: "c4", text: "15", isCorrect: false },
        ],
        explanation: "العدد 7 لا يقبل القسمة إلا على نفسه وعلى الواحد."
      }
    ]
  }
];
