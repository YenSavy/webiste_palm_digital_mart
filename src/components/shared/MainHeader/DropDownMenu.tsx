import { Link } from "react-router-dom";
import type { NavChild } from "../MainHeader";

const DropdownMenu: React.FC<{ children: NavChild[] }> = ({ children }) => {
 return <div className="absolute top-full left-0 mt-3 bg-white -translate-x-64 shadow-lg border rounded-lg p-6 w-[900px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fadeIn z-50">
    {children.map((col) => (
      <div key={col.id}>
        <h3 className="font-semibold text-[#00509e] mb-2 border-b pb-1 text-sm">
          {col.title}
        </h3>
        <ul className="space-y-1 text-gray-700">
          {col && col.content?.map((item) => (
            <li key={item}>
              <Link
                to="#"
                className="hover:text-[#8f7c15] text-xs block py-1 transition-colors"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
}
export default DropdownMenu