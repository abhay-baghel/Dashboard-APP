import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Orderslist from "./Orderslist";

// Mock the SCSS file
jest.mock("./Orderslist.scss", () => ({}));

describe("Orderslist Component", () => {
  const mockOnBack = jest.fn();

  beforeEach(() => {
    mockOnBack.mockClear();
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(<Orderslist onBack={mockOnBack} />);

    expect(screen.getByTestId("orderslist-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading orders...")).toBeInTheDocument();
  });

  test("renders orders list after loading", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(
      () => {
        expect(screen.getByTestId("orderslist-main")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Order List")).toBeInTheDocument();
    expect(screen.getByTestId("back-button")).toBeInTheDocument();
  });

  test("calls onBack when back button is clicked", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("back-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("back-button"));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test("renders refresh button and orders count", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
      expect(screen.getByTestId("orders-count")).toBeInTheDocument();
    });
  });

  test("renders filter options", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("status-filter")).toBeInTheDocument();
      expect(screen.getByTestId("date-filter")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("All Status")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All Dates")).toBeInTheDocument();
  });

  test("renders search input and button", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("orders-search")).toBeInTheDocument();
      expect(screen.getByTestId("search-button")).toBeInTheDocument();
    });
  });

  test("renders orders table with headers", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("orders-table")).toBeInTheDocument();
      expect(screen.getByText("Order ID")).toBeInTheDocument();
      expect(screen.getByText("User")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });
  });

  test("renders select all checkbox", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("select-all-checkbox")).toBeInTheDocument();
    });
  });

  test("filters orders by status", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("status-filter")).toBeInTheDocument();
    });

    const statusFilter = screen.getByTestId("status-filter");
    await user.selectOptions(statusFilter, "Completed");

    expect(statusFilter.value).toBe("Completed");
  });

  test("searches orders by term", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("orders-search")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("orders-search");
    await user.type(searchInput, "John");

    expect(searchInput.value).toBe("John");
  });

  test("toggles select all checkbox", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("select-all-checkbox")).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getByTestId("select-all-checkbox");
    await user.click(selectAllCheckbox);

    expect(selectAllCheckbox).toBeChecked();
  });

  test("refreshes orders when refresh button is clicked", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("refresh-button")).toBeInTheDocument();
    });

    const refreshButton = screen.getByTestId("refresh-button");
    await user.click(refreshButton);

    // Should show loading state temporarily
    await waitFor(() => {
      expect(refreshButton).toBeDisabled();
    });
  });

  test("renders order rows with correct data", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByText("ORD001")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Completed")).toBeInTheDocument();
    });
  });

  test("selects individual orders", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("order-checkbox-0")).toBeInTheDocument();
    });

    const orderCheckbox = screen.getByTestId("order-checkbox-0");
    await user.click(orderCheckbox);

    expect(orderCheckbox).toBeChecked();
  });

  test("displays orders count correctly", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      const ordersCount = screen.getByTestId("orders-count");
      expect(ordersCount).toHaveTextContent("2 orders");
    });
  });

  test("renders table footer when orders are selected", async () => {
    const user = userEvent.setup();
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      expect(screen.getByTestId("select-all-checkbox")).toBeInTheDocument();
    });

    const selectAllCheckbox = screen.getByTestId("select-all-checkbox");
    await user.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByTestId("table-footer")).toBeInTheDocument();
      expect(screen.getByText("2 order(s) selected")).toBeInTheDocument();
    });
  });

  test("renders with proper accessibility attributes", async () => {
    render(<Orderslist onBack={mockOnBack} />);

    await waitFor(() => {
      const backButton = screen.getByTestId("back-button");
      expect(backButton).toHaveAttribute("aria-label", "Go back to dashboard");
    });
  });
});
