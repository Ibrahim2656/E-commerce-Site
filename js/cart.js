import { getCart, updateCartCounter, saveCart } from "./utils.js";
import { TAX_VALUE, SHIPPING_VALUE } from "./config.js"
let cart = [];

function renderCart() {
    cart = getCart();
    const container = document.getElementById('cart-items');
    const checkoutBtn = document.getElementById('btn-checkout');

    if (!cart.length) {
        container.innerHTML = `
      <div class="empty-card">
        <img src="./assets/icons/emptycart.png" alt="Empty Cart">
        <h3>Your Cart is empty</h3>
        <p>Look like you haven't added anything to your cart</p>
        <a href="products.html" class="cart-shop-btn">Start Shopping</a>
      </div>
    `;
        checkoutBtn.disabled = true;
        document.getElementById('total').textContent = '$0.00';
        document.getElementById('shipping').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('total-cost').textContent = '$0.00';
        document.getElementById('cart-item-counter').textContent = '0 items';
        return;
    }

    // Render products
    container.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div class="cart-item-image">
        <img src="${item.thumbnail}" alt="${item.title}">
      </div>
      <div class="cart-item-details">
        <div class="cart-item-title">${item.title}</div>
        <div class="cart-item-category">${item.category}</div>
        <div class="cart-item-price">
          $${(item.price * (1 - item.discountPercentage / 100)).toFixed(2)}
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn decrease" data-id="${item.id}"> - </button>
          <span class="quantity">${item.quantity}</span>
          <button class="quantity-btn increase" data-id="${item.id}">+</button>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');


    // Totals
    const subtotal = cart.reduce(
        (sum, item) => sum + item.quantity * item.price * (1 - item.discountPercentage / 100),
        0
    );
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const tax = subtotal * TAX_VALUE
    const shipping = cart.length ? SHIPPING_VALUE : 0.00;
    const totalCost = subtotal + tax + shipping

    document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`
    document.getElementById('cart-item-counter').textContent = `${totalItems} items`;

    checkoutBtn.disabled = !cart.length;
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    renderCart();
    const container = document.getElementById('cart-items')
    container.addEventListener('click', function (e) {
        const id = e.target.dataset.id;
        if (!id) return;

        let cart = getCart();
        const item = cart.find((p) => p.id == id);
        if (!item) return;

        if (e.target.classList.contains('increase')) item.quantity+=1;
        if (e.target.classList.contains('decrease')) item.quantity-=1;

        if (e.target.classList.contains('remove-btn') || item.quantity <= 0) {
            cart = cart.filter(p => p.id != id);
        }
        saveCart(cart);
        updateCartCounter();

        renderCart();
    });
    document.getElementById('btn-checkout').onclick = () => {
        if (cart.length > 0) {
            window.location.href = 'checkout.html';
        }
    };
});
