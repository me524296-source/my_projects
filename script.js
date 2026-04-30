const PRODUCTS = [
  { id: 1, name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones", price: 279.99, original: 399.99, rating: 4.8, reviews: 12430, category: "electronics", emoji: "🎧", badge: "sale", badgeType: "badge-sale" },
  { id: 2, name: "Apple MacBook Air 15\" M3 Chip Laptop", price: 1099.00, original: 1299.00, rating: 4.9, reviews: 5871, category: "electronics", emoji: "💻", badge: "hot", badgeType: "badge-hot" },
  { id: 3, name: "Samsung 65\" QLED 4K Smart TV Crystal Series", price: 899.99, original: 1199.99, rating: 4.7, reviews: 8920, category: "electronics", emoji: "📺", badge: "sale", badgeType: "badge-sale" },
  { id: 4, name: "Nike Air Max 270 React Running Shoes", price: 129.99, original: 160.00, rating: 4.6, reviews: 23500, category: "fashion", emoji: "👟", badge: "new", badgeType: "badge-new" },
  { id: 5, name: "Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker", price: 79.99, original: 119.99, rating: 4.8, reviews: 45620, category: "home", emoji: "🍲", badge: "sale", badgeType: "badge-sale" },
  { id: 6, name: "Levi's Men's 501 Original Fit Jeans", price: 59.99, original: 79.99, rating: 4.5, reviews: 18200, category: "fashion", emoji: "👖", badge: null, badgeType: null },
  { id: 7, name: "Bowflex SelectTech 552 Adjustable Dumbbells Pair", price: 349.00, original: 429.00, rating: 4.9, reviews: 9840, category: "sports", emoji: "🏋️", badge: "limited", badgeType: "badge-limited" },
  { id: 8, name: "Kindle Paperwhite 16GB E-Reader Waterproof", price: 139.99, original: 159.99, rating: 4.7, reviews: 32000, category: "electronics", emoji: "📖", badge: "new", badgeType: "badge-new" },
  { id: 9, name: "L'Oréal Paris Revitalift Laser Retinol Serum", price: 34.99, original: 45.00, rating: 4.4, reviews: 7630, category: "beauty", emoji: "✨", badge: null, badgeType: null },
  { id: 10, name: "LEGO Technic Ferrari Daytona SP3 Set", price: 399.99, original: 449.99, rating: 4.9, reviews: 4120, category: "toys", emoji: "🏎️", badge: "hot", badgeType: "badge-hot" },
  { id: 11, name: "Dyson V15 Detect Cordless Vacuum Cleaner", price: 649.99, original: 749.99, rating: 4.8, reviews: 6750, category: "home", emoji: "🌪️", badge: "sale", badgeType: "badge-sale" },
  { id: 12, name: "Adidas Ultraboost 23 Running Shoes Men's", price: 149.99, original: 190.00, rating: 4.7, reviews: 14200, category: "sports", emoji: "🏃", badge: null, badgeType: null },
];

const DEALS = [
  { id: 101, name: "iPad Air 11\" M2 Chip 256GB WiFi + Cellular", price: 699.00, original: 899.00, rating: 4.9, reviews: 8900, category: "electronics", emoji: "📱", badge: "sale", badgeType: "badge-sale" },
  { id: 102, name: "KitchenAid Stand Mixer 5 Qt Artisan Series Tilt-Head", price: 349.99, original: 499.99, rating: 4.9, reviews: 28000, category: "home", emoji: "🥣", badge: "sale", badgeType: "badge-sale" },
  { id: 103, name: "Ray-Ban Aviator Classic Gold Sunglasses", price: 154.00, original: 180.00, rating: 4.6, reviews: 11400, category: "fashion", emoji: "🕶️", badge: "hot", badgeType: "badge-hot" },
  { id: 104, name: "Garmin Forerunner 965 GPS Running Smartwatch", price: 499.99, original: 599.99, rating: 4.8, reviews: 3200, category: "sports", emoji: "⌚", badge: "new", badgeType: "badge-new" },
];

let cart = [];
let currentFilter = "all";
let currentSlide = 0;
let sliderInterval;
const SLIDES_COUNT = 3;

function getDiscount(price, original) {
  if (!original || original <= price) return null;
  return Math.round((1 - price / original) * 100);
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  let html = "";
  for (let i = 0; i < full; i++) html += `<i class="fa-solid fa-star"></i>`;
  if (half) html += `<i class="fa-solid fa-star-half-stroke"></i>`;
  for (let i = 0; i < empty; i++) html += `<i class="fa-regular fa-star"></i>`;
  return html;
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n.toString();
}

function createProductCard(product, delay = 0) {
  const discount = getDiscount(product.price, product.original);
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = `${delay}ms`;
  card.dataset.category = product.category;
  card.dataset.id = product.id;
  card.innerHTML = `
    ${product.badge ? `<span class="product-badge ${product.badgeType}">${product.badge.toUpperCase()}</span>` : ""}
    <button class="product-wishlist" aria-label="Add to wishlist"><i class="fa-regular fa-heart"></i></button>
    <div class="product-img-wrap">
      <span class="product-emoji">${product.emoji}</span>
    </div>
    <div class="product-info">
      <div class="product-category-label">${product.category}</div>
      <h3 class="product-title">${product.name}</h3>
      <div class="product-rating">
        <div class="stars">${renderStars(product.rating)}</div>
        <span class="rating-count">(${formatCount(product.reviews)})</span>
      </div>
      <div class="product-price-row">
        <span class="current-price">$${product.price.toFixed(2)}</span>
        ${product.original ? `<span class="original-price">$${product.original.toFixed(2)}</span>` : ""}
        ${discount ? `<span class="discount-pct">-${discount}%</span>` : ""}
      </div>
      <button class="add-to-cart-btn" data-id="${product.id}">
        <i class="fa-solid fa-bag-shopping"></i> Add to Cart
      </button>
    </div>
  `;

  card.querySelector(".product-wishlist").addEventListener("click", function (e) {
    e.stopPropagation();
    this.classList.toggle("active");
    const icon = this.querySelector("i");
    icon.className = this.classList.contains("active") ? "fa-solid fa-heart" : "fa-regular fa-heart";
  });

  card.querySelector(".add-to-cart-btn").addEventListener("click", function (e) {
    e.stopPropagation();
    addToCart(product.id);
    this.innerHTML = `<i class="fa-solid fa-check"></i> Added!`;
    this.style.background = "var(--success)";
    setTimeout(() => {
      this.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Add to Cart`;
      this.style.background = "";
    }, 1400);
  });

  return card;
}

function renderProducts(filter = "all") {
  const grid = document.getElementById("productsGrid");
  grid.innerHTML = "";
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  let filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  if (search) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
  }
  if (filtered.length === 0) {
    grid.innerHTML = `<div class="no-results"><i class="fa-solid fa-magnifying-glass"></i><p>No products found</p></div>`;
    return;
  }
  filtered.forEach((p, i) => grid.appendChild(createProductCard(p, i * 60)));
}

function renderDeals() {
  const grid = document.getElementById("dealsGrid");
  grid.innerHTML = "";
  DEALS.forEach((p, i) => grid.appendChild(createProductCard(p, i * 80)));
}

function addToCart(productId) {
  const allProducts = [...PRODUCTS, ...DEALS];
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`${product.emoji} Added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
    return;
  }
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const countEl = document.getElementById("cartCount");
  countEl.textContent = totalItems;
  countEl.classList.remove("bump");
  void countEl.offsetWidth;
  countEl.classList.add("bump");

  document.getElementById("cartItemCount").textContent = `(${totalItems} ${totalItems === 1 ? "item" : "items"})`;
  document.getElementById("cartSubtotal").textContent = `$${totalPrice.toFixed(2)}`;

  const itemsContainer = document.getElementById("cartItems");
  const emptyEl = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");

  if (cart.length === 0) {
    emptyEl.style.display = "";
    footer.classList.remove("visible");
    itemsContainer.innerHTML = "";
    itemsContainer.appendChild(emptyEl);
    return;
  }

  emptyEl.style.display = "none";
  footer.classList.add("visible");

  const existing = itemsContainer.querySelectorAll(".cart-item");
  existing.forEach(el => el.remove());

  cart.forEach(item => {
    const el = document.createElement("div");
    el.className = "cart-item";
    el.dataset.id = item.id;
    el.innerHTML = `
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-controls">
          <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          <button class="remove-btn" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
    el.querySelector(".qty-minus").addEventListener("click", () => updateQty(item.id, -1));
    el.querySelector(".qty-plus").addEventListener("click", () => updateQty(item.id, 1));
    el.querySelector(".remove-btn").addEventListener("click", () => removeFromCart(item.id));
    itemsContainer.appendChild(el);
  });
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("active");
  document.body.style.overflow = "";
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => toast.classList.remove("show"), 2500);
}

function initSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");

  function goTo(index) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (index + SLIDES_COUNT) % SLIDES_COUNT;
    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  document.getElementById("sliderPrev").addEventListener("click", () => { goTo(currentSlide - 1); resetInterval(); });
  document.getElementById("sliderNext").addEventListener("click", () => { goTo(currentSlide + 1); resetInterval(); });
  dots.forEach(dot => dot.addEventListener("click", () => { goTo(parseInt(dot.dataset.index)); resetInterval(); }));

  function resetInterval() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => goTo(currentSlide + 1), 5000);
  }

  sliderInterval = setInterval(() => goTo(currentSlide + 1), 5000);
}

function initFilters() {
  const tabs = document.querySelectorAll(".filter-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentFilter = tab.dataset.filter;
      renderProducts(currentFilter);
    });
  });
}

function initCategories() {
  document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
      const filter = card.dataset.filter;
      const tabEl = document.querySelector(`.filter-tab[data-filter="${filter}"]`);
      if (tabEl) {
        tabEl.click();
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      } else {
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

function initSearch() {
  const input = document.getElementById("searchInput");
  const btn = document.getElementById("searchBtn");

  function doSearch() {
    const val = input.value.trim();
    if (val) {
      currentFilter = "all";
      document.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      document.querySelector(".filter-tab[data-filter='all']").classList.add("active");
      renderProducts("all");
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }
  }

  input.addEventListener("keydown", e => { if (e.key === "Enter") doSearch(); });
  btn.addEventListener("click", doSearch);
  input.addEventListener("input", () => {
    if (input.value.trim() === "") renderProducts(currentFilter);
  });
}

function initNavbar() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
    document.getElementById("backToTop").classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });

  document.querySelectorAll(".nav-categories-bar a").forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelectorAll(".nav-categories-bar a").forEach(l => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function initLoadMore() {
  const btn = document.getElementById("loadMoreBtn");
  btn.addEventListener("click", function () {
    this.classList.add("loading");
    this.textContent = "Loading...";
    setTimeout(() => {
      this.classList.remove("loading");
      this.innerHTML = "All Products Loaded <i class='fa-solid fa-check'></i>";
      this.disabled = true;
      this.style.opacity = "0.6";
    }, 1200);
  });
}

function init() {
  renderProducts();
  renderDeals();
  initSlider();
  initFilters();
  initCategories();
  initSearch();
  initNavbar();
  initLoadMore();

  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("closeCart").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
  document.getElementById("continueShopping").addEventListener("click", closeCart);
  document.getElementById("backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.addEventListener("DOMContentLoaded", init);