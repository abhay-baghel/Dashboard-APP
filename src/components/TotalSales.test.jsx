import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import TotalSales from "./TotalSales";

describe("TotalSales Component", () => {
  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      constructor(cb) {
        this.cb = cb;
      }
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
    };

    // Mock window.addEventListener
    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
  });

  test("renders loading state initially", () => {
    render(<TotalSales />);

    expect(screen.getByTestId("total-sales-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading sales data...")).toBeInTheDocument();
  });

  test("renders total sales component after loading", async () => {
    render(<TotalSales />);

    await waitFor(
      () => {
        expect(screen.getByTestId("total-sales-main")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Total Sales by Source")).toBeInTheDocument();
  });

  test("renders doughnut chart", async () => {
    render(<TotalSales />);

    await waitFor(() => {
      expect(screen.getByTestId("total-sales-chart")).toBeInTheDocument();
    });

    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("renders sales legend", async () => {
    render(<TotalSales />);

    await waitFor(() => {
      expect(screen.getByTestId("sales-legend")).toBeInTheDocument();
    });

    // Check for legend items
    expect(screen.getByText("Direct")).toBeInTheDocument();
    expect(screen.getByText("Social Media")).toBeInTheDocument();
    expect(screen.getByText("40%")).toBeInTheDocument();
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  test("renders total amount", async () => {
    render(<TotalSales />);

    await waitFor(() => {
      expect(screen.getByTestId("total-amount")).toBeInTheDocument();
    });

    expect(screen.getByText("$70")).toBeInTheDocument();
  });

  test("handles loading state correctly", async () => {
    render(<TotalSales />);

    // Initially should show loading
    expect(screen.getByTestId("total-sales-loading")).toBeInTheDocument();

    // After timeout, should show main content
    await waitFor(
      () => {
        expect(
          screen.queryByTestId("total-sales-loading")
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("total-sales-main")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test("renders with proper accessibility attributes", async () => {
    render(<TotalSales />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId("total-sales-main");
      expect(mainContainer).toHaveAttribute("id", "total-sales-main");
    });
  });

  test("displays correct data from sources", async () => {
    render(<TotalSales />);

    await waitFor(() => {
      // Check if data from mocked sources.json is displayed
      expect(screen.getByText("Direct")).toBeInTheDocument();
      expect(screen.getByText("Social Media")).toBeInTheDocument();
      expect(screen.getByText("40%")).toBeInTheDocument();
      expect(screen.getByText("30%")).toBeInTheDocument();
    });
  });
});
