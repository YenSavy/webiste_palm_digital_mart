import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../store/authStore";
import { AlertCircle, ArrowLeftIcon, Lock, LogIn, User, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/TextInput";
import { useLogin, useSignUp } from "../lib/mutations";
import CodeVerificationModal from "../components/auth/CodeVerificationModal";
import type { SignInData } from "../lib/apis/auth/authApi";
import FacebookAuth from "../components/auth/FacebookAuth";
import GoogleAuth from "../components/auth/GoogleAuth";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  // const { t } = useTranslation();
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
      className="flex min-h-screen items-center justify-center px-4 relative"
    >
      {/* Back Button */}
      <Link
        to={"/"}
        className="p-3 bg-black/20 rounded absolute top-5 left-5 md:top-8 md:left-8 z-50 hover:bg-black/30 transition-colors"
      >
        <ArrowLeftIcon className="text-white" />
      </Link>

      {/* Main Container with Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={isSignInPage ? "./bg-signin.png" : "./bg-signup.png"}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Centered Form Container */}
      <div className="relative z-20 flex items-center justify-center w-full h-screen px-4">
        <div
          className={`w-full max-w-md ${
            isSignInPage ? "bg-black/30" : "bg-black/20"
          } backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-xl`}
        >
          {/* Mobile Logo */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <img
              src="./palm technology.png"
              alt="Palm Technology"
              className="w-24 h-auto mb-3"
            />
          </div>

          {/* Desktop Logo */}
          <div className="hidden md:flex flex-col items-center mb-6">
            <img
              src="./palm technology.png"
              alt="PalmLogo"
              className="w-40 h-auto mb-2"
            />
          </div>

          {/* Form */}
          <div className="mt-2">
            {isSignInPage ? <LoginForm /> : <SignUpForm />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;

const LoginForm: React.FC = () => {
  const { setIsSignInPage, setToken, setUser } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loginData, setLoginData] = useState<SignInData>({
    name: "",
    password: "",
  });
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name?: string; password?: string }>(
    {},
  );
  const [touched, setTouched] = useState<{ name: boolean; password: boolean }>({
    name: false,
    password: false,
  });

  const { mutate: login, isPending } = useLogin();

  const validateField = (name: "name" | "password", value: string) => {
    let error = "";

    if (name === "name") {
      if (!value.trim()) {
        error = t("username_required") || "Username is required";
      } else if (value.length < 3) {
        error =
          t("username_min_length") || "Username must be at least 3 characters";
      }
    }

    if (name === "password") {
      if (!value.trim()) {
        error = t("password_required") || "Password is required";
      } else if (value.length < 6) {
        error =
          t("password_min_length") || "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (field: "name" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, loginData[field]);
  };

  const handleChange = (field: "name" | "password", value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const setAuthCookie = (token: string, maxAgeSeconds?: number) => {
    if (maxAgeSeconds) {
      document.cookie = `auth_token=${token}; max-age=${maxAgeSeconds}; path=/; secure; samesite=strict`;
    } else {
      document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;
    }
  };
  
  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, password: true });

    const usernameError = validateField("name", loginData.name);
    const passwordError = validateField("password", loginData.password);

    if (usernameError || passwordError) return;

    login(loginData, {
      onSuccess: (data) => {
        const token = data.data.token;
        setToken(token);
        setUser({
          email: data.data.email,
          name: data.data.name,
          phone: data.data.phone,
          full_name: data.data.full_name,
        });

        if (rememberMe) {
          setAuthCookie(token, 7 * 24 * 60 * 60);
        } else {
          setAuthCookie(token);
        }

        setIsFailed(false);
        navigate("/dashboard");
      },
      onError: (error) => {
        setIsFailed(true);
        setMessage(
          error.message.toLowerCase() === "unauthorized"
            ? "Incorrect credentials! Try again."
            : "Sign in failed",
        );
      },
    });
  };
  
  return (
    <form className="flex flex-col gap-4" onSubmit={onLogin}>
      <div className="flex flex-col gap-2">
        <label className="flex gap-2 items-center text-white font-medium">
          <User size={20} />
          {t("username")}
        </label>
        <TextInput
          type="text"
          placeholder="Username"
          className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
            errors.name && touched.name
              ? "border-red-500 border-2"
              : "border-gray-300"
          }`}
          value={loginData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
        />
        {errors.name && touched.name && (
          <span className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.name}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex gap-2 items-center text-white font-medium">
          <Lock size={20} />
          {t("password")}
        </label>
        <TextInput
          type="password"
          placeholder="Password"
          className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
            errors.password && touched.password
              ? "border-red-500 border-2"
              : "border-gray-300"
          }`}
          value={loginData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          onBlur={() => handleBlur("password")}
        />
        {errors.password && touched.password && (
          <span className="text-red-500 text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            {errors.password}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 cursor-pointer"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span>{t("remember_me") || "Remember me"}</span>
        </label>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        disabled={!!errors.name || !!errors.password || isPending}
      >
        {isPending ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            {t("logging_in") || "Logging in"}...
          </>
        ) : (
          <>
            <LogIn />
            {t("login")}
          </>
        )}
      </button>

      <div className="text-center mt-2">
        <span className="text-gray-300 text-sm">
          {t("don't_have_account") || "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-sky-300 hover:text-sky-200 font-medium"
            onClick={() => setIsSignInPage(false)}
          >
            {t("sign_up")}
          </button>
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 my-4">
        <hr className="flex-1 border-gray-400" />
        <span className="text-gray-300 text-sm">Or</span>
        <hr className="flex-1 border-gray-400" />
      </div>
      
      <FacebookAuth setMessage={setMessage} setIsError={setIsFailed} />
      <GoogleAuth />
      
      {message && (
        <p
          className={`text-center text-sm mt-2 ${isFailed ? "text-red-400" : "text-green-400"}`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

// Signup form ----------------------------------------------------

const SignUpForm: React.FC = () => {
  const { t } = useTranslation();
  const { setIsSignInPage } = useAuthStore();
  const [message, setMessage] = useState<string>("");
  const [showVerificationModal, setShowVerificationModal] =
    useState<boolean>(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    prefix: "855",
    phone: "",
    password: "",
    c_password: "",
  });
  const [errors, setErrors] = useState<{
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    c_password?: string;
  }>({});

  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [touched, setTouched] = useState<
    Record<keyof typeof formData, boolean>
  >({
    first_name: false,
    last_name: false,
    username: false,
    email: false,
    prefix: false,
    phone: false,
    password: false,
    c_password: false,
  });
  
  const { mutate: signUpMutation, isPending } = useSignUp();

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = "";
    
    if (name === "first_name") {
      if (!value.trim()) {
        error = t("first_name_required") || "First name is required";
      } else if (value.length < 1) {
        error = t("first_name_min_length") || "First name must be at least 2 characters";
      }
    }
    
    if (name === "last_name") {
      if (!value.trim()) {
        error = t("last_name_required") || "Last name is required";
      } else if (value.length < 1) {
        error = t("last_name_min_length") || "Last name must be at least 2 characters";
      }
    }
    
    if (name === "username") {
      if (!value.trim()) {
        error = t("username_required") || "Username is required";
      } else if (value.length < 3) {
        error = t("username_min_length") || "Username must be at least 3 characters";
      }
    }
    
    if (name === "email") {
      if (!value.trim()) {
        error = t("email_required") || "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = t("email_invalid") || "Please enter a valid email address";
      }
    }
    
    if (name === "phone") {
      if (!value.trim()) {
        error = t("phone_required") || "Phone number is required";
      } else if (!/^\d{8,10}$/.test(value)) {
        error = t("phone_invalid") || "Please enter a valid phone number (8-10 digits)";
      }
    }
    
    if (name === "password") {
      if (!value.trim()) {
        error = t("password_required") || "Password is required";
      } else if (value.length < 6) {
        error = t("password_min_length") || "Password must be at least 6 characters";
      }
    }
    
    if (name === "c_password") {
      if (!value.trim()) {
        error = t("confirm_password_required") || "Please confirm your password";
      } else if (value !== formData.password) {
        error = t("password_mismatch") || "Passwords do not match";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      validateField(field, value);
    }
    if (field === "password" && touched.c_password) {
      validateField("c_password", formData.c_password);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      first_name: true,
      last_name: true,
      username: true,
      email: true,
      prefix: true,
      phone: true,
      password: true,
      c_password: true,
    });

    const firstNameError = validateField("first_name", formData.first_name);
    const lastNameError = validateField("last_name", formData.last_name);
    const usernameError = validateField("username", formData.username);
    const emailError = validateField("email", formData.email);
    const phoneError = validateField("phone", formData.phone);
    const passwordError = validateField("password", formData.password);
    const cPasswordError = validateField("c_password", formData.c_password);

    if (
      !firstNameError &&
      !lastNameError &&
      !usernameError &&
      !emailError &&
      !phoneError &&
      !passwordError &&
      !cPasswordError
    ) {
      signUpMutation(
        {
          name: formData.username,
          email: formData.email,
          prefix: formData.prefix,
          phone: formData.phone,
          password: formData.password,
          c_password: formData.c_password,
        },
        {
          onSuccess: (data) => {
            setIsFailed(false);
            setMessage(data?.message || "");
            setShowVerificationModal(true);
          },
          onError: (error) => {
            setIsFailed(true);
            setMessage(error.message);
          },
        },
      );
    }
  };
  
  const hasErrors = Object.values(errors).some((error) => error !== "");

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={onRegister}>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label className="block text-white text-sm font-medium">
              {t("First Name")}
            </label>
            <TextInput
              type="text"
              placeholder="First name"
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
                errors.first_name && touched.first_name
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
              value={formData.first_name}
              onChange={(e) => handleChange("first_name", e.target.value)}
              onBlur={() => handleBlur("first_name")}
            />
            {errors.first_name && touched.first_name && (
              <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.first_name}
              </span>
            )}
          </div>
          
          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label className="block text-white text-sm font-medium">
              {t("Last Name")}
            </label>
            <TextInput
              type="text"
              placeholder="Last name"
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
                errors.last_name && touched.last_name
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
              value={formData.last_name}
              onChange={(e) => handleChange("last_name", e.target.value)}
              onBlur={() => handleBlur("last_name")}
            />
            {errors.last_name && touched.last_name && (
              <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.last_name}
              </span>
            )}
          </div>
        </div>

        {/* Username Field */}
        <div className="flex flex-col gap-2">
          <label className="block text-white text-sm font-medium">
            {t("username")}
          </label>
          <TextInput
            type="text"
            placeholder="Username"
            className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
              errors.username && touched.username
                ? "border-red-500 border-2"
                : "border-gray-300"
            }`}
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
            onBlur={() => handleBlur("username")}
          />
          {errors.username && touched.username && (
            <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.username}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="block text-white text-sm font-medium">
            {t("email")}
          </label>
          <TextInput
            type="email"
            placeholder="Email"
            className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
              errors.email && touched.email
                ? "border-red-500 border-2"
                : "border-gray-300"
            }`}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            onBlur={() => handleBlur("email")}
          />
          {errors.email && touched.email && (
            <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone Field */}
        <div className="flex flex-col gap-2">
          <label className="block text-white text-sm font-medium">
            {t("phone_number")}
          </label>
          <div className="flex gap-2">
            <select
              className="py-3 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 appearance-none cursor-pointer bg-white min-w-[100px]"
              value={formData.prefix}
              onChange={(e) => handleChange("prefix", e.target.value)}
            >
              <option value="855">+855</option>
              <option value="1">+1</option>
              <option value="86">+86</option>
              <option value="66">+66</option>
            </select>
            <TextInput
              type="tel"
              placeholder="Phone number"
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
                errors.phone && touched.phone
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              onBlur={() => handleBlur("phone")}
            />
          </div>
          {errors.phone && touched.phone && (
            <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.phone}
            </span>
          )}
        </div>

        {/* Password Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="block text-white text-sm font-medium">
              {t("password")}
            </label>
            <TextInput
              type="password"
              placeholder="Password"
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
                errors.password && touched.password
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              onBlur={() => handleBlur("password")}
            />
            {errors.password && touched.password && (
              <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.password}
              </span>
            )}
          </div>
          
          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="block text-white text-sm font-medium">
              {t("confirm_password")}
            </label>
            <TextInput
              type="password"
              placeholder="Confirm password"
              className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700 ${
                errors.c_password && touched.c_password
                  ? "border-red-500 border-2"
                  : "border-gray-300"
              }`}
              value={formData.c_password}
              onChange={(e) => handleChange("c_password", e.target.value)}
              onBlur={() => handleBlur("c_password")}
            />
            {errors.c_password && touched.c_password && (
              <span className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.c_password}
              </span>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          disabled={hasErrors || isPending}
        >
          {isPending ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Loading...
            </>
          ) : (
            <>
              <UserPen size={20} />
              {t("sign_up")}
            </>
          )}
        </button>

        {/* Login Link */}
        <div className="text-center mt-2">
          <span className="text-gray-300 text-sm">
            {t("already_have_account") || "Already have an account?"}{" "}
            <button
              type="button"
              className="text-sky-300 hover:text-sky-200 font-medium"
              onClick={() => setIsSignInPage(true)}
            >
              {t("login")}
            </button>
          </span>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-center text-sm mt-2 ${isFailed ? "text-red-400" : "text-green-400"}`}
          >
            {message}
          </p>
        )}
      </form>

      {/* Verification Modal */}
      <CodeVerificationModal
        isOpen={showVerificationModal}
        message={message}
        onClose={() => setShowVerificationModal(false)}
        onVerify={() => {}}
      />
    </>
  );
};