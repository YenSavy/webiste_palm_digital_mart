import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "./MainHeader/MenuIcon";
import ChevronIcon from "./MainHeader/ChevronIcon";
import LanguageSwitcher from "./MainHeader/LanguageSwitcher";
import DropdownMenu from "./MainHeader/DropDownMenu";
import MobileMenu from "./MainHeader/MobileMenu";
import TabletMenu from "./MainHeader/TabletMenu";
import { useServiceMenu } from "../../hooks/useServiceMenu";
import { useTranslation } from "react-i18next";
import useScrollTo from "../../hooks/useScrollTo";
import { useAuthStore } from "../../store/authStore";
import { LayoutDashboard } from "lucide-react";

export type NavChild = {
  id: string;
  title: string;
  content: string[];
};

export type NavItem = {
  nav: string;
  href: string;
  hasChild?: boolean;
  children?: NavChild[];
};

export type THeaderProps = {
  company: {
    logo: string;
    name: string;
  };
  navContent?: NavItem[];
};

const MainHeader: React.FC<THeaderProps> = ({ company, navContent }) => {
  const scrollTo = useScrollTo();
  const { t } = useTranslation(["header", "common"]);
  const SERVICE_MENU = useServiceMenu();
  const navigate = useNavigate();
  const { setIsSignInPage } = useAuthStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const DEFAULT_NAV: NavItem[] = useMemo(
    () => [
      { nav: t("header:services"), href: "#services", hasChild: true, children: SERVICE_MENU },
      { nav: t("header:pricing"), href: "#pricing" },
      { nav: t("header:about_us"), href: "#about" },
      { nav: t("header:contact_us"), href: "#contact" },
    ],
    [SERVICE_MENU, t]
  );

  const navItems = navContent || DEFAULT_NAV;

  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false); // Track the visibility of the header
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleDropdown = useCallback(
    (navName: string) => setOpenDropdown((p) => (p === navName ? null : navName)),
    []
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    if (openDropdown) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsHeaderHidden(true);
      } else {
        setIsHeaderHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`px-5 md:px-16 lg:px-32 py-4 flex items-center justify-between fixed z-50 bg-gradient-primary left-0 right-0 shadow-md shadow-lime-200/30 transition-transform duration-300 ${
        isHeaderHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Link to="/" className="flex flex-col items-center gap-0 sha hover:opacity-90 transition-opacity">
        <img
          alt={company.name}
          src={company.logo}
          loading="lazy"
          width={60}
          height={60}
          className="object-cover"
        />
        <h1 className="uppercase font-semibold text-sm sm:text-base text-secondary text-shadow-md drop-shadow-[0_0_8px_rgba(218,165,32,0.5)] moul-regular text-gradient">{company.name}</h1>
      </Link>

      <button
        onClick={toggleMenu}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-[#8f7c15] rounded p-1"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <MenuIcon isOpen={menuOpen} />
      </button>

      <button
        onClick={toggleMenu}
        className="hidden md:flex lg:hidden focus:outline-none focus:ring-2 focus:ring-[#8f7c15] rounded p-1"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        <MenuIcon isOpen={menuOpen} />
      </button>

      <nav
        className="hidden lg:flex items-center gap-6 uppercase text-sm lg:text-base font-medium"
        aria-label="Main navigation"
        ref={dropdownRef}
      >
        {navItems.map((n) => (
          <div key={n.nav} className="relative">
            {n.hasChild && n.children ? (
              <>
                <button
                  onClick={() => toggleDropdown(n.nav)}
                  className="flex items-center gap-1 text-sm hover:text-[#8f7c15] transition-colors uppercase"
                >
                  {n.nav}
                  <ChevronIcon isOpen={openDropdown === n.nav} />
                </button>
                {openDropdown === n.nav && <DropdownMenu children={n.children || []} />}
              </>
            ) : (
              <Link to={n.href} onClick={() => scrollTo(n.href.split("#")[1], -80)} className="hover:text-[#8f7c15] transition-colors text-sm">
                {n.nav}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="hidden md:flex items-center gap-4">

        {isAuthenticated && <Link to={"/dashboard"} className="uppercase text-xs flex items-center justify-center gap-1 px-3 py-2 bg-secondary rounded-full"><LayoutDashboard size={18}/>{t("header:dashboard")}</Link>}
        {!isAuthenticated && <><button
          className="bg-secondary text-white text-xs lg:text-base uppercase px-3 py-2 rounded-3xl shadow-md  transition-colors font-medium"
          onClick={() => {
            setIsSignInPage(false);
            navigate("/auth");
          }}
        >
          {t("common:sign_up")}
        </button>
        <button
          className="uppercase text-xs lg:text-base transition-colors font-medium"
          onClick={() => {
            setIsSignInPage(true);
            navigate("/auth");
          }}
        >
          {t("common:login")}
        </button></>}
        <LanguageSwitcher />
      </div>

      {menuOpen && <MobileMenu navContent={navItems} onClose={closeMenu} />}
      {menuOpen && <TabletMenu navContent={navItems} />}
    </header>
  );
};

export default MainHeader;
