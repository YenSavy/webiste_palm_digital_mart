import { AxiosError } from 'axios';
import type { ApiResponse } from '../../../types';
import axiosInstance from '../../api';
import { QueryClient } from '@tanstack/react-query';

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
}QueryClient


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
  try {
    const fullPhoneNumber = data.prefix + data.phone;
    
    const response = await axiosInstance.post(
      '/resend-verification-code', 
      {
        phone: fullPhoneNumber,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

