import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts } from "../api.js";

const TABS = ["Top Brands", "Nearby Stores", "1Fi Marketplace"];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("1Fi Marketplace");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab !== "1Fi Marketplace") return;
    setLoading(true);
    fetchProducts()
      .then((data) => setProducts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeTab]);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-1.5 flex gap-1 mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-brand text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab !== "1Fi Marketplace" && (
        <div className="text-center text-gray-400 py-24">
          <p>{activeTab} — coming soon</p>
        </div>
      )}

      {activeTab === "1Fi Marketplace" && (
        <>
          {loading && <p className="text-gray-500">Loading products...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
