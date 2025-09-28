// js/api.js
import { DEFAULT_LIMIT } from "./config.js";

const API_BASE = "https://dummyjson.com/products";

let allproducts = null;

export async function fetchProducts(limit = DEFAULT_LIMIT) {
  try {
    if (allproducts && (!limit || allproducts.length >= limit)) {
      return limit ? allproducts.slice(0, limit) : allproducts;
    }
    const url = limit ? `${API_BASE}?limit=${limit}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allproducts = data.products ?? [];
    console.log(typeof allproducts);
    return allproducts;
  } catch (err) {
    console.error("fetchProducts error", err);
    return [];
  }
}

export function getAllProducts() {
  return allproducts;
}
