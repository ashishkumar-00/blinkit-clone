// ===== PRODUCT DATA =====
const products = [
    { id: 1, name: "Amul Full Cream Milk", weight: "1 Litre", price: 68, oldPrice: 72, img: "11.jpg", category: "dairy", badge: "5% OFF" },
    { id: 2, name: "Lay's Classic Salted", weight: "26g", price: 20, oldPrice: null, img: "12.jpg", category: "snacks", badge: null },
    { id: 3, name: "Coca-Cola Can", weight: "330ml", price: 45, oldPrice: 50, img: "13.jpg", category: "beverages", badge: "10% OFF" },
    { id: 4, name: "Fresh Bananas", weight: "500g", price: 35, oldPrice: 40, img: "14.jpg", category: "fruits", badge: null },
    { id: 5, name: "Dog Biscuits Treat", weight: "200g", price: 120, oldPrice: 135, img: "15.jpg", category: "pets", badge: "11% OFF" },
    { id: 6, name: "Baby Diapers Small", weight: "Pack of 20", price: 349, oldPrice: 399, img: "16.jpg", category: "baby", badge: "13% OFF" },
    { id: 7, name: "Britannia Bread", weight: "400g", price: 48, oldPrice: null, img: "17.jpg", category: "dairy", badge: null },
    { id: 8, name: "Maggi Masala Noodles", weight: "70g × 4", price: 72, oldPrice: 80, img: "19.jpg", category: "snacks", badge: "10% OFF" },
    { id: 9, name: "Tropicana Orange", weight: "1 Litre", price: 99, oldPrice: 110, img: "18.jpg", category: "beverages", badge: null },
    { id: 10, name: "Tomatoes", weight: "500g", price: 28, oldPrice: null, img: "20.jpg", category: "fruits", badge: null },
    { id: 11, name: "Kurkure Masala", weight: "90g", price: 30, oldPrice: null, img: "21.jpg", category: "snacks", badge: null },
    { id: 12, name: "Sprite Bottle", weight: "750ml", price: 42, oldPrice: 48, img: "22.jpg", category: "beverages", badge: null },
    { id: 13, name: "Greek Yoghurt", weight: "100g", price: 55, oldPrice: 65, img: "23.jpg", category: "dairy", badge: "15% OFF" },
    { id: 14, name: "Cat Wet Food", weight: "85g", price: 85, oldPrice: null, img: "24.jpg", category: "pets", badge: null },
    { id: 15, name: "Baby Lotion", weight: "200ml", price: 175, oldPrice: 199, img: "25.jpg", category: "baby", badge: null },
];

// ===== STATE =====
let cart = {};
let currentFilter = "all";

// ===== RENDER PRODUCTS =====
function renderProducts(filter = "all") {
    const grid = document.getElementById("productsGrid");
    const title = document.getElementById("productsTitle");

    const filtered = filter === "all"
        ? products
        : products.filter(p => p.category === filter);

    const labels = {
        all: "Best Sellers",
        fruits: "Fruits & Vegetables",
        dairy: "Dairy & Breakfast",
        snacks: "Snacks",
        beverages: "Beverages",
        pets: "Pet Care",
        baby: "Baby Care"
    };

    title.textContent = labels[filter] || "Products";

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color:#999;font-size:14px;grid-column:1/-1;padding:20px 0">No products found.</p>';
        return;
    }

    grid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
            <div class="product-img-wrapper">
                <img src="${product.img}" alt="${product.name}"
                    onerror="this.src='https://via.placeholder.com/200x140/f4f6fb/999?text=Product'">
            </div>
            <div class="product-info">
                <div class="product-weight">${product.weight}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-bottom">
                    <div class="product-price">
                        <span class="price-now">₹${product.price}</span>
                        ${product.oldPrice ? `<span class="price-old">₹${product.oldPrice}</span>` : ""}
                    </div>
                    ${renderCartControl(product.id)}
                </div>
            </div>
        </div>
    `).join("");
}

function renderCartControl(id) {
    const qty = cart[id] ? cart[id].qty : 0;
    if (qty === 0) {
        return `<button class="add-btn" onclick="addToCart(${id})">ADD</button>`;
    }
    return `
        <div class="qty-controls">
            <button class="qty-btn" onclick="changeQty(${id}, -1)">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="changeQty(${id}, 1)">+</button>
        </div>
    `;
}

// ===== CART LOGIC =====
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (cart[id]) {
        cart[id].qty += 1;
    } else {
        cart[id] = { ...product, qty: 1 };
    }

    updateUI();
    animateCartBtn();
}

function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;

    if (cart[id].qty <= 0) {
        delete cart[id];
    }

    updateUI();
}

function updateUI() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);

    // Update cart count badge
    document.getElementById("cartCount").textContent = totalItems;

    // Re-render products to update buttons
    renderProducts(currentFilter);

    // Update cart sidebar items
    renderCartItems();

    // Cart total
    document.getElementById("cartTotal").textContent = `₹${total}`;

    // Show/hide cart footer
    const hasItems = Object.keys(cart).length > 0;
    document.getElementById("cartFooter").style.display = hasItems ? "block" : "none";
}

function renderCartItems() {
    const container = document.getElementById("cartItems");
    const items = Object.values(cart);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                <p>Your cart is empty</p>
                <span>Add items to get started</span>
            </div>
        `;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <img class="cart-item-img" src="${item.img}" alt="${item.name}"
                onerror="this.src='https://via.placeholder.com/56x56/f4f6fb/999?text=?'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-weight">${item.weight}</div>
                <div class="cart-item-price">₹${item.price * item.qty}</div>
            </div>
            <div class="qty-controls" style="width:72px;height:30px">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                <span class="qty-num">${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
        </div>
    `).join("");
}

function animateCartBtn() {
    const btn = document.getElementById("cartBtn");
    btn.style.transform = "scale(1.08)";
    setTimeout(() => { btn.style.transform = "scale(1)"; }, 180);
}

// ===== CART SIDEBAR OPEN/CLOSE =====
function openCart() {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("cartOverlay").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("active");
    document.body.style.overflow = "";
}

// ===== CATEGORY FILTER =====
function filterCategory(cat) {
    currentFilter = cat;
    renderProducts(cat);
    document.querySelector(".products-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetFilter() {
    currentFilter = "all";
    renderProducts("all");
}

// ===== SEARCH =====
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");

searchInput.addEventListener("input", function () {
    const query = this.value.trim().toLowerCase();

    if (query.length < 1) {
        searchDropdown.classList.remove("active");
        return;
    }

    const results = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );

    if (results.length === 0) {
        searchDropdown.innerHTML = `<div class="search-item">No results for "${query}"</div>`;
    } else {
        searchDropdown.innerHTML = results.slice(0, 6).map(p => `
            <div class="search-item" onclick="selectProduct(${p.id})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                ${p.name}
                <span>₹${p.price}</span>
            </div>
        `).join("");
    }

    searchDropdown.classList.add("active");
});

function selectProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    searchInput.value = product.name;
    searchDropdown.classList.remove("active");
    filterCategory(product.category);
}

// Close search dropdown on outside click
document.addEventListener("click", function (e) {
    if (!e.target.closest(".search-wrapper")) {
        searchDropdown.classList.remove("active");
    }
});

// ===== LOGIN MODAL =====
function openModal() {
    document.getElementById("loginModal").classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("loginModal").classList.remove("active");
    document.body.style.overflow = "";
}

function sendOTP() {
    const phone = document.getElementById("phoneInput").value.trim();
    if (phone.length !== 10 || isNaN(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }
    alert(`OTP sent to +91 ${phone}`);
    closeModal();
}

// Close modal on overlay click
document.getElementById("loginModal").addEventListener("click", function (e) {
    if (e.target === this) closeModal();
});

// ===== EVENT LISTENERS =====
document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("loginBtn").addEventListener("click", openModal);

// ===== INIT =====
renderProducts("all");
