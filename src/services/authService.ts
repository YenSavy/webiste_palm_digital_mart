
import axiosInstance from '../lib/api';
import type { SocialLoginResponse } from '../types/auth.types';

export const loginSocialMedia = async (
  social_type: 'google' | 'facebook',
  token: string
): Promise<SocialLoginResponse> => {
  try {
    const response = await axiosInstance.post<SocialLoginResponse>(
      '/loginSocialMedia',
      {
        social_type,
        token,
      }
    );
    return response.data; 
  } catch (error: any) {
    throw error.response?.data || { 
      success: false, 
      message: error.message || 'Login failed' 
    };
  }
};