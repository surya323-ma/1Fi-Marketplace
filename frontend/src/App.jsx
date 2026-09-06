import { Routes, Route, Link } from "react-router-dom";
import ShopPage from "./pages/ShopPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light">
      <div className="sticky top-0 z-10 px-3 pt-3 sm:px-4">
        <header className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-4 py-2.5 flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-brand text-white font-bold text-sm rounded-lg w-8 h-8 flex items-center justify-center">
                1Fi
              </span>
              <span className="hidden sm:inline text-gray-400 text-sm font-medium">Shop</span>
            </Link>
            <span className="text-brand font-semibold text-sm sm:text-base">1Fi Marketplace</span>
          </div>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
        </Routes>
      </main>
    </div>
  );
}
