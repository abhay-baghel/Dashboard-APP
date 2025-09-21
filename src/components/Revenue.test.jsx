import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Revenue from "./Revenue";

describe("Revenue Component", () => {
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
    render(<Revenue />);

    expect(screen.getByTestId("revenue-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading revenue data...")).toBeInTheDocument();
  });

  test("renders revenue component after loading", async () => {
    render(<Revenue />);

    await waitFor(
      () => {
        expect(screen.getByTestId("revenue-main")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );

    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
  });

  test("renders line chart", async () => {
    render(<Revenue />);

    await waitFor(() => {
      expect(screen.getByTestId("revenue-chart")).toBeInTheDocument();
    });

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("renders with proper accessibility attributes", async () => {
    render(<Revenue />);

    await waitFor(() => {
      const mainContainer = screen.getByTestId("revenue-main");
      expect(mainContainer).toHaveAttribute("id", "revenue-main");
    });
  });
});
