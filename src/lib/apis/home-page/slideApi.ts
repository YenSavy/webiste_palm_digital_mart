import type { TSlide } from "../../../components/shared/home/SlideShow";
import type { ApiResponse } from "../../../types";
import axiosInstance from "../../api"

export const fetchSlideImage = async ( ) => {
   const res = await axiosInstance.get< ApiResponse<TSlide[]>>("/get-slide/" + import.meta.env.VITE_COMPANY_ID);
   return res.data
}