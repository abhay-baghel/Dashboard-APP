import React, { useState, useEffect } from "react";
import ordersDataFile from "../data/orders.json";
import "./Orderslist.scss";

// Function to get status badge CSS class
const getStatusBadgeClass = (status) => {
  const baseClass = "status-badge";
  const statusClass = status.toLowerCase().replace(" ", "-");
  return `${baseClass} ${statusClass}`;
};

export default function Orderslist({ onBack }) {
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      console.log("Loading orders data from src/data/orders.json...");

      // Small delay to show loading state
      const isProduction = process.env.NODE_ENV === "production";
      if (!isProduction) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const data = ordersDataFile;
      console.log(
        "Orders data loaded successfully:",
        data.orders?.length || 0,
        "orders"
      );
      setOrdersData(data.orders || []);
      setError(null);
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Failed to load orders data. Please try again later.");
      setOrdersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Refresh handler
  const handleRefresh = () => {
    loadOrders();
  };

  // Helper function to check if a date matches the filter
  const matchesDateFilter = (orderDate) => {
    if (dateFilter === "All") return true;

    const orderDateTime = new Date(orderDate);
    const today = new Date();

    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    orderDateTime.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "Today":
        return orderDateTime.getTime() === today.getTime();

      case "This Week":
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
        return orderDateTime >= weekStart && orderDateTime <= weekEnd;

      case "This Month":
        return (
          orderDateTime.getMonth() === today.getMonth() &&
          orderDateTime.getFullYear() === today.getFullYear()
        );

      default:
        return true;
    }
  };

  const filteredOrders = ordersData.filter((order) => {
    // filtering based on user name, project and order ID
    const matchesSearch =
      order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    const matchesDate = matchesDateFilter(order.date);

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map((order) => order.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectOrder = (orderId) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-96"
        id="orderslist-loading"
        data-testid="orderslist-loading"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-96"
        id="orderslist-error"
        data-testid="orderslist-error"
      >
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!ordersData || ordersData.length === 0) {
    return (
      <div
        className="flex items-center justify-center min-h-96"
        id="orderslist-empty"
        data-testid="orderslist-empty"
      >
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Orders Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no orders available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-6 max-w-full overflow-hidden"
      id="orderslist-main"
      data-testid="orderslist-main"
    >
      {/* Header with Back Button */}
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pt-2 sm:pt-0"
        id="orderslist-header"
        data-testid="orderslist-header"
      >
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            id="back-button"
            data-testid="back-button"
            aria-label="Go back to dashboard"
          >
            ← Back
          </button>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold truncate"
            id="orders-title"
            data-testid="orders-title"
          >
            Order List
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            id="refresh-button"
            data-testid="refresh-button"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            <span className="hidden xs:inline">
              {loading ? "Loading..." : "Refresh"}
            </span>
            <span className="xs:hidden">↻</span>
          </button>
          <div
            className="text-xs sm:text-sm text-gray-500 text-center sm:text-left"
            id="orders-count"
            data-testid="orders-count"
          >
            {filteredOrders.length} total orders | Page {currentPage} of{" "}
            {totalPages || 1}
          </div>
        </div>
      </div>

      {/* Filters and Search Row */}
      <div
        className="app-card p-3 sm:p-4 rounded-lg shadow max-w-full overflow-hidden"
        id="filters-container"
        data-testid="filters-container"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 min-w-0">
          {/* Left side - Filters */}
          <div
            className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 min-w-0 w-full lg:w-auto"
            id="filter-options"
            data-testid="filter-options"
          >
            <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
              <label
                htmlFor="status-filter"
                className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0"
              >
                Status:
              </label>
              <select
                id="status-filter"
                data-testid="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white dark:bg-gray-800 dark:text-white min-w-0 flex-1 max-w-none"
              >
                <option value="All">All Status</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
              <label
                htmlFor="date-filter"
                className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0"
              >
                Date:
              </label>
              <select
                id="date-filter"
                data-testid="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white dark:bg-gray-800 dark:text-white min-w-0 flex-1 max-w-none"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>
          </div>

          {/* Right side - Search */}
          <div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto min-w-0"
            id="search-container"
            data-testid="search-container"
          >
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white dark:bg-gray-800 dark:text-white w-full sm:w-48 lg:w-64 min-w-0"
              id="orders-search"
              data-testid="orders-search"
            />
            <button
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
              id="search-button"
              data-testid="search-button"
            >
              🔍 <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="app-card rounded-lg shadow overflow-hidden max-w-full"
        id="orders-table-container"
        data-testid="orders-table-container"
      >
        <div className="overflow-x-auto max-w-full">
          <table
            className="w-full"
            style={{ minWidth: "640px" }}
            id="orders-table"
            data-testid="orders-table"
          >
            <thead
              className="bg-gray-50 dark:bg-gray-800"
              id="orders-table-head"
              data-testid="orders-table-head"
            >
              <tr>
                <th className="px-2 sm:px-3 lg:px-6 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    id="select-all-checkbox"
                    data-testid="select-all-checkbox"
                  />
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                  Order ID
                </th>
                <th className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20 sm:w-28">
                  User
                </th>
                <th className="hidden md:table-cell px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-24 sm:w-32">
                  Project
                </th>
                <th className="hidden lg:table-cell px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32 sm:w-40">
                  Address
                </th>
                <th className="hidden sm:table-cell px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20 sm:w-24">
                  Date
                </th>
                <th
                  className="px-2 sm:px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-0"
                  style={{ width: "120px", maxWidth: "120px" }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody
              className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
              id="orders-table-body"
              data-testid="orders-table-body"
            >
              {currentOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  id={`order-row-${index}`}
                  data-testid={`order-row-${index}`}
                >
                  <td className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4 whitespace-nowrap w-12">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      id={`order-checkbox-${index}`}
                      data-testid={`order-checkbox-${index}`}
                    />
                  </td>
                  <td
                    className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900 dark:text-white w-24 sm:w-32"
                    id={`order-id-${index}`}
                    data-testid={`order-id-${index}`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{order.id}</span>
                      {/* Show project on mobile when Project column is hidden */}
                      <span className="md:hidden text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {order.project}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-300 w-20 sm:w-28"
                    id={`order-user-${index}`}
                    data-testid={`order-user-${index}`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{order.user}</span>
                      {/* Show date on mobile when Date column is hidden */}
                      <span className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                        {order.date}
                      </span>
                    </div>
                  </td>
                  <td
                    className="hidden md:table-cell px-2 sm:px-3 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-300 w-24 sm:w-32"
                    id={`order-project-${index}`}
                    data-testid={`order-project-${index}`}
                  >
                    <span className="truncate block" title={order.project}>
                      {order.project}
                    </span>
                  </td>
                  <td
                    className="hidden lg:table-cell px-2 sm:px-3 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-300 w-32 sm:w-40"
                    id={`order-address-${index}`}
                    data-testid={`order-address-${index}`}
                  >
                    <div className="truncate max-w-full" title={order.address}>
                      {order.address}
                    </div>
                  </td>
                  <td
                    className="hidden sm:table-cell px-2 sm:px-3 lg:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 dark:text-gray-300 w-20 sm:w-24"
                    id={`order-date-${index}`}
                    data-testid={`order-date-${index}`}
                  >
                    <span className="truncate block">{order.date}</span>
                  </td>
                  <td
                    className="px-2 sm:px-3 lg:px-6 py-3 sm:py-4 min-w-0"
                    id={`order-status-${index}`}
                    data-testid={`order-status-${index}`}
                    style={{ width: "120px", maxWidth: "120px" }}
                  >
                    <div className="w-full max-w-full">
                      <span
                        className={`${getStatusBadgeClass(
                          order.status
                        )} block text-center whitespace-nowrap text-xs`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          className="bg-gray-50 dark:bg-gray-800 px-3 sm:px-6 py-3 border-t border-gray-200 dark:border-gray-700"
          id="pagination-footer"
          data-testid="pagination-footer"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Left side - Selection info or showing info */}
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {selectedOrders.length > 0 ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span>{selectedOrders.length} order(s) selected</span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Export
                    </button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <span>
                  Showing {startIndex + 1}-
                  {Math.min(endIndex, filteredOrders.length)} of{" "}
                  {filteredOrders.length} orders
                </span>
              )}
            </div>

            {/* Right side - Pagination controls */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  id="prev-page-button"
                  data-testid="prev-page-button"
                >
                  Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        data-testid={`page-${pageNum}-button`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-500">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  id="next-page-button"
                  data-testid="next-page-button"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
