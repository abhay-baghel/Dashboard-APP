import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cards from "./Cards";

describe("Cards Component", () => {
  const mockOnNavigateToOrders = jest.fn();

  beforeEach(() => {
    mockOnNavigateToOrders.mockClear();
  });

  test("renders all card metrics", () => {
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    // Check if all cards are rendered
    expect(screen.getByTestId("customers-card")).toBeInTheDocument();
    expect(screen.getByTestId("orders-card")).toBeInTheDocument();
    expect(screen.getByTestId("revenue-card")).toBeInTheDocument();
    expect(screen.getByTestId("growth-card")).toBeInTheDocument();
  });

  test("displays correct card titles", () => {
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    expect(screen.getByTestId("customers-card-title")).toHaveTextContent(
      "Customers"
    );
    expect(screen.getByTestId("orders-card-title")).toHaveTextContent("Orders");
    expect(screen.getByTestId("revenue-card-title")).toHaveTextContent(
      "Revenue"
    );
    expect(screen.getByTestId("growth-card-title")).toHaveTextContent("Growth");
  });

  test("displays correct card values", () => {
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    expect(screen.getByTestId("revenue-card-value")).toHaveTextContent("$695");
    expect(screen.getByTestId("orders-card-value")).toHaveTextContent("1,219");
    expect(screen.getByTestId("customers-card-value")).toHaveTextContent(
      "3,781"
    );
    expect(screen.getByTestId("growth-card-value")).toHaveTextContent("30.1%");
  });

  test("orders card calls navigation function when clicked", async () => {
    const user = userEvent.setup();
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    const ordersCard = screen.getByTestId("orders-card");
    await user.click(ordersCard);

    expect(mockOnNavigateToOrders).toHaveBeenCalledTimes(1);
  });

  test("other cards do not trigger navigation when clicked", async () => {
    const user = userEvent.setup();
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    await user.click(screen.getByTestId("revenue-card"));
    await user.click(screen.getByTestId("customers-card"));
    await user.click(screen.getByTestId("growth-card"));

    expect(mockOnNavigateToOrders).not.toHaveBeenCalled();
  });

  test("cards have correct CSS classes", () => {
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    const revenueCard = screen.getByTestId("revenue-card");
    const ordersCard = screen.getByTestId("orders-card");

    expect(revenueCard).toHaveClass("app-card");
    expect(ordersCard).toHaveClass("app-card");
  });

  test("cards maintain accessibility attributes", () => {
    render(<Cards onNavigateToOrders={mockOnNavigateToOrders} />);

    const ordersCard = screen.getByTestId("orders-card");
    expect(ordersCard).toHaveAttribute("id", "orders-card");
    expect(ordersCard).toHaveAttribute("data-testid", "orders-card");
  });

  test("handles missing onNavigateToOrders prop gracefully", () => {
    expect(() => {
      render(<Cards />);
    }).not.toThrow();
  });
});
