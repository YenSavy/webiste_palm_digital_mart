import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { AlertCircle, ArrowLeftIcon, Lock, LogIn, Mail, Phone, User, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import { useLogin, useSignUp } from "../lib/mutations";
import CodeVerificationModal from "../components/auth/CodeVerificationModal";
import type { SignInData } from "../lib/apis/auth/authApi";


const AuthPage: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { isSignInPage, isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (isAuthenticated) {
            window.history.length > 1 ? navigate(-1) : navigate("/")
        }
    }, [isAuthenticated])
    return (
        <section
            id="auth-page"
            className="flex min-h-[80vh] mt-6 items-center justify-center px-0"
        >
            <Link to={"/"} className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20"><ArrowLeftIcon /></Link>
            <main
                className={`
                grid-cols-1 md:grid-cols-2 gap-0 w-full max-w-5xl h-full
                rounded-2xl overflow-hidden grid
                `}
            >
                <div
                    className={`hidden
                    md:flex flex-col items-center justify-center p-8 transition-all duration-300
                
                `}
                >
                    <img
                        src="./palm technology.png"
                        alt="Palm Technology"
                        loading="lazy"
                        className="w-[200px] mb-3"
                    />
                    <h2 className="text-4xl font-bold text-secondary text-center">
                        Palm Digital Biz
                    </h2>
                    <p className="text-secondary text-center">
                        We Care for Your Business.
                    </p>
                </div>

                <div
                    className={`
                    flex flex-col justify-center p-3 bg-primary/5 transition-all duration-300 bg-gradient-primary rounded-xl
                    ${isSignInPage ? "md:order-2" : "md:order-1"}
                `}
                >
                    <span className="flex w-full justify-end md:hidden">
                        <img
                            src="./palm technology.png"
                            alt="Palm Technology"
                            loading="lazy"
                            className="w-[50px] mb-3"
                        />
                    </span>
                    <h2 className="text-2xl font-semibold mb-6 text-center text-[#b19b1f] mt-3 flex items-center gap-2 justify-center border-b-2 border-white/20 mx-3 py-5">
                        {isSignInPage ? <LogIn size={30} /> : <UserPen size={30} />}
                        {isSignInPage ? t("login") : t("sign_up")}
                    </h2>

                    <div className="mt-1 p-2">
                        {isSignInPage ? <LoginForm /> : <SignUpForm />}
                    </div>
                </div>
            </main>
        </section>
    );
};

export default AuthPage;

const LoginForm: React.FC = () => {
    const { setIsSignInPage, setToken, setUser } = useAuthStore()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [rememberMe, setRememberMe] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [loginData, setLoginData] = useState<SignInData>({
        name: "",
        password: ""
    })
    const [isFailed, setIsFailed] = useState<boolean>(false)
    const [errors, setErrors] = useState<{ name?: string; password?: string }>({})
    const [touched, setTouched] = useState<{ name: boolean; password: boolean }>({
        name: false,
        password: false
    })

    const { mutate: login, isPending } = useLogin()

    const validateField = (name: 'name' | 'password', value: string) => {
        let error = ''

        if (name === 'name') {
            if (!value.trim()) {
                error = t('username_required') || 'Username is required'
            } else if (value.length < 3) {
                error = t('username_min_length') || 'Username must be at least 3 characters'
            }
        }

        if (name === 'password') {
            if (!value.trim()) {
                error = t('password_required') || 'Password is required'
            } else if (value.length < 6) {
                error = t('password_min_length') || 'Password must be at least 6 characters'
            }
        }

        setErrors(prev => ({ ...prev, [name]: error }))
        return error
    }

    const handleBlur = (field: 'name' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field, loginData[field])
    }

    const handleChange = (field: 'name' | 'password', value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }))
        if (touched[field]) {
            validateField(field, value)
        }
    }

    const setAuthCookie = (token: string, maxAgeSeconds?: number) => {
        if (maxAgeSeconds) {
            document.cookie = `auth_token=${token}; max-age=${maxAgeSeconds}; path=/; secure; samesite=strict`
        } else {
            document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`
        }
    }

    const onLogin = (e: React.FormEvent) => {
        e.preventDefault()

        setTouched({ name: true, password: true })

        const usernameError = validateField('name', loginData.name)
        const passwordError = validateField('password', loginData.password)

        if (usernameError || passwordError) return

        login(loginData, {
            onSuccess: (data) => {
                const token = data.data.token
                setToken(token)
                setUser({email: data.data.email, name: data.data.name, phone: data.data.phone, full_name: data.data.full_name})
                setIsFailed(false)
                if (rememberMe) {
                    setAuthCookie(token, 7 * 24 * 60 * 60)
                } else {
                    setAuthCookie(token)
                }
                navigate('/dashboard')
            },
            onError: (error) => {
                setIsFailed(true)
                setMessage(error.message.toLowerCase() === "unauthorized" ? "Incorrect credential !, Try again." : "Sign In failed")
            }
        })
    }
    return (
        <form className="flex flex-col gap-3" onSubmit={onLogin}>
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <User size={20} />{t("username")}
                </label>
                <TextInput
                    type="text"
                    placeholder="Username"
                    className={`py-4 px-3 ${errors.name && touched.name ? 'border-red-500 border-2' : ''}`}
                    value={loginData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleBlur('name')}
                />
                {errors.name && touched.name && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Lock size={20} />{t("password")}
                </label>
                <TextInput
                    type="password"
                    placeholder="Password"
                    className={`py-4 px-3 ${errors.password && touched.password ? 'border-red-500 border-2' : ''}`}
                    value={loginData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onBlur={() => handleBlur('password')}
                />
                {errors.password && touched.password && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                    </span>
                )}
            </div>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>{t("remember_me") || "Remember me"}</span>
            </label>

            {/* Sign Up Link */}
            <span className="flex gap-2">
                <p>{t("don't_have_account") || "Don't have an account?"}</p>
                <button
                    type="button"
                    className="underline hover:text-secondary"
                    onClick={() => setIsSignInPage(false)}
                >
                    {t("sign_up")}
                </button>
            </span>

            <p className={isFailed ? "text-red-500" : "text-lime-500"}>{message || ""}</p>
            <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!errors.name || !!errors.password || isPending}
            >
                {isPending ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        {t("logging_in") || "Logging in"}...
                    </>
                ) : (
                    <>
                        <LogIn />{t("login")}
                    </>
                )}
            </button>
        </form>
    )
}

const SignUpForm: React.FC = () => {
    const { t } = useTranslation()
    const { setIsSignInPage } = useAuthStore()
    const [message, setMessage] = useState<string>("")
    const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false)
    const [formData, setFormData] = useState({
        name: 'Heak1',
        email: 'example.12@gmail.com',
        prefix: '855',
        phone: '0192833464',
        password: '12345678',
        c_password: '12345678'
    })
    const [errors, setErrors] = useState<{
        name?: string
        email?: string
        phone?: string
        password?: string
        c_password?: string
    }>({})

    const [isFailed, setIsFailed] = useState<boolean>(false)
    const [touched, setTouched] = useState<Record<keyof typeof formData, boolean>>({
        name: false,
        email: false,
        prefix: false,
        phone: false,
        password: false,
        c_password: false
    })
    const { mutate: signUpMutation, isPending } = useSignUp()
    const validateField = (name: keyof typeof formData, value: string) => {
        let error = ''

        if (name === 'name') {
            if (!value.trim()) {
                error = t('name_required') || 'Name is required'
            } else if (value.length < 3) {
                error = t('name_min_length') || 'Name must be at least 3 characters'
            }
        }

        if (name === 'email') {
            if (!value.trim()) {
                error = t('email_required') || 'Email is required'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = t('email_invalid') || 'Please enter a valid email address'
            }
        }

        if (name === 'phone') {
            if (!value.trim()) {
                error = t('phone_required') || 'Phone number is required'
            } else if (!/^\d{8,10}$/.test(value)) {
                error = t('phone_invalid') || 'Please enter a valid phone number (8-10 digits)'
            }
        }

        if (name === 'password') {
            if (!value.trim()) {
                error = t('password_required') || 'Password is required'
            } else if (value.length < 6) {
                error = t('password_min_length') || 'Password must be at least 6 characters'
            }
        }

        if (name === 'c_password') {
            if (!value.trim()) {
                error = t('confirm_password_required') || 'Please confirm your password'
            } else if (value !== formData.password) {
                error = t('password_mismatch') || 'Passwords do not match'
            }
        }

        setErrors(prev => ({ ...prev, [name]: error }))
        return error
    }

    const handleBlur = (field: keyof typeof formData) => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field, formData[field])
    }

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (touched[field as keyof typeof formData]) {
            validateField(field, value)
        }
        if (field === 'password' && touched.c_password) {
            validateField('c_password', formData.c_password)
        }
    }

    const onRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        setTouched({
            name: true,
            email: true,
            prefix: true,
            phone: true,
            password: true,
            c_password: true
        })
        const nameError = validateField('name', formData.name)
        const emailError = validateField('email', formData.email)
        const phoneError = validateField('phone', formData.phone)
        const passwordError = validateField('password', formData.password)
        const cPasswordError = validateField('c_password', formData.c_password)

        if (!nameError && !emailError && !phoneError && !passwordError && !cPasswordError) {
            if (!nameError && !emailError && !phoneError && !passwordError && !cPasswordError) {
                signUpMutation(formData, {
                    onSuccess: (data) => {
                        setIsFailed(false)
                        setMessage(data?.message || "")
                        setShowVerificationModal(true)
                    },
                    onError: (error) => {
                        setIsFailed(true)
                        setMessage(error.message)
                    }
                })
            }

        }
    }
    const hasErrors = Object.values(errors).some(error => error !== '')

    return (
        <form className="flex flex-col gap-3" onSubmit={onRegister}>
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <User size={20} />{t("name")}
                </label>
                <TextInput
                    type="text"
                    placeholder="Enter your name"
                    className={`py-4 px-3 ${errors.name && touched.name ? 'border-red-500 border-2' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                />
                {errors.name && touched.name && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.name}
                    </span>
                )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Mail size={20} />{t("email")}
                </label>
                <TextInput
                    type="email"
                    placeholder="Enter your email"
                    className={`py-4 px-3 ${errors.email && touched.email ? 'border-red-500 border-2' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                />
                {errors.email && touched.email && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.email}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Phone size={20} />{t("phone")}
                </label>
                <div className="flex gap-2">
                    <select
                        className="py-4 px-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary text-white appearance-none cursor-pointer"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.6), rgba(30, 41, 59, 0.6))',
                            backdropFilter: 'blur(10px)'
                        }}
                        value={formData.prefix}
                        onChange={(e) => handleChange('prefix', e.target.value)}
                    >
                        <option value="855" style={{ background: '#1e293b', color: 'white' }}>+855</option>
                        <option value="1" style={{ background: '#1e293b', color: 'white' }}>+1</option>
                        <option value="86" style={{ background: '#1e293b', color: 'white' }}>+86</option>
                        <option value="66" style={{ background: '#1e293b', color: 'white' }}>+66</option>
                    </select>
                    <TextInput
                        type="tel"
                        placeholder="Phone number"
                        className={`py-4 px-3 flex-1 ${errors.phone && touched.phone ? 'border-red-500 border-2' : ''}`}
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                    />
                </div>
                {errors.phone && touched.phone && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.phone}
                    </span>
                )}
            </div>
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Lock size={20} />{t("password")}
                </label>
                <TextInput
                    type="password"
                    placeholder="Enter password"
                    className={`py-4 px-3 ${errors.password && touched.password ? 'border-red-500 border-2' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                />
                {errors.password && touched.password && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.password}
                    </span>
                )}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Lock size={20} />{t("confirm_password")}
                </label>
                <TextInput
                    type="password"
                    placeholder="Confirm password"
                    className={`py-4 px-3 ${errors.c_password && touched.c_password ? 'border-red-500 border-2' : ''}`}
                    value={formData.c_password}
                    onChange={(e) => handleChange('c_password', e.target.value)}
                    onBlur={() => handleBlur('c_password')}
                />
                {errors.c_password && touched.c_password && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.c_password}
                    </span>
                )}
            </div>
            <CodeVerificationModal isOpen={showVerificationModal} message={message} onClose={() => setShowVerificationModal(false)} onVerify={() => { }} />
            <span className="flex gap-2">
                <p>{t("already_have_account")}</p>
                <button
                    type="button"
                    className="underline hover:text-secondary"
                    onClick={() => setIsSignInPage(true)}
                >
                    {t("login")}
                </button>
            </span>
            <p className={isFailed ? "text-red-500" : "text-lime-500"}>{message || ""}</p>
            <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={hasErrors || isPending}
            >
                {isPending ? (
                    <>Loading...</>
                ) : (
                    <>
                        <UserPen />{t("sign_up")}
                    </>
                )}
            </button>
        </form>
    )
}
