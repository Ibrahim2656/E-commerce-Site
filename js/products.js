import {
  BESTSELLER_LIMIT,
  BESTSELLER_RATING_THRESHOLD,
  BESTSELLER_PRODUCT_LIMIT,
} from "./config.js";
import { fetchProducts } from "./api.js";

function getStars(rating) {
  const fullStars = Math.ceil(rating);
  const emptyStars = 5 - fullStars;
  return "★".repeat(fullStars) + "☆".repeat(emptyStars);
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("products-container");
  if (!container) return;

  container.innerHTML = `<p>Loading...</p>`;

  try {
    const products = await fetchProducts(BESTSELLER_LIMIT);
    container.innerHTML = "";

    if (!products.length) {
      container.innerHTML = `<p>No products found.</p>`;
      return;
    }
    let bestSellerCounter = 0;
    products.forEach((product) => {
      if (product.rating >= 4 && bestSellerCounter < BESTSELLER_PRODUCT_LIMIT) {
        const card = document.createElement("div");
        card.className = "product-card";

        const isBestSeller = product.rating >= BESTSELLER_RATING_THRESHOLD;

        card.innerHTML = `
        ${isBestSeller ? `<span class="product-badge">Best Seller</span>` : ""}
        <div class="product-image-container">
          <img src="${product.thumbnail}" alt="${
          product.title
        }" class="product-image">
        </div>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-category">${product.category}</p>
        <div class="product-rating">
          <span class="rating-stars">${getStars(product.rating)}</span>
          <span class="rating-value">(${product.rating.toFixed(1)})</span>
        </div>
        <p class="product-price">$${product.price}</p>
        <div class="product-actions">
          <button class="btn-favorite"><img src="./assets/icons/fav.png" alt="fav"></button>
        <button class="btn-add-to-cart">Add to Cart</button>
        </div>
      `;

        card.addEventListener("click", (e) => {
          if (
            e.target.closest(".btn-add-to-cart") ||
            e.target.closest(".btn-favorite")
          )
            return;
          window.location.href = `product.html?id=${product.id}`;
        });

        container.appendChild(card);
        bestSellerCounter += 1;
      }
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p>Error loading products. See console.</p>`;
  }
});
