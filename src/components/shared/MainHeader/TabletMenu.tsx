import { Link } from "react-router-dom";
import ChevronIcon from "./ChevronIcon";
import type { NavItem } from "../MainHeader";
import { useState } from "react";
import useScrollTo from "../../../hooks/useScrollTo";

const TabletMenu: React.FC<{ navContent: NavItem[] }> = ({ navContent }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (navName: string) => {
    setActiveDropdown((prev) => (prev === navName ? null : navName));
  };
  const scrollTo = useScrollTo()
  return (
    <div className="hidden md:flex text-gray-700 lg:hidden flex-col absolute top-full left-0 w-full bg-white shadow-md py-4 z-40">
      {navContent.map((n) => (
        <div key={n.nav} className="border-b border-gray-100 px-6 py-2">
          {n.hasChild ? (
            <>
              <button
                onClick={() => toggleDropdown(n.nav)}
                className="w-full flex justify-between items-center uppercase text-sm font-medium hover:text-[#8f7c15] transition-colors"
              >
                {n.nav}
                <ChevronIcon isOpen={activeDropdown === n.nav} />
              </button>
              {activeDropdown === n.nav && n.children && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm px-4 bg-gray-50 py-3 rounded">
                  {n.children.map((col) => (
                    <div key={col.id}>
                      <p className="font-semibold text-[#00509e] border-b mb-1 text-xs">
                        {col.title}
                      </p>
                      {col.content.map((c) => (
                        <Link
                          key={c}
                          to="#"
                          className="block hover:text-[#8f7c15] text-xs py-1 transition-colors"
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
              className="block uppercase text-sm font-medium hover:text-[#8f7c15] transition-colors"
              onClick={() => scrollTo(n.href.split("#")[1], -80)}
            >
              {n.nav}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
export default TabletMenu