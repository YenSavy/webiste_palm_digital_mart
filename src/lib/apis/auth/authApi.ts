import { AxiosError } from 'axios';
import type { ApiResponse } from '../../../types';
import axiosInstance from '../../api';

export interface SignUpData {
  firstname:string;
  lastname:string;
  name: string;
  email: string;
  prefix: string;
  phone: string;
  password: string;
  c_password: string;
}

export interface SignInData{
    name: string
    password: string;
}

// Forgot Password Interfaces
export interface ForgotPasswordSendOTPData {
  prefix: string;
  phone: string;
}

export interface ForgotPasswordVerifyOTPData {
  phone: string; // Full phone number with prefix
  code_verify: string;
}

export interface ForgotPasswordResetData {
  phone: string; // Full phone number with prefix
  new_password: string;
  c_password: string;
}

export const signUp = async (data: SignUpData): Promise<ApiResponse<{data: string}>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<{data: string}>>(
      '/register',
      null, 
      {
        params: {
          firstname:data.firstname,
          lastname:data.lastname,
          name: data.name,
          email: data.email,
          prefix: data.prefix,
          phone: data.phone,
          password: data.password,
          c_password: data.c_password,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.data || 'Sign in failed');
    }
    throw error;
  }
};

type TLoginReponse ={
  name: string;
  phone: string;
  email: string;
  status: string;
  token: string;
  full_name: string | null;
}

export const login = async (data: SignInData): Promise<ApiResponse<TLoginReponse>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<TLoginReponse>>(
      '/login',
      null, 
      {
        params: {
          name: data.name,
          password: data.password,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message);
    }
    throw error;
  }
};

export type TSocialLoginInput = {
  social_type: "google" | "facebook";
  token: string;
}

export const socialLogin = async (payload: TSocialLoginInput) => {
  const res = await axiosInstance.post<{success: boolean, message: string}>("/login-with-social-media", null, {
    params: payload,
  })
  return res.data
}

export interface VerifySignupCodeData {
  prefix: string;
  phone: string;
  code: string; 
}

export const verifySignupCode = async (
  data: VerifySignupCodeData
): Promise<ApiResponse<TLoginReponse>> => {
  const fullPhoneNumber = (data.prefix + data.phone).replace(/\D/g, '');
  const phoneWithoutCountryCode = fullPhoneNumber.replace(/^855/, '');
  
  const res = await axiosInstance.post('/verify-phone', null, {
    params: {
      phone: phoneWithoutCountryCode, 
      verify_code: data.code.trim(),
    },
  });
  return res.data;
};

export const resendVerificationCode = async (data: { 
  prefix: string; 
  phone: string; 
}): Promise<ApiResponse<{ success: boolean; message?: string }>> => {

    const fullPhoneNumber = (data.prefix + data.phone).replace(/\D/g, '');
    const phoneWithoutCountryCode = fullPhoneNumber.replace(/^855/, '');

    const response = await axiosInstance.post(
      '/resend-verification-code', 
      null,
      {
        params: {
          phone: phoneWithoutCountryCode,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
};

export const forgotPasswordSendOTP = async (
  data: ForgotPasswordSendOTPData
): Promise<ApiResponse<{ success: boolean; message?: string }>> => {
  try {
    const response = await axiosInstance.post<ApiResponse<{ success: boolean; message?: string }>>(
      '/send-otp-forget-password',
      null,
      {
        params: {
          prefix: data.prefix,
          phone: data.phone,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
    throw error;
  }
};

export const forgotPasswordVerifyOTP = async (
  data: ForgotPasswordVerifyOTPData
): Promise<ApiResponse<{ success: boolean; message?: string }>> => {
  try {

    const phoneWithoutCountryCode = data.phone.replace(/^855/, '');
    
    const response = await axiosInstance.post<ApiResponse<{ success: boolean; message?: string }>>(
      '/verify-code-forget-password',
      null,
      {
        params: {
          phone: phoneWithoutCountryCode, 
          code_verify: data.code_verify,
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
    throw error;
  }
};

export const forgotPasswordSetNewPassword = async (
  data: ForgotPasswordResetData
): Promise<ApiResponse<{ success: boolean; message?: string }>> => {
  try {
    const fullPhoneNumber = data.phone.replace(/\D/g, '');
    const phoneWithoutCountryCode = fullPhoneNumber.replace(/^855/, '');
    
    const formattedPhone = phoneWithoutCountryCode.replace(/^\+0+/, '');
    
    const response = await axiosInstance.post(
      '/forget-password-set-new-password',
      {
        phone: formattedPhone,
        new_password: data.new_password,
        c_password: data.c_password,
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorResponse = error.response?.data;
      
      if (errorResponse?.message && typeof errorResponse.message === 'object') {
        const errorMessages = Object.values(errorResponse.message).flat().join(', ');
        throw new Error(errorMessages);
      }
      
      const message = errorResponse?.message || 'Failed to reset password';
      throw new Error(typeof message === 'string' ? message : 'Failed to reset password');
    }

    throw new Error('Server error');
  }
};
export const formatPhone = (phone: string, prefix?: string): string => {
  let fullPhoneNumber = phone;
  if (prefix) {
    fullPhoneNumber = prefix + phone;
  }
  fullPhoneNumber = fullPhoneNumber.replace(/\D/g, '');
  let formatted = fullPhoneNumber.replace(/^855/, '');
  formatted = formatted.replace(/^\+0+/, '');
  return formatted;
};