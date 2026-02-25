import { Link, useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import ChevronIcon from "./ChevronIcon";
import type { NavItem } from "../MainHeader";
import { useState } from "react";
import useScrollTo from "../../../hooks/useScrollTo";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/authStore";
import { LayoutDashboard } from "lucide-react";

const MobileMenu: React.FC<{ navContent: NavItem[]; onClose: () => void }> = ({
  navContent,
  onClose,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (navName: string) => {
    setActiveDropdown((prev) => (prev === navName ? null : navName));
  };
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const { t } = useTranslation("common")
  const scrollTo = useScrollTo()
  const navigate = useNavigate()
  const { setIsSignInPage } = useAuthStore()
  
  return (
    <div className="absolute top-full text-white left-0 w-full shadow-md flex flex-col items-center py-4 gap-4 md:hidden z-40 bg-gradient-secondary">
      <nav className="w-full px-5" aria-label="Mobile navigation">
        {navContent.map((n) => (
          <div key={n.nav} className="w-full border-b border-gray-100 py-2">
            {n.hasChild ? (
              <>
                <button
                  onClick={() => toggleDropdown(n.nav)}
                  className="w-full flex justify-between items-center hover:text-[#8f7c15] transition-colors text-sm uppercase font-medium"
                >
                  {n.nav}
                  <ChevronIcon isOpen={activeDropdown === n.nav} />
                </button>
                {activeDropdown === n.nav && n.children && (
                  <div className="grid grid-cols-2 gap-4 px-2 py-3 text-sm mt-2 rounded">
                    {n.children.map((col) => (
                      <div key={col.id}>
                        <p className="font-semibold text-[#00509e] border-b mb-1 text-xs">
                          {col.title}
                        </p>
                        {col.content.map((c) => (
                          <Link
                            key={c}
                            to="#"
                            className="block hover:text-[#8f7c15] text-xs py-1"
                            onClick={onClose}
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={n.href}
                className="block hover:text-[#8f7c15] transition-colors text-sm uppercase font-medium"
                onClick={() => { onClose(); scrollTo(n.href.split("#")[1], -80); }}
              >
                {n.nav}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t w-3/4 my-2"></div>
        
      <div className="flex flex-col gap-3 items-center">
        {isAuthenticated && (
          <Link to={"/dashboard"} className="uppercase text-xs flex items-center justify-center gap-1 px-3 py-2 bg-secondary rounded-full">
            <LayoutDashboard size={18}/>
            {t("header:dashboard")}
          </Link>
        )}
        {!isAuthenticated && (
          <> 
            <button 
              className="bg-[#8f7c15] text-white text-xs uppercase px-4 py-2 rounded-2xl font-bold shadow-md hover:bg-[#a98f25] transition-colors" 
              onClick={() => { 
                navigate('/signup'); // Direct navigation to signup
                setIsSignInPage(false); 
                onClose();
              }}
            >
              {t("common:sign_up")}
            </button>
            <button 
              className="uppercase text-xs font-medium hover:text-[#8f7c15] transition-colors" 
              onClick={() => { 
                navigate('/login'); // Direct navigation to login
                setIsSignInPage(true); 
                onClose();
              }}
            >
              {t("common:login")}
            </button> 
          </>
        )}
        <LanguageSwitcher />
      </div>
    </div>
  );
};

export default MobileMenu;