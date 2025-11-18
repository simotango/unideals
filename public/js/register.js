// API Configuration
let API_URL = localStorage.getItem('apiUrl') || 'http://localhost:3000';
let selectedUserType = null;
let studentEmail = '';

function selectUserType(type) {
    selectedUserType = type;
    document.querySelectorAll('.type-card').forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    
    if (type === 'student') {
        document.getElementById('student-register').style.display = 'block';
        document.getElementById('business-register').style.display = 'none';
    } else {
        document.getElementById('student-register').style.display = 'none';
        document.getElementById('business-register').style.display = 'block';
    }
}

// Student Registration
document.getElementById('student-register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('student-email').value;
    studentEmail = email;
    const messageEl = document.getElementById('student-register-message');
    
    try {
        const response = await fetch(`${API_URL}/api/client/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        if (data.success) {
            showMessage(messageEl, data.message + ' Check server console for verification code.', 'success');
            document.getElementById('verify-section').style.display = 'block';
        } else {
            showMessage(messageEl, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Error: ' + error.message, 'error');
    }
});

// Verify Email
document.getElementById('verify-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const verification_code = document.getElementById('verify-code').value;
    const messageEl = document.getElementById('verify-message');
    
    try {
        const response = await fetch(`${API_URL}/api/client/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: studentEmail, verification_code })
        });
        
        const data = await response.json();
        if (data.success) {
            showMessage(messageEl, data.message, 'success');
            document.getElementById('password-section').style.display = 'block';
        } else {
            showMessage(messageEl, data.message, 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Error: ' + error.message, 'error');
    }
});

// Set Password
document.getElementById('password-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const password = document.getElementById('student-password').value;
    const messageEl = document.getElementById('password-message');
    
    try {
        const response = await fetch(`${API_URL}/api/client/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: studentEmail, password })
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

// Business Registration
document.getElementById('business-register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('business-name').value;
    const email = document.getElementById('business-email').value;
    const password = document.getElementById('business-password').value;
    const messageEl = document.getElementById('business-message');
    
    try {
        const response = await fetch(`${API_URL}/api/supplier/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
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



