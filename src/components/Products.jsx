import React, { useState, useEffect } from "react";
import productsDataFile from "../data/products.json";
import "./Dashboard.scss";

export default function Products() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products data from imported JSON file
  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("Loading products data from src/data/products.json...");

      // Small delay to show loading state (remove in production if not needed)
      const isProduction = process.env.NODE_ENV === "production";
      if (!isProduction) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      const data = productsDataFile;
      console.log(
        "Products data loaded successfully:",
        data.products?.length || 0,
        "products"
      );
      setTopProducts(data.products || []);
      setError(null);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products data. Please try again later.");
      setTopProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div
      className="lg:col-span-2 app-card p-6 rounded-lg shadow"
      id="products-table-container"
      data-testid="products-table-container"
    >
      <div
        className="flex items-center justify-between mb-4"
        id="products-header"
        data-testid="products-header"
      >
        <h3
          className="font-semibold"
          id="products-title"
          data-testid="products-title"
        >
          Top Selling Products
        </h3>
      </div>
      <table
        className="w-full text-sm"
        id="products-table"
        data-testid="products-table"
      >
        <thead
          className="text-left text-gray-500"
          id="products-table-head"
          data-testid="products-table-head"
        >
          <tr>
            <th className="pb-2">Name</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Quantity</th>
            <th className="pb-2">Amount</th>
          </tr>
        </thead>
        <tbody id="products-table-body" data-testid="products-table-body">
          {loading ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-gray-500">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                  Loading products...
                </div>
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-red-500">
                <div className="text-red-600 dark:text-red-400">{error}</div>
              </td>
            </tr>
          ) : topProducts.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-8 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          ) : (
            topProducts.map((p, i) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 dark:hover:bg-gray-800"
                id={`product-row-${p.id}`}
                data-testid={`product-row-${p.id}`}
              >
                <td
                  className="py-3"
                  id={`product-name-${p.id}`}
                  data-testid={`product-name-${p.id}`}
                >
                  {p.name}
                </td>
                <td
                  id={`product-price-${p.id}`}
                  data-testid={`product-price-${p.id}`}
                >
                  {p.price}
                </td>
                <td
                  id={`product-qty-${p.id}`}
                  data-testid={`product-qty-${p.id}`}
                >
                  {p.qty}
                </td>
                <td
                  className="font-semibold"
                  id={`product-amount-${p.id}`}
                  data-testid={`product-amount-${p.id}`}
                >
                  {p.amount}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
