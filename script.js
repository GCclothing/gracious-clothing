// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = document.getElementById('cart-count');
let cartLink = document.getElementById('cart-link');

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems || '0';
        // Also update localStorage for cart count
        localStorage.setItem('cartCount', (totalItems || 0).toString());
    }
}

function addToCart(productName, price, size, color, image) {
    const existingItem = cart.find(item => item.name === productName && item.size === size && item.color === color);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: parseFloat(price), size, color, image, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    showNotification(`${productName} added to cart!`, 'success');
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function updateCartDropdown() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (!cartDropdown) return;

    if (cart.length === 0) {
        cartDropdown.innerHTML = '<div class="cart-dropdown-item empty">Your cart is empty</div>';
        return;
    }

    let total = 0;
    cartDropdown.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-dropdown-item">
                <img src="${item.image}" alt="${item.name}" class="dropdown-item-image">
                <div class="dropdown-item-details">
                    <div class="dropdown-item-name">${item.name}</div>
                    <div class="dropdown-item-info">Size: ${item.size} | Color: ${item.color}</div>
                    <div class="dropdown-item-price">${item.price.toFixed(0)} kr × ${item.quantity}</div>
                </div>
                <button class="dropdown-remove-btn" onclick="removeFromCart('${item.name}', '${item.size}', '${item.color}')">×</button>
            </div>
        `;
    }).join('') + `
        <div class="cart-dropdown-total">
            <strong>Total: ${total.toFixed(0)} kr</strong>
            <a href="cart.html" class="dropdown-view-cart">View Cart</a>
        </div>
    `;
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to get started!</p>
                <a href="products.html">Continue Shopping</a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    let total = 0;
    cartItemsContainer.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Size: ${item.size}</p>
                    <p>Color: ${item.color}</p>
                    <p>Price: ${item.price.toFixed(0)} kr</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="changeQuantity('${item.name}', '${item.size}', '${item.color}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity('${item.name}', '${item.size}', '${item.color}', 1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.name}', '${item.size}', '${item.color}')">Remove</button>
            </div>
        `;
    }).join('');

    if (cartSummary) {
        cartSummary.innerHTML = `
            <h2>Order Summary</h2>
            <p>Subtotal: <span>${total.toFixed(0)} kr</span></p>
            <p>Shipping: <span>50 kr</span></p>
            <p class="total">Total: <span>${(total + 50).toFixed(0)} kr</span></p>
        `;
        cartSummary.style.display = 'block';
    }

    if (checkoutBtn) {
        checkoutBtn.disabled = false;
        checkoutBtn.onclick = function() {
            alert('Checkout functionality would be implemented here!');
        };
    }
}

function changeQuantity(productName, size, color, change) {
    const item = cart.find(item => item.name === productName && item.size === size && item.color === color);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName, size, color);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
            displayCart();
        }
    }
}

function removeFromCart(productName, size, color) {
    cart = cart.filter(item => !(item.name === productName && item.size === size && item.color === color));
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    displayCart();
}

// Add to cart functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product');
        const productName = product.querySelector('h3').textContent;
        const price = product.querySelector('p').textContent.replace(' kr', '');
        const size = product.querySelector('.size').value;
        const color = product.querySelector('.color').value;
        const image = product.querySelector('img').src;
        addToCart(productName, price, size, color, image);
    });
});

// Contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    showNotification('Message sent successfully!', 'success');
    this.reset();
});



// Fade in on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.product, .shop h2, .contact h2').forEach(el => observer.observe(el));

// Additional animations
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideDown 1s ease-out';
        }
    });
});

document.querySelectorAll('.hero-content h1').forEach(el => heroObserver.observe(el));

// Lazy loading for images
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            observer.unobserve(img);
        }
    });
}, { threshold: 0.1 });

// Initialize cart count and dropdown on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage for persistence across pages and refreshes
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Load cart count from localStorage if available
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount && cartCount) {
        cartCount.textContent = savedCartCount;
    } else {
        updateCartCount();
    }

    // Initialize cart dropdown
    updateCartDropdown();

    // Lazy loading for images
    document.querySelectorAll('img.lazy').forEach(img => {
        lazyImageObserver.observe(img);
    });

    // Manually add 'loaded' to images already in or near viewport
    document.querySelectorAll('img.lazy').forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            img.classList.add('loaded');
        }
    });

    // Hide preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// Cart link click
if (cartLink) {
    cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'cart.html';
    });
}

// Cart dropdown hover functionality
document.addEventListener('DOMContentLoaded', function() {
    const cartContainer = document.querySelector('.cart');
    if (cartContainer) {
        cartContainer.addEventListener('mouseenter', function() {
            updateCartDropdown();
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown) {
                dropdown.style.display = 'block';
                setTimeout(() => {
                    dropdown.classList.add('show');
                }, 10);
            }
        });

        cartContainer.addEventListener('mouseleave', function() {
            const dropdown = document.getElementById('cart-dropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
                setTimeout(() => {
                    dropdown.style.display = 'none';
                }, 300);
            }
        });
    }
});


// Cart page functionality
if (window.location.pathname.includes('cart.html')) {
    displayCart();
}



// Make functions global for onclick handlers
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;

// Profile picture upload functionality
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('profile_pic');
    const profileImage = document.getElementById('profileImage');

    if (uploadArea && fileInput) {
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, unhighlight, false);
        });

        // Handle dropped files
        uploadArea.addEventListener('drop', handleDrop, false);

        // Handle file input change
        fileInput.addEventListener('change', handleFiles, false);

        // Click to open file dialog
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        function highlight() {
            uploadArea.classList.add('highlight');
        }

        function unhighlight() {
            uploadArea.classList.remove('highlight');
        }

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles({ target: { files } });
        }

        function handleFiles(e) {
            const files = [...e.target.files];
            files.forEach(uploadFile);
        }

        function uploadFile(file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                showNotification('Please select an image file!', 'error');
                return;
            }

            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB!', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                if (profileImage) {
                    profileImage.src = e.target.result;
                }
                showNotification('Profile picture updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    }
});
