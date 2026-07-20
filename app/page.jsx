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
  FaChartPie,
  FaNetworkWired,
  FaShieldAlt,
  FaWifi,
  FaServer
} from 'react-icons/fa';

// ============================================================
// 1. هوية المشروع - الألوان والثوابت
// ============================================================
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
    title: 'Subnetting',
    icon: <FaNetworkWired />,
    question: 'جهازين بنفس الشبكة. PC1 IP: 192.168.1.10/24 و PC2 IP: 192.168.2.10/24. هل بقدر يعملوا Ping لبعض مباشرة؟',
    options: [
      'نعم مباشرة',
      'لا, لأنهم بشبكتين مختلفتين',
      'نعم بس لازم سويتش',
      'حسب الكيبل'
    ],
    correct: 1,
    explanation: '🔥 الثغرة: Subnetting. /24 تعني شبكة 192.168.1.0 و /24 ثانية تعني شبكة 192.168.2.0، فما بيقدرو يتواصلو مباشرة.'
  },
  {
    id: 2,
    title: 'OSI Layer',
    icon: <FaShieldAlt />,
    question: 'العميل: "النت شغال بس المتصفح ما عم يفتح المواقع". أي Layer من الـ OSI فيه المشكلة الأكبر احتمال؟',
    options: [
      'Physical Layer',
      'Data Link Layer',
      'Application Layer',
      'Network Layer'
    ],
    correct: 2,
    explanation: '🔥 الثغرة: OSI Troubleshooting. المشكلة بالمتصفح أو DNS تعني طبقة التطبيق (Application Layer) مش مشكلة كيبل أو راوتر.'
  },
  {
    id: 3,
    title: 'DHCP & APIPA',
    icon: <FaServer />,
    question: 'PC عم ياخد IP: 169.254.1.5. شو المشكلة؟',
    options: [
      'DHCP Server Down',
      'Cable Problem',
      'IP Conflict'
    ],
    correct: 0,
    explanation: '🔥 الثغرة: APIPA. 169.254.1.5 هو عنوان APIPA، الجهاز بعطيه لحاله لما ما في DHCP Server.'
  },
  {
    id: 4,
    title: 'IPv4 Classes',
    icon: <FaNetworkWired />,
    question: 'أي من العناوين التالية هو عنوان عام (Public)؟',
    options: [
      '10.0.0.1',
      '172.16.0.1',
      '192.168.1.1',
      '8.8.8.8'
    ],
    correct: 3,
    explanation: '🔥 الثغرة: IPv4 Addressing. 8.8.8.8 هو DNS عام، الباقي عناوين خاصة.'
  },
  {
    id: 5,
    title: 'Broadcast Domain',
    icon: <FaWifi />,
    question: 'في شبكة سويتش واحدة (بدون راوتر)، إذا أرسل جهاز Broadcast، إلى أين تصل؟',
    options: [
      'فقط للراوتر',
      'لجميع الأجهزة بنفس الشبكة المحلية',
      'لجهاز واحد فقط',
      'للإنترنت كله'
    ],
    correct: 1,
    explanation: '🔥 الثغرة: Broadcast Domain. السويتش يبعث Broadcast لكل الأجهزة بنفس الـ VLAN.'
  },
  {
    id: 6,
    title: 'TCP vs UDP',
    icon: <FaServer />,
    question: 'أي بروتوكول مناسب للبث المباشر (Live Streaming)؟',
    options: [
      'TCP',
      'UDP',
      'HTTP',
      'FTP'
    ],
    correct: 1,
    explanation: '🔥 الثغرة: Transport Layer. UDP أسرع وما ينتظر تأكيد وصول، مثالي للبث المباشر.'
  },
  {
    id: 7,
    title: 'Gateway',
    icon: <FaNetworkWired />,
    question: 'جهاز IP: 192.168.1.100/24. شو لازم يكون الـ Default Gateway؟',
    options: [
      '192.168.1.0',
      '192.168.1.1',
      '192.168.1.255',
      '8.8.8.8'
    ],
    correct: 1,
    explanation: '🔥 الثغرة: Gateway. أول عنوان صالح في الشبكة (غالباً 192.168.1.1) هو الـ Gateway.'
  },
  {
    id: 8,
    title: 'VLAN',
    icon: <FaShieldAlt />,
    question: 'الـ VLAN تستخدم لـ:',
    options: [
      'زيادة سرعة الإنترنت',
      'تقسيم شبكة LAN واحدة إلى شبكات منطقية منفصلة',
      'حماية الشبكة من الفيروسات',
      'توصيل الأجهزة لاسلكياً'
    ],
    correct: 1,
    explanation: '🔥 الثغرة: VLAN. تقسم الشبكة لعزل الحركة وتحسين الأمان والأداء.'
  }
];

// ============================================================
// 2. مكون الخلفية المتحركة الذكية
// ============================================================
function SmartBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-[10%] left-[8%] w-1.5 h-1.5 rounded-full animate-float" style={{ backgroundColor: COLORS.brand, animationDelay: '0s' }} />
      <div className="absolute top-[20%] right-[15%] w-2 h-2 rounded-full animate-float" style={{ backgroundColor: COLORS.brandSecondary, animationDelay: '1.5s' }} />
      <div className="absolute bottom-[30%] left-[12%] w-1 h-1 rounded-full animate-float" style={{ backgroundColor: COLORS.textSecondary, animationDelay: '3s' }} />
      <div className="absolute top-[60%] right-[8%] w-1.5 h-1.5 rounded-full animate-float" style={{ backgroundColor: COLORS.brand, animationDelay: '0.8s' }} />
      <div className="absolute bottom-[15%] right-[25%] w-2.5 h-2.5 rounded-full animate-float" style={{ backgroundColor: COLORS.brandSecondary, animationDelay: '2.2s' }} />
      <div className="absolute top-[40%] left-[20%] w-1 h-1 rounded-full animate-float" style={{ backgroundColor: COLORS.textSecondary, animationDelay: '4s' }} />
      <div className="absolute bottom-[50%] right-[30%] w-1.5 h-1.5 rounded-full animate-float" style={{ backgroundColor: COLORS.brand, animationDelay: '1.2s' }} />
      <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full animate-float" style={{ backgroundColor: COLORS.brandSecondary, animationDelay: '2.8s' }} />
      
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// ============================================================
// 3. شاشة الترحيب (معدلة - min-h-[50vh])
// ============================================================
function WelcomeScreen({ onStart }) {
  const [userCount, setUserCount] = useState(1234);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[50vh] py-12 text-center px-4 relative z-10"
    >
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-custom"
        style={{ 
          background: `radial-gradient(circle, ${COLORS.brand}40 0%, transparent 70%)`,
        }} 
      />

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative z-10 mb-8"
      >
        <div className="relative">
          <div 
            className="absolute inset-0 rounded-full blur-2xl" 
            style={{ 
              background: `radial-gradient(circle, ${COLORS.brand}80 0%, transparent 70%)`,
              transform: 'scale(1.4)'
            }} 
          />
          <img 
            src="/logo.png" 
            alt="SmartLab Logo" 
            className="h-32 md:h-40 w-auto relative z-10 drop-shadow-[0_0_40px_rgba(23,145,158,0.3)]"
          />
        </div>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold mb-4 relative z-10"
        style={{ color: COLORS.text }}
      >
        تشريح أساسيات الشبكات 
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="inline-block ml-2 text-5xl md:text-7xl"
        >
          🔥
        </motion.span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-lg md:text-xl mb-6 relative z-10"
        style={{ color: COLORS.textSecondary }}
      >
        90% من المهندسين بيوقعوا بهالأسئلة. انت منهم؟
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex items-center gap-3 mb-10 px-6 py-3 rounded-full relative z-10"
        style={{ 
          backgroundColor: `${COLORS.cardBg}80`, 
          border: `1px solid ${COLORS.border}`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <FaChartPie style={{ color: COLORS.brand }} />
        <span style={{ color: COLORS.textSecondary }}>
          <motion.span
            key={userCount}
            initial={{ scale: 1.3, color: COLORS.brand }}
            animate={{ scale: 1, color: COLORS.textSecondary }}
            transition={{ duration: 0.3 }}
            className="inline-block font-bold min-w-[50px]"
            style={{ color: COLORS.brand }}
          >
            📊 {userCount.toLocaleString()}
          </motion.span>
          <span className="mr-1">مهندس اختبروا مهاراتهم</span>
        </span>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={{
          boxShadow: [
            `0 0 20px ${COLORS.brand}40`,
            `0 0 40px ${COLORS.brand}60`,
            `0 0 20px ${COLORS.brand}40`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        onClick={onStart}
        className="px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 relative z-10"
        style={{ 
          backgroundColor: COLORS.brand, 
          color: COLORS.text,
        }}
      >
        <span className="flex items-center gap-2">
          ابدأ التشريح 🚀
        </span>
      </motion.button>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center gap-2 mt-6 relative z-10"
        style={{ color: COLORS.textSecondary }}
      >
        <FaClock />
        <span>⏱️ 60 ثانية فقط</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 4. شاشة السؤال (معدلة - min-h-[50vh])
// ============================================================
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

    setTimeout(() => {
      onAnswer(correct);
    }, 2500);
  };

  const progress = ((currentIndex) / total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 w-full max-w-3xl mx-auto relative z-10"
    >
      <div className="w-full mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: COLORS.textSecondary }}>
          <span>السؤال {currentIndex + 1} من {total}</span>
          <span className="flex items-center gap-1">
            <FaClock style={{ color: timeLeft < 10 ? COLORS.error : COLORS.brand }} />
            <span style={{ color: timeLeft < 10 ? COLORS.error : COLORS.textSecondary }}>
              {timeLeft}ث
            </span>
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.cardBg }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full"
            style={{ backgroundColor: COLORS.brand }}
          />
        </div>
      </div>

      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl" style={{ color: COLORS.brand }}>{question.icon}</span>
          <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: `${COLORS.brand}20`, color: COLORS.brand }}>
            {question.title}
          </span>
        </div>
        
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
              <motion.button
                key={idx}
                whileHover={{ scale: selected === null ? 1.02 : 1 }}
                whileTap={{ scale: selected === null ? 0.98 : 1 }}
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
              </motion.button>
            );
          })}
        </div>
        
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl"
            style={{ 
              backgroundColor: isCorrect ? `${COLORS.success}15` : `${COLORS.error}15`,
              border: `1px solid ${isCorrect ? COLORS.success : COLORS.error}`
            }}
          >
            <p style={{ color: isCorrect ? COLORS.success : COLORS.error }} className="font-medium">
              {isCorrect ? '✅ إجابة صحيحة!' : '❌ إجابة خاطئة'}
            </p>
            <p style={{ color: COLORS.textSecondary }} className="mt-1 text-sm">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// 5. شاشة النتيجة (معدلة - min-h-[50vh])
// ============================================================
function ResultScreen({ score, answers, onRestart, onContinue }) {
  const correctCount = answers.filter(Boolean).length;
  const percentage = Math.round((correctCount / answers.length) * 100);
  
  let level = 'Beginner';
  let levelColor = COLORS.error;
  let levelEmoji = '🔴';
  if (percentage >= 67) { level = 'Advanced'; levelColor = COLORS.success; levelEmoji = '🟢'; }
  else if (percentage >= 34) { level = 'Intermediate'; levelColor = COLORS.brandSecondary; levelEmoji = '🟠'; }
  
  const weakTopics = [];
  if (!answers[0]) weakTopics.push('Subnetting & IP Addressing - ضعيف');
  if (!answers[1]) weakTopics.push('OSI Model Troubleshooting - متوسط');
  if (!answers[2]) weakTopics.push('DHCP & APIPA - ضعيف');
  if (!answers[3]) weakTopics.push('IPv4 Classes - ضعيف');
  if (!answers[4]) weakTopics.push('Broadcast Domain - متوسط');
  if (!answers[5]) weakTopics.push('TCP vs UDP - ضعيف');
  if (!answers[6]) weakTopics.push('Gateway - ضعيف');
  if (!answers[7]) weakTopics.push('VLAN - ضعيف');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 w-full max-w-3xl mx-auto relative z-10"
    >
      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <h2 className="text-3xl font-bold text-center mb-6" style={{ color: COLORS.text }}>
          نتيجة تشريح الأساسيات ✅
        </h2>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke={COLORS.border} strokeWidth="12" />
              <motion.circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={levelColor}
                strokeWidth="12"
                strokeLinecap="round"
                initial={{ strokeDasharray: 339, strokeDashoffset: 339 }}
                animate={{ strokeDashoffset: 339 - (339 * percentage) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color: COLORS.text }}>{percentage}%</span>
              <span className="text-sm" style={{ color: COLORS.textSecondary }}>{levelEmoji} {level}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mb-6">
          {answers.map((correct, idx) => (
            <div key={idx} className="flex flex-col items-center p-2 rounded-lg" style={{ backgroundColor: `${COLORS.border}30` }}>
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>س{idx+1}</span>
              {correct ? (
                <FaCheckCircle style={{ color: COLORS.success }} />
              ) : (
                <FaTimesCircle style={{ color: COLORS.error }} />
              )}
            </div>
          ))}
        </div>
        
        {weakTopics.length > 0 && (
          <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${COLORS.error}10`, border: `1px solid ${COLORS.error}30` }}>
            <h3 className="font-bold mb-2" style={{ color: COLORS.error }}>⚠️ الثغرات المكتشفة</h3>
            {weakTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm" style={{ color: COLORS.textSecondary }}>
                <span>•</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${COLORS.brand}10`, border: `1px solid ${COLORS.brand}30` }}>
          <h3 className="font-bold mb-3" style={{ color: COLORS.brand }}>📚 خطة العلاج المقترحة</h3>
          <div className="space-y-2">
            <button className="w-full p-3 rounded-lg text-right font-medium transition-all" style={{ backgroundColor: `${COLORS.brand}20`, color: COLORS.text }}>
              📖 درس: Subnetting من الصفر لـ CCNA
            </button>
            <button className="w-full p-3 rounded-lg text-right font-medium transition-all" style={{ backgroundColor: `${COLORS.brand}20`, color: COLORS.text }}>
              🧪 مختبر: حل مشاكل IP و DHCP
            </button>
            <button className="w-full p-3 rounded-lg text-right font-medium transition-all" style={{ backgroundColor: `${COLORS.brand}20`, color: COLORS.text }}>
              💼 سيناريو: عميل ما عنده نت
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContinue}
            className="flex-1 p-3 rounded-xl font-bold transition-all"
            style={{ backgroundColor: COLORS.brand, color: COLORS.text }}
          >
            📬 احصل على التقييم الكامل
          </button>
          <button
            onClick={onRestart}
            className="flex-1 p-3 rounded-xl font-bold transition-all"
            style={{ backgroundColor: COLORS.border, color: COLORS.text }}
          >
            🔄 إعادة التشريح
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================
// 6. شاشة النموذج (معدلة - min-h-[50vh])
// ============================================================
function FormScreen({ onSubmit, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    level: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
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
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[40vh] py-12 text-center px-4 relative z-10"
      >
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
          تم استلام بياناتك!
        </h2>
        <p style={{ color: COLORS.textSecondary }}>
          سنرسل لك التقييم الكامل خلال 24 ساعة 🚀
        </p>
        <button
          onClick={onBack}
          className="mt-6 px-6 py-3 rounded-xl font-bold transition-all"
          style={{ backgroundColor: COLORS.brand, color: COLORS.text }}
        >
          ← العودة للصفحة الرئيسية
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4 w-full max-w-2xl mx-auto relative z-10"
    >
      <div className="w-full p-6 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.text }}>
          📬 احصل على التقييم الكامل
        </h2>
        <p className="text-center mb-6" style={{ color: COLORS.textSecondary }}>
          املأ بياناتك وسنرسل لك 40 سؤالاً تشخيصياً + خطة تعلم مخصصة
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.textSecondary }} />
            <input
              type="text"
              placeholder="الاسم الكامل"
              required
              className="w-full p-3 pr-12 rounded-xl outline-none transition-all"
              style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.textSecondary }} />
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              required
              className="w-full p-3 pr-12 rounded-xl outline-none transition-all"
              style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: COLORS.textSecondary }} />
            <input
              type="tel"
              placeholder="رقم الهاتف"
              className="w-full p-3 pr-12 rounded-xl outline-none transition-all"
              style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="relative">
            <select
              required
              className="w-full p-3 pr-4 rounded-xl outline-none transition-all appearance-none"
              style={{ backgroundColor: COLORS.background, color: COLORS.text, border: `1px solid ${COLORS.border}` }}
              value={formData.level}
              onChange={(e) => setFormData({...formData, level: e.target.value})}
            >
              <option value="">المستوى الوظيفي</option>
              <option value="طالب">طالب</option>
              <option value="مهندس مبتدئ">مهندس مبتدئ</option>
              <option value="مهندس شبكات">مهندس شبكات</option>
              <option value="مدير تقني">مدير تقني</option>
              <option value="آخر">آخر</option>
            </select>
          </div>
          
          <p className="text-xs text-center" style={{ color: COLORS.textSecondary }}>
            🔒 لن نشارك بياناتك مع أي طرف ثالث
          </p>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded-xl font-bold transition-all"
            style={{ backgroundColor: COLORS.brand, color: COLORS.text }}
          >
            {loading ? 'جاري الإرسال...' : '🚀 أرسل لي الخطة الكاملة'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

// ============================================================
// 7. المكون الرئيسي
// ============================================================
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

  const handleStart = () => {
    setTimerActive(true);
    setStep('question');
  };

  const handleAnswer = (correct) => {
    setAnswers(prev => [...prev, correct]);
    
    if (currentQuestion + 1 < QUESTIONS.length) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setTimerActive(false);
      setStep('result');
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setTimeLeft(60);
    setStep('welcome');
  };

  const handleContinue = () => {
    setStep('form');
  };

  const handleFormSubmit = (data) => {
    console.log('User Data:', data);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative" style={{ backgroundColor: COLORS.background }}>
      <SmartBackground />

      <div className="w-full max-w-4xl relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SmartLab Logo" className="h-10 w-auto" />
          </div>
          {step !== 'welcome' && step !== 'form' && (
            <span className="text-sm" style={{ color: COLORS.textSecondary }}>
              {step === 'result' ? '✅ النتيجة' : `سؤال ${currentQuestion + 1}/${QUESTIONS.length}`}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {step === 'welcome' && <WelcomeScreen key="welcome" onStart={handleStart} />}
          {step === 'question' && (
            <QuestionScreen
              key="question"
              question={QUESTIONS[currentQuestion]}
              currentIndex={currentQuestion}
              total={QUESTIONS.length}
              onAnswer={handleAnswer}
              timeLeft={timeLeft}
            />
          )}
          {step === 'result' && (
            <ResultScreen
              key="result"
              score={answers.filter(Boolean).length}
              answers={answers}
              onRestart={handleRestart}
              onContinue={handleContinue}
            />
          )}
          {step === 'form' && (
            <FormScreen
              key="form"
              onSubmit={handleFormSubmit}
              onBack={handleRestart}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
