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
