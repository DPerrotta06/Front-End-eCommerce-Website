console.log("JS loaded!");
$(document).ready(function () {
    loadProducts();
    setupEventListeners();
    updateCartCount();
});


let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 6;


function loadProducts() {
    $.ajax({
        url: "../data/products.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            allProducts = data.products || data;
            applyFilters();
        },
        error: function () {
            alert("Failed to load products.");
        }
    });
}


function applyFilters() {
    const searchQuery = getSearchQuery();
    const maxPrice = $("#price-range").val();
    const selectedCategories = getSelectedCategories();
    filteredProducts = allProducts.filter(product => {
        const matchesSearch =
            !searchQuery || product.name.toLowerCase().includes(searchQuery);
        const matchesPrice = product.price <= maxPrice;
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);

        return matchesSearch && matchesPrice && matchesCategory;
    });
    applySorting();
}


function applySorting() {
    const sortValue = $("#sort-select").val();
    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }
    currentPage = 1;
    renderProducts();
}


function renderProducts() {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);
    $("#items-list").empty();
    productsToShow.forEach(product => {
        $("#items-list").append(`
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `);
    });
    updateCounts();
    renderPagination();
}


function updateCounts() {
    $("#current-product-count").text(filteredProducts.length);
    $("#total-product-count").text(allProducts.length);
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    $("#page-numbers").text(`Page ${currentPage} of ${totalPages}`);
    $("#prev-page").prop("disabled", currentPage === 1);
    $("#next-page").prop("disabled", currentPage === totalPages);
}


function addToCart(productId) {
    const product = allProducts.find(p => p.id == productId);
    if (!product) return;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id == productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#home-shoppingcart span").text(totalItems);
}


function setupEventListeners() {
    $("input[type=checkbox]").on("change", applyFilters);
    $("#price-range").on("input", function () {
        $("#max").text(this.value);
        applyFilters();
    });
    $("#sort-select").on("change", applySorting);
    $("#prev-page").on("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });
    $("#next-page").on("click", function () {
        const maxPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            renderProducts();
        }
    });
    $("#product-search-button").on("click", performSearch);
    $("#search").on("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
    $("#reset-filter").on("click", resetFilters);
    $(document).on("click", ".add-to-cart-btn", function () {
        const productId = $(this).data("id");
        addToCart(productId);
    });
}


function getSearchQuery() {
    const urlParams = new URLSearchParams(window.location.search);
    return (
        urlParams.get("search") ||
        $("#search").val().trim().toLowerCase()
    );
}


function performSearch() {
    const query = $("#search").val().trim();
    if (!query) return;
    window.location.href =
        "Product Listing Page.html?search=" + encodeURIComponent(query);
}


function getSelectedCategories() {
    const categories = [];
    if ($("#electronics-chkBox").is(":checked")) categories.push("Electronics");
    if ($("#home-chkBox").is(":checked")) categories.push("Home & Kitchen");
    if ($("#sports-chkBox").is(":checked")) categories.push("Sports & Outdoors");
    if ($("#beauty-chkBox").is(":checked")) categories.push("Beauty & Personal Care");
    if ($("#toys-chkBox").is(":checked")) categories.push("Toys & Games");
    if ($("#clothing-chkBox").is(":checked")) categories.push("Clothing");
    if ($("#auto-chkBox").is(":checked")) categories.push("Automotive");
    if ($("#office-chkBox").is(":checked")) categories.push("Office Supplies");
    if ($("#garden-chkBox").is(":checked")) categories.push("Garden & Outdoors");
    if ($("#pet-chkBox").is(":checked")) categories.push("Pet Supplies");
    return categories;
}


function resetFilters() {
    $("input[type=checkbox]").prop("checked", false);
    $("#price-range").val(1000);
    $("#max").text(1000);
    $("#sort-select").val("default");
    $("#search").val("");
    applyFilters();
}
