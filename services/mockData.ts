import { Test, User, Subject, GradeLevel, QuestionType } from "../types";

export const SUBJECTS: Subject[] = [
  'القرآن الكريم', 'التربية الإسلامية', 'اللغة العربية', 'اللغة الإنجليزية',
  'الرياضيات', 'العلوم', 'الكيمياء', 'الفيزياء', 'الأحياء',
  'الاجتماعيات', 'الحاسوب', 'المكتبة', 'الفنية', 'المختص الاجتماعي', 'الأنشطة'
];

export const GRADES: GradeLevel[] = [
  'التمهيدي', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس',
  'السادس', 'السابع', 'الثامن', 'التاسع',
  'الأول الثانوي', 'الثاني الثانوي', 'الثالث الثانوي'
];

export const QUESTION_TYPES: QuestionType[] = [
  'صح / خطأ',
  'اختيار من متعدد',
  'ملء الفراغ',
  'المقابلة (المزاوجة)',
  'الترتيب',
  'المقالية',
  'الإيجاز (قصيرة)',
  'تصنيف المجموعات',
  'اختبار الأداء',
  'أسئلة الرسم البياني',
  'حل المشكلات',
  'أسئلة التكميل',
  'الأسئلة التشخيصية',
  'الأسئلة الاستنباطية',
  'الأسئلة التطبيقية',
  'أسئلة التحليل',
  'أسئلة التركيب',
  'أسئلة التقويم',
  'أسئلة الصح والخطأ المعدلة',
  'أسئلة الاختيار من متعدد المتعددة الإجابات'
];

export const MOCK_TEACHER: User = {
  id: "t-1",
  name: "أ. إبراهيم دخان",
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
    subject: "الرياضيات",
    gradeLevel: "التاسع",
    durationMinutes: 15,
    teacherId: "t-1",
    isActive: true,
    createdAt: new Date().toISOString(),
    accessCode: "MATH101",
    questions: [
      {
        id: "q1",
        text: "ما هي قيمة س في المعادلة: 2س + 4 = 10؟",
        type: "اختيار من متعدد",
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
        text: "العدد 7 هو عدد أولي.",
        type: "صح / خطأ",
        choices: [
          { id: "true", text: "صح", isCorrect: true },
          { id: "false", text: "خطأ", isCorrect: false }
        ],
        explanation: "العدد 7 لا يقبل القسمة إلا على نفسه وعلى الواحد."
      }
    ]
  }
];