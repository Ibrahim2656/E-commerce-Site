import{getCart,updateCartCounter,saveCart} from './utils.js'
import { TAX_VALUE, SHIPPING_VALUE } from "./config.js"
document.addEventListener('DOMContentLoaded',()=>{
    showCartItems();
    updateCartCounter();
    setupOrderButton();
});

function showCartItems(){
    const cart = getCart();
    const orderItems = document.getElementById('order-items')

    if(cart.length===0){
        orderItems.innerHTML = '<p>Your cart is empty</p>';
        document.getElementById('btn-place-order').disabled = true;
        return;
    }
    let html='';
    let subtotal=0;
    cart.forEach(item=>{
        const price = item.price * (1 - item.discountPercentage / 100);
        const total = price * item.quantity;
        subtotal += total;

        html+=`
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${item.title}</div>
                    <div class="order-item-details> Qty:${item.quantity}</div>
                </div>
                <div class="order-item-price">$${total.toFixed(2)}</div>
            </div>
        `;
    });
    orderItems.innerHTML=html;
    //Calculate totals
    const tax=subtotal*TAX_VALUE;
    const shipping=SHIPPING_VALUE;
    const totalCost=subtotal+tax+shipping

    document.getElementById('subtotal').textContent=`$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total-cost').textContent = `$${totalCost.toFixed(2)}`;
}
// Setup order button
function setupOrderButton() {
    const orderBtn = document.getElementById('btn-place-order');
    orderBtn.addEventListener('click', function() {
        if (validateForm()) {
            orderBtn.textContent = 'Processing...';
            orderBtn.disabled = true;
            
            setTimeout(function() {
                // Clear cart
                saveCart([]);
                updateCartCounter();
                
                // Show success message
                document.querySelector('.checkout-container').style.display = 'none';
                document.getElementById('success-message').classList.add('show');
            }, 2000);
        }
    });
}

// Validate the form
function validateForm() {
    const name = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const zip = document.getElementById('zip-code').value.trim();
    
    
    clearErrors();
    
    let isValid = true;
    
    // Check name
    if (name.length < 2) {
        showError('name-error', 'Please enter your full name');
        isValid = false;
    }
    
    // Check email
    if (!isValidEmail(email)) {
        showError('email-error', 'Please enter a valid email');
        isValid = false;
    }
    
    // Check address
    if (address.length < 5) {
        showError('address-error', 'Please enter your complete address');
        isValid = false;
    }
    
    // Check city
    if (city.length < 2) {
        showError('city-error', 'Please enter your city');
        isValid = false;
    }
    
    // Check zip code
    if (!isValidZip(zip)) {
        showError('zip-error', 'Please enter a valid 5-digit ZIP code');
        isValid = false;
    }
    
    return isValid;
}

// Check if email is valid
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Check if zip code is valid
function isValidZip(zip) {
    const zipRegex = /^\d{5}$/;
    return zipRegex.test(zip);
}

// Show error message
function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear all error messages
function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(error => {
        error.classList.remove('show');
    });
}