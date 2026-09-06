import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EMIPlanList from "../components/EMIPlanList.jsx";
import { fetchProductBySlug } from "../api.js";

function formatINR(amount) {
  return `\u20B9${Number(amount).toLocaleString("en-IN")}`;
}

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [variantIndex, setVariantIndex] = useState(0);
  const [planIndex, setPlanIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    setLoading(true);
    setConfirmation(null);
    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setVariantIndex(0);
        setPlanIndex(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="text-gray-500">Loading product...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!product) return null;

  const variant = product.variants[variantIndex];
  const plan = variant.emiPlans[planIndex];

  return (
    <div>
      <Link to="/" className="text-sm text-brand font-medium">
        &larr; Back to Shop
      </Link>

      <div className="mt-4 grid sm:grid-cols-2 gap-8">
        {/* Left: image + variant selector */}
        <div>
          <div className="bg-brand-card rounded-2xl aspect-square overflow-hidden flex items-center justify-center">
            <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
          </div>

          {product.variants.length > 1 && (
            <div className="mt-4">
              <p className="text-xs text-gray-400 mb-2">Available in {product.variants.length} variants</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.variantId}
                    onClick={() => {
                      setVariantIndex(i);
                      setPlanIndex(0);
                      setConfirmation(null);
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      i === variantIndex
                        ? "border-brand bg-brand-card text-brand font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: details + EMI plans */}
        <div>
          {product.tag && (
            <span className="text-[11px] font-semibold text-red-500 uppercase">{product.tag}</span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h1>
          <p className="text-gray-400 text-sm mb-3">{variant.storage}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-gray-900">{formatINR(variant.price)}</span>
            {variant.mrp > variant.price && (
              <span className="text-sm text-gray-400 line-through">{formatINR(variant.mrp)}</span>
            )}
          </div>

          <EMIPlanList
            plans={variant.emiPlans}
            selectedIndex={planIndex}
            onSelect={(i) => {
              setPlanIndex(i);
              setConfirmation(null);
            }}
          />

          <button
            onClick={() =>
              setConfirmation(
                `Proceeding with ${formatINR(plan.monthlyAmount)}/month for ${plan.tenureMonths} months on ${variant.label}.`
              )
            }
            className="mt-5 w-full bg-brand text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors"
          >
            Proceed with this plan
            <span aria-hidden="true">↗</span>
          </button>

          {confirmation && (
            <p className="mt-3 text-sm text-green-600 text-center">{confirmation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
