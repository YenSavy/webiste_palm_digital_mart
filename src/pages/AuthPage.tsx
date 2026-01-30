import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { AlertCircle, ArrowLeftIcon, Lock, LogIn, Mail, Phone, User, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import { useLogin, useSignUp } from "../lib/mutations";
import CodeVerificationModal from "../components/auth/CodeVerificationModal";
import type { SignInData } from "../lib/apis/auth/authApi";
import FacebookAuth from "../components/auth/FacebookAuth";
import GoogleAuth from "../components/auth/GoogleAuth";

const AuthPage: React.FC = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { isSignInPage, isAuthenticated } = useAuthStore();
    useEffect(() => {
        if (isAuthenticated) {
            if (window.history.length > 1) {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        }
    }, [isAuthenticated, navigate]);

    return (
        <section
            id="auth-page"
            className="flex min-h-screen items-center justify-center px-0 relative"
        >
            
            <Link 
                to={"/"} 
                className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20 z-50 hover:bg-black/30 transition-colors">
                <ArrowLeftIcon className="text-white" />
            </Link>
            
                <main className={` grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0 w-full h-screen`}>   
                {/* Left side with background image */}
                <div
                    className={`
                    hidden md:flex flex-col items-center justify-center p-8
                    relative bg-cover bg-center
                    `}
                    style={{ backgroundImage: "url('./bg-signin.png')" }}
                >
                    {/* Dark overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/40"></div>
                    
                </div>

                {/* Right side with form - Full Height */}
                <div
                    className={`
                    flex flex-col justify-center p-8 bggradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43]
                    ${isSignInPage ? "md:order-2" : "md:order-1"}
                    h-full 
                `}
                >
                    {/* PALM Logo for right side (Desktop only) */}
                    <div className="hidden md:flex w-full justify-center mb-6">
                       <img src="./palm technology.png" 
                       alt="PalmLogo"
                       className="h-25 w-20"/>
                    </div>
                    
                    {/* Mobile header */}
                    <div className="md:hidden text-center mb-8">
                        <img
                            src="./palm technology.png"
                            alt="Palm Technology"
                            loading="lazy"
                            className="w-[100px] mx-auto mb-4"
                        />
                    </div>
                    
                    <div className="mt-1">
                        <LoginForm />
                    </div>
                </div>
            </main>
        </section>
    );
};

export default AuthPage;

const LoginForm: React.FC = () => {
    const { setToken, setUser } = useAuthStore()
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
                setUser({
                    email: data.data.email,
                    name: data.data.name,
                    phone: data.data.phone,
                    full_name: data.data.full_name
                })

                if (rememberMe) {
                    setAuthCookie(token, 7 * 24 * 60 * 60)
                } else {
                    setAuthCookie(token)
                }

                setIsFailed(false)
                navigate('/dashboard')
            },
            onError: (error) => {
                setIsFailed(true)
                setMessage(
                    error.message.toLowerCase() === "unauthorized"
                        ? "Incorrect credentials! Try again."
                        : "Sign in failed"
                )
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

            <span className="flex gap-2">
                <p>{t("don't_have_account") || "Don't have an account?"}</p>
                <button
                    type="button"
                    className="underline hover:text-secondary"
                    onClick={() => navigate('/pages')} // ប្ដូរពី setIsSignInPage(false) ទៅ navigate('/signup')
                >
                    {t("sign_up")}
                </button>
            </span>
            <div className="flex items-center justify-between gap-4">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500 text-sm">Or</span>
                <hr className="flex-1 border-gray-300" />
            </div>
            <FacebookAuth setMessage={setMessage} setIsError={setIsFailed}/>
            <GoogleAuth />
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

// Signp form ----------------------------------------------------
