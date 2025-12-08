import axiosInstance from "../../api";

export type TSaveCompanyResponse = {
  company_id: string;
  company_code: string;
  company_name_km: string;
  company_name_en: string;
  village: string;
  company_email: string;
  company_phone: string;
  address_en: string;
  address_km: string;
  created_by: number;
  company_profile: string | null;
  home_str: string;
  road_str: string;
  created_at: string;
  updated_at: string;
};


export type TCreateBranchInput = {
  branch_name_km: string;
  branch_name_en: string;
  company: string; 
  branch_email: string;
  branch_phone: string;
  branch_address_en: string;
  lat: string;
  lng: string;
  telegram: string;
};


export type TCreateBranchResponse = {
  branch_id: string;
  branch_code: string;
  branch_name_km: string;
  branch_name_en: string;
  company: string;
  branch_email: string;
  branch_phone: string;
  branch_address_en: string;
  branch_address_km?: string;
  lat: string;
  lng: string;
  telegram: string;
  created_by: number;
  branch_profile?: string | null;
  created_at: string;
  updated_at: string;
};

export const saveCompanyInfo = async (
  company_name_en: string,
  village: string
) => {
  const res = await axiosInstance.post<{
    status: string;
    data: TSaveCompanyResponse;
  }>("/company/create", null, {
    params: {
      company_name_en,
      village,
    },
  });
  return res.data;
};


export const createBranch = async (payload: TCreateBranchInput) => {
  const res = await axiosInstance.post<{
    status: string;
    data: TCreateBranchResponse;
  }>("/branches", payload);
  
  return res.data;
};