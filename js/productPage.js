import { getAllProducts } from "./api.js";
import { cartAdd, cartRemove, getCart ,showToast,updateCartCounter} from "./utils.js";

async function initProductPage() {
  const products = await getAllProducts();
  console.log(products);
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const product = products[id - 1];

  if (product) {
    document.title = product.title;
    updateCartCounter();//to update the counter

    // Images
    document.querySelector(".product-page-main-img").src = product.images[0];
    document.querySelector(".product-page-main-img").alt = product.title;

    document.querySelector(".product-page-thumb img").src = product.thumbnail;
    document.querySelector(
      ".product-page-thumb img"
    ).alt = `${product.title} thumbnail`;

    // Text-Info (Rating , Price , Title)
    document.querySelector(".product-page-title").textContent = product.title;

    const stars = "⭐".repeat(Math.round(product.rating));
    document.querySelector(
      ".product-page-rating p"
    ).innerHTML = `<span>${stars}</span> ${product.rating} (${product.reviews.length} Reviews)`;

    // Price
    const discountedPrice =
      product.price * (1 - product.discountPercentage / 100);
    document.querySelector(
      ".product-page-main-price"
    ).textContent = `$${discountedPrice.toFixed(2)}`;

    document.querySelector(
      ".product-page-previous-price"
    ).textContent = `$${product.price}`;
    document.querySelector(
      ".product-page-main-discount"
    ).textContent = `- ${product.discountPercentage}%`;

    // Features
    document.querySelector(
      ".availability-feature"
    ).innerHTML = `<span>Availability: </span> ${product.availabilityStatus}`;
    document.querySelector(
      ".warranty-feature"
    ).innerHTML = `<span>Warranty: </span> ${product.warrantyInformation}`;
    document.querySelector(
      ".shipping-feature"
    ).innerHTML = `<span>Shipping: </span> ${product.shippingInformation}`;

    // Details
    document.querySelector(".product-page-details p").textContent =
      product.description;

    document.querySelector(".product-page-details ul").innerHTML = `
      ${product.brand ? `<li><span>Brand:</span> ${product.brand}</li>` : ""}
      <li><span>Category:</span> ${product.category}</li>
      <li><span>SKU:</span> ${product.sku}</li>
      <li><span>Weight:</span> ${product.weight}g</li>
      <li><span>Dimensions:</span> ${product.dimensions.width} × ${
      product.dimensions.height
    } × ${product.dimensions.depth} cm</li>
      <li><span>Return Policy:</span> ${product.returnPolicy}</li>
      <li><span>Minimum Order:</span> ${product.minimumOrderQuantity} units</li>
    `;
    // Reviews
    const reviewsContainer = document.querySelector(".product-page-reviews");
    reviewsContainer.innerHTML = `<h3>Customer Reviews</h3>`;
    product.reviews.forEach((review) => {
      const stars = "⭐".repeat(review.rating);
      reviewsContainer.innerHTML += `
        <div class="product-review">
          <p class="product-rating">${stars} (${review.rating}/5)</p>
          <p class="review-comment"> ${review.comment}</p>
          <small>${review.reviewerName}</small> 
        </div>
      `;
    });
    //added in the cart
    const addToCartBtn = document.querySelector(".btn-add-to-cart");
    const cart = getCart();
    if(cart.some(item=>item.id==product.id)){
      addToCartBtn.textContent='Added'
    }
    else{
      addToCartBtn.textContent = "Add to Cart";
    }
    addToCartBtn.addEventListener("click", (e) => {
      e.stopPropagation(); 
      const cartNow=getCart();
      const isInCart = cartNow.some(item => item.id === product.id);
      if(isInCart){
        cartRemove(product.id, addToCartBtn);
        addToCartBtn.textContent = "Add to Cart";
      }
      else{
        cartAdd(product, addToCartBtn);
        addToCartBtn.textContent = "Added";
      }
  });
  } else {
    document.querySelector(
      ".product-page-container"
    ).innerHTML = `<h2 style="text-align=center">Product Not Found</h2>`;
  }
}

initProductPage();
