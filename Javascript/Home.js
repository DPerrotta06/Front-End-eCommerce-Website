$(document).ready(function () {
    loadFeaturedProducts();
    updateCartCount();
    setupEventListeners();
});


function loadFeaturedProducts() {
    $.ajax({
        url: "../data/products.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            const products = data.products || data;
            const featuredProducts = products.slice(0, 6);
            displayProducts(featuredProducts);
        },
        error: function () {
            showNotification("Unable to load products", "error");
        }
    });
}


function displayProducts(products) {
    const container = $(".home-featured-section .category-container");
    container.find(".home-product-grid").remove();
    products.forEach(product => {
        const productHTML = `
            <div class="home-product-grid" data-product-id="${product.id}">
                <div class="home-product-card">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="home-product-data">
                    <h3 class="home-product-name">${product.name}</h3>
                    <p class="home-product-price">$${product.price.toFixed(2)}</p>
                    <button class="home-add-cart-btn" data-product-id="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.append(productHTML);
    });
}


function setupEventListeners() {
    $(document).on("click", ".home-add-cart-btn", function () {
        const productId = $(this).data("product-id");
        addToCart(productId);
    });
    $("#home-search-button").on("click", performSearch);
    $("#search").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
    $(".newsletter-button").on("click", subscribeNewsletter);
}


function addToCart(productId) {
    $.ajax({
        url: "../data/products.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            const products = data.products || data;
            const product = products.find(p => p.id == productId);

            if (!product) {
                showNotification("Product not found", "error");
                return;
            }

            let cart = getCart();
            const existingItem = cart.find(item => item.id == productId);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }

            saveCart(cart);
            updateCartCount();
            showNotification("Product added to cart!", "success");
        },
        error: function () {
            showNotification("Failed to add product", "error");
        }
    });
}


function getCart() {
    const cookie = getCookie("cart");
    return cookie ? JSON.parse(decodeURIComponent(cookie)) : [];
}


function saveCart(cart) {
    document.cookie =
        "cart=" +
        encodeURIComponent(JSON.stringify(cart)) +
        "; path=/; max-age=604800";
}


function updateCartCount() {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => (total += item.quantity));
    $("#home-shoppingcart span").text(total);
}


function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}


function performSearch() {
    const query = $("#search").val().trim();
    if (!query) {
        showNotification("Please enter a search term", "error");
        return;
    }
    window.location.href =
        "Product Listing Page.html?search=" + encodeURIComponent(query);
}


function subscribeNewsletter() {
    const email = $("#newsletterEmail").val().trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !regex.test(email)) {
        showNotification("Enter a valid email", "error");
        return;
    }

    showNotification("Thanks for subscribing!", "success");
    $("#newsletterEmail").val("");
}


function showNotification(message, type) {
    $(".notification").remove();

    const bg = type === "success" ? "#10b981" : "#ef4444";
    const note = $("<div>")
        .addClass("notification")
        .text(message)
        .css({
            position: "fixed",
            top: "20px",
            right: "20px",
            background: bg,
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "8px",
            fontWeight: "600",
            zIndex: 9999
        });

    $("body").append(note);

    setTimeout(() => note.fadeOut(300, () => note.remove()), 3000);
}
