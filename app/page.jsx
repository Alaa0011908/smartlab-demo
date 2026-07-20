// app/page.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaUser, 
  FaEnvelope, 
  FaPhone,
  FaChartPie
} from 'react-icons/fa';

const COLORS = {
  background: '#0A0A0A',
  brand: '#17919e',
  brandSecondary: '#e1682e',
  success: '#22C55E',
  error: '#EF4444',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  cardBg: '#1A1A1A',
  border: '#2A2A2A',
};

const QUESTIONS = [
  {
    id: 1,
    question: 'جهازين بنفس الشبكة. PC1 IP: 192.168.1.10/24 و PC2 IP: 192.168.2.10/24. هل بقدر يعملوا Ping لبعض مباشرة؟',
    options: ['نعم مباشرة', 'لا, لأنهم بشبكتين مختلفتين', 'نعم بس لازم سويتش', 'حسب الكيبل'],
    correct: 1,
    explanation: '🔥 /24 تعني شبكة 192.168.1.0 و /24 ثانية تعني شبكة 192.168.2.0'
  },
  {
    id: 2,
    question: 'العميل: "النت شغال بس المتصفح ما عم يفتح المواقع". أي Layer من الـ OSI فيه المشكلة الأكبر؟',
    options: ['Physical Layer', 'Data Link Layer', 'Application Layer', 'Network Layer'],
    correct: 2,
    explanation: '🔥 المشكلة بالمتصفح = Application Layer'
  },
  {
    id: 3,
    question: 'PC عم ياخد IP: 169.254.1.5. شو المشكلة؟',
    options: ['DHCP Server Down', 'Cable Problem', 'IP Conflict'],
    correct: 0,
    explanation: '🔥 169.254 = APIPA، الجهاز عطى حاله IP فاشل'
  }
];

// ===== شاشة الترحيب =====
function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="text-6xl mb-6"
      >
        <img src="/logo.png" alt="SmartLab Logo" className="h-32 w-auto" />
      </motion.div>
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: COLORS.text }}>
        <span style={{ color: COLORS.brand }}>اكتشف</span> مستواك الحقيقي 
        <br />
        <span style={{ color: COLORS.text }}>في الشبكات</span> 🔥
      </h1>
      
      <p className="text-base md:text-lg mb-2 max-w-2xl mx-auto" style={{ color: COLORS.textSecondary }}>
        منصة تعليمية متطورة تعتمد على الذكاء الاصطناعي لتقديم تجارب تعلم مخصصة
      </p>
      
      <p className="text-lg md:text-xl mb-2 mt-2" style={{ color: COLORS.textSecondary }}>
        90% من المهندسين بيوقعوا بهالأسئلة. انت منهم؟
      </p>
      
      <div className="flex items-center gap-2 mt-2 mb-8 px-4 py-2 rounded-full" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <FaChartPie style={{ color: COLORS.brand }} />
        <span style={{ color: COLORS.textSecondary }}>📊 1,238 مهندس اختبروا مهاراتهم</span>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-8 py-4 rounded-xl text-lg font-bold"
        style={{ backgroundColor: COLORS.brand, color: COLORS.text }}
      >
        ابدأ التقييم الذكي 🚀
      </motion.button>
      
      <div className="flex items-center gap-2 mt-6" style={{ color: COLORS.textSecondary }}>
        <FaClock />
        <span>⏱️ 60 ثانية فقط</span>
      </div>
    </motion.div>
  );
}

// ===== شاشة السؤال =====
function QuestionScreen({ question, currentIndex, total, onAnswer, timeLeft }) {
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowExplanation(false);
    setIsCorrect(false);
  }, [question]);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === question.correct;
    setIsCorrect(correct);
    setShowExplanation(true);
    setTimeout(() => onAnswer(correct), 2000);
  };

  const progress = ((currentIndex) / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-3xl mx-auto"
    >
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: COLORS.textSecondary }}>
          <span>السؤال {currentIndex + 1} من {total}</span>
          <span style={{ color: timeLeft < 10 ? COLORS.error : COLORS.textSecondary }}>{timeLeft}ث</span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.cardBg }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: COLORS.brand }} />
        </div>
      </div>

      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-right" style={{ color: COLORS.text }}>
          {question.question}
        </h2>
        
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            let bgColor = COLORS.cardBg;
            let borderColor = COLORS.border;
            let textColor = COLORS.text;
            
            if (selected !== null) {
              if (idx === question.correct) {
                bgColor = `${COLORS.success}20`;
                borderColor = COLORS.success;
                textColor = COLORS.success;
              } else if (selected === idx && idx !== question.correct) {
                bgColor = `${COLORS.error}20`;
                borderColor = COLORS.error;
                textColor = COLORS.error;
              }
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={selected !== null}
                className="w-full p-4 rounded-xl text-right transition-all duration-300 flex items-center gap-3"
                style={{
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: textColor,
                  opacity: selected !== null && selected !== idx && idx !== question.correct ? 0.5 : 1
                }}
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: `${COLORS.border}50` }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
                {selected !== null && idx === question.correct && (
                  <FaCheckCircle style={{ color: COLORS.success, marginRight: 'auto' }} />
                )}
                {selected === idx && idx !== question.correct && (
                  <FaTimesCircle style={{ color: COLORS.error, marginRight: 'auto' }} />
                )}
              </button>
            );
          })}
        </div>
        
        {showExplanation && (
          <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: `${COLORS.brand}15`, border: `1px solid ${COLORS.brand}` }}>
            <p style={{ color: isCorrect ? COLORS.success : COLORS.error }} className="font-medium">
              {isCorrect ? '✅ صحيح!' : '❌ خطأ'}
            </p>
            <p style={{ color: COLORS.textSecondary }} className="mt-1 text-sm">{question.explanation}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ===== شاشة النتيجة =====
function ResultScreen({ answers, onRestart, onContinue }) {
  const correctCount = answers.filter(Boolean).length;
  const percentage = Math.round((correctCount / answers.length) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-3xl mx-auto"
    >
      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: COLORS.text }}>نتيجتك ✅</h2>
        
        <div className="text-center mb-6">
          <span className="text-6xl font-bold" style={{ color: percentage >= 70 ? COLORS.success : percentage >= 50 ? COLORS.brandSecondary : COLORS.error }}>
            {percentage}%
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onContinue} className="flex-1 p-3 rounded-xl font-bold" style={{ backgroundColor: COLORS.brand, color: COLORS.text }}>
            📬 احصل على التقييم الكامل
          </button>
          <button onClick={onRestart} className="flex-1 p-3 rounded-xl font-bold" style={{ backgroundColor: COLORS.border, color: COLORS.text }}>
            🔄 إعادة
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ===== شاشة النموذج =====
function FormScreen({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', level: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('demoUser', JSON.stringify(formData));
      setSubmitted(true);
      setLoading(false);
      onSubmit(formData);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>تم استلام بياناتك!</h2>
        <p style={{ color: COLORS.textSecondary }}>سنرسل لك التقييم الكامل خلال 24 ساعة 🚀</p>
        <button onClick={onBack} className="mt-6 px-6 py-3 rounded-xl font-bold" style={{ backgroundColor: COLORS.brand, color: COLORS.text }}>
          ← العودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-2xl mx-auto">
      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.text }}>📬 احصل على التقييم الكامل</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="الاسم الكامل" required className="w-full p-3 rounded-xl" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <input type="email" placeholder="البريد الإلكتروني" required className="w-full p-3 rounded-xl" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input type="tel" placeholder="رقم الهاتف" className="w-full p-3 rounded-xl" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <select required className="w-full p-3 rounded-xl" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            value={formData.level} onChange={(e) => setFormData({...formData, level: e.target.value})}>
            <option value="">المستوى الوظيفي</option>
            <option value="طالب">طالب</option>
            <option value="مهندس مبتدئ">مهندس مبتدئ</option>
            <option value="مهندس شبكات">مهندس شبكات</option>
            <option value="موظف تقني">موظف تقني</option>
            <option value="آخر">آخر</option>
          </select>
          <textarea placeholder="ملاحظاتك عن المشروع (اختياري)" rows="3" className="w-full p-3 rounded-xl" style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
            value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
          <button type="submit" disabled={loading} className="w-full p-3 rounded-xl font-bold" style={{ backgroundColor: COLORS.brand, color: COLORS.text }}>
            {loading ? 'جاري الإرسال...' : '🚀 أرسل لي الخطة الكاملة'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ===== المكون الرئيسي =====
export default function Home() {
  const [step, setStep] = useState('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      setStep('result');
    }
    return () => clearTimeout(timerRef.current);
  }, [timerActive, timeLeft]);

  const handleStart = () => { setTimerActive(true); setStep('question'); };
  const handleAnswer = (correct) => {
    setAnswers([...answers, correct]);
    if (currentQuestion + 1 < QUESTIONS.length) setCurrentQuestion(currentQuestion + 1);
    else { setTimerActive(false); setStep('result'); }
  };
  const handleRestart = () => { setCurrentQuestion(0); setAnswers([]); setTimeLeft(60); setStep('welcome'); };
  const handleContinue = () => setStep('form');
  const handleFormSubmit = (data) => console.log('User Data:', data);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: COLORS.background }}>
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2"><img src="/logo.png" alt="SmartLab Logo" className="h-10 w-auto" /></div>
          {step !== 'welcome' && step !== 'form' && (
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>
              {step === 'result' ? '✅ النتيجة' : `سؤال ${currentQuestion + 1}/${QUESTIONS.length}`}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 'welcome' && <WelcomeScreen key="welcome" onStart={handleStart} />}
          {step === 'question' && <QuestionScreen key="question" question={QUESTIONS[currentQuestion]} currentIndex={currentQuestion} total={QUESTIONS.length} onAnswer={handleAnswer} timeLeft={timeLeft} />}
          {step === 'result' && <ResultScreen key="result" answers={answers} onRestart={handleRestart} onContinue={handleContinue} />}
          {step === 'form' && <FormScreen key="form" onSubmit={handleFormSubmit} onBack={handleRestart} />}
        </AnimatePresence>
      </div>
    </main>
  );
}
