// API Configuration
// API Configuration - Auto-detect API URL from current domain
function getApiUrl() {
  const stored = localStorage.getItem('apiUrl');
  if (stored) return stored;
  
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
  }
  
  return 'http://localhost:3000';
}

let API_URL = getApiUrl();
let clientToken = localStorage.getItem('clientToken');
let clientData = localStorage.getItem('clientData') ? JSON.parse(localStorage.getItem('clientData')) : null;
let storesData = [];
let currentView = 'stores';

// Check authentication
if (!clientToken) {
    window.location.href = 'login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadProfile();
    setupNavigation();
    updateCartCount();
});

function setupNavigation() {
    // Bottom nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showStores() {
    currentView = 'stores';
    hideAllViews();
    document.getElementById('stores-view').style.display = 'block';
    showStoresList();
}

function showCart() {
    currentView = 'cart';
    hideAllViews();
    document.getElementById('cart-view').style.display = 'block';
    loadCart();
    updateNavActive('cart');
}

function showOrders() {
    currentView = 'orders';
    hideAllViews();
    document.getElementById('orders-view').style.display = 'block';
    loadClientOrders();
    updateNavActive('orders');
}

function showProfile() {
    currentView = 'profile';
    hideAllViews();
    document.getElementById('profile-view').style.display = 'block';
    updateNavActive('profile');
}

function hideCart() {
    showStores();
}

function hideAllViews() {
    document.querySelectorAll('.content-view').forEach(view => {
        view.style.display = 'none';
    });
}

function updateNavActive(active) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // Find and activate the corresponding nav button
    const navBtns = document.querySelectorAll('.nav-btn');
    if (active === 'stores') navBtns[0]?.classList.add('active');
    else if (active === 'cart') navBtns[1]?.classList.add('active');
    else if (active === 'orders') navBtns[2]?.classList.add('active');
    else if (active === 'profile') navBtns[3]?.classList.add('active');
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/client/products`, {
            headers: { 'Authorization': `Bearer ${clientToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            storesData = data.data || [];
            showStoresList();
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function showStoresList() {
    const storesList = document.getElementById('stores-list');
    if (!storesList) return;
    
    const storesWithProducts = storesData.filter(store => 
        store && store.products && Array.isArray(store.products) && store.products.length > 0
    );
    
    if (storesWithProducts.length === 0) {
        storesList.innerHTML = '<p>No stores available.</p>';
        return;
    }
    
    storesList.innerHTML = storesWithProducts.map(store => {
        const productCount = store.products.length;
        const firstProduct = store.products[0];
        const storeImage = firstProduct?.image || '';
        
        return `
            <div class="store-card" onclick="showStoreDetail('${store.supplier_id}')">
                ${storeImage ? `<div class="store-card-image"><img src="${storeImage}" alt="${store.supplier_name}"></div>` : ''}
                <div class="store-card-content">
                    <h3>${store.supplier_name || 'Unknown Store'}</h3>
                    <p class="store-product-count">${productCount} ${productCount === 1 ? 'product' : 'products'}</p>
                </div>
            </div>
        `;
    }).join('');
}

function showStoreDetail(storeId) {
    const store = storesData.find(s => s.supplier_id === storeId);
    if (!store) return;
    
    hideAllViews();
    document.getElementById('store-detail-view').style.display = 'block';
    document.getElementById('store-name').textContent = store.supplier_name;
    
    const productsList = document.getElementById('store-products');
    productsList.innerHTML = store.products.map(product => `
        <div class="product-card">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">` : ''}
            <div class="product-card-content">
                <h4>${product.name || 'Unnamed Product'}</h4>
                ${product.description ? `<p class="product-description">${product.description}</p>` : ''}
                <p class="product-price">${parseFloat(product.price || 0).toFixed(2)} DH</p>
                <button class="btn" onclick="addToCart('${product.id}', '${product.name || 'Product'}', ${product.price || 0})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function goBackToStores() {
    showStores();
}

async function addToCart(productId, productName, price) {
    try {
        const response = await fetch(`${API_URL}/api/client/panier/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({ product_id: productId, quantity: 1 })
        });
        
        const data = await response.json();
        if (data.success) {
            updateCartCount();
            alert(`${productName} added to cart!`);
        }
    } catch (error) {
        alert('Error adding to cart');
    }
}

async function loadCart() {
    try {
        const response = await fetch(`${API_URL}/api/client/panier`, {
            headers: { 'Authorization': `Bearer ${clientToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const cartItems = document.getElementById('cart-items');
            const cartSummary = document.getElementById('cart-summary');
            const confirmBtn = document.getElementById('confirm-order-btn');
            
            if (!data.data.items || data.data.items.length === 0) {
                cartItems.innerHTML = '<p>Your cart is empty.</p>';
                cartSummary.innerHTML = '';
                confirmBtn.style.display = 'none';
                return;
            }
            
            let subtotal = 0;
            cartItems.innerHTML = data.data.items.map(item => {
                const itemTotal = parseFloat(item.price_at_time) * item.quantity;
                subtotal += itemTotal;
                return `
                    <div class="cart-item">
                        <div class="cart-item-info">
                            <h4>${item.product_name}</h4>
                            <p>${parseFloat(item.price_at_time).toFixed(2)} DH each</p>
                            <div class="quantity-controls">
                                <button onclick="updateCartItem('${item.id}', ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button onclick="updateCartItem('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price">
                            <p class="price">${itemTotal.toFixed(2)} DH</p>
                            <button class="btn-remove" onclick="removeCartItem('${item.id}')">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');
            
            cartSummary.innerHTML = `
                <p>Subtotal: <strong>${subtotal.toFixed(2)} DH</strong></p>
                <p>Delivery: <strong>0.00 DH</strong> <small>(Select location when confirming)</small></p>
                <h3>Total: ${subtotal.toFixed(2)} DH</h3>
            `;
            confirmBtn.style.display = 'block';
            updateCartCount();
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

async function updateCartItem(itemId, quantity) {
    if (quantity < 1) {
        removeCartItem(itemId);
        return;
    }
    
    try {
        await fetch(`${API_URL}/api/client/panier/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({ item_id: itemId, quantity })
        });
        loadCart();
    } catch (error) {
        alert('Error updating cart');
    }
}

async function removeCartItem(itemId) {
    try {
        await fetch(`${API_URL}/api/client/panier/remove/${itemId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${clientToken}` }
        });
        loadCart();
    } catch (error) {
        alert('Error removing item');
    }
}

function updateCartCount() {
    fetch(`${API_URL}/api/client/panier`, {
        headers: { 'Authorization': `Bearer ${clientToken}` }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.data && data.data.items) {
            const count = data.data.items.length;
            const cartCountEl = document.getElementById('cart-count');
            const navCartCountEl = document.getElementById('nav-cart-count');
            if (cartCountEl) cartCountEl.textContent = count;
            if (navCartCountEl) {
                navCartCountEl.textContent = count;
                navCartCountEl.style.display = count > 0 ? 'flex' : 'none';
            }
        } else {
            const cartCountEl = document.getElementById('cart-count');
            const navCartCountEl = document.getElementById('nav-cart-count');
            if (cartCountEl) cartCountEl.textContent = '0';
            if (navCartCountEl) {
                navCartCountEl.textContent = '0';
                navCartCountEl.style.display = 'none';
            }
        }
    })
    .catch(() => {
        const cartCountEl = document.getElementById('cart-count');
        const navCartCountEl = document.getElementById('nav-cart-count');
        if (cartCountEl) cartCountEl.textContent = '0';
        if (navCartCountEl) {
            navCartCountEl.textContent = '0';
            navCartCountEl.style.display = 'none';
        }
    });
}

function showOrderModal() {
    document.getElementById('order-modal').style.display = 'flex';
}

function hideOrderModal() {
    document.getElementById('order-modal').style.display = 'none';
}

function toggleLocationFields() {
    const locationType = document.getElementById('location-type').value;
    document.getElementById('emsi-fields').style.display = locationType === 'emsi' ? 'block' : 'none';
    document.getElementById('outside-fields').style.display = locationType === 'outside' ? 'block' : 'none';
}

document.getElementById('order-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const phone = document.getElementById('order-phone').value;
    const locationType = document.getElementById('location-type').value;
    const etage = document.getElementById('etage').value;
    const address = document.getElementById('address').value;
    const clientName = document.getElementById('order-name').value;
    
    if (locationType === 'emsi' && !etage) {
        alert('Please enter the floor number (Etage)');
        return;
    }
    
    if (locationType === 'outside' && !address) {
        alert('Please enter your address');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/client/panier/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${clientToken}`
            },
            body: JSON.stringify({
                phone,
                location_type: locationType,
                etage: locationType === 'emsi' ? etage : null,
                address: locationType === 'outside' ? address : null,
                client_name: clientName
            })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Order confirmed successfully!');
            hideOrderModal();
            loadCart();
            showOrders();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error confirming order');
    }
});

async function loadClientOrders() {
    try {
        const response = await fetch(`${API_URL}/api/client/orders`, {
            headers: { 'Authorization': `Bearer ${clientToken}` }
        });
        const data = await response.json();
        
        if (data.success) {
            const ordersList = document.getElementById('orders-list');
            if (data.data.length === 0) {
                ordersList.innerHTML = '<p>No orders yet.</p>';
                return;
            }
            
            ordersList.innerHTML = data.data.map(order => {
                const itemsBySupplier = {};
                if (order.items) {
                    order.items.forEach(item => {
                        const key = item.supplier_id || 'unknown';
                        if (!itemsBySupplier[key]) {
                            itemsBySupplier[key] = {
                                supplier_name: item.supplier_name || 'Unknown',
                                items: []
                            };
                        }
                        itemsBySupplier[key].items.push(item);
                    });
                }
                
                return `
                    <div class="order-card">
                        <div class="order-header">
                            <h4>Order #${order.id.substring(0, 8)}</h4>
                            <span class="order-status">${order.status}</span>
                        </div>
                        <p class="order-info">${new Date(order.created_at).toLocaleString()}</p>
                        <p class="order-info">
                            ${order.location_type === 'emsi' 
                                ? `📍 EMSI - Etage: ${order.etage || 'N/A'}` 
                                : `📍 ${order.address || 'N/A'}`}
                        </p>
                        ${order.delivery_fee > 0 ? `<p class="order-info">Delivery: ${parseFloat(order.delivery_fee).toFixed(2)} DH</p>` : ''}
                        <p class="order-total">Total: ${parseFloat(order.total_amount).toFixed(2)} DH</p>
                    </div>
                `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

async function loadProfile() {
    if (clientData) {
        document.getElementById('profile-email').textContent = clientData.email || '-';
        // Load full profile
        try {
            const response = await fetch(`${API_URL}/api/client/profile`, {
                headers: { 'Authorization': `Bearer ${clientToken}` }
            });
            const data = await response.json();
            if (data.success) {
                document.getElementById('profile-phone').textContent = data.data.phone || '-';
                if (data.data.location_type === 'emsi') {
                    document.getElementById('profile-location').textContent = `EMSI - ${data.data.etage || 'N/A'}`;
                } else {
                    document.getElementById('profile-location').textContent = data.data.address || '-';
                }
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    }
}

function logout() {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    window.location.href = 'index.html';
}

