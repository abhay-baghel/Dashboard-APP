import React from "react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    section: "Main Navigation",
    items: [
      { label: "Dashboard", icon: "📊", path: "/api/homepage" },
      { label: "Orders", icon: "📋", path: "/api/orders" },
    ],
  },
  {
    section: "Favorites",
    items: [
      { label: "Overview", icon: "📊" },
      { label: "Projects", icon: "📁" },
    ],
  },
  {
    section: "Dashboards",
    items: [
      { label: "Default", icon: "⭐" },
      { label: "eCommerce", icon: "🛍️" },
      { label: "Projects", icon: "📁" },
      { label: "Online Courses", icon: "📚" },
    ],
  },
  {
    section: "Pages",
    items: [
      { label: "User Profile", icon: "👤" },
      { label: "Overview", icon: "🧾" },
      { label: "Projects", icon: "📂" },
      { label: "Campaigns", icon: "📣" },
      { label: "Documents", icon: "📄" },
      { label: "Followers", icon: "👥" },
    ],
  },
  {
    section: "Other",
    items: [
      { label: "Account", icon: "⚙️" },
      { label: "Corporate", icon: "🏢" },
      { label: "Blog", icon: "✍️" },
      { label: "Social", icon: "💬" },
    ],
  },
];

const sidebarStyles = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "16rem",
  maxWidth: "16rem",
  overflowY: "auto",
  overflowX: "hidden",
};

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
          id="sidebar-overlay"
          data-testid="sidebar-overlay"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-screen p-4 sm:p-6 bg-gradient-to-b from-purple-800 to-purple-700 text-white overflow-y-auto overflow-x-hidden z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:block`}
        style={sidebarStyles}
        id="sidebar"
        data-testid="sidebar"
      >
        <div className="flex items-center justify-between mb-6 min-w-0">
          <div
            className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1"
            id="sidebar-logo"
            data-testid="sidebar-logo"
          >
            <div
              className="w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
              id="logo-icon"
              data-testid="logo-icon"
            >
              AB
            </div>
            <div
              className="font-semibold text-sm sm:text-lg truncate"
              id="logo-text"
              data-testid="logo-text"
            >
              AbhayBaghel
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 rounded hover:bg-white/10"
            onClick={onClose}
            aria-label="Close sidebar"
            id="sidebar-close-btn"
            data-testid="sidebar-close-btn"
          >
            ✕
          </button>
        </div>
        {items.map((group, i) => (
          <div
            key={i}
            className="mb-6"
            id={`sidebar-section-${i}`}
            data-testid={`sidebar-section-${i}`}
          >
            <div
              className="text-xs text-white/70 mb-2"
              id={`section-title-${i}`}
              data-testid={`section-title-${i}`}
            >
              {group.section}
            </div>
            <div
              className="space-y-1"
              id={`section-items-${i}`}
              data-testid={`section-items-${i}`}
            >
              {group.items.map((it, idx) => {
                const isActive = it.path && location.pathname === it.path;
                const ItemComponent = it.path ? Link : "div";

                return (
                  <ItemComponent
                    key={idx}
                    to={it.path}
                    className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded cursor-pointer hover:bg-white/10 min-w-0 ${
                      isActive ? "bg-white/20 text-white" : ""
                    }`}
                    id={`nav-item-${i}-${idx}`}
                    data-testid={`nav-item-${i}-${idx}`}
                    onClick={() => {
                      if (it.path) {
                        onClose(); // Close sidebar on mobile when navigating
                      }
                    }}
                  >
                    <span
                      className="text-xs sm:text-sm flex-shrink-0"
                      id={`nav-icon-${i}-${idx}`}
                      data-testid={`nav-icon-${i}-${idx}`}
                    >
                      {it.icon}
                    </span>
                    <span
                      className="text-xs sm:text-sm truncate"
                      id={`nav-label-${i}-${idx}`}
                      data-testid={`nav-label-${i}-${idx}`}
                    >
                      {it.label}
                    </span>
                  </ItemComponent>
                );
              })}
            </div>
          </div>
        ))}
      </aside>
    </>
  );
}
