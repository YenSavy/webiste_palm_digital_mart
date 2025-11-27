import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";

import MainPageLayout from "./layouts/MainPageLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import { useAuthStore } from "./store/authStore";
import UserPage from "./pages/UserPage";

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
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  // Initialize login state
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Initialize Language
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");

    if (lang && ["en", "km", "zh"].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    } else {
      const saved = localStorage.getItem("i18nextLng");
      const defaultLang = ["en", "km", "zh"].includes(saved || "") ? saved! : "en";

      i18n.changeLanguage(defaultLang);
      localStorage.setItem("i18nextLng", defaultLang);

      const url = new URL(window.location.href);
      url.searchParams.set("lang", defaultLang);
      window.history.replaceState({}, "", url.toString());
    }
  }, [i18n]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainPageLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>

            <Route path="/user" element={<UserPage />} />

            <Route element={<AuthLayout />}>
              <Route path="/auth" element={<AuthPage />} />
            </Route>

            <Route
              path="/dashboard"
              element={<ProtectedRoute component={DashboardPage} />}
            />
          </Routes>

          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;