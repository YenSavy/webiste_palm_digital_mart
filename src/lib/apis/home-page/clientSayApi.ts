import type { TClientSay } from "../../../components/shared/home/ClientSay"
import type { ApiResponse } from "../../../types"
import axiosInstance from "../../api"

export const fetchClientSay = async () => {
    const res = await axiosInstance.get<ApiResponse<TClientSay[]>>("/get-client_say/"+import.meta.env.VITE_COMPANY_ID)
    return res.data
}