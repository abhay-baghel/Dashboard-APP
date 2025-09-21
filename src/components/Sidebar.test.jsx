import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Link: ({ children, to, ...props }) => (
    <a href={to} {...props} onClick={() => mockNavigate(to)}>
      {children}
    </a>
  ),
  useLocation: () => ({
    pathname: "/api/homepage",
  }),
}));

describe("Sidebar Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockNavigate.mockClear();
  });

  test("renders all navigation sections", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Main Navigation")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("Dashboards")).toBeInTheDocument();
    expect(screen.getByText("Pages")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  test("renders navigation items with correct icons and labels", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  test("shows close button on mobile screens", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId("sidebar-close-btn");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveTextContent("✕");
  });

  test("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    await user.click(screen.getByTestId("sidebar-close-btn"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const overlay = screen.getByTestId("sidebar-overlay");
    await user.click(overlay);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders overlay when sidebar is open", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
  });

  test("does not render overlay when sidebar is closed", () => {
    render(<Sidebar isOpen={false} onClose={mockOnClose} />);
    expect(screen.queryByTestId("sidebar-overlay")).not.toBeInTheDocument();
  });

  test("navigation items with paths are clickable", async () => {
    const user = userEvent.setup();
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveAttribute("href", "/api/homepage");

    await user.click(dashboardLink);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders correct number of navigation sections", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    // Check that all 5 sections are rendered
    expect(screen.getByTestId("sidebar-section-0")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-section-1")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-section-2")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-section-3")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-section-4")).toBeInTheDocument();
  });

  test("navigation items without paths are not clickable links", () => {
    render(<Sidebar isOpen={true} onClose={mockOnClose} />);

    const overviewItem = screen.getByText("Overview").closest("div");
    expect(overviewItem).not.toHaveAttribute("href");
  });
});
