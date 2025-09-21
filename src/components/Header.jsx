import React, { useEffect, useState } from "react";

export default function Header({ onNotificationToggle, onSidebarToggle }) {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header
      className="fixed top-0 left-0 md:left-64 right-0 bg-white dark:bg-gray-900 shadow-sm px-3 sm:px-6 py-3 sm:py-4 z-20 min-w-0"
      id="header"
      data-testid="header"
    >
      {/* First row: Main navigation */}
      <div className="flex items-center justify-between min-w-0">
        <div
          className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1"
          id="header-left"
          data-testid="header-left"
        >
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden flex-shrink-0"
            onClick={onSidebarToggle}
            aria-label="Toggle sidebar"
            id="mobile-menu-btn"
            data-testid="mobile-menu-btn"
          >
            ☰
          </button>
          <div
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:block"
            id="breadcrumb"
            data-testid="breadcrumb"
          >
            ⭐ Dashboards
          </div>
          <div
            className="font-semibold text-sm sm:text-base truncate"
            id="page-title"
            data-testid="page-title"
          >
            Default
          </div>
        </div>
        <div
          className="flex items-center gap-1 sm:gap-3 flex-shrink-0"
          id="header-right"
          data-testid="header-right"
        >
          <input
            className="border rounded-lg px-3 py-1 hidden lg:block w-32 xl:w-48 dark:bg-gray-800 dark:border-gray-600"
            placeholder="Search"
            id="search-input"
            data-testid="search-input"
          />
          <button
            aria-label="toggle-dark"
            onClick={() => setDark((d) => !d)}
            className="px-2 sm:px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs sm:text-sm whitespace-nowrap"
            id="theme-toggle"
            data-testid="theme-toggle"
          >
            <span className="hidden sm:inline">
              {dark ? "🌙 Dark" : "☀️ Light"}
            </span>
            <span className="sm:hidden">{dark ? "🌙" : "☀️"}</span>
          </button>
          <button
            className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            id="notifications-btn"
            data-testid="notifications-btn"
            onClick={onNotificationToggle}
          >
            🔔
          </button>
          <button
            className="p-1 sm:p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
            id="settings-btn"
            data-testid="settings-btn"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Second row: Search bar for mobile/tablet screens */}
      <div className="lg:hidden mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <input
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Search..."
          id="search-input-mobile"
          data-testid="search-input-mobile"
        />
      </div>
    </header>
  );
}
