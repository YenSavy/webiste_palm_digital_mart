import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { AlertCircle, ArrowLeftIcon, Lock, LogIn, Mail, User, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";

const AuthPage: React.FC = () => {
    const { t } = useTranslation();
    const { isSignInPage, isAuthenticated } = useAuthStore();
console.log(isAuthenticated)
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
    const { setIsSignInPage, setLoginFormData, loginFormData, setToken } = useAuthStore()
    const { t } = useTranslation()
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
    const [touched, setTouched] = useState<{ username: boolean; password: boolean }>({
        username: false,
        password: false
    })
    const navigate = useNavigate()
    const [rememberMe, setRememberMe] = useState(false)

    const validateField = (name: 'username' | 'password', value: string) => {
        let error = ''

        if (name === 'username') {
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

    const handleBlur = (field: 'username' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field, loginFormData[field])
    }

    const handleChange = (field: 'username' | 'password', value: string) => {
        setLoginFormData({ ...loginFormData, [field]: value })
        if (touched[field]) {
            validateField(field, value)
        }
    }

    const setAuthCookie = (token: string, maxAgeSeconds?: number) => {
        if (maxAgeSeconds) {
            document.cookie = `auth_token=${token}; max-age=${maxAgeSeconds}; path=/`
        } else {
            document.cookie = `auth_token=${token}; path=/`
        }
    }

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        setTouched({ username: true, password: true })

        const usernameError = validateField('username', loginFormData.username)
        const passwordError = validateField('password', loginFormData.password)

        if (usernameError || passwordError) return
        const fakeToken = 'example-token-from-api'

        setToken(fakeToken)

        if (rememberMe) {
            setAuthCookie(fakeToken, 7 * 24 * 60 * 60)
        } else {
            setAuthCookie(fakeToken)
        }

        console.log('Login success:', loginFormData, 'rememberMe:', rememberMe)
          navigate('/dashboard')
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
                    className={`py-4 px-3 ${errors.username && touched.username ? 'border-red-500 border-2' : ''}`}
                    value={loginFormData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                />
                {errors.username && touched.username && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.username}
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
                    value={loginFormData.password}
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

            {/* NEW: remember me checkbox */}
            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t("remember_me") || "Remember me"}
            </label>

            <span className="flex gap-2">
                <p>{t("don't_have_account")}</p>
                <button
                    type="button"
                    className="underline hover:text-secondary"
                    onClick={() => setIsSignInPage(false)}
                >
                    {t("sign_up")}
                </button>
            </span>

            <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!errors.username || !!errors.password}
            >
                <LogIn />{t("login")}
            </button>
        </form>
    )
}

const SignUpForm: React.FC = () => {
    const { t } = useTranslation()
    const { setIsSignInPage, registerFormData, setRegisterFormData } = useAuthStore()
    const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({})
    const [touched, setTouched] = useState<{ username: boolean; email: boolean; password: boolean }>({
        username: false,
        email: false,
        password: false
    })

    const validateField = (name: 'username' | 'email' | 'password', value: string) => {
        let error = ''

        if (name === 'username') {
            if (!value.trim()) {
                error = t('username_required') || 'Username is required'
            } else if (value.length < 3) {
                error = t('username_min_length') || 'Username must be at least 3 characters'
            } else if (value.length > 20) {
                error = t('username_max_length') || 'Username must be less than 20 characters'
            } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                error = t('username_invalid') || 'Username can only contain letters, numbers, and underscores'
            }
        }

        if (name === 'email') {
            if (!value.trim()) {
                error = t('email_required') || 'Email is required'
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                error = t('email_invalid') || 'Please enter a valid email address'
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

    const handleBlur = (field: 'username' | 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }))
        validateField(field, registerFormData[field])
    }

    const handleChange = (field: 'username' | 'email' | 'password', value: string) => {
        setRegisterFormData({ ...registerFormData, [field]: value })
        if (touched[field]) {
            validateField(field, value)
        }
    }

    const onRegister = (e: React.FormEvent) => {
        e.preventDefault()

        // Mark all fields as touched
        setTouched({ username: true, email: true, password: true })

        // Validate all fields
        const usernameError = validateField('username', registerFormData.username)
        const emailError = validateField('email', registerFormData.email)
        const passwordError = validateField('password', registerFormData.password)

        if (!usernameError && !emailError && !passwordError) {
            console.log('Register data:', registerFormData)
        }
    }

    return (
        <form className="flex flex-col gap-3" onSubmit={onRegister}>
            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <User size={20} />{t("username")}
                </label>
                <TextInput
                    type="text"
                    placeholder="Username"
                    className={`py-4 px-3 ${errors.username && touched.username ? 'border-red-500 border-2' : ''}`}
                    value={registerFormData.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    onBlur={() => handleBlur('username')}
                />
                {errors.username && touched.username && (
                    <span className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.username}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-1">
                <label className="flex gap-1 items-center">
                    <Mail size={20} />{t("email")}
                </label>
                <TextInput
                    type="email"
                    placeholder="Email"
                    className={`py-4 px-3 ${errors.email && touched.email ? 'border-red-500 border-2' : ''}`}
                    value={registerFormData.email}
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
                    <Lock size={20} />{t("password")}
                </label>
                <TextInput
                    type="password"
                    placeholder="Password"
                    className={`py-4 px-3 ${errors.password && touched.password ? 'border-red-500 border-2' : ''}`}
                    value={registerFormData.password}
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

            <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!!errors.username || !!errors.email || !!errors.password}
            >
                <UserPen />{t("sign_up")}
            </button>
        </form>
    )
}