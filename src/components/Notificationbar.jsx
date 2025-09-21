import React, { useState, useEffect } from "react";
import notificationsDataFile from "../data/notifications.json";
import "./NotificationBar.scss";

export default function Notificationbar({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get notification badge CSS class
  const getNotificationBadgeClass = (type) => {
    return `notification-badge ${type}`;
  };

  // Load notifications data from imported JSON file
  const loadNotifications = async () => {
    try {
      setLoading(true);
      console.log(
        "Loading notifications data from src/data/notifications.json..."
      );

      // Small delay to show loading state (remove in production if not needed)
      const isProduction = process.env.NODE_ENV === "production";
      if (!isProduction) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const data = notificationsDataFile;
      console.log(
        "Notifications data loaded successfully:",
        data.notifications?.length || 0,
        "notifications"
      );
      setNotifications(data.notifications || []);
      setError(null);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications data.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onClose}
          id="notification-overlay"
          data-testid="notification-overlay"
        />
      )}

      {/* Notification Sidebar */}
      <aside
        className={`notification-sidebar fixed top-0 right-0 w-80 h-screen bg-gradient-to-b from-purple-800 to-purple-700 text-white transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        id="notificationbar"
        data-testid="notificationbar"
      >
        <div className="p-6">
          {/* Header */}
          <div
            className="mb-6 flex items-center justify-between"
            id="notificationbar-header"
            data-testid="notificationbar-header"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center"
                id="notification-icon"
                data-testid="notification-icon"
              >
                🔔
              </div>
              <div
                className="font-semibold text-lg"
                id="notification-title"
                data-testid="notification-title"
              >
                Notifications
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              id="close-notifications"
              data-testid="close-notifications"
              aria-label="Close notifications"
            >
              ✕
            </button>
          </div>

          {/* Notifications List */}
          <div
            className="space-y-4"
            id="notifications-list"
            data-testid="notifications-list"
          >
            <div
              className="text-xs text-white/70 mb-3"
              id="recent-section"
              data-testid="recent-section"
            >
              Recent Notifications
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-3"></div>
                <p className="text-white/70 text-sm">
                  Loading notifications...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/70 text-sm">No notifications found.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white/10 rounded-lg p-4 notification-item cursor-pointer"
                  id={`notification-${notification.id}`}
                  data-testid={`notification-${notification.id}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-lg flex-shrink-0"
                      id={`notification-icon-${notification.id}`}
                      data-testid={`notification-icon-${notification.id}`}
                    >
                      {notification.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className="text-sm font-semibold truncate"
                          id={`notification-title-${notification.id}`}
                          data-testid={`notification-title-${notification.id}`}
                        >
                          {notification.title}
                        </h4>
                        <span
                          className={getNotificationBadgeClass(
                            notification.type
                          )}
                          id={`notification-type-${notification.id}`}
                          data-testid={`notification-type-${notification.id}`}
                        >
                          {notification.type}
                        </span>
                      </div>
                      <p
                        className="text-xs text-white/80 mb-2"
                        id={`notification-message-${notification.id}`}
                        data-testid={`notification-message-${notification.id}`}
                      >
                        {notification.message}
                      </p>
                      <span
                        className="text-xs text-white/60"
                        id={`notification-time-${notification.id}`}
                        data-testid={`notification-time-${notification.id}`}
                      >
                        {notification.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div
            className="mt-6 pt-4 border-t border-white/20"
            id="notification-actions"
            data-testid="notification-actions"
          >
            <button
              className="w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 px-4 text-sm font-medium transition-colors"
              id="mark-all-read"
              data-testid="mark-all-read"
            >
              Mark All as Read
            </button>
            <button
              className="w-full mt-2 text-white/70 hover:text-white rounded-lg py-2 px-4 text-sm transition-colors"
              id="view-all-notifications"
              data-testid="view-all-notifications"
            >
              View All Notifications
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
