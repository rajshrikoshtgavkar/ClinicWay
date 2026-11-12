"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  IconPalette,
  IconCheck,
  IconDeviceDesktop,
  IconChevronDown,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

const ThemeToggler = () => {
  const [currentTheme, setCurrentTheme] = useState("light");

  const themes = [
    "light",
    "dark",
    "cmyk",
    "coffee",
    "winter",
    "nord",
    "caramellatte",
  ].sort();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setCurrentTheme(storedTheme);
    document.documentElement.setAttribute("data-theme", storedTheme);
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Optional: Close dropdown by removing focus from active element
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-outline btn-secondary flex items-center gap-3 px-4 rounded-xl transition-all duration-300"
      >
        <div className="p-1.5 bg-primary rounded-lg text-primary-content shadow-sm">
          <IconPalette size={18} stroke={2.5} />
        </div>
        <span className="hidden md:inline-block text-xs font-black uppercase tracking-widest opacity-70">
          Theme
        </span>
        <IconChevronDown size={14} className="opacity-50" />
      </div>

      {/* DROPDOWN CONTENT */}
      <ul
        tabIndex={0}
        className="dropdown-content mt-3 z-100 p-2 shadow-2xl bg-base-100 border border-base-content/10 rounded-2xl w-64 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-base-content/5 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            Customization
          </span>
          <IconDeviceDesktop size={14} className="opacity-40" />
        </div>

        {/* SCROLLABLE LIST */}
        <div className="overflow-y-auto max-h-96 scrollbar-thin scrollbar-thumb-primary/20 p-1 space-y-1">
          {themes.map((theme) => (
            <li key={theme}>
              <button
                onClick={() => handleThemeChange(theme)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${
                    currentTheme === theme
                      ? "bg-primary text-primary-content shadow-md"
                      : "hover:bg-base-content/5 text-base-content/70 hover:text-base-content"
                  }
                `}
              >
                <div className="flex items-center gap-3 capitalize">
                  {/* Theme Preview Dot */}
                  <div className="flex gap-0.5 border border-base-content/10 rounded-full overflow-hidden shrink-0">
                    <div
                      className={`w-2 h-2 bg-primary`}
                      data-theme={theme}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-secondary`}
                      data-theme={theme}
                    ></div>
                    <div
                      className={`w-2 h-2 bg-accent`}
                      data-theme={theme}
                    ></div>
                  </div>
                  {theme}
                </div>

                {currentTheme === theme && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <IconCheck size={16} stroke={3} />
                  </motion.div>
                )}
              </button>
            </li>
          ))}
        </div>

        <div className="p-2 bg-base-200/50 mt-1">
          <p className="text-[9px] text-center opacity-40 font-medium italic">
            Changes are saved to local storage
          </p>
        </div>
      </ul>
    </div>
  );
};

export default ThemeToggler;
