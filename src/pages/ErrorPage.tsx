import { Home, ArrowLeft, AlertCircle, FileQuestion, Compass } from 'lucide-react'

const ErrorPage = () => {
  const theme = {
    gradient: 'from-[#102A43] via-[#0D3C73] to-[#102A43]',
    cardBg: 'from-slate-800/60 to-slate-900/60',
    border: 'border-slate-700/50',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    accent: '#DAA520',
    accentGlow: 'rgba(218,165,32,0.3)',
  }


  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient} flex items-center justify-center p-4`}>
      <div className="max-w-4xl w-full">
        <div className={`bg-gradient-to-br ${theme.cardBg} backdrop-blur-sm border ${theme.border} rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: theme.accent }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: theme.accent }} />

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center animate-bounce-slow" style={{ 
                background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}40)`,
                boxShadow: `0 0 60px ${theme.accentGlow}`
              }}>
                <FileQuestion size={64} style={{ color: theme.accent }} />
                
                <div className="absolute inset-0 animate-spin-slow">
                  <AlertCircle size={24} className="absolute -top-2 left-1/2 -translate-x-1/2" style={{ color: theme.accent }} />
                </div>
                <div className="absolute inset-0 animate-spin-reverse">
                  <Compass size={24} className="absolute -bottom-2 left-1/2 -translate-x-1/2" style={{ color: theme.accent }} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-8xl sm:text-9xl font-black mb-4 tracking-tighter" style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                404
              </h1>
              <h2 className={`text-2xl sm:text-3xl font-bold ${theme.text} mb-3`}>
                Page Not Found
              </h2>
              <p className={`text-base sm:text-lg ${theme.textSecondary} max-w-md mx-auto`}>
                Oops! The page you're looking for seems to have wandered off. 
                Don't worry, we'll help you find your way back.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 mb-12">
              <button onClick={() => window.location.href = '/'} className="px-8 py-4 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center gap-3 hover:scale-105" style={{ background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}dd)` }}>
                <Home size={20} />
                Go to Home
              </button>

              <button onClick={() => window.history.back()} className="px-8 py-4 rounded-xl font-semibold transition-all border-2 flex items-center gap-3 hover:scale-105" style={{ 
                backgroundColor: `${theme.accent}10`,
                borderColor: theme.accent,
                color: theme.accent,
              }}>
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-700">
              <p className={`text-sm ${theme.textSecondary}`}>
                Need help? Contact our support team at{' '}
                <a href="mailto:support@example.com" className="font-medium hover:underline" style={{ color: theme.accent }}>
                  yen.savy@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className={`text-xs ${theme.textSecondary}`}>Error Code: 404 | Page Not Found</p>
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-spin-reverse { animation: spin-reverse 6s linear infinite; }
      `}</style>
    </div>
  )
}

export default ErrorPage