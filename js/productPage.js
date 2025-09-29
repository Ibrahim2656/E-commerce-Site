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
    // Update page title
    document.title = product.title;

    // Update main product image
    document.querySelector(".product-page-main-img").src = product.images[0];
    document.querySelector(".product-page-main-img").alt = product.title;

    // Update thumbnail image
    document.querySelector(".product-page-thumb img").src = product.thumbnail;
    document.querySelector(".product-page-thumb img").alt = `${product.title} thumbnail`;

    // Update product title
    document.querySelector(".product-page-title").textContent = product.title;

    // Update rating
    const stars = "⭐".repeat(Math.round(product.rating));
    document.querySelector(".product-page-rating p").innerHTML = 
      `<span>${stars}</span> ${product.rating} (${product.reviews.length} Reviews)`;

    // Update price
    document.querySelector(".proudct-page-main-price").textContent = `$${product.price}`;

    // Update discount
    document.querySelector(".proudct-page-main-discount").textContent = 
      `${product.discountPercentage}% off`;

    // Update availability
    document.querySelector(".product-feature:nth-child(1) p").innerHTML = 
      `<span>Availability: </span>${product.availabilityStatus}`;

    // Update warranty
    document.querySelector(".product-feature:nth-child(2) p").innerHTML = 
      `<span>Warranty: </span>${product.warrantyInformation}`;

    // Update shipping
    document.querySelector(".product-feature:nth-child(3) p").innerHTML = 
      `<span>Shipping: </span>${product.shippingInformation}`;

    // Update product details description
    document.querySelector(".product-page-details p").textContent = product.description;

    // Update product details list
    const detailsList = document.querySelector(".product-page-details ul");
    detailsList.innerHTML = `
      <li><span>Brand:</span> ${product.brand }</li>
      <li><span>Category:</span> ${product.category}</li>
      <li><span>SKU:</span> ${product.sku}</li>
      <li><span>Weight:</span> ${product.weight}g</li>
      <li><span>Dimensions:</span> ${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm</li>
      <li><span>Return Policy:</span> ${product.returnPolicy}</li>
      <li><span>Minimum Order:</span> ${product.minimumOrderQuantity} units</li>
    `;

    // Update reviews section
    const reviewsContainer = document.querySelector(".product-page-reviews");
    reviewsContainer.innerHTML = `<h3>Customer Reviews</h3>`;
    
    product.reviews.forEach(review => {
      const stars = "⭐".repeat(review.rating);
      reviewsContainer.innerHTML += `
        <div class="product-review">
          <p class="review-rating">${stars} (${review.rating}/5)</p>
          <p class="review-comment">${review.comment}</p>
          <small>- ${review.reviewerName}</small>
        </div>
      `;
    });

  } else {
    // If product not found, show error message
    document.querySelector(".product-page-container").innerHTML = 
      `<h2 style="text-align: center; padding: 5rem;">Product not found!</h2>`;
  }
}

initProductPage();