/**
 * Main entry point for the Gracious Clothing website
 * This file contains all JavaScript functionality: utilities, cart management, and initialization
 */

/**
 * Show a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, info)
 */
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

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}



/**
 * Initialize fade in animations on scroll
 */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.product, .shop h2, .contact h2').forEach(el => observer.observe(el));

    // Additional animations for hero
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideDown 1s ease-out';
            }
        });
    });

    document.querySelectorAll('.hero-content h1').forEach(el => heroObserver.observe(el));
}

/**
 * Initialize hero parallax effect
 */
function initHeroParallax() {
    const heroLogo = document.querySelector('.hero-logo');
    const heroContent = document.querySelector('.hero-content');
    if (!heroLogo || !heroContent) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const logoRate = scrolled * -0.1; // Weaker rate for logo
        const contentRate = scrolled * -0.2; // Weaker for content
        heroLogo.style.transform = `translateY(${logoRate}px)`;
        heroContent.style.transform = `translateY(${contentRate}px)`;
    });
}

/**
 * Initialize hero fade-in on load
 */
function initHeroFadeIn() {
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay) {
        // Add animate class after a short delay to trigger CSS transition
        setTimeout(() => {
            heroOverlay.classList.add('animate');
        }, 100);
    }
}

/**
 * Update active navigation link based on scroll position
 */
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav ul li a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('main-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');

    if (hamburger && navMenu && mobileOverlay) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileOverlay.classList.toggle('show');
            hamburger.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu when clicking overlay
        mobileOverlay.addEventListener('click', () => {
            closeMobileMenu();
        });
    }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
    const navMenu = document.getElementById('main-nav');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const hamburger = document.getElementById('hamburger');
    if (navMenu && mobileOverlay) {
        navMenu.classList.remove('open');
        mobileOverlay.classList.remove('show');
        if (hamburger) hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Initialize page transitions
 */
function initPageTransitions() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Add fade-out to current visible sections
                sections.forEach(section => {
                    if (section.style.display !== 'none') {
                        section.classList.add('fade-out');
                    }
                });

                // After fade-out, scroll and fade-in target section
                setTimeout(() => {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    sections.forEach(section => {
                        section.classList.remove('fade-out');
                        section.classList.add('fade-in');
                    });

                    // Remove fade-in class after animation
                    setTimeout(() => {
                        sections.forEach(section => section.classList.remove('fade-in'));
                    }, 500);
                }, 300);
            }
        });
    });
}

/**
 * Initialize preloader functionality
 */
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Show preloader immediately
    preloader.style.display = 'flex';

    // Function to load an image
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => resolve(src); // Resolve even on error to not block preloader
            img.src = src;
        });
    };

    // Get all images on the page
    const images = Array.from(document.querySelectorAll('img')).map(img => img.src);

    // Add dynamic product images if on products page
    if (window.location.pathname.includes('products.html')) {
        // Wait for products to load first
        setTimeout(() => {
            const productImages = Array.from(document.querySelectorAll('#products-grid img')).map(img => img.src);
            images.push(...productImages);
            startPreloader(images);
        }, 100);
    } else {
        startPreloader(images);
    }

    function startPreloader(imageSources) {
        // Load all images
        const imagePromises = imageSources.map(src => loadImage(src));

        // Set timeout for preloader (max 5 seconds)
        const timeout = setTimeout(() => {
            hidePreloader();
        }, 5000);

        // Wait for all images to load or timeout
        Promise.all(imagePromises).then(() => {
            clearTimeout(timeout);
            hidePreloader();
        }).catch(() => {
            clearTimeout(timeout);
            hidePreloader();
        });
    }

    function hidePreloader() {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

/**
 * Initialize enhanced lazy loading with IntersectionObserver
 */
function initLazyLoading() {
    // For products page, preload all images immediately to avoid white placeholders
    if (window.location.pathname.includes('products.html')) {
        document.querySelectorAll('img.lazy').forEach(img => {
            if (img.dataset.src && img.src !== img.dataset.src) {
                img.src = img.dataset.src;
            }
            img.classList.add('loaded');
        });
        return; // Skip lazy loading for products page
    }

    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src && img.src !== img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('img.lazy').forEach(img => {
        lazyImageObserver.observe(img);
    });

    // Manually load and add 'loaded' to images already in or near viewport after short delay for preloader/layout
    setTimeout(() => {
        document.querySelectorAll('img.lazy').forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
                if (img.dataset.src && img.src !== img.dataset.src) {
                    img.src = img.dataset.src;
                }
                img.classList.add('loaded');
            }
        });
    }, 100);
}

// Cart functionality
// Check for localStorage availability, fallback to sessionStorage or in-memory
function getStorage() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return localStorage;
    } catch (e) {
        try {
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return sessionStorage;
        } catch (e) {
            return null; // In-memory only
        }
    }
}

const storage = getStorage();
let cart = storage ? JSON.parse(storage.getItem('cart')) || [] : [];
let cartCount = document.getElementById('cart-count');
let cartLink = document.getElementById('cart-link');

/**
 * Update the cart count display
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems || '0';
        // Also update storage for cart count
        if (storage) storage.setItem('cartCount', (totalItems || 0).toString());
    }
}

/**
 * Add an item to the cart
 * @param {string} productName - Name of the product
 * @param {string} price - Price of the product
 * @param {string} size - Size of the product
 * @param {string} color - Color of the product
 * @param {string} image - Image URL of the product
 */
function addToCart(productName, price, size, color, image) {
    const existingItem = cart.find(item => item.name === productName && item.size === size && item.color === color);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: parseFloat(price), size, color, image, quantity: 1 });
    }
    if (storage) storage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    showNotification(`${productName} added to cart!`, 'success');
}

/**
 * Update the cart dropdown display
 */
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

/**
 * Display the cart on the cart page
 */
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
            checkout();
        };
    }
}

/**
 * Change the quantity of an item in the cart
 * @param {string} productName - Name of the product
 * @param {string} size - Size of the product
 * @param {string} color - Color of the product
 * @param {number} change - Amount to change the quantity by
 */
function changeQuantity(productName, size, color, change) {
    const item = cart.find(item => item.name === productName && item.size === size && item.color === color);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productName, size, color);
        } else {
            if (storage) storage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartDropdown();
            displayCart();
        }
    }
}

/**
 * Remove an item from the cart
 * @param {string} productName - Name of the product
 * @param {string} size - Size of the product
 * @param {string} color - Color of the product
 */
function removeFromCart(productName, size, color) {
    cart = cart.filter(item => !(item.name === productName && item.size === size && item.color === color));
    if (storage) storage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDropdown();
    displayCart();
}

/**
 * Initialize cart functionality
 */
function initCart() {
    // Load cart from storage for persistence
    cart = storage ? JSON.parse(storage.getItem('cart')) || [] : [];

    // Load cart count from storage if available
    const savedCartCount = storage ? storage.getItem('cartCount') : null;
    if (savedCartCount && cartCount) {
        cartCount.textContent = savedCartCount;
    } else {
        updateCartCount();
    }

    // Initialize cart dropdown
    updateCartDropdown();

    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productName = product.querySelector('h3').textContent;
            const price = product.querySelector('p').textContent.replace(' kr', '');
            const size = product.querySelector('.size').value;
            const color = product.querySelector('.color').value;
            const image = product.querySelector('img').src;
            if (!size || !color) {
                showNotification('Please select size and color', 'error');
                return;
            }
            addToCart(productName, price, size, color, image);
        });
    });

    // Cart link click
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'cart.html';
        });
    }

    // Cart dropdown hover functionality
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

    // Initialize cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

/**
 * Checkout functionality
 */
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    // Simple checkout - just show a message and clear cart
    showNotification('Checkout successful! Thank you for your purchase.', 'success');
    cart = [];
    if (storage) storage.removeItem('cart');
    updateCartCount();
    updateCartDropdown();
    displayCart();
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize preloader first
    initPreloader();

    // Initialize lazy loading
    initLazyLoading();

    // Initialize utility functions
    initSmoothScrolling();
    initScrollAnimations();

    // Initialize new effects
    initHeroParallax();
    initHeroFadeIn();
    initMobileMenu();
    initPageTransitions();

    // Initialize cart functionality
    initCart();

    // Initialize contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Message sent successfully!', 'success');
            this.reset();
        });
    }

    // Initialize product loading (for products page)
    if (document.getElementById('products-grid')) {
        loadProducts();
    }

    // Initialize quick view modal
    const closeBtn = document.querySelector('.quick-view-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeQuickView);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('quick-view-modal');
        if (event.target === modal) {
            closeQuickView();
        }
    });

    console.log('Gracious Clothing website initialized successfully!');
});

// Add scroll event for active nav update
window.addEventListener('scroll', updateActiveNav);

/**
 * Load products from a hardcoded array
 */
function loadProducts() {
    const products = [
        {
            id: 1,
            name: 'Classic T-Shirt',
            price: 199,
            image_url: './Images/Image (3).png'
        },
        {
            id: 2,
            name: 'Vintage Hoodie',
            price: 399,
            image_url: './Images/Image (4).png'
        },
        {
            id: 3,
            name: 'Denim Jacket',
            price: 599,
            image_url: './Images/Image (3).png'
        },
        {
            id: 4,
            name: 'Polo Shirt',
            price: 250,
            image_url: './Images/Image (4).png'
        },
        {
            id: 5,
            name: 'Slim Jeans',
            price: 450,
            image_url: './Images/Image (3).png'
        },
        {
            id: 6,
            name: 'Leather Belt',
            price: 150,
            image_url: './Images/Image (4).png'
        },
        {
            id: 7,
            name: 'Cotton Pants',
            price: 350,
            image_url: './Images/Image (3).png'
        },
        {
            id: 8,
            name: 'Wool Sweater',
            price: 500,
            image_url: './Images/Image (4).png'
        }
    ];
    displayProducts(products);
}

/**
 * Open quick view modal for a product
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {string} image - Product image URL
 */
function openQuickView(name, price, image) {
    const modal = document.getElementById('quick-view-modal');
    const modalImage = document.getElementById('quick-view-image');
    const modalTitle = document.getElementById('quick-view-title');
    const modalPrice = document.getElementById('quick-view-price');
    const modalAddToCart = document.getElementById('quick-view-add-to-cart');

    if (modal && modalImage && modalTitle && modalPrice && modalAddToCart) {
        modalImage.src = image;
        modalImage.onerror = () => { modalImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='; };
        modalTitle.textContent = name;
        modalPrice.textContent = `${price.toFixed ? price.toFixed(0) : price} kr`;

        // Reset selects
        const quickViewSize = document.getElementById('quick-view-size');
        const quickViewColor = document.getElementById('quick-view-color');
        if (quickViewSize) quickViewSize.value = '';
        if (quickViewColor) quickViewColor.value = '';

        // Add ARIA to modal
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'quick-view-title');
        modal.setAttribute('aria-modal', 'true');

        // Add ARIA to selects if exist
        if (quickViewSize) quickViewSize.setAttribute('aria-label', `Select size for ${name}`);
        if (quickViewColor) quickViewColor.setAttribute('aria-label', `Select color for ${name}`);

        // Add to cart from modal
        modalAddToCart.setAttribute('aria-label', `Add ${name} to cart`);
        modalAddToCart.onclick = function() {
            const size = quickViewSize ? quickViewSize.value : '';
            const color = quickViewColor ? quickViewColor.value : '';
            if (!size || !color) {
                showNotification('Please select size and color', 'error');
                return;
            }
            addToCart(name, price.toFixed ? price.toFixed(0) : price, size, color, image);
            modal.style.display = 'none';
        };

        modal.style.display = 'block';
    }
}

/**
 * Close quick view modal
 */
function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * Display products on the products page
 * @param {Array} products - Array of product objects
 */
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product skeleton';
        productElement.innerHTML = `
            <img data-src="${product.image_url}" alt="${product.name}" class="lazy">
            <h3>${product.name}</h3>
            <p>${product.price.toFixed(0)} kr</p>
            <select class="size" aria-label="Select size for ${product.name}">
                <option value="">Select Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
            </select>
            <select class="color" aria-label="Select color for ${product.name}">
                <option value="">Select Color</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
                <option value="Black">Black</option>
            </select>
            <button class="add-to-cart" aria-label="Add ${product.name} to cart">Add to Cart</button>
        `;
        // Attach quick view only to the image
        const img = productElement.querySelector('img');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', `View details for ${product.name}`);
        img.onclick = () => openQuickView(product.name, product.price, product.image_url);
        // Remove skeleton when image loads or fails
        img.onload = () => { 
            console.log(`Image loaded successfully: ${product.image_url}`);
            productElement.classList.remove('skeleton'); 
        };
        img.onerror = () => { 
            console.error(`Image failed to load: ${product.image_url}`);
            // Set a simple placeholder without text if needed, but keep as is for now
            productElement.classList.remove('skeleton'); 
        };
        productsGrid.appendChild(productElement);
    });

    // Re-initialize lazy loading for new images
    initLazyLoading();

    // Re-initialize cart functionality for new products
    initCart();
}

// Make functions global
window.showNotification = showNotification;
window.initSmoothScrolling = initSmoothScrolling;
window.initScrollAnimations = initScrollAnimations;
window.initHeroParallax = initHeroParallax;
window.initHeroFadeIn = initHeroFadeIn;
window.updateActiveNav = updateActiveNav;
window.initMobileMenu = initMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.initPageTransitions = initPageTransitions;
window.updateCartCount = updateCartCount;
window.addToCart = addToCart;
window.updateCartDropdown = updateCartDropdown;
window.displayCart = displayCart;
window.changeQuantity = changeQuantity;
window.removeFromCart = removeFromCart;
window.initCart = initCart;
window.checkout = checkout;
window.loadProducts = loadProducts;
window.displayProducts = displayProducts;
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
