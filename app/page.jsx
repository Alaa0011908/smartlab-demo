// ============================================================
// 2. شاشة الترحيب (معدلة - تصميم احترافي)
// ============================================================
function WelcomeScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 relative overflow-hidden"
    >
      {/* خلفية متحركة (دائرية) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20" 
             style={{ 
               background: `radial-gradient(circle, ${COLORS.brand}40 0%, transparent 70%)`,
               animation: 'pulse 3s ease-in-out infinite'
             }} 
        />
      </div>

      {/* اللوغو - مكبر مع تأثير glow */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative z-10 mb-8"
      >
        <div className="relative">
          {/* تأثير الإضاءة حول اللوغو */}
          <div className="absolute inset-0 rounded-full blur-2xl" 
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

      {/* العنوان مع تأثير كتابي */}
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

      {/* النص الفرعي */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-lg md:text-xl mb-6 relative z-10"
        style={{ color: COLORS.textSecondary }}
      >
        90% من المهندسين بيوقعوا بهالأسئلة. انت منهم؟
      </motion.p>

      {/* الإحصائيات - مع تأثير عد تنازلي */}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            📊 1,234
          </motion.span>
          <span className="mr-1">مهندس اختبروا مهاراتهم</span>
        </span>
      </motion.div>

      {/* زر مع تأثير نبض */}
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

      {/* المؤقت */}
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

      {/* أنماط CSS للتحريك */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.35; }
        }
      `}</style>
    </motion.div>
  );
}
