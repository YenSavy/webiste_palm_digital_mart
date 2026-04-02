import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../lib/api";

const getList = (res: any): any[] => {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (res?.data && typeof res.data === "object" && !Array.isArray(res.data))
    return [res.data];
  return [];
};

export const COMPANY_STATUS_KEY = "company-status";

export const useCompanyStatus = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // Scope cache to the current user so user B never reads user A's result
  const userId = user?.email ?? user?.phone ?? "guest";

  const { data, isLoading } = useQuery({
    queryKey: [COMPANY_STATUS_KEY, userId],
    queryFn: () => axiosInstance.get("/company/list").then((r) => r.data),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const companies = getList(data);
  return { hasCompany: companies.length > 0, isLoading, userId };
};
