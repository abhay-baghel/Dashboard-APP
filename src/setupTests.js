// jest-dom adds custom jest matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";

// Mock Chart.js
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

// React-router-dom will be mocked in individual test files as needed

// Mock Chart.js components
jest.mock("react-chartjs-2", () => ({
  Chart: ({ children }) => <div data-testid="chart">{children}</div>,
  Bar: ({ data, options, ...props }) => (
    <canvas data-testid="bar-chart" {...props} />
  ),
  Line: ({ data, options, ...props }) => (
    <canvas data-testid="line-chart" {...props} />
  ),
  Doughnut: ({ data, options, ...props }) => (
    <canvas data-testid="doughnut-chart" {...props} />
  ),
}));

jest.mock("chart.js", () => ({
  Chart: {
    register: jest.fn(),
  },
  CategoryScale: {},
  LinearScale: {},
  BarElement: {},
  LineElement: {},
  PointElement: {},
  ArcElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
}));

// Mock SCSS files
jest.mock("./components/Dashboard.scss", () => ({}));
jest.mock("./components/Orderslist.scss", () => ({}));
jest.mock("./components/NotificationBar.scss", () => ({}));

// Mock JSON data files
jest.mock("./data/products.json", () => ({
  products: [
    {
      id: 1,
      name: "ASOS Ridley High Waist",
      price: "$79.49",
      qty: 82,
      amount: "$6,518.18",
    },
    {
      id: 2,
      name: "Marco Lightweight Shirt",
      price: "$128.50",
      qty: 37,
      amount: "$4,754.50",
    },
  ],
}));

jest.mock("./data/orders.json", () => ({
  orders: [
    {
      id: "ORD001",
      user: "John Doe",
      project: "Website Redesign",
      address: "123 Main St, City, Country",
      date: "2023-09-20",
      status: "Completed",
    },
    {
      id: "ORD002",
      user: "Jane Smith",
      project: "Mobile App",
      address: "456 Oak Ave, City, Country",
      date: "2023-09-19",
      status: "In Progress",
    },
  ],
}));

jest.mock("./data/projectedData.json", () => ({
  projectedData: {
    labels: ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Projections",
        data: [1000, 1200, 1100, 1300],
        backgroundColorClass: "projections-bg",
      },
      {
        label: "Actuals",
        data: [950, 1100, 1000, 1250],
        backgroundColorClass: "actuals-bg",
      },
    ],
  },
}));

jest.mock("./data/revenue.json", () => ({
  revenueData: [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 6000 },
  ],
}));

jest.mock("./data/sources.json", () => ({
  sources: [
    { name: "Direct", value: 40, color: "#FF6384" },
    { name: "Social Media", value: 30, color: "#36A2EB" },
  ],
}));

jest.mock("./data/locations.json", () => ({
  locations: {
    labels: ["New York", "San Francisco", "Sydney", "Singapore"],
    datasets: [
      {
        data: [72000, 39000, 25000, 61000],
        backgroundColorClasses: [
          "newyork-color",
          "sanfrancisco-color",
          "sydney-color",
          "singapore-color",
        ],
      },
    ],
  },
}));

jest.mock("./data/notifications.json", () => ({
  notifications: [
    {
      id: 1,
      title: "New Order",
      message: "You have a new order from John Doe",
      time: "2 minutes ago",
      type: "order",
      read: false,
    },
  ],
}));
