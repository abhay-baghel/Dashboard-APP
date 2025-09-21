import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import projectedDataFile from "../data/projectedData.json";
import "./Dashboard.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const CHART_COLORS = {
  labels: "rgb(107, 114, 128)", // gray-500 for labels and axis
  gridLines: "rgba(107, 114, 128, 0.2)", // subtle grid lines
};

export default function Projections() {
  const [projData, setProjData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);

  // Function to get CSS custom property value
  const getCSSCustomProperty = (propertyName) => {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(propertyName)
      .trim();
  };

  // Load projected data and convert to Chart.js format
  const loadProjectedData = async () => {
    try {
      console.log("Loading projected data from src/data/projectedData.json...");

      const data = projectedDataFile;
      const projectedData = data.projectedData;

      // Get colors from CSS custom properties
      const projectionsColor = getCSSCustomProperty("--projections-bg-color");
      const actualsColor = getCSSCustomProperty("--actuals-bg-color");

      // Convert data with CSS class references to actual colors from SCSS
      const chartData = {
        labels: projectedData.labels,
        datasets: projectedData.datasets.map((dataset) => ({
          label: dataset.label,
          data: dataset.data,
          backgroundColor:
            dataset.backgroundColorClass === "projections-bg"
              ? projectionsColor || "rgba(99,102,241,0.85)" // fallback if CSS not loaded
              : actualsColor || "rgba(99,102,241,0.35)", // fallback if CSS not loaded
        })),
      };

      setProjData(chartData);
      console.log("Projected data loaded successfully");
    } catch (err) {
      console.error("Error loading projected data:", err);
      // Fallback to empty data
      setProjData({ labels: [], datasets: [] });
    }
  };

  useEffect(() => {
    loadProjectedData();
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
  }, [projData]);

  return (
    <div
      className="app-card p-6 rounded-lg shadow"
      id="projections-chart-container"
      data-testid="projections-chart-container"
    >
      <h3
        className="font-semibold mb-3"
        id="projections-title"
        data-testid="projections-title"
      >
        Projections vs Actuals
      </h3>
      <div
        className="chart-container projections-bar-chart w-full h-80"
        id="projections-bar-chart"
        data-testid="projections-bar-chart"
        style={{ position: "relative", minHeight: "320px" }}
      >
        <Bar
          ref={chartRef}
          data={projData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            resizeDelay: 0,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: CHART_COLORS.labels,
                },
              },
            },
            scales: {
              x: {
                ticks: {
                  color: CHART_COLORS.labels,
                },
                grid: {
                  color: CHART_COLORS.gridLines,
                },
              },
              y: {
                ticks: {
                  color: CHART_COLORS.labels,
                },
                grid: {
                  color: CHART_COLORS.gridLines,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
