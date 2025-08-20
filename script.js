
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 1999,
        description: "High-quality wireless headphones with noise cancellation.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 4999,
        description: "Track your fitness and stay connected with this smart watch.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Bluetooth Speaker",
        price: 999,
        description: "Portable Bluetooth speaker with great sound quality.",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Laptop Backpack",
        price: 1499,
        description: "Stylish and durable backpack for your laptop and accessories.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];


let users = [
    {
        id: 1,
        name: "Admin User",
        email: "sameepspk002@gmail.com",
        password: "admin123",
        isAdmin: true
    },
    {
        id: 2,
        name: "Regular User",
        email: "sameepspk002@gamil.com",
        password: "user123",
        isAdmin: false
    }
];

let currentUser = null;
let cart = [];


const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const authLinks = document.getElementById('auth-links');
const userGreeting = document.getElementById('user-greeting');
const usernameDisplay = document.getElementById('username-display');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');
const loginModal = document.getElementById('login-modal');
const registerModal = document.getElementById('register-modal');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const closeModalButtons = document.querySelectorAll('.close-modal');


loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'block';
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'block';
});

logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    logoutUser();
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        loginUser(user);
        loginModal.style.display = 'none';
        loginError.textContent = '';
        loginForm.reset();
    } else {
        loginError.textContent = 'Invalid email or password';
    }
});


registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    
    
    if (password !== confirm) {
        registerError.textContent = 'Passwords do not match';
        return;
    }
    
    if (users.some(u => u.email === email)) {
        registerError.textContent = 'Email already registered';
        return;
    }
    
    
    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        isAdmin: false
    };
    
    users.push(newUser);
    loginUser(newUser);
    registerModal.style.display = 'none';
    registerError.textContent = '';
    registerForm.reset();
});


function loginUser(user) {
    currentUser = user;
    updateAuthUI();
}

function logoutUser() {
    currentUser = null;
    updateAuthUI();
}

function updateAuthUI() {
    if (currentUser) {
        authLinks.style.display = 'none';
        userGreeting.style.display = 'flex';
        usernameDisplay.textContent = currentUser.name;
    } else {
        authLinks.style.display = 'flex';
        userGreeting.style.display = 'none';
    }
}


function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <img src=" ${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="product-price">NRP${product.price.toFixed(2)}</span>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}


function addToCart(e) {
    if (!currentUser) {
        alert('Please login to add items to your cart');
        loginModal.style.display = 'block';
        return;
    }
    
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
}


function updateCart() {
   
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = '';
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-quantity" data-id="${item.id}">+</button>
                    <span class="cart-item-remove" data-id="${item.id}">×</span>
                </div>
            `;
            
            cartItems.appendChild(cartItem);
        });
        
      
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', removeItem);
        });
        
        checkoutBtn.disabled = false;
    }
    
  
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}


function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
}


function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    item.quantity += 1;
    updateCart();
}


function removeItem(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}


checkoutBtn.addEventListener('click', () => {
    if (!currentUser) {
        alert('Please login to checkout');
        loginModal.style.display = 'block';
        return;
    }
    
    alert(`Thank you for your purchase, ${currentUser.name}! Total: NPR${cartTotal.textContent}`);
    cart = [];
    updateCart();
});


displayProducts();
updateCart();
updateAuthUI();