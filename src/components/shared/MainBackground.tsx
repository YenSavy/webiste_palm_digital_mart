import React from 'react'

const MainBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <main className="min-h-screen bg-gradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43] relative overflow-hidden">
            {/* Animated gold dots */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-yellow-500 opacity-60"
                        style={{
                            width: `${4}px`,
                            height: `${4}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            {/* Keyframe animation */}
            <style>{`
                @keyframes float {
                    0% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100 + 50}vw, ${Math.random() > 0.5 ? '' : '-'}${Math.random() * 100 + 50}vh);
                    }
                }
            `}</style>

            {children}
        </main>
    )
}

export default MainBackground