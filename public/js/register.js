// API Configuration - Auto-detect API URL from current domain
function getApiUrl() {
  // Check localStorage first (for manual override)
  const stored = localStorage.getItem('apiUrl');
  if (stored) return stored;
  
  // Auto-detect from current window location
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // If on Render or production, use current domain
  if (hostname.includes('render.com') || hostname.includes('onrender.com')) {
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
}

let API_URL = getApiUrl();
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
            // Show success message
            showMessage(messageEl, data.message, 'success');
            document.getElementById('verify-section').style.display = 'block';
            
            // Show email status - ONLY show success message, never show code on page
            if (data.data && data.data.emailSent) {
                // Email was sent successfully - show success message
                const successNote = document.createElement('div');
                successNote.className = 'email-success-note';
                successNote.style.cssText = 'margin-top: 15px; padding: 12px; background: #d4edda; border: 2px solid #28a745; border-radius: 8px; font-size: 14px; color: #155724; line-height: 1.6;';
                successNote.innerHTML = '✅ <strong>Email Sent Successfully!</strong><br>Check your inbox for the verification code.';
                messageEl.parentNode.insertBefore(successNote, messageEl.nextSibling);
            } else if (data.data && !data.data.emailSent) {
                // Email failed - show warning but NEVER show code on page (security)
                const warningNote = document.createElement('div');
                warningNote.className = 'email-warning-note';
                warningNote.style.cssText = 'margin-top: 15px; padding: 12px; background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; font-size: 14px; color: #856404; line-height: 1.6;';
                warningNote.innerHTML = '⚠️ <strong>Email Not Sent</strong><br>Email configuration issue. Check server logs for the verification code.';
                messageEl.parentNode.insertBefore(warningNote, messageEl.nextSibling);
                
                // Show helpful note about checking logs if on Render
                if (API_URL.includes('render.com') || API_URL.includes('onrender.com')) {
                    const logNote = document.createElement('div');
                    logNote.className = 'log-note';
                    logNote.style.cssText = 'margin-top: 10px; padding: 12px; background: #e7f3ff; border: 1px solid #2196F3; border-radius: 6px; font-size: 13px; color: #0d47a1; line-height: 1.5;';
                    logNote.innerHTML = '📋 <strong>How to find your code:</strong><br>' +
                        '👉 Go to: <strong>Render Dashboard → Your Service → Logs tab</strong><br>' +
                        '🔍 Look for: <code>VERIFICATION CODE</code> in the logs';
                    messageEl.parentNode.insertBefore(logNote, messageEl.nextSibling);
                }
            }
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






