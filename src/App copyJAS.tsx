import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AOS from "aos";
import MainPageLayout from "./layouts/MainPageLayout";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SignupForm from "./pages/SignupForm";
import ForgotpasswordForm from "./pages/ForgotpasswordForm";
import PhoneVerifyForm from "./pages/PhoneVerifyForm";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import "aos/dist/aos.css";
import UserPage from "./pages/Dashboard/UserPage";
import DashboardLayout from "./layouts/DashboardLayout";
import UserGuidePage from "./pages/Dashboard/UserGuidePage";
import ErrorPage from "./pages/ErrorPage";
import VideoPage from "./pages/Dashboard/VideoPage";
import MainBackground from "./components/shared/MainBackground";
import MainHeader, { type THeaderProps } from "./components/shared/MainHeader";


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

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
      offset: 100,
      easing: 'ease-in-out',
    });
  }, []);

  const { t } = useTranslation("common");
  const Company: THeaderProps = {
    company: {
      logo: "./palm technology.png",
      name: t("company"),
    },
  };


  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<MainPageLayout />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route element={<MainBackground>
              <MainHeader company={Company.company} />
              <main className=" px-5 md:px-16 lg:px-32 translate-y-[6rem]">
                <Outlet />
              </main>
            </MainBackground>}>
              <Route path="/videos" element={<VideoPage />} />

            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<AuthPage />} />
             <Route path="/signup/" element={<SignupForm />} />
             <Route path="//phone-verification/" element={<PhoneVerifyForm/>} />
             <Route path="/forgot-password" element={<ForgotpasswordForm/>} />
            </Route>
            

            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
            >
              <Route index element={<DashboardPage />} />
              <Route path="/dashboard/user" element={<UserPage />} />
              <Route path="/dashboard/subscription" element={<h1 className="text-black">Subscription step</h1>}/>
              <Route path="/dashboard/user-guide" element={<UserGuidePage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;