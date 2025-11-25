import { useState, useRef, useEffect } from 'react'
import { X, Mail, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface CodeVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    onVerify: (code: string) => void
    email?: string
    isLoading?: boolean
    message: string
}

const CodeVerificationModal: React.FC<CodeVerificationModalProps> = ({
    isOpen,
    onClose,
    onVerify,
    email,
    message="",
    isLoading = false
}) => {
    const { t } = useTranslation()
    const [code, setCode] = useState(['', '', '', ''])
    const [error, setError] = useState('')
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        if (isOpen && inputRefs.current[0]) {
            inputRefs.current[0]?.focus()
        }
    }, [isOpen])

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value.slice(-1)

        setCode(newCode)
        setError('')

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }

        if (index === 3 && value) {
            const fullCode = newCode.join('')
            if (fullCode.length === 4) {
                handleVerify(fullCode)
            }
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').slice(0, 4)

        if (!/^\d+$/.test(pastedData)) return

        const newCode = pastedData.split('').concat(['', '', '', '']).slice(0, 4)
        setCode(newCode)

        const nextEmptyIndex = newCode.findIndex(digit => !digit)
        const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex
        inputRefs.current[focusIndex]?.focus()

        if (pastedData.length === 4) {
            handleVerify(pastedData)
        }
    }

    const handleVerify = (fullCode: string) => {
        if (fullCode.length !== 4) {
            setError(t('code_incomplete') || 'Please enter all 4 digits')
            return
        }
        onVerify(fullCode)
    }

    const handleSubmit = () => {
        const fullCode = code.join('')
        handleVerify(fullCode)
    }

    const handleResend = () => {
        console.log('Resend code')
        setCode(['', '', '', ''])
        setError('')
        inputRefs.current[0]?.focus()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(30, 41, 59, 0.95))',
                }}
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Mail className="text-yellow-400" />
                        {t('verify_email') || 'Verify Your Email'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/70 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <p className="text-white/80 text-center">
                        {t('verification_sent') || 'We sent a verification code to'}
                    </p>
                    {email && (
                        <p className="text-yellow-400 font-semibold text-center">
                            {email}
                        </p>
                    )}  
                    <p>{message}</p>
                    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    if (el) {
                                        inputRefs.current[index] = el
                                    }
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-16 h-16 text-center text-2xl font-bold rounded-lg 
                                    bg-white/10 text-white border-2 transition-all
                                    focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400
                                    ${error ? 'border-red-500' : 'border-white/20'}
                                    ${digit ? 'border-yellow-400' : ''}
                                `}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                        
                    {error && (
                        <p className="text-red-400 text-sm text-center flex items-center justify-center gap-1">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={code.some(d => !d) || isLoading}
                        className="w-full py-4 bg-yellow-400 text-blue-900 font-semibold rounded-lg
                            hover:bg-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900" />
                                {t('verifying') || 'Verifying'}...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                {t('verify') || 'Verify Code'}
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <p className="text-white/60 text-sm mb-2">
                            {t('didnt_receive') || "Didn't receive the code?"}
                        </p>
                        <button
                            onClick={handleResend}
                            className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
                            disabled={isLoading}
                        >
                            {t('resend_code') || 'Resend Code'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CodeVerificationModal