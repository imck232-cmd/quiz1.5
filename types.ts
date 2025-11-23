export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
}

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
}

// القائمة المحدثة لأنواع الأسئلة (20 نوع)
export type QuestionType = 
  | 'صح / خطأ'
  | 'اختيار من متعدد'
  | 'ملء الفراغ'
  | 'المقابلة (المزاوجة)'
  | 'الترتيب'
  | 'المقالية'
  | 'الإيجاز (قصيرة)'
  | 'تصنيف المجموعات'
  | 'اختبار الأداء'
  | 'أسئلة الرسم البياني'
  | 'حل المشكلات'
  | 'أسئلة التكميل'
  | 'الأسئلة التشخيصية'
  | 'الأسئلة الاستنباطية'
  | 'الأسئلة التطبيقية'
  | 'أسئلة التحليل'
  | 'أسئلة التركيب'
  | 'أسئلة التقويم'
  | 'أسئلة الصح والخطأ المعدلة'
  | 'أسئلة الاختيار من متعدد المتعددة الإجابات';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  choices: Choice[];
  explanation?: string;
  // حقول إضافية قد نحتاجها لبعض الأنواع، لكن سنبقيها اختيارية للحفاظ على الاستقرار
  matchPairs?: { left: string; right: string }[]; 
  correctAnswerText?: string; 
}

export type Subject = 
  | 'القرآن الكريم' | 'التربية الإسلامية' | 'اللغة العربية' | 'اللغة الإنجليزية'
  | 'الرياضيات' | 'العلوم' | 'الكيمياء' | 'الفيزياء' | 'الأحياء'
  | 'الاجتماعيات' | 'الحاسوب' | 'المكتبة' | 'الفنية' | 'المختص الاجتماعي' | 'الأنشطة' | string;

export type GradeLevel = 
  | 'التمهيدي' | 'الأول' | 'الثاني' | 'الثالث' | 'الرابع' | 'الخامس'
  | 'السادس' | 'السابع' | 'الثامن' | 'التاسع'
  | 'الأول الثانوي' | 'الثاني الثانوي' | 'الثالث الثانوي' | string;

export interface Test {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  gradeLevel: GradeLevel;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
  isActive: boolean;
  teacherId: string;
  accessCode: string;
  sourceContent?: string; // المحتوى الذي تم التحليل منه
}

export interface TestSession {
  id: string;
  studentId: string;
  testId: string;
  answers: Record<string, string>; // questionId -> choiceId or text answer
  score: number;
  totalQuestions: number;
  completedAt: string;
}