import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import locationsDataFile from "../data/locations.json";
import "./Dashboard.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RevenueByLocation() {
  const [revenueByLocation, setRevenueByLocation] = useState({
    labels: [],
    datasets: [],
  });
  const [locationStats, setLocationStats] = useState([]);
  const chartRef = useRef(null);

  // Function to get CSS custom property value
  const getCSSCustomProperty = (propertyName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();
  };

  // Load locations data and convert to Chart.js format
  const loadLocationsData = async () => {
    try {
      console.log("Loading locations data from src/data/locations.json...");

      const data = locationsDataFile;
      const locationsData = data.locations;

      // Get colors from CSS custom properties
      const newyorkColor = getCSSCustomProperty("--newyork-color");
      const sanfranciscoColor = getCSSCustomProperty("--sanfrancisco-color");
      const sydneyColor = getCSSCustomProperty("--sydney-color");
      const singaporeColor = getCSSCustomProperty("--singapore-color");

      // Map color classes to actual CSS colors
      const colorMap = {
        "newyork-color": newyorkColor || "#60a5fa",
        "sanfrancisco-color": sanfranciscoColor || "#93c5fd",
        "sydney-color": sydneyColor || "#bfdbfe",
        "singapore-color": singaporeColor || "#60f5d0",
      };

      // Convert data with CSS class references to actual colors from SCSS
      const chartData = {
        labels: locationsData.labels,
        datasets: locationsData.datasets.map((dataset) => ({
          data: dataset.data,
          backgroundColor: dataset.backgroundColorClasses.map(
            (colorClass) => colorMap[colorClass] || "#60a5fa" // fallback color
          ),
        })),
      };

      setRevenueByLocation(chartData);

      // Also create location stats for the sidebar display
      const stats = locationsData.labels.map((label, index) => ({
        name: label,
        revenue: locationsData.datasets[0].data[index],
        formattedRevenue: `${Math.round(
          locationsData.datasets[0].data[index] / 1000
        )}K`,
      }));
      setLocationStats(stats);

      console.log("Locations data loaded successfully");
    } catch (err) {
      console.error("Error loading locations data:", err);
      // Fallback to empty data
      setRevenueByLocation({ labels: [], datasets: [] });
      setLocationStats([]);
    }
  };

  useEffect(() => {
    loadLocationsData();
  }, []);

  // Handle responsive resizing
  useLayoutEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ResizeObserver for container changes
  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    });

    const chartContainer = chartRef.current.canvas.parentNode;
    if (chartContainer) {
      resizeObserver.observe(chartContainer);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [revenueByLocation]);

  return (
    <aside
      className="app-card p-6 rounded-lg shadow"
      id="revenue-location-container"
      data-testid="revenue-location-container"
    >
      <h3
        className="font-semibold mb-3"
        id="revenue-location-title"
        data-testid="revenue-location-title"
      >
        Revenue by Location
      </h3>
      <div
        className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4"
        id="revenue-location-content"
        data-testid="revenue-location-content"
      >
        <div
          className="w-40 h-40 lg:w-48 lg:h-48 flex-shrink-0"
          id="revenue-location-chart"
          data-testid="revenue-location-chart"
          style={{
            position: "relative",
            minWidth: "160px",
            minHeight: "160px",
          }}
        >
          <Doughnut
            ref={chartRef}
            data={revenueByLocation}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              resizeDelay: 0,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div
          className="w-full lg:flex-1 space-y-1.5 text-sm max-w-full"
          id="revenue-location-stats"
          data-testid="revenue-location-stats"
        >
          {locationStats.map((location, index) => (
            <div
              key={location.name}
              className="flex justify-between items-center px-1"
              id={`location-${location.name.toLowerCase().replace(/\s+/g, "")}`}
              data-testid={`location-${location.name
                .toLowerCase()
                .replace(/\s+/g, "")}`}
            >
              <span className="truncate pr-2">{location.name}</span>
              <span className="font-semibold text-right flex-shrink-0">
                {location.formattedRevenue}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
