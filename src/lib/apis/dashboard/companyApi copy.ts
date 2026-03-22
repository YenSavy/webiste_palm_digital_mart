import type { ApiResponse } from "../../../types";
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

export type TCreateWarehouseInput = {
  company: number | string;
  branch: number | string;
  warehouse_km: string;
  warehouse_en: string;
  address: string;
  description: string;
};

export type TCreateWarehouseResponse = {
  id: string;
  company_id: number | string;
  branch_id: number | string;
  name_kh: string;
  name_en: string;
  address: string;
  note: string;
  created_by: string | number;
  updated_at: string;
  created_at: string;
};

export type TGetPlanResponse = {
  pricing_plan_id: string;
  plan_name: string;
  plan_price: number;
  plan_description: string;
  created_at: string;
  updated_at: string;
};


export type TPricingFeature = {
  feature_id: string;
  feature_name_km: string;
  feature_name_en: string;
};
 
export type TPricingPlan = {
  pricing_plan_id: string;
  plan_name: string;
  plan_name_km: string;
  plan_price_monthly: number;
  plan_price_yearly: number;
  is_popular: boolean;
  features: TPricingFeature[];
  created_at: string;
  updated_at: string;
};
 
export type TCompanySubscription = {
  subscription_id: string;
  company_id: string;
  pricing_plan_id: string;
  billing_type: "monthly" | "yearly";
  start_date: string;
  end_date: string;
  status: "active" | "inactive" | "expired";
  plan: TPricingPlan;
  created_at: string;
  updated_at: string;
};
 
export type TPaginationParams = {
  page?: number;
  limit?: number;
  search?: string;
};
 

export const saveCompanyInfo = async (
  company_name_en: string,
  village: string
) => {
  const res = await axiosInstance.post<ApiResponse<TSaveCompanyResponse>>(
    "/company/create",
    null,
    {
      params: {
        company_name_en,
        village,
      },
    }
  );
  return res.data;
};

export const createBranch = async (payload: TCreateBranchInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreateBranchResponse>>(
    "/branches",
    payload
  );
  return res.data;
};

export const createWarehouse = async (payload: TCreateWarehouseInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreateWarehouseResponse>>(
    "/warehouse",
    payload
  );
  return res.data;
};

export type TCreatePositionInput = {
  company_id: string;
  position_km: string;
  position_en: string;
  description: string;
};

export type TCreatePositionResponse = {
  id: string;
  company_id: 1;
  position_km: string;
  position_en: string;
  description: string;
  created_by: string | number;
  updated_at: string;
  created_at: string;
};

export const createPosition = async (payload: TCreatePositionInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreatePositionResponse>>(
    "/position",
    payload
  );
  return res.data;
};


export type TCreateCurrencyInput = {
  crrcode: string;
  crrname: string;
  crrbase: number;
  crrsymbol: string;
  rate: number;
};

export type TCreateCurrencyResponse = {
  company_id: string;
  currency_id: string;
  currencycode: string;
  currencyname: string;
  default: number;
  currency: string;
  rate: number;
  updated_at: string;
  created_at: string;
};

export const createCurrency = async (payload: TCreateCurrencyInput) => {
  const res = await axiosInstance.post<ApiResponse<TCreateCurrencyResponse>>(
    "/currency",
    null,
    {
      params: {
        crrcode: payload.crrcode,
        crrname: payload.crrname,
        crrbase: payload.crrbase,
        crrsymbol: payload.crrsymbol,
        rate: payload.rate,
      },
    }
  );
  return res.data;
};

export type TPlanSubscriptionInput = {
  company_id: string;
  pricing_plan_id: string;
};

export const subscribePlan = async (payload: TPlanSubscriptionInput) => {
  const res = await axiosInstance.post<{ status: number; message: string }>(
    "/company/subscribe",
    null,
    {
      params: payload,
    }
  );
  return res.data;
};

export const unsubscribePlan = async (payload: TPlanSubscriptionInput) => {
  const res = await axiosInstance.post<{ status: number; message: string }>(
    "/company/unsubscribe",
    null,
    {
      params: payload,
    }
  );
  return res.data;
};

 
export const getPlans = async (params?: TPaginationParams) => {
  const res = await axiosInstance.get<ApiResponse<TPricingPlan[]>>(
    "/pricing-plans",
    { params }
  );
  return res.data;
};
 

export const getPlanById = async (pricing_plan_id: string) => {
  const res = await axiosInstance.get<ApiResponse<TPricingPlan>>(
    `/pricing-plans/${pricing_plan_id}`
  );
  return res.data;
};
 

export const getCompanySubscription = async (company_id: string) => {
  const res = await axiosInstance.get<ApiResponse<TCompanySubscription>>(
    "/company/subscribe",
    {
      params: { company_id },
    }
  );
  return res.data;
};