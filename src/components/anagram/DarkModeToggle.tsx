import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("anagram_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("anagram_theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("anagram_theme");
    if (saved === "dark") {
      setDark(true);
    }
  }, []);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="flex items-center gap-4 rounded-lg px-3 py-3 transition-all hover:bg-secondary w-full"
      aria-label="Toggle dark mode"
    >
      {dark ? (
        <Sun size={24} strokeWidth={1.5} className="shrink-0" />
      ) : (
        <Moon size={24} strokeWidth={1.5} className="shrink-0" />
      )}
      <span className="hidden text-base xl:block">{dark ? "Light Mode" : "Dark Mode"}</span>
    </button>
  );
};

export default DarkModeToggle;
