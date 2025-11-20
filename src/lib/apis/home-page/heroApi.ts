import type { THeroContent, THeroFeature } from "../../../components/shared/home/Hero";
import type { ApiResponse } from "../../../types";
import axiosInstance from "../../api";

export const fetchHeroContent = async () => {
  const res = await axiosInstance.get<ApiResponse<THeroContent[]>>("/get-homepage_content/" + import.meta.env.VITE_COMPANY_ID);
  return res.data
}

export const fetchHeroFeature = async () => {
    const res= await axiosInstance.get<ApiResponse<THeroFeature[]>>("/get-homepage_feature/" + import.meta.env.VITE_COMPANY_ID)
    return res.data
}
