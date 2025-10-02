import {
  DEFAULT_LIMIT,
  BESTSELLER_LIMIT,
  BESTSELLER_PRODUCT_LIMIT,
  BESTSELLER_RATING_THRESHOLD,
} from "./config.js";
import { fetchProducts, getAllProducts } from "./api.js";

const CATEGORY_MAP = {
  electronics: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  fashion: [
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-dresses",
    "womens-shoes",
    "womens-watches",
    "womens-bags",
    "womens-jewellery",
    "tops",
    "sunglasses"
  ],
  "home and kitchen": ["home-decoration", "furniture", "kitchen-accessories"],
  beauty: ["beauty", "fragrances", "skincare"],
  sports: ["sports-accessories"],
  groceries: ["groceries"],
  automotive: ["motorcycles", "vehicles"]
};

function getStars(rating) {
  const stars = Math.ceil(rating);
  const emptyStars = 5 - stars;
  return "⭐".repeat(stars) + "☆".repeat(emptyStars);
}

function createProductCard(product, { showBadge = false }) {
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    ${showBadge ? `<span class="product-badge">Best Seller</span>` : ""}
    <div class="product-image-container">
      <img src="${product.thumbnail}" alt="${
    product.title
  }" class="product-image"> </div>
    <h3 class="product-title">${product.title}</h3>
    <p class="product-category">${product.category}</p>
    <div class="product-rating">
      <span class="rating-stars">${getStars(product.rating)}</span>
      <span class="rating-value">(${product.rating.toFixed(1)})</span>
    </div>
    <div class="product-card-price">
      <span class="product-price-final">
        $${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
      </span>
      <span class="product-card-previous-price">$${product.price}</span>
      <span class="product-card-discount">-${product.discountPercentage}%</span>
    </div>
    <div class="product-actions">
      <button class="btn-favorite"> <img src="./assets/icons/fav.png" alt="fav"></button>
      <button class="btn-add-to-cart">Add to Cart </button>
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
  return card;
}

function renderBestSellers(products, container) {
  let count = 0;
  products.forEach((product) => {
    if (
      product.rating >= BESTSELLER_RATING_THRESHOLD &&
      count < BESTSELLER_PRODUCT_LIMIT
    ) {
      const card = createProductCard(product, { showBadge: true });
      container.appendChild(card);
      count++;
    }
  });
}

function renderAllProducts(products, container) {
  products.forEach((product) => {
    const card = createProductCard(product, {
      showBadge: product.rating >= BESTSELLER_RATING_THRESHOLD,
    });
    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("products-container");

  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode") || container.dataset.mode; // bestseller | all | category

  try {
    let products;
    if (mode === "bestseller") {
      products = await fetchProducts(BESTSELLER_LIMIT);
      container.innerHTML = "";
      renderBestSellers(products, container);
    } else if (mode == "all") {
      products = await fetchProducts();
      container.innerHTML = "";
      renderAllProducts(products, container);
    } else if (mode === "category") {
      const param = new URLSearchParams(window.location.search);
      const category = param.get("category");

      products = await getAllProducts();

      if (products.length < DEFAULT_LIMIT) {
        products = await fetchProducts();
      }
      console.log(category);

      const validCategories = CATEGORY_MAP[category] || [];
      const filtered = products.filter((p) =>
        validCategories.includes(p.category.toLowerCase())
      );

      container.innerHTML = "";
      if (filtered.length) {
        renderAllProducts(filtered, container);
      } else {
        container.innerHTML = `<p>No products found for category: ${category}</p>`;
      }
    } else {
      container.innerHTML = `<h1>Unknow Mode , Please make sure about the mode you want`;
    }
  } catch (error) {
    console.error(error);
    container.innerHTML = `<h1> Error Loading products.</p>`;
  }
});
