import { AxiosError } from 'axios';
import axiosErpInstance from '../../apiErp';
import type { ApiResponse } from '../../../types';

export interface SignUpData {
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
    const response = await axiosErpInstance.post<ApiResponse<{data: string}>>(
      '/register',
      null, 
      {
        params: {
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
}

export const login = async (data: SignInData): Promise<ApiResponse<TLoginReponse>> => {
  try {
    const response = await axiosErpInstance.post<ApiResponse<TLoginReponse>>(
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



