// CATEGORY CLICKS
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card
      .querySelector("h4")
      .textContent.toLowerCase()
      .replace("&", "and")
      .trim();
    window.location.href = `products.html?category=${category}`;
  });
});

let cartCount = 0;
let favCount = 0;

const cartCounter = document.getElementById("cart-counter");
const favCounter = document.getElementById("fav-count");

document.addEventListener("click", (e) => {
  // CART
  if (e.target.closest(".btn-add-to-cart")) {
    const btn = e.target.closest(".btn-add-to-cart");
    btn.classList.toggle("in-cart");

    if (btn.classList.contains("in-cart")) {
      cartCount++;
      showToast("Item added to cart!");
      btn.textContent = "Added";
    } else {
      cartCount--;
      btn.textContent = "Add to the Cart";
      showToast("Item removed from cart!");
    }

    cartCounter.textContent = cartCount;
  }
  // FAVORITE
  if (e.target.closest(".btn-favorite")) {
    const btn = e.target.closest(".btn-favorite");
    btn.classList.toggle("active");

    if (btn.classList.contains("active")) {
      favCount++;
    } else {
      favCount--;
    }
    favCounter.textContent = favCount;
  }
});

// TOAST MESSAGE
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
