// API Configuration
let API_URL = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let supplierToken = localStorage.getItem('supplierToken');

// Check authentication
if (!supplierToken) {
    window.location.href = 'login.html';
}

// Loading functions
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    showLoading();
    loadSupplierProducts().finally(() => hideLoading());
    setupNavigation();
});

function setupNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showProducts() {
    hideAllViews();
    const productsView = document.getElementById('products-view');
    productsView.style.display = 'block';
    productsView.classList.add('active');
    loadSupplierProducts();
}

function showAddProduct() {
    hideAllViews();
    const addView = document.getElementById('add-product-view');
    addView.style.display = 'block';
    addView.classList.add('active');
}

function showOrders() {
    hideAllViews();
    const ordersView = document.getElementById('orders-view');
    ordersView.style.display = 'block';
    ordersView.classList.add('active');
    loadSupplierOrders();
}

function hideAllViews() {
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
        view.style.display = 'none';
    });
}

async function loadSupplierProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;
    
    // Show loading spinner
    productsList.innerHTML = '<div class="loading-spinner"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="#667eea" d="M597.000000,376.657959 C618.005493,376.363403 638.503296,376.493805 658.425598,382.218964 C706.083557,395.914581 734.733032,427.391663 743.993164,475.904755 C748.666321,500.387268 747.611694,525.100586 740.728638,549.144653 C727.932861,593.843567 697.758301,619.890930 652.649109,629.231934 C641.705017,631.498230 630.622131,632.462585 619.416870,632.420288 C589.754028,632.308411 560.089783,632.310242 530.427551,632.493103 C525.934998,632.520813 524.472351,631.398254 524.494141,626.670593 C524.679504,586.509399 524.624268,546.346863 524.564026,506.184906 C524.547241,495.025024 524.336609,483.864075 524.081665,472.706665 C523.991272,468.752747 525.156738,467.237701 529.561951,467.343781 C544.718018,467.708801 559.893738,467.815155 575.047180,467.433533 C580.375427,467.299347 581.391418,469.076263 581.365295,473.925079 C581.192383,506.087158 581.289062,538.250732 581.307190,570.413818 C581.313599,581.842896 580.410950,580.871521 591.398438,580.662354 C604.210754,580.418518 617.044983,581.531921 629.837280,579.901428 C660.362549,576.010681 678.831421,559.537231 685.155029,529.350708 C688.914001,511.406769 689.314270,493.209900 683.492371,475.544342 C675.325012,450.762299 657.693115,436.183777 632.539551,430.477966 C625.235168,428.821075 617.722961,428.364075 610.222229,428.354492 C586.224915,428.323883 562.226562,428.225128 538.231018,428.432373 C533.370605,428.474335 531.425476,427.320312 531.559509,422.063873 C531.899292,408.740723 531.795654,395.401154 531.593445,382.072327 C531.531128,377.965027 532.859497,376.569611 537.009033,376.602966 C556.838196,376.762421 576.669495,376.665161 597.000000,376.657959 z"/><path fill="#667eea" d="M299.780334,449.000000 C299.773682,436.169128 299.801392,423.838074 299.742493,411.507446 C299.718079,406.399414 298.928589,405.872284 294.127258,407.380371 C285.549957,410.074402 276.984497,412.806213 268.398865,415.473328 C266.876495,415.946259 265.401215,417.028564 263.577209,416.190704 C263.205109,414.025177 264.950592,412.902039 265.976013,411.562653 C273.975281,401.113861 282.128571,390.782684 290.094910,380.309174 C292.100342,377.672577 294.355560,376.566284 297.697906,376.587036 C315.860199,376.699738 334.025482,376.750000 352.185455,376.504547 C356.504761,376.446198 357.445618,377.950073 357.436096,381.956085 C357.330139,426.596161 357.280426,471.237091 357.482117,515.876587 C357.526306,525.654480 357.923584,535.456604 360.283142,545.105530 C366.079132,568.807007 384.604858,583.148254 409.059509,583.829407 C434.062073,584.525757 452.584045,571.079407 459.049316,550.415771 C461.548096,542.429382 462.674164,534.190430 462.677155,525.817078 C462.694000,478.659729 462.695129,431.502411 462.705292,384.345062 C462.706970,376.628815 462.715912,376.681213 470.342712,376.629974 C485.334656,376.529266 500.326660,376.400330 515.317505,376.198273 C518.756531,376.151947 520.426331,377.174500 520.416809,381.043335 C520.295837,430.366455 520.999817,479.703949 520.006104,529.007812 C519.439392,557.124939 510.523682,583.060059 491.079834,604.350708 C476.988556,619.780396 459.173126,628.855896 438.830780,632.624512 C415.264008,636.990479 391.605804,637.150696 368.897034,628.554321 C334.207184,615.422485 314.180573,589.111572 304.773376,554.020630 C301.001678,539.951355 299.879974,525.506226 299.825317,510.986053 C299.748199,490.490936 299.789215,469.995361 299.780334,449.000000 z"/></svg></div>';
    
    try {
        const response = await fetch(`${API_URL}/api/supplier/products`, {
            headers: { 'Authorization': `Bearer ${supplierToken}` }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            if (!data.data || data.data.length === 0) {
                productsList.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No products yet. Add your first product!</p>';
                return;
            }
            
            productsList.innerHTML = data.data.map(product => {
                const safeName = (product.name || 'Unnamed Product').replace(/'/g, "\\'");
                const safeId = product.id || '';
                const price = parseFloat(product.price || 0).toFixed(2);
                const imageHtml = product.image ? `<img src="${product.image}" alt="${safeName}" onerror="this.style.display='none'">` : '<div style="height: 150px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #999;">No Image</div>';
                
                return `
                    <div class="product-card">
                        ${imageHtml}
                        <div class="product-card-content">
                            <h4>${safeName}</h4>
                            ${product.description ? `<p style="color: #666; font-size: 0.9em; margin: 5px 0;">${product.description}</p>` : ''}
                            <p class="price">${price} DH</p>
                            <button class="btn-delete" onclick="deleteProduct('${safeId}')">Delete</button>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            productsList.innerHTML = `<p style="text-align: center; padding: 40px; color: #f44336;">Error: ${data.message || 'Failed to load products'}</p>`;
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = `<p style="text-align: center; padding: 40px; color: #f44336;">Error loading products: ${error.message}</p>`;
    }
}

// Wait for DOM to be ready before adding event listener
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('product-name').value.trim();
            const image = document.getElementById('product-image').value.trim();
            const price = document.getElementById('product-price').value.trim();
            const description = document.getElementById('product-description').value.trim();
            const messageEl = document.getElementById('add-product-message');
            
            if (!name || !price) {
                showMessage(messageEl, 'Name and price are required', 'error');
                return;
            }
            
            if (isNaN(price) || parseFloat(price) <= 0) {
                showMessage(messageEl, 'Price must be a positive number', 'error');
                return;
            }
            
            showLoading();
            
            try {
                const response = await fetch(`${API_URL}/api/supplier/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${supplierToken}`
                    },
                    body: JSON.stringify({ 
                        name, 
                        image: image || null, 
                        price: parseFloat(price), 
                        description: description || null 
                    })
                });
                
                const data = await response.json();
                if (data.success) {
                    showMessage(messageEl, 'Product added successfully!', 'success');
                    document.getElementById('add-product-form').reset();
                    setTimeout(() => {
                        showProducts();
                    }, 1500);
                } else {
                    showMessage(messageEl, data.message || 'Failed to add product', 'error');
                }
            } catch (error) {
                console.error('Add product error:', error);
                showMessage(messageEl, 'Error: ' + error.message, 'error');
            } finally {
                hideLoading();
            }
        });
    }
});

async function deleteProduct(productId) {
    if (!confirm('Delete this product?')) return;
    
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}/api/supplier/products/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${supplierToken}` }
        });
        
        const data = await response.json();
        if (data.success) {
            await loadSupplierProducts();
        } else {
            alert(data.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('Delete product error:', error);
        alert('Error deleting product: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function loadSupplierOrders() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;
    
    // Show loading spinner
    ordersList.innerHTML = '<div class="loading-spinner"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="#667eea" d="M597.000000,376.657959 C618.005493,376.363403 638.503296,376.493805 658.425598,382.218964 C706.083557,395.914581 734.733032,427.391663 743.993164,475.904755 C748.666321,500.387268 747.611694,525.100586 740.728638,549.144653 C727.932861,593.843567 697.758301,619.890930 652.649109,629.231934 C641.705017,631.498230 630.622131,632.462585 619.416870,632.420288 C589.754028,632.308411 560.089783,632.310242 530.427551,632.493103 C525.934998,632.520813 524.472351,631.398254 524.494141,626.670593 C524.679504,586.509399 524.624268,546.346863 524.564026,506.184906 C524.547241,495.025024 524.336609,483.864075 524.081665,472.706665 C523.991272,468.752747 525.156738,467.237701 529.561951,467.343781 C544.718018,467.708801 559.893738,467.815155 575.047180,467.433533 C580.375427,467.299347 581.391418,469.076263 581.365295,473.925079 C581.192383,506.087158 581.289062,538.250732 581.307190,570.413818 C581.313599,581.842896 580.410950,580.871521 591.398438,580.662354 C604.210754,580.418518 617.044983,581.531921 629.837280,579.901428 C660.362549,576.010681 678.831421,559.537231 685.155029,529.350708 C688.914001,511.406769 689.314270,493.209900 683.492371,475.544342 C675.325012,450.762299 657.693115,436.183777 632.539551,430.477966 C625.235168,428.821075 617.722961,428.364075 610.222229,428.354492 C586.224915,428.323883 562.226562,428.225128 538.231018,428.432373 C533.370605,428.474335 531.425476,427.320312 531.559509,422.063873 C531.899292,408.740723 531.795654,395.401154 531.593445,382.072327 C531.531128,377.965027 532.859497,376.569611 537.009033,376.602966 C556.838196,376.762421 576.669495,376.665161 597.000000,376.657959 z"/><path fill="#667eea" d="M299.780334,449.000000 C299.773682,436.169128 299.801392,423.838074 299.742493,411.507446 C299.718079,406.399414 298.928589,405.872284 294.127258,407.380371 C285.549957,410.074402 276.984497,412.806213 268.398865,415.473328 C266.876495,415.946259 265.401215,417.028564 263.577209,416.190704 C263.205109,414.025177 264.950592,412.902039 265.976013,411.562653 C273.975281,401.113861 282.128571,390.782684 290.094910,380.309174 C292.100342,377.672577 294.355560,376.566284 297.697906,376.587036 C315.860199,376.699738 334.025482,376.750000 352.185455,376.504547 C356.504761,376.446198 357.445618,377.950073 357.436096,381.956085 C357.330139,426.596161 357.280426,471.237091 357.482117,515.876587 C357.526306,525.654480 357.923584,535.456604 360.283142,545.105530 C366.079132,568.807007 384.604858,583.148254 409.059509,583.829407 C434.062073,584.525757 452.584045,571.079407 459.049316,550.415771 C461.548096,542.429382 462.674164,534.190430 462.677155,525.817078 C462.694000,478.659729 462.695129,431.502411 462.705292,384.345062 C462.706970,376.628815 462.715912,376.681213 470.342712,376.629974 C485.334656,376.529266 500.326660,376.400330 515.317505,376.198273 C518.756531,376.151947 520.426331,377.174500 520.416809,381.043335 C520.295837,430.366455 520.999817,479.703949 520.006104,529.007812 C519.439392,557.124939 510.523682,583.060059 491.079834,604.350708 C476.988556,619.780396 459.173126,628.855896 438.830780,632.624512 C415.264008,636.990479 391.605804,637.150696 368.897034,628.554321 C334.207184,615.422485 314.180573,589.111572 304.773376,554.020630 C301.001678,539.951355 299.879974,525.506226 299.825317,510.986053 C299.748199,490.490936 299.789215,469.995361 299.780334,449.000000 z"/></svg></div>';
    
    try {
        const response = await fetch(`${API_URL}/api/supplier/orders`, {
            headers: { 'Authorization': `Bearer ${supplierToken}` }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            if (!data.data || data.data.length === 0) {
                ordersList.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No orders yet.</p>';
                return;
            }
            
            ordersList.innerHTML = data.data.map(order => {
                const orderId = order.id ? order.id.substring(0, 8) : 'N/A';
                const clientName = order.client_name || order.client_email || 'Unknown';
                const phone = order.phone || 'N/A';
                const location = order.location_type === 'emsi' 
                    ? `EMSI - Etage: ${order.etage || 'N/A'}` 
                    : `Outside - ${order.address || 'N/A'}`;
                const total = parseFloat(order.total_amount || 0).toFixed(2);
                const deliveryFee = order.delivery_fee ? parseFloat(order.delivery_fee).toFixed(2) : '0.00';
                const status = order.status || 'pending';
                const createdAt = order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A';
                
                // Get items for this supplier
                const items = order.items || [];
                const itemsHtml = items.length > 0 ? `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e0e0e0;">
                        <strong>Items:</strong>
                        ${items.map(item => `
                            <p style="margin: 5px 0; color: #666;">
                                ${item.quantity}x ${item.product_name || 'Product'} - ${parseFloat(item.price_at_time || 0).toFixed(2)} DH each
                            </p>
                        `).join('')}
                    </div>
                ` : '';
                
                return `
                    <div class="order-card">
                        <div class="order-header">
                            <h4>Order #${orderId}</h4>
                            <span class="order-status">${status}</span>
                        </div>
                        <div class="order-client-info">
                            <p><strong>Client:</strong> ${clientName}</p>
                            <p><strong>Phone:</strong> ${phone}</p>
                            <p><strong>Location:</strong> ${location}</p>
                            <p><strong>Date:</strong> ${createdAt}</p>
                            ${itemsHtml}
                        </div>
                        <p class="order-total">Total: ${total} DH 
                            ${parseFloat(deliveryFee) > 0 ? `(Delivery: ${deliveryFee} DH)` : ''}
                        </p>
                    </div>
                `;
            }).join('');
        } else {
            ordersList.innerHTML = `<p style="text-align: center; padding: 40px; color: #f44336;">Error: ${data.message || 'Failed to load orders'}</p>`;
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = `<p style="text-align: center; padding: 40px; color: #f44336;">Error loading orders: ${error.message}</p>`;
    }
}

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 5000);
}

function logout() {
    localStorage.removeItem('supplierToken');
    localStorage.removeItem('supplierData');
    window.location.href = 'index.html';
}

