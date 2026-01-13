import type { ApiResponse } from "../../../types";
import axiosInstance from "../../api";

export type TCreateUserProfileInput = {
  gender: string;
  profile_type: number;
  first_name: string;
  last_name: string;
  nick_name: string;
  email: string;
  telephone: string;
  village: string;
  facebook: string;
  twitter: string;
  link: string;
  position: number;
  date_of_employment: string;
  branch: number;
  company: number;
  project: number;
};

type Position = {
  id: string;
  company_id: string;
  position_km: string;
  position_en: string;
  created_by: string;
  updated_by: string | null;
  status: string;
  description: string | null;
  created_at: string | null;
  updated_at: string;
};

export type TCreateUserProfileResponse = {
  profile_id: string;
  profile_type_id: number;
  title: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  full_name: string;
  email: string;
  phone1: string;
  address: string;
  facebook: string;
  twitter: string;
  linkin: string;
  position_id: number;
  start_date: string;
  branch_id: number;
  company_id: number;
  project_id: number;
  temp_profile: string;
  id_card_pic: string;
  status: number;
  updated_at: string;
  created_at: string;
  position_en: string;
  position: Position;
};

export const createUserProfile = async (payload: TCreateUserProfileInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreateUserProfileResponse>>(
    "/profile",
    payload
  );
  return res.data;
};
export const deleteUserProfile = async (id: string) => {
  const res = await axiosInstance.delete<{ status: number; message: string }>(
    "/profile/" + id
  );
  return res.data;
};

export type TCreateUserInput = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  profile: string;
};

export type TCreateUserResponse = {
  name: string;
  email: string;
  profile_id: string;
  role: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  id: number;
};

export const createUser = async (payload: TCreateUserInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreateUserResponse>>(
    "/user",
    payload
  );
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete<{ status: number; message: string }>(
    "/user" + id
  );
  return res.data;
};
