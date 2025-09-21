import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";

// Mock the child components
jest.mock("./Cards", () => {
  return function MockCards({ onNavigateToOrders }) {
    return (
      <div data-testid="cards-component">
        <button onClick={onNavigateToOrders} data-testid="mock-navigate-orders">
          Navigate to Orders
        </button>
      </div>
    );
  };
});

jest.mock("./Projections", () => {
  return function MockProjections() {
    return <div data-testid="projections-component">Projections Component</div>;
  };
});

jest.mock("./Revenue", () => {
  return function MockRevenue() {
    return <div data-testid="revenue-component">Revenue Component</div>;
  };
});

jest.mock("./RevenueByLocation", () => {
  return function MockRevenueByLocation() {
    return (
      <div data-testid="revenue-by-location-component">
        Revenue By Location Component
      </div>
    );
  };
});

jest.mock("./Products", () => {
  return function MockProducts() {
    return <div data-testid="products-component">Products Component</div>;
  };
});

jest.mock("./TotalSales", () => {
  return function MockTotalSales() {
    return <div data-testid="total-sales-component">Total Sales Component</div>;
  };
});

describe("Dashboard Component", () => {
  const mockOnNavigateToOrders = jest.fn();

  beforeEach(() => {
    mockOnNavigateToOrders.mockClear();
  });

  test("renders dashboard with all child components", () => {
    render(<Dashboard onNavigateToOrders={mockOnNavigateToOrders} />);

    expect(screen.getByTestId("dashboard-main")).toBeInTheDocument();
    expect(screen.getByTestId("cards-component")).toBeInTheDocument();
    expect(screen.getByTestId("projections-component")).toBeInTheDocument();
    expect(screen.getByTestId("revenue-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("revenue-by-location-component")
    ).toBeInTheDocument();
    expect(screen.getByTestId("products-component")).toBeInTheDocument();
    expect(screen.getByTestId("total-sales-component")).toBeInTheDocument();
  });

  test("passes onNavigateToOrders prop to Cards component", () => {
    render(<Dashboard onNavigateToOrders={mockOnNavigateToOrders} />);

    const navigateButton = screen.getByTestId("mock-navigate-orders");
    navigateButton.click();

    expect(mockOnNavigateToOrders).toHaveBeenCalledTimes(1);
  });

  test("renders individual chart components", () => {
    render(<Dashboard onNavigateToOrders={mockOnNavigateToOrders} />);

    expect(screen.getByTestId("projections-component")).toBeInTheDocument();
    expect(screen.getByTestId("revenue-component")).toBeInTheDocument();
    expect(
      screen.getByTestId("revenue-by-location-component")
    ).toBeInTheDocument();
    expect(screen.getByTestId("products-component")).toBeInTheDocument();
    expect(screen.getByTestId("total-sales-component")).toBeInTheDocument();
  });

  test("dashboard main container has correct attributes", () => {
    render(<Dashboard onNavigateToOrders={mockOnNavigateToOrders} />);

    const dashboardMain = screen.getByTestId("dashboard-main");
    expect(dashboardMain).toHaveAttribute("id", "dashboard-main");
  });

  test("renders without onNavigateToOrders prop", () => {
    expect(() => {
      render(<Dashboard />);
    }).not.toThrow();
  });

  test("all components are rendered in correct order", () => {
    render(<Dashboard onNavigateToOrders={mockOnNavigateToOrders} />);

    const dashboard = screen.getByTestId("dashboard-main");
    const children = Array.from(dashboard.children);

    // Dashboard header should be first
    expect(children[0]).toContainElement(screen.getByTestId("dashboard-title"));

    // Main content row (Cards and Projections) should be second
    expect(children[1]).toContainElement(screen.getByTestId("cards-component"));
    expect(children[1]).toContainElement(
      screen.getByTestId("projections-component")
    );
  });
});
