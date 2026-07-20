// app/layout.js
import './globals.css';

export const metadata = {
  title: 'SmartLab - تشريح أساسيات الشبكات',
  description: 'اختبر مهاراتك في أساسيات الشبكات خلال 60 ثانية',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-cairo">{children}</body>
    </html>
  );
}
