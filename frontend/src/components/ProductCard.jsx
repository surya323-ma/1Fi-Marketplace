import { Link } from "react-router-dom";

function formatINR(amount) {
  return `\u20B9${Number(amount).toLocaleString("en-IN")}`;
}

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="flex items-center justify-between gap-3 bg-brand-card hover:bg-brand-cardDark transition-colors rounded-2xl p-4"
    >
      <div className="min-w-0">
        {product.tag && (
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide">{product.tag}</span>
        )}
        <h3 className="font-semibold text-gray-900 leading-snug truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{product.emiTeaser}</p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-gray-900">{formatINR(product.price)}</span>
          {product.mrp > product.price && (
            <span className="text-[11px] text-gray-400 line-through">{formatINR(product.mrp)}</span>
          )}
        </div>
      </div>
      <div className="shrink-0 w-16 h-16 rounded-xl bg-white/60 overflow-hidden flex items-center justify-center">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>
    </Link>
  );
}
