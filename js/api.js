// js/api.js
import { DEFAULT_LIMIT } from './config.js';

const API_BASE = 'https://dummyjson.com/products';

export async function fetchProducts(limit = DEFAULT_LIMIT) {
  try {
    const url = limit ? `${API_BASE}?limit=${limit}` : API_BASE;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.products ?? [];
  } catch (err) {
    console.error('fetchProducts error', err);
    return [];
  }
}
