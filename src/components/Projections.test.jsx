import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Projections from "./Projections";

describe("Projections Component", () => {
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
    render(<Projections />);

    // Check that the main container exists
    expect(
      screen.getByTestId("projections-chart-container")
    ).toBeInTheDocument();
    expect(screen.getByText("Projections vs Actuals")).toBeInTheDocument();
  });

  test("renders projections component after loading", async () => {
    render(<Projections />);

    await waitFor(
      () => {
        expect(
          screen.getByTestId("projections-chart-container")
        ).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Projections vs Actuals")).toBeInTheDocument();
  });

  test("renders bar chart", async () => {
    render(<Projections />);

    await waitFor(() => {
      expect(screen.getByTestId("projections-bar-chart")).toBeInTheDocument();
    });

    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
  });

  test("handles loading state correctly", async () => {
    render(<Projections />);

    // Initially should show container
    expect(
      screen.getByTestId("projections-chart-container")
    ).toBeInTheDocument();

    // After timeout, should show main content
    await waitFor(
      () => {
        expect(
          screen.getByTestId("projections-chart-container")
        ).toBeInTheDocument();
        expect(screen.getByTestId("projections-bar-chart")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test("renders with proper accessibility attributes", async () => {
    render(<Projections />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId("projections-chart-container");
      expect(mainContainer).toHaveAttribute(
        "id",
        "projections-chart-container"
      );

      const chartContainer = screen.getByTestId("projections-bar-chart");
      expect(chartContainer).toHaveAttribute("id", "projections-bar-chart");
    });
  });

  test("console logs loading message", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<Projections />);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Loading projected data from src/data/projectedData.json..."
    );

    consoleSpy.mockRestore();
  });

  test("handles chart responsiveness", async () => {
    render(<Projections />);

    await waitFor(() => {
      const chartContainer = screen.getByTestId("projections-bar-chart");
      expect(chartContainer).toHaveClass("w-full");
    });
  });
});
