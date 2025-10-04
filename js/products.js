import {
  DEFAULT_LIMIT,
  BESTSELLER_LIMIT,
  BESTSELLER_PRODUCT_LIMIT,
  BESTSELLER_RATING_THRESHOLD,
  PRODUCTS_PER_PAGE
} from "./config.js";
import { fetchProducts, getAllProducts } from "./api.js";
import {cartAdd,cartRemove,updateCartCounter, 
    getCart} from "./utils.js";

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
// Configuration for pagination and filtering
let currentPage=1;
let allProducts=[];
let filteredProducts = [];
let currentMode='';

function getStars(rating) {
  const stars = Math.ceil(rating);
  const emptyStars = 5 - stars;
  return "⭐".repeat(stars) + "☆".repeat(emptyStars);
}

function createProductCard(product, { showBadge = false }) {
  const card = document.createElement("div");
  card.className = "product-card";
  const cart = getCart();
  const isInCart = cart.some(item => item.id === product.id);
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
      <button class="btn-add-to-cart ">${isInCart?"Added":"Add to Cart"} </button>
    </div>
  `;
  const addToCartBtn = card.querySelector(".btn-add-to-cart");

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
})
    // Card Click - Go to Product Page
    card.addEventListener("click", function() {
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

function applyFilters(){
  const selectedCategories=Array.from(document.querySelectorAll('input[name="category"]:checked')).map(checkbox=> checkbox.value);
  const selectedPrice=document.querySelector('input[name="price"]:checked')?.value;
  const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
  
  
  filteredProducts = allProducts.filter(product=>{

    let categoryMatch = true;
    if (selectedCategories.length > 0) {
      categoryMatch = selectedCategories.some(cat => 
        CATEGORY_MAP[cat]?.includes(product.category.toLowerCase())
      );
    }
    let priceMatch=true;
    if(selectedPrice){
      const [min,max]=selectedPrice.split('-').map(Number);
      priceMatch = product.price >= min && product.price <=max;
    }

    let ratingMatch=true;
    if(selectedRating){
      const[minRating]= selectedRating.split('-').map(Number);
      ratingMatch= product.rating >=minRating
    }

    return categoryMatch  && priceMatch && ratingMatch

  });
  currentPage=1;
  renderFilteredProducts();
  setupPagination();
}

// Clear fucntion for Clear button
function clearFilters(){
  document.querySelectorAll('input[type="checkbox"],input[type="radio"]').forEach(input=> input.checked=false);

  // Reset the sort
  const sortSelect = document.getElementById('sort-select');
  if(sortSelect) sortSelect.value='default';

  // Reseting for products
  filteredProducts=[...allProducts];
  currentPage=1;
  renderFilteredProducts();
  setupPagination();
}

function handleSort(){
  const sortSelect=document.getElementById('sort-select');
  const sortValue= sortSelect.value;

  switch(sortValue){
    case 'price-low-high':
      filteredProducts.sort((a,b)=>{return a.price - b.price});
      break;
    case 'price-high-low':
      filteredProducts.sort((a,b)=>{
        return b.price - a.price
      });
      break;
    case 'name-a-z':
      filteredProducts.sort((a,b)=>{
        return a.title.localeCompare(b.title);
      });
      break;
    case 'name-z-a':
      filteredProducts.sort((b,a)=>{
        return b.title.localeCompare(a.title);
      });
      break;
    case 'rating-high-low':
      filteredProducts.sort((a,b)=>{return b.rating - a.rating;});
      break;
    default:
      break;
  }
  currentPage = 1;
  renderFilteredProducts();
  setupPagination();
}

function renderFilteredProducts() {
  const productContainer = document.getElementById('products-container');
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const productsToShow = filteredProducts.slice(startIndex, endIndex);

  productContainer.innerHTML = '';
  if (productsToShow.length === 0) {
    productContainer.innerHTML = '<p class="no-products">No products match your filters. Try adjusting your criteria.</p>';
    return;
  }

  productsToShow.forEach(product => {
    const card = createProductCard(product, {
      showBadge: product.rating >= BESTSELLER_RATING_THRESHOLD,
    });
    productContainer.appendChild(card);
  });
}

function setupPagination(){
  const pageNumbersElement=document.getElementById('page-numbers');
  const prevButton = document.getElementById('prev-btn');
  const nextButton = document.getElementById('next-btn');
  // // 12 of 194 ... 12 is the proudct-count-text
  // const productCountText=document.getElementById('product-count-text')

  // if no pagination (for bestseller part )
  if(!pageNumbersElement)return;
  const pageCount = Math.ceil(filteredProducts.length/PRODUCTS_PER_PAGE)
  pageNumbersElement.innerHTML='';

  const startPage=Math.max(1,currentPage-2);
  const endPage=Math.min(pageCount,startPage+4);

  for(let i=startPage;i<=endPage;i++){
    const pageButton=document.createElement('button');
    pageButton.innerText=i;
    pageButton.classList.add('page-number')
    if(i==currentPage)pageButton.classList.add('active');

    pageButton.addEventListener('click',()=>goToPage(i));
    pageNumbersElement.appendChild(pageButton);
  }
  if(prevButton){
    if(currentPage===1){
      prevButton.disabled=true;
    }
    else{
      prevButton.disabled=false;
    }
  }
  if(nextButton){
    if(currentPage===pageCount ||pageCount===0){nextButton.disabled=true;}
    else{nextButton.disabled=false;}
  }
  updateProductCount();
}
function goToPage(page){
  currentPage=page;
  renderFilteredProducts();
  setupPagination();
  //scrolling
  const productsContainer=document.getElementById('products-container')
  // scroll to the container with 100 px differnce above
  if(productsContainer){window.scrollTo({top: productsContainer.offsetTop-100, behavior: 'smooth'})}
}

function goToPrevPage(){
  if(currentPage>1){
    goToPage(currentPage-1);
  }
}
function goToNextPage(){
  const pageCount=Math.ceil(filteredProducts.length/PRODUCTS_PER_PAGE);
  if(currentPage<pageCount){
    goToPage(currentPage+1);
  }
}
function updateProductCount(){
  const productCountText=document.getElementById('product-count-text');
  if(!productCountText)return;

  const totalProudcts=filteredProducts.length;
  let start;
  if(totalProudcts===0){
    start=0;
  }
  else{
    start=(currentPage-1)*PRODUCTS_PER_PAGE+1;
  }
  const end = Math.min(currentPage*PRODUCTS_PER_PAGE,totalProudcts)
  productCountText.textContent=totalProudcts === 0 
  ?'No product found':
  `showing ${start}-${end} of ${totalProudcts} products`
}

function setupEventListeners(){
  const sortSelect = document.getElementById('sort-select');
  const applyFiltersButton = document.getElementById('apply-filters')
  const clearFiltersButton = document.getElementById('clear-filters')
  const prevButton = document.getElementById('prev-btn')
  const nextButton = document.getElementById('next-btn')


  if(sortSelect)sortSelect.addEventListener('change',handleSort)
  if(applyFiltersButton) applyFiltersButton.addEventListener('click',applyFilters)
  if(clearFiltersButton) clearFiltersButton.addEventListener('click',clearFilters)
  if(prevButton)prevButton.addEventListener('click',goToPrevPage)
  if(nextButton)nextButton.addEventListener('click',goToNextPage)
}
// checking if we are in the proudct.thml
function shouldShowFiltersAndPagination() {
  return document.getElementById('sort-select') && 
        document.getElementById('apply-filters') && 
        document.getElementById('page-numbers')
}

function autoCheckCategoryFilter(categoryFromUrl){
  if(!categoryFromUrl)return;
  const categoryCheckBox=document.querySelector(`input[name="category"][value="${categoryFromUrl}"]`);
    if (categoryCheckBox) {
    categoryCheckBox.checked = true;
  }
}

document.addEventListener('DOMContentLoaded',async()=>{
  updateCartCounter();
  
  const container =document.getElementById("products-container")
  if(!container)return;
  const params= new URLSearchParams(window.location.search)
  const mode= params.get('mode') || container.dataset.mode;
  currentMode = mode

  try {
    let products;
    if(mode==='bestseller'){
      products=await fetchProducts(BESTSELLER_LIMIT);
      renderBestSellers(products,container)
    }
    else if(mode==="all"){
      products=await fetchProducts();
      if(shouldShowFiltersAndPagination()){
        allProducts = products;
        filteredProducts =[...allProducts]
        renderFilteredProducts();
        setupPagination();
        setupEventListeners();
      }
      else{
        renderAllProducts(products,container)
      }
    }
    else if(mode==='category'){
      const category = params.get("category");
      products = await getAllProducts();
      if (products.length < DEFAULT_LIMIT) {
        products = await fetchProducts();
      }

      const validCategories = CATEGORY_MAP[category] || [];
      const filtered = products.filter((p) =>
        validCategories.includes(p.category.toLowerCase())
      );

      allProducts = products; 
      filteredProducts = filtered; 
      
      autoCheckCategoryFilter(category);
      
      renderFilteredProducts();
      setupPagination();
      setupEventListeners();
    
    }
    
  } catch (error) {
    console.error(error)
    container.innerHTML=`<h1> Error Loading Products.</h1>`
  }
})