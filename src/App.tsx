import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRouter from './routes/AppRouter';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const isDark = useThemeStore(s => s.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <>
      <AppRouter />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: isDark ? '#1e293b' : '#fff',
            color: isDark ? '#f1f5f9' : '#0f172a',
            boxShadow: isDark
              ? '0 10px 25px rgba(0,0,0,0.3)'
              : '0 10px 25px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}