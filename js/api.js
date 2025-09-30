// js/api.js
import { DEFAULT_LIMIT } from "./config.js";

const API_BASE = "https://dummyjson.com/products";

let allproducts = null;

export async function fetchProducts(limit = DEFAULT_LIMIT) {
  try {
    const res = await fetch(`${API_BASE}?limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    allproducts = data.products ?? [];
    localStorage.setItem("allProducts", JSON.stringify(allproducts));

    // return only requested limit for the caller
    return allproducts;
  } catch (err) {
    console.error("fetchProducts error", err);
    return [];
  }
}

export async function getAllProducts() {
  if (allproducts && allproducts.length) return allproducts;
  const stored = JSON.parse(localStorage.getItem("allProducts") || "[]");
  if (stored.length) {
    allproducts = stored;
    return allproducts;
  }
  return await fetchProducts();
}
