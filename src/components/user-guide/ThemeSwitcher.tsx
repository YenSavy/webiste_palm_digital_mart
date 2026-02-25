"use client";

import { useState, useRef, useEffect } from "react";
import {
  Moon,
  Sun,
  Palette,
  Eye,
  Contrast,
  Trees,
  Waves,
  Sunset,
  Flower2,
  Leaf,
  Heart,
  ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Theme } from "../../utils/themeUtils";
import { useThemeStore } from "../../store/userGuideThemeStore";

type ThemeOption = {
  label: string;
  value: Theme;
  icon: LucideIcon;
  color: string;
};

const options: ThemeOption[] = [
  { label: "Light", value: "light", icon: Sun, color: "bg-orange-400" },
  { label: "Sepia", value: "sepia", icon: Palette, color: "bg-yellow-700" },
  { label: "Dark", value: "dark", icon: Moon, color: "bg-slate-700" },
  { label: "Night (OLED)", value: "night", icon: Eye, color: "bg-black" },
  { label: "High Contrast", value: "contrast", icon: Contrast, color: "bg-blue-900" },
  { label: "Forest", value: "forest", icon: Trees, color: "bg-emerald-600" },
  { label: "Ocean", value: "ocean", icon: Waves, color: "bg-sky-500" },
  { label: "Sunset", value: "sunset", icon: Sunset, color: "bg-orange-600" },
  { label: "Lavender", value: "lavender", icon: Flower2, color: "bg-purple-400" },
  { label: "Mint", value: "mint", icon: Leaf, color: "bg-teal-400" },
  { label: "Rose", value: "rose", icon: Heart, color: "bg-rose-400" },
  { label: "Luxe Gold", value: "gold", icon: Palette, color: "bg-yellow-500" },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);

  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const menuRef = useRef<HTMLDivElement>(null);

  const currentOption = options.find((o) => o.value === theme) ?? options[0];
  const CurrentIcon = currentOption.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="p-3 border-b border-[var(--border-color)] bg-[var(--bg-hover)]">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Choose Theme
            </h3>
          </div>

          <div className="max-h-[350px] overflow-y-auto py-1 custom-scrollbar">
            {options.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors ${
                    theme === option.value ? "bg-[var(--bg-active)]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-inner ${option.color}`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <span
                      className={`text-sm ${
                        theme === option.value
                          ? "text-[var(--accent-color)] font-bold"
                          : "text-[var(--text-main)]"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {theme === option.value && (
                    <div className="w-2 h-2 rounded-full bg-[var(--accent-color)] shadow-md" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-3 px-4 py-2 bg-[var(--bg-button)] border border-[var(--border-color)] rounded-lg text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-all shadow-lg min-w-[180px]"
      >
        <div className={`p-1 rounded-md ${currentOption.color} shadow-sm`}>
          <CurrentIcon className="w-4 h-4 text-white" />
        </div>

        <span className="text-sm font-medium flex-1 text-left">
          {currentOption.label}
        </span>

        <ChevronUp
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
    </div>
  );
}