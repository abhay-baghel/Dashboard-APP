import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Orderslist from "./components/Orderslist";
import Notificationbar from "./components/Notificationbar";

function AppContent() {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const closeNotifications = () => {
    setIsNotificationOpen(false);
  };

  const navigateToOrders = () => {
    navigate("/api/orders");
    closeNotifications(); // Close notifications when navigating
    closeSidebar(); // Close sidebar when navigating on mobile
  };

  const navigateToDashboard = () => {
    navigate("/api/homepage");
    closeSidebar(); // Close sidebar when navigating on mobile
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      <div className="flex-1 flex flex-col md:ml-64">
        <Header
          onNotificationToggle={toggleNotifications}
          onSidebarToggle={toggleSidebar}
        />
        <main
          className="flex-1 p-3 sm:p-6"
          style={{ paddingTop: "calc(7rem + 1rem)", minHeight: "100vh" }}
        >
          <Routes>
            <Route
              path="/api/homepage"
              element={<Dashboard onNavigateToOrders={navigateToOrders} />}
            />
            <Route
              path="/api/orders"
              element={<Orderslist onBack={navigateToDashboard} />}
            />
            <Route path="/" element={<Navigate to="/api/homepage" replace />} />
          </Routes>
        </main>
      </div>
      <Notificationbar
        isOpen={isNotificationOpen}
        onClose={closeNotifications}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
