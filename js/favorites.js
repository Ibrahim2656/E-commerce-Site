//Manage favorites with localStorage
import { getFavorites, removeFavorite, updateFavCounter } from './utils.js';

// When page loads
document.addEventListener('DOMContentLoaded', function() {
    showFavorites();
    updateFavCounter();
    updateCartCounter();
});

// Show favorite products
function showFavorites() {
    const favorites = getFavorites();
    const container = document.getElementById('favorites-items');
    const countElement = document.getElementById('favorites-count');
    
    countElement.textContent = `${favorites.length} items`;
    
    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="empty-favorites">
                <img src="./assets/icons/empty-fav.png" alt="Empty Favorites">
                <h3>Your Favorites is empty</h3>
                <p>You haven't added any products to favorites yet</p>
                <a href="products.html" class="shop-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    // Show favorite products
    let html = '';
    
    favorites.forEach(product => {
        const finalPrice = product.price * (1 - product.discountPercentage / 100);
        
        html += `
            <div class="product-card favorite-product" data-id="${product.id}">
                ${product.discountPercentage > 0 ? 
                    `<div class="product-badge">-${product.discountPercentage}%</div>` : ''}
                
                <div class="product-image-container">
                    <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                </div>
                
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                
                <div class="product-rating">
                    <div class="rating-stars">⭐ ${product.rating}/5</div>
                </div>
                
                <div class="product-card-price">
                    <span class="product-price-final">$${finalPrice.toFixed(2)}</span>
                    ${product.discountPercentage > 0 ? 
                        `<span class="product-card-previous-price">$${product.price.toFixed(2)}</span>` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="btn-favorite active" data-id="${product.id}">
                        <img src="./assets/icons/fav.png" alt="Remove from Favorites">
                    </button>
                    <button class="btn-add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Setup click events
    setupFavoriteButtons();
    setupAddToCartButtons();
}

// Setup favorite buttons (to remove from favorites)
function setupFavoriteButtons() {
    document.querySelectorAll('.btn-favorite').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            removeFavorite(productId);
            showFavorites();
            updateFavCounter();
        });
    });
}

// Setup add to cart buttons
function setupAddToCartButtons() {
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.id;
            const favorites = getFavorites();
            const product = favorites.find(item => item.id == productId);
            
            if (product) {
                cartAdd(product, this);
            }
        });
    });
}

// Cart functions (from your utils)
function getCart() {
    const cartData = localStorage.getItem('miniMartCart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem("miniMartCart", JSON.stringify(cart));
}

function updateCartCounter() {
    const counter = document.getElementById('cart-counter');
    if (!counter) return;
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalItems;
}

function cartAdd(product, button) {
    let cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    saveCart(cart);
    updateCartCounter();
    
    if (button) {
        button.textContent = "Added!";
        setTimeout(() => {
            button.textContent = "Add to Cart";
        }, 2000);
    }
}