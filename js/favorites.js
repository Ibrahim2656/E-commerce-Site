import { getFavorites, removeFavorite, updateFavCounter, getCart, cartAdd, updateCartCounter, cartRemove } from './utils.js';

document.addEventListener('DOMContentLoaded',function(){
    showFavorites();
    updateCartCounter();
})

function showFavorites(){
    const fav=getFavorites();
    const container= document.getElementById('favorites-items');


    // Update the counter in the navbar and the items
    updateFavCounter();
    document.getElementById('favorites-count').textContent = fav.length + ' items';

    // Check for empty state or when the fav get empty
    if(fav.length===0){
        container.innerHTML=`
            <div class="empty-favorites">
                <img src="./assets/icons/emptyfav.png" alt="Empty Favorites">
                <h3>Your Favorites is empty</h3>
                <p>You haven't added any products to favorites yet</p>
                <a href="products.html" class="shop-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    let html='';
    fav.forEach(product=>{
        // Tocheck if it's in the card
        const cart = getCart();
        const isInCart = cart.some(item => item.id === product.id);

        const price = product.price * (1 - product.discountPercentage / 100);
        html+=`
            <div class=product-card>
                <div class="product-image-container">
                    <img src="${product.thumbnail}" alt="${product.title}">
                </div>
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-card-price">
                    <span class="product-price-final">$${price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-favorite active">
                        <img src="./assets/icons/fav.png" alt="Remove">
                    </button>
                    <button class="btn-add-to-cart">
                        ${isInCart?"Added":"Add to Cart"}
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html
    setupEventListeners(fav);
};
function setupEventListeners(fav){
    const cards=document.querySelectorAll('.product-card') // getting all cards
    cards.forEach((card,index)=>{
        const product = fav[index];
        const btnFav=card.querySelector('.btn-favorite');
        const btnCart= card.querySelector('.btn-add-to-cart');

        btnFav.addEventListener('click',function(){
            removeFavorite(product.id);
            showFavorites();
        });
        btnCart.addEventListener('click',function(){
            const cart = getCart();
            const isInCart = cart.some(item => item.id === product.id);

            if(isInCart){
                cartRemove(product.id,btnCart);
            }
            else{
                cartAdd(product,btnCart)
            }
            updateCartCounter();
        })
    })
}