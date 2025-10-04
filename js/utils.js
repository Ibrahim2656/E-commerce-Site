// CATEGORY CLICKS
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const category = card
      .querySelector("h4")
      .textContent.toLowerCase()
      .replace("&", "and")
      .trim();
    window.location.href = `products.html?mode=category&category=${category}`;
  });
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
// =====================================================================
// Cart Functions
// ========================
function getCart() {
  const cartData = localStorage.getItem('miniMartCart');
  if (cartData) {
    try {
      return JSON.parse(cartData);
    } catch (e) {
      console.error('Error parsing cart data', e);
      return [];
    }
  }
  return [];
}

function saveCart(cart){
  localStorage.setItem("miniMartCart", JSON.stringify(cart));
}

function updateCartCounter(){
  const counter=document.getElementById('cart-counter')
  if(!counter)return;
  const cart=getCart();
  const totalItems = cart.reduce((sum,item)=>sum+item.quantity,0)
  counter.textContent=totalItems;
}
function cartAdd(product,button){
  let cart=getCart();
  const existing=cart.find(item=>item.id===product.id);
  if(existing){
    existing.quantity+=1;
  }
  else{
    cart.push({...product,quantity:1});
  }
  saveCart(cart)
  updateCartCounter()
  showToast('Item added to Cart!')
  if(button)button.textContent="Added";
}

function cartRemove(productId,button){
  let cart=getCart()
  cart = cart.filter(item => item.id !== productId)
  saveCart(cart);
  updateCartCounter();
  showToast("Item removed from cart!")
  if(button)button.textContent="Add to Cart"
}
// =============================================================================
// Favorites section
// ===================

function getFavorites(){
  const favorites = localStorage.getItem("miniMartFavorites");
  if (favorites){
    try{
      return JSON.parse(favorites)
    }
    catch(e){
      console.error("Error parsing Favorites data",e)
    }
  }
}

function saveFavorites(favorites){
  localStorage.setItem("miniMartFavorites",JSON.stringify(favorites))
}
function updateFavCounter(){
  const counter = document.getElementById('fav-count');
  if(!counter)return;
  const favorites = getFavorites();
  counter.textContent=favorites.length;
}

function addFavorite(product){
  let favorite=getFavorites()
  const existing = favorite.find(item=> item.id === product.id)
  if(!existing){
    favorite.push(product);
    saveFavorites(favorite)
    updateFavCounter()
    showToast("Added to Favorites!")
  }
}

function removeFavorite(productId){
  let favorites = getFavorites()
  favorites = favorites.filter(item=>item.id !== productId);
  saveFavorites(favorites)
  updateFavCounter()
  showToast("Removed From the Favorites!")
}

export { 
    showToast, getCart, saveCart, updateCartCounter, cartRemove, cartAdd,
    getFavorites, saveFavorites, updateFavCounter, addFavorite, removeFavorite 
};

