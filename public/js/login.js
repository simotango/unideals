// API Configuration
let API_URL = localStorage.getItem('apiUrl') || 'http://localhost:3000';

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const tab = this.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.login-form').forEach(f => f.classList.remove('active'));
        document.getElementById(`${tab}-login`).classList.add('active');
    });
});

// Client Login
document.getElementById('client-login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('client-email').value;
    const password = document.getElementById('client-password').value;
    const messageEl = document.getElementById('client-message');
    
    try {
        const response = await fetch(`${API_URL}/api/client/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('clientToken', data.data.token);
            localStorage.setItem('clientData', JSON.stringify(data.data.client));
            window.location.href = 'categories.html';
        } else {
            showMessage(messageEl, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Error: ' + error.message, 'error');
    }
});

// Supplier Login
document.getElementById('supplier-login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('supplier-email').value;
    const password = document.getElementById('supplier-password').value;
    const messageEl = document.getElementById('supplier-message');
    
    try {
        const response = await fetch(`${API_URL}/api/supplier/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('supplierToken', data.data.token);
            localStorage.setItem('supplierData', JSON.stringify(data.data.supplier));
            window.location.href = 'supplier-dashboard.html';
        } else {
            showMessage(messageEl, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Error: ' + error.message, 'error');
    }
});

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 5000);
}



