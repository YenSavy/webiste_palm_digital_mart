import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, ArrowLeftIcon, Lock, Mail, Phone, User, UserPen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../lib/apis/auth/authApi";



interface SignUpFormProps {
  setIsSignInPage?: (value: boolean) => void; 
}

const SignUpForm: React.FC<SignUpFormProps> = ({ setIsSignInPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, setMessage] = useState<string>('');
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [countryCode, setCountryCode] = useState<string>('855');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    username: false,
    email: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false
  });

  const validateField = (name: keyof typeof formData, value: string) => {
    let error = '';

    switch (name) {
      case 'firstName':
        if (!value.trim()) error = t('first_name_required') || 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = t('last_name_required') || 'Last name is required';
        break;
      case 'username':
        if (!value.trim()) error = t('username_required') || 'Username is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = t('email_required') || 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = t('email_invalid') || 'Please enter a valid email';
        }
        break;
      case 'phoneNumber':
        if (!value.trim()) error = t('phone_required') || 'Phone number is required';
        break;
      case 'password':
        if (!value.trim()) {
          error = t('password_required') || 'Password is required';
        } else if (value.length < 6) {
          error = t('password_min_length') || 'Password must be at least 6 characters';
        }
        break;
      case 'confirmPassword':
        if (!value.trim()) {
          error = t('confirm_password_required') || 'Please confirm your password';
        } else if (value !== formData.password) {
          error = t('password_mismatch') || 'Passwords do not match';
        }
        break;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleBlur = (field: keyof typeof formData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      validateField(field, value);
    }
    
    if (field === 'password' && touched.confirmPassword) {
      validateField('confirmPassword', formData.confirmPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const newTouched = Object.keys(touched).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {} as typeof touched);
    setTouched(newTouched);
    
    // Validate all fields
    const validationErrors = {
      firstName: validateField('firstName', formData.firstName),
      lastName: validateField('lastName', formData.lastName),
      username: validateField('username', formData.username),
      email: validateField('email', formData.email),
      phoneNumber: validateField('phoneNumber', formData.phoneNumber),
      password: validateField('password', formData.password),
      confirmPassword: validateField('confirmPassword', formData.confirmPassword)
    };
    
    const hasError = Object.values(validationErrors).some(error => error !== '');
    
if (!hasError) {
  setIsPending(true);
  setIsFailed(false);
  setMessage('');

  try {
    await signUp({
      firstname: formData.firstName,
      lastname: formData.lastName,
      name: formData.username,
      email: formData.email,
      prefix: countryCode,
      phone: formData.phoneNumber,
      password: formData.password,
      c_password: formData.confirmPassword,
    });

    const fullPhoneNumber = `+${countryCode}${formData.phoneNumber}`;

    navigate('/phone-verification', {
      state: {
        phoneNumber: fullPhoneNumber,
        prefix: countryCode,
        phone: formData.phoneNumber,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
    });
  } catch (err: any) {
    setIsFailed(true);
    setMessage(err.message || 'Signup failed');
  } finally {
    setIsPending(false);
  }
}

  };

  const handleSignInClick = () => {
    if (setIsSignInPage) {
      setIsSignInPage(true);
    } else {
      navigate('/signup');
    }
  };

  const hasFormErrors = Object.values(errors).some(error => error !== '');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
         style={{ backgroundImage: "url('./bg-signup.png')"}}>   
      <Link 
        to={"/"} 
        className="p-3 bg-black/20 rounded absolute top-20 left-5 md:left-14 lg:left-20 z-50 hover:bg-black/30 transition-colors">
        <ArrowLeftIcon className="text-white" />
      </Link>

      <div className="mb-8 text-center">
        <img src="./palm technology.png" alt="PALM Logo" className="w-24 h-24 mx-auto mb-3 object-contain" />
        <p className="text-gray-600">Create your new account PalmBiz</p>
      </div>

      {/* Sign Up Form */}
      <div className="w-full max-w-md bg-gray-200/40 backdrop-blur-lg rounded-xl shadow-lg p-8 border border-white/30">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name & Last Name - Inline */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('First name') || 'First Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('First name') || 'First name'}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                    errors.firstName && touched.firstName 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                />
              </div>
              {errors.firstName && touched.firstName && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle size={14} />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t('Last name') || 'Last Name'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t('Last name') || 'Last name'}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                    errors.lastName && touched.lastName 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                />
              </div>
              {errors.lastName && touched.lastName && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle size={14} />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('username') || 'Username'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserPen size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('username') || 'Username'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                  errors.username && touched.username 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                onBlur={() => handleBlur('username')}
              />
            </div>
            {errors.username && touched.username && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('email') || 'Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder={t('email') || 'Email'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                  errors.email && touched.email 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.email}
              </p>
            )}
          </div>
          
          {/* Phone Number with Country Code */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('phone_number') || 'Phone Number'}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-shrink-0 w-24">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">+</span>
                </div>
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-full px-8 py-3 rounded-lg border text-gray-900 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 appearance-none"
                >
                  <option value="855">855</option>
                  <option value="1">1</option>
                  <option value="44">44</option>
                  <option value="86">86</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={20} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  placeholder={t('phone_number') || 'Phone number'}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                    errors.phoneNumber && touched.phoneNumber 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  }`}
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                />
              </div>
            </div>
            {errors.phoneNumber && touched.phoneNumber && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('password') || 'Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder={t('password') || 'Password'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                  errors.password && touched.password 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t('confirm_password') || 'Confirm Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder={t('confirm_password') || 'Confirm password'}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border text-gray-900 placeholder:text-gray-400 bg-white border-[#E6D3A3] focus:border-[#D4AF37] focus:shadow-[0_0_12px_rgba(212,175,55,0.4)] outline-none transition-all duration-300 ${
                  errors.confirmPassword && touched.confirmPassword 
                    ? 'border-red-500' 
                    : 'border-gray-300'
                }`}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={hasFormErrors || isPending}
            className="w-full bg-gray-900 text-white py-3 py-4 bg-secondary mt-3 rounded-3xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                {t('signing_up') || 'Signing up...'}
              </>
            ) : (
              <>
                <UserPen size={20} />
                {t('sign_up') || 'Sign Up'}
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center pt-4">
            <span className="text-gray-600 text-sm">
              {t('already_have_account') || 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {t('sign_in') || 'Sign In'}
              </button>
            </span>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`text-center p-3 rounded-lg ${
              isFailed ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        
      </div>
    </div>
  );
};

export default SignUpForm;