import type { TPricingProps } from "../../../components/shared/home/Pricing"
import type { ApiResponse } from "../../../types"
import axiosInstance from "../../api"

export const fetchPlans = async () => {
    const res = await axiosInstance.get<ApiResponse<TPricingProps[]>> ("/get-pricing_plan/"+import.meta.env.VITE_COMPANY_ID)
    return res.data
}