import React, { useEffect, useRef, useState } from "react";
import { verifySignupCode, resendVerificationCode } from "../lib/apis/auth/authApi";
import { useNavigate, useLocation } from "react-router-dom";

const PhoneVerifyForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);

  const { prefix, phone } = location.state as { prefix: string; phone: string } || { prefix: "", phone: "" };

  useEffect(() => {
    if (!prefix || !phone) {
      navigate('/signup');
    }
  }, [prefix, phone, navigate]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const code = otp.join("");
    if (code.length === 4) {
      submit(code);
    }
  }, [otp]);

  const submit = async (code: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log(" DEBUG - Sending verification:", {
        prefix,
        phone,
        code,
        fullPhoneNumber: `${prefix}${phone}`
      });
      const res = await verifySignupCode({
        prefix,
        phone,
        code,
      });

      console.log(" API Response:", res);

      // save token
      localStorage.setItem("token", res.data.token);

      // redirect
      navigate("/dashboard");
    } catch (err: any) {
      console.error(" Verification error:", {
        error: err,
        message: err.message,
        response: err.response?.data
      });
      
      let errorMessage = err.message || "Invalid code";
      
      if (err.response?.data?.error?.verify_code) {
        errorMessage = err.response.data.error.verify_code[0];
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 401) {
        errorMessage = "Unauthorized. Please check your authentication.";
      }
      
      setError(errorMessage);
      setOtp(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setResendLoading(true);
      setResendSuccess(false);
      setError(null);
      
      console.log(" Resending code to:", `${prefix}${phone}`);
      
      await resendVerificationCode({
        prefix,
        phone,
      });
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err: any) {
      console.error(" Resend error:", err);
      setError(err.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.removeItem("token");
    
    navigate("/login");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg gradient-to-r from-[#102A43] via-[#0D3C73] to-[#102A43] p-4">
      <div className="w-full max-w-md bg-white/30 backdrop-blur-lg rounded-2xl shadow-xl  p-8 border border-white/40">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary mb-2">Enter your Code</h1>
          <p className="text-gray-600">
            we've sent to
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-1">
            +{prefix} {phone}
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="mb-8">
          <div className="flex justify-center gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputsRef.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className=" w-14 h-14 text-center text-2xl font-bold  text-gray-800  bg-white  border-2 border-gray-300  rounded-xl  focus:outline-none  focus:border-blue-500 focus:ring-2 focus:ring-blue-200  transition-all
"

                disabled={loading}
              />
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center font-medium">{error}</p>
              <p className="text-red-500 text-center text-sm mt-1">
                សូមពិនិត្យកូដម្តងទៀត ឬចុច "Sent again" ដើម្បីទទួលកូដថ្មី
              </p>
            </div>
          )}

          {loading && (
            <p className="text-center text-blue-500 text-sm mb-4">
              Verifying code...
            </p>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-center text-sm">
                 Code sent successfully! Please check your phone.
              </p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleLoginRedirect}
            className="w-full py-3 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Log In
          </button>

          <button
            onClick={handleResendCode}
            disabled={resendLoading || loading}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? "Sending..." : "Sent again"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            Didn't receive the code? Check your spam folder or{" "}
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-blue-600 font-medium hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              request a new code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerifyForm;