import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

describe("Header Component", () => {
  const mockOnNotificationToggle = jest.fn();
  const mockOnSidebarToggle = jest.fn();

  beforeEach(() => {
    mockOnNotificationToggle.mockClear();
    mockOnSidebarToggle.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();

    // Mock document.documentElement
    Object.defineProperty(document, "documentElement", {
      value: {
        classList: {
          add: jest.fn(),
          remove: jest.fn(),
        },
      },
      writable: true,
    });
  });

  test("renders header with all elements", () => {
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("breadcrumb")).toHaveTextContent("⭐ Dashboards");
    expect(screen.getByTestId("page-title")).toHaveTextContent("Default");
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("notifications-btn")).toBeInTheDocument();
    expect(screen.getByTestId("settings-btn")).toBeInTheDocument();
  });

  test("renders mobile menu button on small screens", () => {
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    expect(screen.getByTestId("mobile-menu-btn")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-menu-btn")).toHaveTextContent("☰");
  });

  test("calls onSidebarToggle when mobile menu button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    await user.click(screen.getByTestId("mobile-menu-btn"));
    expect(mockOnSidebarToggle).toHaveBeenCalledTimes(1);
  });

  test("calls onNotificationToggle when notification button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    await user.click(screen.getByTestId("notifications-btn"));
    expect(mockOnNotificationToggle).toHaveBeenCalledTimes(1);
  });

  test("toggles theme when theme button is clicked", async () => {
    const user = userEvent.setup();
    mockLocalStorage.getItem.mockReturnValue(null); // Default to light theme

    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    const themeToggle = screen.getByTestId("theme-toggle");
    expect(themeToggle).toHaveTextContent("☀️ Light");

    await user.click(themeToggle);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("theme", "dark");
    });
  });

  test("initializes with dark theme when stored in localStorage", () => {
    mockLocalStorage.getItem.mockReturnValue("dark");

    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    expect(screen.getByTestId("theme-toggle")).toHaveTextContent("🌙 Dark");
  });

  test("renders search inputs for different screen sizes", () => {
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    // Desktop search input
    expect(screen.getByTestId("search-input")).toBeInTheDocument();

    // Mobile search input
    expect(screen.getByTestId("search-input-mobile")).toBeInTheDocument();
  });

  test("handles localStorage errors gracefully", () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error("localStorage error");
    });

    expect(() => {
      render(
        <Header
          onNotificationToggle={mockOnNotificationToggle}
          onSidebarToggle={mockOnSidebarToggle}
        />
      );
    }).not.toThrow();
  });

  test("search input accepts user input", async () => {
    const user = userEvent.setup();
    render(
      <Header
        onNotificationToggle={mockOnNotificationToggle}
        onSidebarToggle={mockOnSidebarToggle}
      />
    );

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "test search");
    expect(searchInput).toHaveValue("test search");
  });
});
