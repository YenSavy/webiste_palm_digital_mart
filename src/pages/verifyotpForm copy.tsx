import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftIcon, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  forgotPasswordVerifyOTP, 
  forgotPasswordSendOTP,
  combinePhoneNumber 
} from "../lib/apis/auth/authApi";
import type { 
  ForgotPasswordVerifyOTPData,
  ForgotPasswordSendOTPData 
} from "../lib/apis/auth/authApi";

const VerifyOTPForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get phone and prefix from previous page
  const { phone, prefix } = location.state || { phone: "", prefix: "855" };
  const fullPhone = combinePhoneNumber(prefix, phone);
  
  const [message, setMessage] = useState<string | null>(null);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [resendPending, setResendPending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [errors, setErrors] = useState({
    otp: "",
  });
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user starts typing
    if (errors.otp) {
      setErrors({ otp: "" });
    }
    
    // Auto-focus next input
    if (value && index < 3) { 
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 3) { 
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      const newOtp = [...otp];
      
      digits.forEach((digit, index) => {
        if (index < 4) { 
          newOtp[index] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus last input
      const lastIndex = Math.min(3, digits.length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const validateOTP = (): boolean => {
    const otpString = otp.join("");
    
    // Changed from 6 to 4 digits
    if (otpString.length !== 4) {
      setErrors({ otp: t("otp_length") || "Please enter all 4 digits" });
      return false;
    }

    if (!/^\d{4}$/.test(otpString)) {
      setErrors({ otp: t("invalid_otp") || "OTP must be 4 digits" });
      return false;
    }
    
    return true;
  };

  // Verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) return;
    
    setIsPending(true);
    setMessage(null);
    setIsFailed(false);
    setIsSuccess(false);
    
    try {
      const payload: ForgotPasswordVerifyOTPData = {
        phone: fullPhone,
        code_verify: otp.join(""),
      };
      
      const response = await forgotPasswordVerifyOTP(payload);
      
      if (response.success) {
        setIsSuccess(true);
        setIsFailed(false);
        setMessage(t("otp_verified") || "Verification successful!");
        
        // Redirect to reset password page after success
        setTimeout(() => {
          navigate("/reset-password", { 
            state: { 
              phone,
              prefix,
              verified: true 
            } 
          });
        }, 1500);
      } else {
        setIsFailed(true);
        setIsSuccess(false);
        setMessage(response.message || t("invalid_otp_code") || "Invalid verification code.");
      }
    } catch (error: any) {
      setIsFailed(true);
      setIsSuccess(false);
      setMessage(error.message || t("network_error") || "Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0 || resendPending) return;
    
    setResendPending(true);
    setMessage(null);
    setIsFailed(false);
    
    try {
      const payload: ForgotPasswordSendOTPData = {
        prefix,
        phone,
      };
      
      const response = await forgotPasswordSendOTP(payload);
      
      if (response.success) {
        setIsSuccess(true);
        setCountdown(60); // Reset countdown
        setMessage(t("otp_resent") || "New verification code has been sent.");
      } else {
        setIsFailed(true);
        setMessage(response.message || t("failed_to_resend_otp") || "Failed to resend verification code.");
      }
    } catch (error: any) {
      setIsFailed(true);
      setMessage(error.message || t("network_error") || "Network error. Please try again.");
    } finally {
      setResendPending(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    navigate("/forgot-password");
  };

  return (
    <section
      id="verify-otp-page"
      className="flex min-h-screen items-center justify-center px-0 relative"
    >
      <button onClick={handleBack} className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20 z-50 hover:bg-black/30 transition-colors">
        <ArrowLeftIcon className="text-white" />
      </button>

      <main
        className={`grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0 w-full h-screen`}
      >
        {/* Left side with background image */}
        <div
          className={`  hidden md:flex flex-col items-center justify-center p-8  relative bg-cover bg-center `}
          style={{ backgroundImage: "url('./bg-signin.png')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className={`flex flex-col justify-center p-8 bg-gradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43] md:order-2 h-full`} >
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
              className="w-[100px] mx-auto mb-4"
            />
          </div>

          <div className="mt-1 max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {t("verify otp") || "Verify OTP"}
              </h1>
              <p className="text-gray-300">
                {t("verify otp instruction") || 
                  "Enter the 4-digit verification code sent to your phone."} {/* Changed from 6 to 4 */}
              </p>
              <div className="mt-2 text-sm text-secondary">
                {t("sent to") || "Sent to"}: +{prefix} {phone}
              </div>
            </div>

            {/* Verify OTP Form */}
            <form className="flex flex-col gap-5" onSubmit={handleVerifyOTP}>
              <div className="flex flex-col gap-2">
                <label className="text-white mb-2">
                  {t("verification code") || "Verification Code"}
                </label>
                
                <div className="flex justify-center gap-3 mb-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {inputRefs.current[index] = el;}}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 ${
                        errors.otp ? 'border-red-500 bg-gray-500' : 'border-[#E6D3A3] bg-gray-500' } focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300`}
                      disabled={isSuccess || isPending} />
                  ))}
                </div>
                
                {errors.otp && (
                  <span className="text-red-400 text-sm flex items-center gap-1 justify-center">
                    <AlertCircle size={14} />
                    {errors.otp}
                  </span>
                )}
              </div>

              {/* Resend OTP Section */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-gray-400 text-sm">
                    {t("resend in") || "Resend code in"} {countdown} {t("seconds") || "seconds"}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendPending}
                    className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    <RefreshCw size={16} className={resendPending ? "animate-spin" : ""} />
                    {resendPending 
                      ? (t("resending") || "Resending...") 
                      : (t("resend otp") || "Resend OTP")}
                  </button>
                )}
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="p-4 bg-green-900/30 border border-green-700 rounded-lg">
                  <div className="flex items-center gap-2 text-green-300">
                    <CheckCircle size={20} />
                    <p className="font-medium">{t("otp_verified") || "Verification successful!"}</p>
                  </div>
                  <p className="text-green-200 text-sm mt-1">
                    {t("redirecting_to_reset") || "Redirecting to reset password page..."}
                  </p>
                </div>
              )}

              {/* Message Display */}
              {message && !isSuccess && (
                <div className={`p-4 rounded-lg ${isFailed ? "bg-red-900/30 text-red-300" : "bg-blue-900/30 text-blue-300"}`}>
                  {message}
                </div>
              )}

              {/* Verify Button */}
              <button
                type="submit"
                className="py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed w-full"
                disabled={otp.join("").length !== 4 || isPending || isSuccess} 
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    {t("verifying") || "Verifying..."}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle size={20} />
                    {t("verified") || "Verified"}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    {t("verify_code") || "Verify Code"}
                  </>
                )}
              </button>

              {/* Back to Forgot Password Link */}
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-400 hover:text-blue-300 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  <ArrowLeftIcon size={16} />
                  {t("back to forgot password") || "Back to Forgot Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
};

export default VerifyOTPForm;