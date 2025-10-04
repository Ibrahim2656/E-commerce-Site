# 🛒 Mini Mart E-Commerce Website

[**Live Demo**](https://ibrahim2656.github.io/E-commerce-Site)

A fully responsive **Vanilla JavaScript** e-commerce website designed to simulate a real online store experience. Users can browse products, filter, search, manage a cart and favorites, and view product details. Built with modern HTML, CSS, and JavaScript — **no frameworks or libraries used**.

---

## 🌟 Features

### 🏠 Home Page
- **Hero section** with a CTA button linking to products.
- **Shop by category** cards (Electronics, Fashion, Home & Kitchen, Beauty, Sports, Groceries, Automotive).
- **Best seller section** dynamically populated with featured products.
- Responsive layout for **desktop, tablet, and mobile** devices.

### 🔍 Products Page
- **Search functionality** (works only on this page) to filter products by name in real-time.
- **Sort products** by:
  - Price (Low → High / High → Low)
  - Name (A → Z / Z → A)
  - Rating (High → Low)
- **Filters**:
  - Category selection (checkboxes)
  - Price ranges (radio buttons)
  - Ratings (radio buttons)
- Pagination for better product navigation.

### 🛍️ Product Details
- Individual product page with:
  - Main image + thumbnails
  - Product title, rating, price, discount
  - Availability, shipping, warranty info
  - Detailed description and specifications
  - Reviews placeholder for future functionality

### 🛒 Cart & Favorites
- Add/remove products from cart and favorites.
- Real-time **cart and favorites counters**.
- Visual **toast notifications** for user actions.
- Cart shows subtotal, shipping, and totals.
- Favorites page to view saved items.

### 💳 Checkout Page
- Review cart items before checkout.
- Dynamic subtotal and shipping calculation.
- Frontend-only checkout simulation.

### 🌐 Navigation & Footer
- Sticky **navbar** with logo, links, search bar, and counters.
- Footer includes contact info, categories, support links, and social media icons.

---

## 💻 Technologies Used

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)  
Semantic markup for building the website structure.

![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)  
Responsive layouts using Grid & Flexbox, animations, transitions, and hover effects.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)  
Vanilla JS (ES6 Modules) for dynamic product rendering, filtering, sorting, cart/favorites management, and search functionality.

![Local Storage](https://img.shields.io/badge/Local%20Storage-000000?style=for-the-badge&logo=sqlite&logoColor=white)  
Persisting cart and favorites data across sessions.

**No frameworks or libraries used** – 100% custom, lightweight, and fast.



---

## ⚡ Project Structure
```
E-commerce-Site
├─ assets
│  ├─ icons
│  └─ images
├─ cart.html
├─ checkout.html
├─ css
│  └─ style.css
├─ favorites.html
├─ index.html
├─ js
│  ├─ api.js
│  ├─ cart.js
│  ├─ checkout.js
│  ├─ config.js
│  ├─ favorites.js
│  ├─ productPage.js
│  ├─ products.js
│  └─ utils.js
├─ product.html
├─ products.html
├─ LICENSE
└─ README.md

```
---

## 🚀 How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/Ibrahim2656/E-commerce-Site.git
---
## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

