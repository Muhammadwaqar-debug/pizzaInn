/* ========================================
   PIZZA INN - GLOBAL JAVASCRIPT
   ======================================== */

// DOM Elements
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const cartCount = document.querySelector('.cart-count');

// Cart Data
let cart = JSON.parse(localStorage.getItem('pizzaInnCart')) || [];
let orders = JSON.parse(localStorage.getItem('pizzaInnOrders')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    initMobileMenu();
    initScrollEffects();
    initAnimations();
    
    // Page-specific initialization
    const currentPage = document.body.dataset.page;
    if (currentPage) {
        switch(currentPage) {
            case 'menu':
                initMenuPage();
                break;
            case 'order':
                initOrderPage();
                break;
            case 'track':
                initTrackPage();
                break;
            case 'reviews':
                initReviewsPage();
                break;
            case 'complaints':
                initComplaintsPage();
                break;
        }
    }
});

/* ========================================
   MOBILE MENU
   ======================================== */

function initMobileMenu() {
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/* ========================================
   SCROLL EFFECTS
   ======================================== */

function initScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
}

/* ========================================
   ANIMATIONS
   ======================================== */

function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.menu-card, .testimonial-card, .about-feature');
    animateElements.forEach(el => observer.observe(el));
}

/* ========================================
   CART FUNCTIONS
   ======================================== */

// Global function to add item to cart (called from onclick)
function addItemToCart(id, name, price, image) {
    const existingItem = cart.find(i => i.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    
    // Refresh order page if on order page
    if (document.body.dataset.page === 'order') {
        renderCartItems();
    }
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            updateCartCount();
            
            if (document.body.dataset.page === 'order') {
                renderCartItems();
            }
        }
    }
}

function saveCart() {
    localStorage.setItem('pizzaInnCart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartCount();
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            max-width: 300px;
        ">
            ✓ ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

/* ========================================
   MENU PAGE
   ======================================== */

function initMenuPage() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Filter items
            menuItems.forEach(item => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/* ========================================
   ORDER PAGE
   ======================================== */

function initOrderPage() {
    renderCartItems();
    
    // Payment method change handler
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            const onlinePaymentSection = document.getElementById('onlinePaymentSection');
            if (method.value === 'online') {
                onlinePaymentSection.style.display = 'block';
            } else {
                onlinePaymentSection.style.display = 'none';
            }
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-gray);">
                <p style="font-size: 1.25rem;">🛒 Your cart is empty</p>
                <p>Add some delicious pizzas to get started!</p>
                <a href="menu.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Browse Menu</a>
            </div>
        `;
        if (cartSummary) {
            cartSummary.innerHTML = '<p style="text-align: center; color: var(--text-gray);">No items in cart</p>';
        }
        return;
    }
    
    // Render cart items
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <h4 class="order-item-title">${item.name}</h4>
                <div class="order-item-price">Rs. ${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="
                background: none;
                border: none;
                color: var(--danger);
                cursor: pointer;
                font-size: 1.25rem;
                padding: 0.5rem;
            " title="Remove item">✕</button>
        </div>
    `).join('');
    
    // Render summary
    const subtotal = getCartTotal();
    const delivery = subtotal > 0 ? 150 : 0; // Rs. 150 delivery fee
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + delivery + tax;
    
    if (cartSummary) {
        cartSummary.innerHTML = `
            <h3>Order Summary</h3>
            <div class="cart-summary-row">
                <span>Subtotal</span>
                <span>Rs. ${subtotal.toLocaleString()}</span>
            </div>
            <div class="cart-summary-row">
                <span>Delivery Fee</span>
                <span>Rs. ${delivery.toLocaleString()}</span>
            </div>
            <div class="cart-summary-row">
                <span>Tax (10%)</span>
                <span>Rs. ${tax.toLocaleString()}</span>
            </div>
            <div class="cart-summary-row total">
                <span>Total</span>
                <span class="amount">Rs. ${total.toLocaleString()}</span>
            </div>
            <button id="checkoutBtn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
                Proceed to Checkout
            </button>
            <button onclick="clearCart()" style="
                width: 100%;
                margin-top: 0.5rem;
                padding: 0.75rem;
                background: transparent;
                border: 1px solid var(--danger);
                color: var(--danger);
                border-radius: 8px;
                cursor: pointer;
            ">
                Clear Cart
            </button>
        `;
    }
    
    // Re-attach checkout event
    document.getElementById('checkoutBtn')?.addEventListener('click', processCheckout);
}

function processCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Get form data
    const name = document.getElementById('customerName')?.value || 'Customer';
    const phone = document.getElementById('customerPhone')?.value || '';
    const address = document.getElementById('deliveryAddress')?.value || '';
    
    if (!name || !phone || !address) {
        showNotification('Please fill in all delivery details!');
        return;
    }
    
    // Check payment method
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';
    
    // If online payment selected, check for payment proof
    if (paymentMethod === 'online') {
        const paymentProof = document.getElementById('paymentProof')?.value;
        const paymentMethodSelected = document.querySelector('input[name="onlineMethod"]:checked')?.value;
        
        if (!paymentMethodSelected) {
            showNotification('Please select an online payment method!');
            return;
        }
        
        if (!paymentProof) {
            showNotification('Please enter your payment proof/transaction ID!');
            return;
        }
        
        // Show confirmation with payment details
        const orderTotal = getCartTotal() + 150 + (getCartTotal() * 0.10);
        
        // Create order
        const order = {
            id: 'PI' + Date.now(),
            items: [...cart],
            total: orderTotal,
            customer: { name, phone, address },
            paymentMethod: paymentMethodSelected,
            paymentProof: paymentProof,
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            timeline: [
                { status: 'Order Confirmed - Payment Verified', time: new Date().toLocaleString(), completed: true },
                { status: 'Preparing', time: '', completed: false },
                { status: 'Out for Delivery', time: '', completed: false },
                { status: 'Delivered', time: '', completed: false }
            ]
        };
        
        orders.push(order);
        localStorage.setItem('pizzaInnOrders', JSON.stringify(orders));
        
        // Clear cart
        clearCart();
        
        showNotification('Order placed successfully! Payment verified.');
        setTimeout(() => {
            window.location.href = `track.html?orderId=${order.id}`;
        }, 1500);
        
    } else {
        // Cash on delivery
        const orderTotal = getCartTotal() + 150 + (getCartTotal() * 0.10);
        
        const order = {
            id: 'PI' + Date.now(),
            items: [...cart],
            total: orderTotal,
            customer: { name, phone, address },
            paymentMethod: 'cash',
            status: 'confirmed',
            timestamp: new Date().toISOString(),
            timeline: [
                { status: 'Order Confirmed', time: new Date().toLocaleString(), completed: true },
                { status: 'Preparing', time: '', completed: false },
                { status: 'Out for Delivery', time: '', completed: false },
                { status: 'Delivered', time: '', completed: false }
            ]
        };
        
        orders.push(order);
        localStorage.setItem('pizzaInnOrders', JSON.stringify(orders));
        
        // Clear cart
        clearCart();
        
        showNotification('Order placed successfully!');
        setTimeout(() => {
            window.location.href = `track.html?orderId=${order.id}`;
        }, 1500);
    }
}

/* ========================================
   TRACK ORDER PAGE
   ======================================== */

function initTrackPage() {
    const searchBtn = document.getElementById('searchOrderBtn');
    const orderIdInput = document.getElementById('orderIdInput');
    
    // Check for order ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    
    if (orderId) {
        orderIdInput.value = orderId;
        searchOrder();
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', searchOrder);
    }
}

function searchOrder() {
    const orderIdInput = document.getElementById('orderIdInput');
    const orderId = orderIdInput.value.trim();
    
    if (!orderId) {
        showNotification('Please enter an order ID');
        return;
    }
    
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        // Show demo order for testing
        displayDemoOrder();
        return;
    }
    
    displayOrder(order);
}

function displayOrder(order) {
    const orderResult = document.getElementById('orderResult');
    
    if (!orderResult) return;
    
    orderResult.innerHTML = `
        <div class="order-timeline">
            <h3 style="margin-bottom: 1.5rem;">Order #${order.id}</h3>
            ${order.timeline.map((step, index) => `
                <div class="timeline-item">
                    <div class="timeline-icon ${step.completed ? 'completed' : index === getCurrentStep(order.status) ? 'current' : 'pending'}">
                        ${step.completed ? '✓' : index + 1}
                    </div>
                    <div class="timeline-content">
                        <h4>${step.status}</h4>
                        <p>${step.time || 'Pending...'}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 2rem; background: var(--light-bg); padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <h4 style="margin-bottom: 1rem;">Order Details</h4>
            <p><strong>Total:</strong> Rs. ${order.total.toLocaleString()}</p>
            <p><strong>Items:</strong> ${order.items.length}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod}</p>
            <p><strong>Delivery Address:</strong> ${order.customer.address}</p>
        </div>
    `;
}

function displayDemoOrder() {
    const orderResult = document.getElementById('orderResult');
    const now = new Date();
    const prepTime = new Date(now.getTime() + 10 * 60000);
    const deliveryTime = new Date(now.getTime() + 35 * 60000);
    
    orderResult.innerHTML = `
        <div class="order-timeline">
            <h3 style="margin-bottom: 1.5rem;">Demo Order #PI${Date.now()}</h3>
            <div class="timeline-item">
                <div class="timeline-icon completed">✓</div>
                <div class="timeline-content">
                    <h4>Order Confirmed</h4>
                    <p>${now.toLocaleString()}</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-icon current">2</div>
                <div class="timeline-content">
                    <h4>Preparing</h4>
                    <p>Your pizza is being prepared with fresh ingredients</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-icon pending">3</div>
                <div class="timeline-content">
                    <h4>Out for Delivery</h4>
                    <p>Estimated: ${prepTime.toLocaleTimeString()}</p>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-icon pending">4</div>
                <div class="timeline-content">
                    <h4>Delivered</h4>
                    <p>Estimated: ${deliveryTime.toLocaleTimeString()}</p>
                </div>
            </div>
        </div>
        
        <div style="margin-top: 2rem; background: var(--light-bg); padding: 1.5rem; border-radius: 16px; box-shadow: var(--shadow-sm);">
            <h4 style="margin-bottom: 1rem;">Demo Order Details</h4>
            <p><strong>Items:</strong> 2x Pepperoni Pizza, 1x Garlic Bread</p>
            <p><strong>Total:</strong> Rs. 8,680</p>
            <p style="color: var(--text-gray); font-size: 0.9rem; margin-top: 1rem;">
                ℹ️ This is a demo order. To track your real order, place an order and use the order ID shown.
            </p>
        </div>
    `;
}

function getCurrentStep(status) {
    const steps = ['confirmed', 'preparing', 'out_for_delivery', 'delivered'];
    return steps.indexOf(status);
}

/* ========================================
   REVIEWS PAGE
   ======================================== */

let selectedRating = 0;

function initReviewsPage() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedRating = index + 1;
            updateStars();
        });
        
        star.addEventListener('mouseover', () => {
            highlightStars(index);
        });
        
        star.addEventListener('mouseout', () => {
            updateStars();
        });
    });
    
    // Submit review
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
    
    renderReviews();
}

function updateStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < selectedRating);
    });
}

function highlightStars(index) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, i) => {
        star.classList.toggle('active', i <= index);
    });
}

function submitReview(e) {
    e.preventDefault();
    
    const name = document.getElementById('reviewerName').value;
    const text = document.getElementById('reviewText').value;
    
    if (!name || !text || selectedRating === 0) {
        showNotification('Please fill in all fields and select a rating');
        return;
    }
    
    // Get existing reviews
    let reviews = JSON.parse(localStorage.getItem('pizzaInnReviews')) || [];
    
    // Add new review
    reviews.unshift({
        id: Date.now(),
        name,
        text,
        rating: selectedRating,
        date: new Date().toLocaleDateString()
    });
    
    localStorage.setItem('pizzaInnReviews', JSON.stringify(reviews));
    
    // Reset form
    e.target.reset();
    selectedRating = 0;
    updateStars();
    
    showNotification('Thank you for your review!');
    renderReviews();
}

function renderReviews() {
    const reviewsContainer = document.getElementById('reviewsList');
    if (!reviewsContainer) return;
    
    let reviews = JSON.parse(localStorage.getItem('pizzaInnReviews')) || getDefaultReviews();
    
    reviewsContainer.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random" 
                         alt="${review.name}" class="reviewer-avatar">
                    <div>
                        <div class="reviewer-name">${review.name}</div>
                        <div class="review-date">${review.date}</div>
                    </div>
                </div>
                <div class="review-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
    
    // Update stats
    updateReviewStats(reviews);
}

function updateReviewStats(reviews) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const fiveStars = reviews.filter(r => r.rating === 5).length;
    
    const avgElement = document.getElementById('avgRating');
    const totalElement = document.getElementById('totalReviews');
    const fiveStarElement = document.getElementById('fiveStarReviews');
    
    if (avgElement) avgElement.textContent = avgRating.toFixed(1);
    if (totalElement) totalElement.textContent = reviews.length;
    if (fiveStarElement) fiveStarElement.textContent = fiveStars;
}

function getDefaultReviews() {
    return [
        {
            id: 1,
            name: 'Ahmed Khan',
            text: 'Best pizza in town! The crust is perfectly crispy and the toppings are always fresh. Highly recommend the Pepperoni Supreme!',
            rating: 5,
            date: '2024-01-15'
        },
        {
            id: 2,
            name: 'Sarah Ali',
            text: 'Great service and delicious food. The delivery was super fast and the pizza arrived hot. Will order again!',
            rating: 5,
            date: '2024-01-10'
        },
        {
            id: 3,
            name: 'Mohammad Rashid',
            text: 'Good quality pizza, but the delivery took a bit longer than expected. Taste is excellent though.',
            rating: 4,
            date: '2024-01-05'
        }
    ];
}

/* ========================================
   COMPLAINTS PAGE
   ======================================== */

function initComplaintsPage() {
    const complaintTypes = document.querySelectorAll('.complaint-type');
    
    complaintTypes.forEach(type => {
        type.addEventListener('click', () => {
            complaintTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
            
            const input = document.getElementById('complaintType');
            if (input) input.value = type.dataset.type;
        });
    });
    
    // Submit complaint
    const complaintForm = document.getElementById('complaintForm');
    if (complaintForm) {
        complaintForm.addEventListener('submit', submitComplaint);
    }
}

function submitComplaint(e) {
    e.preventDefault();
    
    const type = document.getElementById('complaintType').value;
    const name = document.getElementById('complainantName').value;
    const phone = document.getElementById('complainantPhone').value;
    const email = document.getElementById('complainantEmail').value;
    const message = document.getElementById('complaintMessage').value;
    
    if (!type || !name || !phone || !message) {
        showNotification('Please fill in all required fields');
        return;
    }
    
    // Get existing complaints
    let complaints = JSON.parse(localStorage.getItem('pizzaInnComplaints')) || [];
    
    // Add new complaint
    complaints.push({
        id: 'COMP' + Date.now(),
        type,
        name,
        phone,
        email,
        message,
        status: 'submitted',
        date: new Date().toLocaleString()
    });
    
    localStorage.setItem('pizzaInnComplaints', JSON.stringify(complaints));
    
    // Reset form
    e.target.reset();
    
    showNotification('Complaint submitted successfully! We will contact you soon.');
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.searchOrder = searchOrder;
window.addItemToCart = addItemToCart;
