import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  ArrowLeftIcon, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { forgotPasswordSetNewPassword } from "../lib/apis/auth/authApi";
import type { ForgotPasswordResetData } from "../lib/apis/auth/authApi";

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get phone and prefix from previous page
  const { phone, prefix } = location.state || { phone: "", prefix: "855" };
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  
  const [message, setMessage] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };
  
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      newPassword: "",
      confirmPassword: "",
    };
    
    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = t("password required") || "Password is required";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t("password min length") || "Password must be at least 6 characters";
      isValid = false;
    }
    
    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = t("confirm password required") || "Please confirm your password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t("passwords not match") || "Passwords do not match";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsPending(true);
    setMessage(null);
    setIsFailed(false);
    setIsSuccess(false);
    
    try {
      // Combine phone number (prefix + phone)
      const fullPhone = prefix + phone;
      
      const payload: ForgotPasswordResetData = {
        phone: fullPhone, // Full phone number with prefix
        new_password: formData.newPassword,
        c_password: formData.confirmPassword,
      };
      
      const response = await forgotPasswordSetNewPassword(payload);
      
      if (response.success) {
        setIsSuccess(true);
        setIsFailed(false);
        setMessage(t("password reset success") || "Password reset successful!");
        
        // Redirect to login page after success
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: t("password reset success") || "Password reset successful. Please login with your new password.",
              phone,
              prefix,
            } 
          });
        }, 2000);
      } else {
        setIsFailed(true);
        setIsSuccess(false);
        setMessage(response.message || t("password reset failed") || "Failed to reset password.");
      }
    } catch (error: any) {
      setIsFailed(true);
      setIsSuccess(false);
      setMessage(error.message || t("network error") || "Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };
  
  const handleBack = () => {
    navigate("/verify-otp", { state: { phone, prefix } });
  };
  
  return (
    <section
      id="reset-password-page"
      className="flex min-h-screen items-center justify-center px-0 relative"
    >
      <button
        onClick={handleBack}
        className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20 z-50 hover:bg-black/30 transition-colors"
      >
        <ArrowLeftIcon className="text-white" />
      </button>

      <main
        className={`grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0 w-full h-screen`}
      >
        {/* Left side with background image */}
        <div
          className={`  hidden md:flex flex-col items-center justify-center p-8   relative bg-cover bg-center `}
          style={{ backgroundImage: "url('./bg-signin.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Right side with form - Full Height */}
        <div
          className={`  flex flex-col justify-center p-8 bg-gradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43] md:order-2 h-full `}
        >
          {/* PALM Logo */}
          <div className="hidden md:flex w-full justify-center mb-2">
            <img
              src="./palm technology.png"
              alt="PalmLogo"
              className="h-25 w-20"
            />
          </div>

          <div className="md:hidden text-center mb-2">
            <img
              src="./palm technology.png"
              alt="Palm Technology"
              loading="lazy"
              className="w-[100px] mx-auto mb-2"
            />
          </div>

          <div className="mt-1 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-2">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {t("reset password") || "Reset Password"}
              </h1>
              <p className="text-gray-300">
                {t("reset password instruction") || 
                  "Create a new password for your account."}
              </p>
              <div className="mt-2 text-sm text-gray-400">
                {t("for account") || "For account"}: +{prefix} {phone}
              </div>
            </div>

            {/* Reset Password Form */}
            <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
              {/* New Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-white">
                  {t("new password") || "New Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword" 
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border-2 bg-white text-gray-900  ${
                      errors.newPassword 
                        ? 'border-red-500' 
                        : 'border-[#E6D3A3]'
                    } focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300`}
                    placeholder={t("enter new password") || "Enter new password"}
                    disabled={isPending || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("newPassword")}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword.newPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.newPassword}
                  </span>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="flex flex-col gap-2">
                <label className="text-white">
                  {t("confirm_password") || "Confirm Password"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 rounded-lg border-2 bg-white text-gray-900  ${
                      errors.confirmPassword 
                        ? 'border-red-500' 
                        : 'border-[#E6D3A3]'
                    } focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300`}
                    placeholder={t("confirm new password") || "Confirm new password"}
                    disabled={isPending || isSuccess}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    className="absolute right-3 top-3 text-gray-500"
                  >
                    {showPassword.confirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-blue-900/20 p-4 rounded-lg">
                <p className="text-blue-300 text-sm font-medium mb-2">
                  {t("password_requirements") || "Password Requirements:"}
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li className={`flex items-center gap-2 ${
                    formData.newPassword.length >= 6 ? 'text-green-400' : ''
                  }`}>
                    {formData.newPassword.length >= 6 ? (
                      <CheckCircle size={14} />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-400" />
                    )}
                    {t("at least 6 characters") || "At least 6 characters"}
                  </li>
                  <li className={`flex items-center gap-2 ${
                    formData.newPassword === formData.confirmPassword && formData.confirmPassword ? 'text-green-400' : ''
                  }`}>
                    {formData.newPassword === formData.confirmPassword && formData.confirmPassword ? (
                      <CheckCircle size={14} />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-gray-400" />
                    )}
                    {t("passwords match") || "Passwords must match"}
                  </li>
                </ul>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle size={20} />
                    <p className="font-medium">{t("password reset success") || "Password reset successful!"}</p>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    {t("redirecting to login") || "Redirecting to login page..."}
                  </p>
                </div>
              )}

              {/* Message Display */}
              {message && !isSuccess && (
                <div className={`p-4 rounded-lg ${isFailed ? "bg-red-900/30 text-red-300" : "bg-blue-900/30 text-blue-300"}`}>
                  {message}
                </div>
              )}

              {/* Reset Password Button */}
              <button
                type="submit"
                className="py-4 bg-secondary rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full mt-3"
                disabled={isPending || isSuccess || !formData.newPassword || !formData.confirmPassword}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {t("resetting") || "Resetting..."}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    {t("reset successful") || "Reset Successful"}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    {t("reset password button") || "Reset Password"}
                  </>
                )}
              </button>

              {/* Back to Verify OTP Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeftIcon size={16} />
                  {t("back to verify otp") || "Back to Verify OTP"}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center mt-2">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
                >
                  {t("remember password") || "Remembered your password?"} {t("login here") || "Login here"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ResetPasswordForm;