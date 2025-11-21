// Check if user is logged in
const clientToken = localStorage.getItem('clientToken');
if (!clientToken) {
    window.location.href = 'login.html';
}

function selectCategory(category) {
    if (category === 'fastfood') {
        window.location.href = 'client-dashboard.html';
    }
}

function showComingSoon(categoryName) {
    alert(`${categoryName} category is coming soon!`);
}

function logout() {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientData');
    window.location.href = 'index.html';
}






