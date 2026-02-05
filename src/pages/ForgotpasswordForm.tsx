import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, Phone, AlertCircle, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordSendOTP } from "../lib/apis/auth/authApi";
import type { ForgotPasswordSendOTPData } from "../lib/apis/auth/authApi";

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [message, setMessage] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    prefix: "855",
    phone: "",
  });
  
  const [errors, setErrors] = useState({
    phone: "",
  });
  
  const [touched, setTouched] = useState({
    phone: false,
  });

  // Validate phone number
  const validatePhone = () => {
    const { prefix, phone } = formData;
    let error = "";
    
    if (!phone.trim()) {
      error = t("phone number required") || "Phone number is required";
    } else if (!/^[0-9]+$/.test(phone)) {
      error = t("invalid phone number") || "Phone number must contain only digits";
    } else if (phone.length < 8) {
      error = t("phone number min length") || "Phone number must be at least 8 digits";
    } else if (phone.length > 15) {
      error = t("phone number max length") || "Phone number is too long";
    }
    
    setErrors(prev => ({ ...prev, phone: error }));
    return !error;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate the field
    if (field === "phone") validatePhone();
  };

  // Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePhone()) return;
    
    setIsPending(true);
    setMessage(null);
    setIsFailed(false);
    setIsSuccess(false);
    
    try {
      const payload: ForgotPasswordSendOTPData = {
        prefix: formData.prefix,
        phone: formData.phone,
      };
      
      const response = await forgotPasswordSendOTP(payload);
      
      if (response.success) {
        setIsSuccess(true);
        setIsFailed(false);
        setMessage(t("otp sent") || "Verification code has been sent to your phone.");
        
        // Redirect to OTP verification page after success
        setTimeout(() => {
          navigate("/verify-otp", { 
            state: { 
              phone: formData.phone,
              prefix: formData.prefix 
            } 
          });
        }, 1500);
      } else {
        setIsFailed(true);
        setIsSuccess(false);
        setMessage(response.message || t("failed_to_send_otp") || "Failed to send verification code.");
      }
    } catch (error: any) {
      setIsFailed(true);
      setIsSuccess(false);
      setMessage(error.message || t("network_error") || "Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/login");
  };

  return (
    <section id="forgot-password-page"className="flex min-h-screen items-center justify-center px-0 relative">
      <button onClick={handleBack} className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20 z-50 hover:bg-black/30 transition-colors">
        <ArrowLeftIcon className="text-white" />
      </button>

      <main
        className={`grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0 w-full h-screen`}
      >
        {/* Left side with background image */}
        <div
          className={` hidden md:flex flex-col items-center justify-center p-8 relative bg-cover bg-center`}
          style={{ backgroundImage: "url('./bg-signin.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Right side with form - Full Height */}
        <div
          className={`flex flex-col justify-center p-8 bg-gradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43] md:order-2 h-full `} >
          {/* PALM Logo */}
          <div className="hidden md:flex w-full justify-center mb-6">
            <img src="./palm technology.png" alt="PalmLogo"className="h-25 w-20" />
          </div>

          <div className="md:hidden text-center mb-8">
            <img src="./palm technology.png" alt="Palm Technology" loading="lazy" className="w-[100px] mx-auto mb-4" />
          </div>

          <div className="mt-1 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <LockKeyhole className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {t("forgot password") || "Forgot Password?"}
              </h1>
              <p className="text-gray-300">
                {t("forgot password phone instruction") ||"Enter your phone number to receive a verification code to reset your password."}
              </p>
            </div>

            {/* Request OTP Form */}
            <form className="flex flex-col gap-1" onSubmit={handleRequestOTP}>
              <div className="flex flex-col gap-2">
                <label className="flex gap-2 items-center text-white">
                  <Phone size={20} />
                  {t("Phone Number") || "Phone Number"}
                </label>
                
                <div className="flex gap-2">
                  {/* Country Code */}
                  <div className="relative flex-shrink-0 w-24">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+</span>
                    </div>
                    <select
                      value={formData.prefix}
                      onChange={(e) => handleChange("prefix", e.target.value)}
                      className="w-full px-8 py-3 rounded-lg border text-gray-900 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 appearance-none"
                      disabled={isSuccess}
                    >
                      <option value="855">855</option>
                      <option value="1">1</option>
                      <option value="44">44</option>
                      <option value="86">86</option>
                      <option value="84">84</option>
                      <option value="66">66</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder={t("enter your phone") || "Enter your phone number"}
                      className={`w-full px-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white ${
                        errors.phone && touched.phone  ? 'border-red-500'  : 'border-[#E6D3A3]'
                       } focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300`}
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      onBlur={() => handleBlur("phone")}
                      disabled={isSuccess}
                    />
                  </div>
                </div>
                
                {errors.phone && touched.phone && (
                  <span className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </span>
                )}
                
                <div className="text-xs text-gray-400 mt-1">
                  {t("phone verification note") || "We'll send a verification code to this number"}
                </div>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">{t("otp sent") || "Verification code sent!"}</p>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    {t("check your phone") || "Please check your phone for the verification code."}
                  </p>
                  <p className="text-green-200 text-sm mt-2">
                    {t("redirecting to verify") || "Redirecting to verification page..."}
                  </p>
                </div>
              )}

              {/* Message Display */}
              {message && !isSuccess && (
                <div className={`p-4 rounded-lg ${isFailed ? "bg-red-900/30 text-red-300" : "bg-blue-900/30 text-blue-300"}`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full"
                disabled={!!errors.phone || isPending || isSuccess || !formData.phone.trim()}
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {t("sending verification code") || "Sending verification code..."}
                  </>
                ) : isSuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t("code sent") || "Code sent"}
                  </>
                ) : (
                  <>
                    <Phone size={20} />
                    {t("send verification code") || "Send Verification Code"}
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeftIcon size={16} />
                  {t("back to login") || "Back to Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};

export default ForgotPasswordPage;