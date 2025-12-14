$(document).ready(function () {
    const productId = getProductIdFromURL();
    if (!productId) {
        alert("Product not found");
        return;
    }
    loadProduct(productId);
    setupQuantityButtons();
    updateCartCount();
});


function loadProduct(productId) {
    $.ajax({
        url: "../data/products.json",
        method: "GET",
        dataType: "json",
        success: function (data) {
            const products = data.products || data;
            const product = products.find(p => p.id == productId);
            if (!product) {
                alert("Product not found");
                return;
            }
            populateProduct(product);
            loadRelatedProducts(products, product);
            loadReviews(product.id);
        }
    });
}


function populateProduct(product) {
    $("#product-title").text(product.name);
    $(".price-value").text(`$${product.price.toFixed(2)}`);
    $("#product-description p").text(product.description);
    $("#product-sku").text(product.sku || product.id);
    $("#product-category").text(product.category);
    $("#product-name-breadcrumb").text(product.name);
    $("#main-product-image").attr("src", product.image);
    $("#add-to-cart-btn").on("click", function () {
        addToCart(product);
    });
}


function setupQuantityButtons() {
    $("#increase").on("click", function () {
        let qty = parseInt($("#quantity").val());
        if (qty < 10) $("#quantity").val(qty + 1);
    });
    $("#decrease").on("click", function () {
        let qty = parseInt($("#quantity").val());
        if (qty > 1) $("#quantity").val(qty - 1);
    });
}


function addToCart(product) {
    const quantity = parseInt($("#quantity").val());
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart!");
}


function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(count);
}


function loadReviews(productId) {
    $.ajax({
        url: "../data/reviews.json",
        method: "GET",
        dataType: "json",
        success: function (reviews) {
            const productReviews = reviews.filter(r => r.productId == productId);
            $(".big-rating").text(calculateAverage(productReviews));
            $(".reviews-summary p").text(`Based on ${productReviews.length} reviews`);
            $(".rating-text").text(`(${calculateAverage(productReviews)} out of 5) | ${productReviews.length} reviews`);
            $("#customer-reviews").empty();
            productReviews.forEach(review => {
                $("#customer-reviews").append(`
                    <div class="review-card">
                        <div class="review-header">
                            <span class="review-author">${review.author}</span>
                        </div>
                        <h4 class="review-title">${review.title}</h4>
                        <p class="user-review">${review.comment}</p>
                    </div>
                `);
            });
        }
    });
}


function calculateAverage(reviews) {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
}


function loadRelatedProducts(products, currentProduct) {
    const related = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4);
    $(".suggested-item").each(function (index) {
        const product = related[index];
        if (!product) return;
        $(this).find("img").attr("src", product.image);
        $(this).find(".suggested-product-title").text(product.name);
        $(this).find(".suggested-price").text(`$${product.price.toFixed(2)}`);
        $(this).find(".view-details-btn").on("click", function () {
            window.location.href = `Product Details Page.html?id=${product.id}`;
        });
    });
}


function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}
