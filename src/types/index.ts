export interface ApiResponse<T> {
  success: boolean
  status: number;
  message?: string;
  data: T;
  currency: string;
}

export interface PaginatedResponse<T> {
  success: boolean
  status: number;
  data: {
    current_page: number;
    data: T
    first_page_url: string;
    from: number
    last_page: number
    last_page_url: string | null;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string;
    to: number;
    total: number
  };
  message: string;
  currency: string;
}

export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export type TCreateCompanyInput = {
  companyNameLocal: string
  companyNameEnglish: string
  phone: string
  addressEnglish: string
  file: null | File
  email: string
  country: string
  district: string
  province: string
  commune: string
  village: string
  roadStrNumber: string
  homeStrNumber: string
}
