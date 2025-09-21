import React from "react";

// Individual Card component as arrow function
const Card = ({ title, value, change, id, className, ...props }) => {
  return (
    <div
      className={`app-card p-4 rounded-lg shadow transition-transform duration-200 cursor-pointer ${
        className || ""
      }`}
      id={id}
      {...props}
    >
      <div
        className="text-sm text-gray-500 mb-2"
        id={`${id}-title`}
        data-testid={`${id}-title`}
      >
        {title}
      </div>
      <div
        className="text-2xl font-bold mb-1"
        id={`${id}-value`}
        data-testid={`${id}-value`}
      >
        {value}
      </div>
      <div
        className="text-sm text-green-600"
        id={`${id}-change`}
        data-testid={`${id}-change`}
      >
        {change}
      </div>
    </div>
  );
};

// Cards container component
export default function Cards({ onNavigateToOrders }) {
  return (
    <div
      className="grid grid-cols-2 gap-4"
      id="metrics-grid"
      data-testid="metrics-grid"
    >
      <Card
        title="Customers"
        value="3,781"
        change="+11.01%"
        id="customers-card"
        data-testid="customers-card"
        className="hover:scale-105"
      />
      <Card
        title="Orders"
        value="1,219"
        change="-0.03%"
        id="orders-card"
        data-testid="orders-card"
        className="hover:scale-105"
        onClick={onNavigateToOrders}
      />
      <Card
        title="Revenue"
        value="$695"
        change="+15.03%"
        id="revenue-card"
        data-testid="revenue-card"
        className="hover:scale-105"
      />
      <Card
        title="Growth"
        value="30.1%"
        change="+6.08%"
        id="growth-card"
        data-testid="growth-card"
        className="hover:scale-105"
      />
    </div>
  );
}
