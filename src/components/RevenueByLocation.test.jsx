import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RevenueByLocation from "./RevenueByLocation";

describe("RevenueByLocation Component", () => {
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

    global.addEventListener = jest.fn();
    global.removeEventListener = jest.fn();
  });

  test("renders loading state initially", () => {
    render(<RevenueByLocation />);

    // Check that the main container exists
    expect(
      screen.getByTestId("revenue-location-container")
    ).toBeInTheDocument();
    expect(screen.getByText("Revenue by Location")).toBeInTheDocument();
  });

  test("renders revenue by location component after loading", async () => {
    render(<RevenueByLocation />);

    await waitFor(
      () => {
        expect(
          screen.getByTestId("revenue-location-container")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Revenue by Location")).toBeInTheDocument();
  });

  test("renders doughnut chart", async () => {
    render(<RevenueByLocation />);

    await waitFor(() => {
      expect(screen.getByTestId("revenue-location-chart")).toBeInTheDocument();
    });

    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
  });

  test("renders location stats", async () => {
    render(<RevenueByLocation />);

    await waitFor(() => {
      expect(screen.getByTestId("revenue-location-stats")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("New York")).toBeInTheDocument();
      expect(screen.getByText("San Francisco")).toBeInTheDocument();
    });
  });

  test("renders with proper accessibility attributes", async () => {
    render(<RevenueByLocation />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId("revenue-location-container");
      expect(mainContainer).toHaveAttribute("id", "revenue-location-container");

      const title = screen.getByTestId("revenue-location-title");
      expect(title).toHaveAttribute("id", "revenue-location-title");
    });
  });
});
