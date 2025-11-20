import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import MainPageLayout from "./layouts/MainPageLayout";
import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { i18n } = useTranslation();
  const initializeAuth = useAuthStore(state => state.initializeAuth)
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");

    if (lang && ["en", "km", "zh"].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    } else {
      const savedLang = localStorage.getItem("i18nextLng");
      const defaultLang = savedLang && ["en", "km", "ch"].includes(savedLang) ? savedLang : "en";

      i18n.changeLanguage(defaultLang);
      localStorage.setItem("i18nextLng", defaultLang);

      const url = new URL(window.location.href);
      url.searchParams.set("lang", defaultLang);
      window.history.replaceState({}, "", url.toString());
    }
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<MainPageLayout />}>
          <Route path="" element={<HomePage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<AuthPage />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;