import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Notificationbar from "./Notificationbar";

// Mock the SCSS file
jest.mock("./NotificationBar.scss", () => ({}));

describe("Notificationbar Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test("renders notification bar when open", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("notification-bar")).toBeInTheDocument();
  });

  test("does not render notification bar when closed", () => {
    render(<Notificationbar isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId("notification-bar")).not.toBeInTheDocument();
  });

  test("renders overlay when notification bar is open", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("notification-overlay")).toBeInTheDocument();
  });

  test("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    const overlay = screen.getByTestId("notification-overlay");
    await user.click(overlay);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders close button", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("close-notifications-btn")).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByTestId("close-notifications-btn");
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("renders notification header", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  test("renders loading state initially", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("notifications-loading")).toBeInTheDocument();
    expect(screen.getByText("Loading notifications...")).toBeInTheDocument();
  });

  test("renders notification list after loading", async () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(
      () => {
        expect(screen.getByTestId("notifications-list")).toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test("renders notification items", async () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText("New Order")).toBeInTheDocument();
      expect(
        screen.getByText("You have a new order from John Doe")
      ).toBeInTheDocument();
      expect(screen.getByText("2 minutes ago")).toBeInTheDocument();
    });
  });

  test("notification bar slides in when open", () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    const notificationBar = screen.getByTestId("notification-bar");
    expect(notificationBar).toHaveClass("translate-x-0");
  });

  test("notification bar slides out when closed", () => {
    const { rerender } = render(
      <Notificationbar isOpen={true} onClose={mockOnClose} />
    );

    rerender(<Notificationbar isOpen={false} onClose={mockOnClose} />);

    // Should not be in DOM when closed
    expect(screen.queryByTestId("notification-bar")).not.toBeInTheDocument();
  });

  test("renders mark all as read button", async () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByTestId("mark-all-read-btn")).toBeInTheDocument();
    });
  });

  test("marks all notifications as read when button is clicked", async () => {
    const user = userEvent.setup();
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByTestId("mark-all-read-btn")).toBeInTheDocument();
    });

    const markAllReadBtn = screen.getByTestId("mark-all-read-btn");
    await user.click(markAllReadBtn);

    // The button should be disabled after clicking
    await waitFor(() => {
      expect(markAllReadBtn).toBeDisabled();
    });
  });

  test("handles notification click", async () => {
    const user = userEvent.setup();
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      const notification = screen.getByTestId("notification-0");
      expect(notification).toBeInTheDocument();
    });

    const notification = screen.getByTestId("notification-0");
    await user.click(notification);

    // Notification should be marked as read
    expect(notification).toHaveClass("opacity-60");
  });

  test("renders clear all button", async () => {
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByTestId("clear-all-btn")).toBeInTheDocument();
    });
  });

  test("clears all notifications when clear all button is clicked", async () => {
    const user = userEvent.setup();
    render(<Notificationbar isOpen={true} onClose={mockOnClose} />);

    const clearAllBtn = screen.getByTestId("clear-all-btn");
    await user.click(clearAllBtn);

    await waitFor(() => {
      expect(screen.getByText("No notifications")).toBeInTheDocument();
    });
  });
});
