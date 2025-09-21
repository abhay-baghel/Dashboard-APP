import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import sourcesDataFile from "../data/sources.json";
import "./Dashboard.scss";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TotalSales() {
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [salesData, setSalesData] = useState({ labels: [], values: [] });
  const chartRef = useRef(null);

  // Function to get CSS custom property value
  const getCSSCustomProperty = (propertyName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();
  };

  // Load sources data and convert to Chart.js format
  const loadSourcesData = async () => {
    try {
      console.log("Loading sources data from src/data/sources.json...");

      const data = sourcesDataFile;
      const sourcesData = data.sources;

      // Get colors from CSS custom properties
      const directColor = getCSSCustomProperty("--direct-color");
      const affiliateColor = getCSSCustomProperty("--affiliate-color");
      const sponsoredColor = getCSSCustomProperty("--sponsored-color");
      const emailColor = getCSSCustomProperty("--email-color");

      // Map color classes to actual CSS colors
      const colorMap = {
        "direct-color": directColor || "#3b82f6",
        "affiliate-color": affiliateColor || "#8b5cf6",
        "sponsored-color": sponsoredColor || "#10b981",
        "email-color": emailColor || "#e5e7eb",
      };

      // Convert data with CSS class references to actual colors from SCSS
      const chartData = {
        labels: sourcesData.labels,
        datasets: sourcesData.datasets.map((dataset) => ({
          data: dataset.data,
          backgroundColor: dataset.backgroundColorClasses.map(
            (colorClass) => colorMap[colorClass] || "#e5e7eb" // fallback color
          ),
        })),
      };

      setPieData(chartData);

      // Store sales data for legend
      setSalesData({
        labels: sourcesData.labels,
        values: sourcesData.datasets[0].data,
      });

      console.log("Sources data loaded successfully");
    } catch (err) {
      console.error("Error loading sources data:", err);
      // Fallback to empty data
      setPieData({ labels: [], datasets: [] });
      setSalesData({ labels: [], values: [] });
    }
  };

  useEffect(() => {
    loadSourcesData();
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
  }, [pieData]);

  return (
    <div
      className="app-card p-6 rounded-lg shadow"
      id="total-sales-container"
      data-testid="total-sales-container"
    >
      <h3
        className="font-semibold mb-3"
        id="total-sales-title"
        data-testid="total-sales-title"
      >
        Total Sales
      </h3>
      <div
        className="flex flex-col items-center"
        id="total-sales-content"
        data-testid="total-sales-content"
      >
        <div
          className="w-48 h-48 mb-4"
          id="total-sales-chart"
          data-testid="total-sales-chart"
          style={{
            position: "relative",
            minWidth: "180px",
            minHeight: "180px",
          }}
        >
          <Doughnut
            ref={chartRef}
            data={pieData}
            options={{
              cutout: "70%",
              responsive: true,
              maintainAspectRatio: false,
              resizeDelay: 0,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div
          className="w-full space-y-2 text-sm"
          id="total-sales-legend"
          data-testid="total-sales-legend"
        >
          {salesData.labels.map((label, index) => {
            const colorClasses = {
              Direct: "bg-blue-500",
              Affiliate: "bg-purple-500",
              Sponsored: "bg-green-500",
              "E-mail": "bg-gray-300",
            };

            return (
              <div
                key={label}
                className="flex justify-between items-center"
                id={`sales-${label.toLowerCase()}`}
                data-testid={`sales-${label.toLowerCase()}`}
              >
                <div className="flex items-center">
                  <span
                    className={`inline-block w-3 h-3 ${colorClasses[label]} rounded-full mr-2`}
                  ></span>
                  <span>{label}</span>
                </div>
                <div className="font-semibold">
                  ${salesData.values[index] || "0.00"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
