import { getAllProducts, fetchProducts } from "./api.js";

async function initProductPage() {
  let products = getAllProducts();
  console.log("Before Checking", products);

  // If cache is empty, fetch from API
  if (!products || products.length === 0) {
    products = await fetchProducts();
  }

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const product = products.find((p) => p.id === id);

  if (product) {
    document.title = product.title;
    document.getElementById("product-title").textContent = product.title;
  }
}

initProductPage();
