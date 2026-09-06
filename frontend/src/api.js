const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to load products");
  const json = await res.json();
  return json.data;
}

export async function fetchProductBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Failed to load product");
  const json = await res.json();
  return json.data;
}
