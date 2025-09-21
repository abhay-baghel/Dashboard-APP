import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Products from "./Products";

describe("Products Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state initially", () => {
    render(<Products />);

    expect(screen.getByText("Loading products...")).toBeInTheDocument();
  });

  test("renders products component after loading", async () => {
    render(<Products />);

    await waitFor(
      () => {
        expect(
          screen.getByTestId("products-table-container")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Top Selling Products")).toBeInTheDocument();
  });

  test("renders product table", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByTestId("products-table")).toBeInTheDocument();
    });
  });

  test("displays product items with correct data", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("ASOS Ridley High Waist")).toBeInTheDocument();
      expect(screen.getByText("Marco Lightweight Shirt")).toBeInTheDocument();
      expect(screen.getByText("$79.49")).toBeInTheDocument();
      expect(screen.getByText("$128.50")).toBeInTheDocument();
    });
  });

  test("renders product quantities and amounts", async () => {
    render(<Products />);

    await waitFor(() => {
      expect(screen.getByText("82")).toBeInTheDocument();
      expect(screen.getByText("37")).toBeInTheDocument();
      expect(screen.getByText("$6,518.18")).toBeInTheDocument();
      expect(screen.getByText("$4,754.50")).toBeInTheDocument();
    });
  });

  test("handles loading state correctly", async () => {
    render(<Products />);

    // Initially should show loading in table
    expect(screen.getByText("Loading products...")).toBeInTheDocument();

    // After timeout, should show product data
    await waitFor(
      () => {
        expect(
          screen.queryByText("Loading products...")
        ).not.toBeInTheDocument();
        expect(
          screen.getByTestId("products-table-container")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test("renders product names correctly", async () => {
    render(<Products />);

    await waitFor(() => {
      const productNames = screen.getAllByTestId(/product-name-/);
      expect(productNames).toHaveLength(2);
      expect(productNames[0]).toHaveTextContent("ASOS Ridley High Waist");
      expect(productNames[1]).toHaveTextContent("Marco Lightweight Shirt");
    });
  });

  test("renders product prices correctly", async () => {
    render(<Products />);

    await waitFor(() => {
      const productPrices = screen.getAllByTestId(/product-price-/);
      expect(productPrices).toHaveLength(2);
      expect(productPrices[0]).toHaveTextContent("$79.49");
      expect(productPrices[1]).toHaveTextContent("$128.50");
    });
  });

  test("renders product quantities correctly", async () => {
    render(<Products />);

    await waitFor(() => {
      const productQties = screen.getAllByTestId(/product-qty-/);
      expect(productQties).toHaveLength(2);
      expect(productQties[0]).toHaveTextContent("82");
      expect(productQties[1]).toHaveTextContent("37");
    });
  });

  test("renders with proper accessibility attributes", async () => {
    render(<Products />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId("products-table-container");
      expect(mainContainer).toHaveAttribute("id", "products-table-container");
    });
  });

  test("displays correct number of products", async () => {
    render(<Products />);

    await waitFor(() => {
      const productRows = screen.getAllByTestId(/product-row-/);
      expect(productRows).toHaveLength(2);
    });
  });

  test("console logs loading message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<Products />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Loading products data from src/data/products.json..."
    );

    consoleSpy.mockRestore();
  });
});
