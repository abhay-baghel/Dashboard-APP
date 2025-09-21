import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import revenueDataFile from "../data/revenue.json";
import "./Dashboard.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Revenue() {
  const [revenueLine, setRevenueLine] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);

  // Function to get CSS custom property value
  const getCSSCustomProperty = (propertyName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();
  };

  // Load revenue data and convert to Chart.js format
  const loadRevenueData = async () => {
    try {
      console.log("Loading revenue data from src/data/revenue.json...");

      const data = revenueDataFile;
      const revenueData = data.revenue;

      // Get colors from CSS custom properties
      const currentWeekColor = getCSSCustomProperty("--current-week-line");
      const previousWeekColor = getCSSCustomProperty("--previous-week-line");

      // Map color classes to actual CSS colors
      const colorMap = {
        "current-week-line": currentWeekColor || "#059669",
        "previous-week-line": previousWeekColor || "#3b82f6",
      };

      // Convert data with CSS class references to actual colors from SCSS
      const chartData = {
        labels: revenueData.labels,
        datasets: revenueData.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          borderColor: colorMap[dataset.borderColorClass] || "#059669", // fallback color
          tension: dataset.tension,
          fill: dataset.fill,
        })),
      };

      setRevenueLine(chartData);
      console.log("Revenue data loaded successfully");
    } catch (err) {
      console.error("Error loading revenue data:", err);
      // Fallback to empty data
      setRevenueLine({ labels: [], datasets: [] });
    }
  };

  useEffect(() => {
    loadRevenueData();
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
  }, [revenueLine]);

  return (
    <div
      className="app-card p-6 rounded-lg shadow"
      id="revenue-line-container"
      data-testid="revenue-line-container"
    >
      <h4
        className="font-semibold mb-2"
        id="revenue-line-title"
        data-testid="revenue-line-title"
      >
        Revenue
      </h4>
      <div
        id="revenue-line-chart"
        data-testid="revenue-line-chart"
        className="w-full h-80"
        style={{ position: "relative", minHeight: "320px" }}
      >
        <Line
          ref={chartRef}
          data={revenueLine}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  color: "rgb(107, 114, 128)", // gray-500 for both light and dark
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: "rgb(107, 114, 128)", // gray-500 for axis labels
                },
                grid: {
                  color: "rgba(107, 114, 128, 0.2)", // subtle grid lines
                },
              },
              y: {
                ticks: {
                  color: "rgb(107, 114, 128)", // gray-500 for axis labels
                },
                grid: {
                  color: "rgba(107, 114, 128, 0.2)", // subtle grid lines
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
