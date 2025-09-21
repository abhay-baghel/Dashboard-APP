import React from "react";
import Cards from "./Cards";
import Projections from "./Projections";
import Revenue from "./Revenue";
import RevenueByLocation from "./RevenueByLocation";
import Products from "./Products";
import TotalSales from "./TotalSales";
import "./Dashboard.scss";

export default function Dashboard({ onNavigateToOrders }) {
  return (
    <div
      className="space-y-6 dashboard-main"
      id="dashboard-main"
      data-testid="dashboard-main"
    >
      <div
        className="flex items-center justify-between"
        id="dashboard-header"
        data-testid="dashboard-header"
      >
        <h2
          className="text-2xl font-bold"
          id="dashboard-title"
          data-testid="dashboard-title"
        >
          eCommerce
        </h2>
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="main-content-row"
        data-testid="main-content-row"
      >
        <Cards onNavigateToOrders={onNavigateToOrders} />
        <Projections />
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="charts-grid"
        data-testid="charts-grid"
      >
        <Revenue />
        <RevenueByLocation />
      </div>
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        id="bottom-section"
        data-testid="bottom-section"
      >
        <Products />
        <TotalSales />
      </div>
    </div>
  );
}
