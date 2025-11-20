import type { TVideoType } from "../../../components/shared/home/Advertising"
import type { PaginatedResponse } from "../../../types"
import axiosInstance from "../../api"

export const fetchVideo = async () => {
    const res = await axiosInstance.get<PaginatedResponse<TVideoType[]>>("/get-video_feature/" + import.meta.env.VITE_COMPANY_ID)
    return res.data
}
export const fetchVideoPodcast = async () => {
    const res = await axiosInstance.get<PaginatedResponse<TVideoType[]>>("/get-video_podcast/" + import.meta.env.VITE_COMPANY_ID)
    return res.data
}