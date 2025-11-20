import type { TFooter } from "../../../components/shared/home/Footer";
import type { TWhyUS } from "../../../components/shared/home/WhyUs";
import type { ApiResponse } from "../../../types";
import axiosInstance from "../../api";

export const fetchWhyUs = async () => {
  const res = await axiosInstance.get<ApiResponse<TWhyUS[]>>(
    "/get-system_feature/" + import.meta.env.VITE_COMPANY_ID
  );
  return res.data;
};

export const fetchFooter = async () => {
  const res = await axiosInstance.get<ApiResponse<TFooter[]>>(
    "/get-contact_footer/" + import.meta.env.VITE_COMPANY_ID
  );
  return res.data
};
