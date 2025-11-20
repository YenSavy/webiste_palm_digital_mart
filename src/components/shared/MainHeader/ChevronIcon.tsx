const ChevronIcon: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => (
  <svg
    className={`w-3 h-3 mt-[2px] transform transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);
export default ChevronIcon