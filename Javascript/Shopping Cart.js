$(document).ready(function () {
    renderCart();
    updateCartBadge();

    $("#clear-cart").on("click", clearCart);
    $("#checkout-btn").on("click",function() {
        if ($(this).prop("disabled")) return;
        window.location.href = "http://localhost/Front-End-eCommerce-Website/HTML/Checkout Page.html"
    });
});


function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = $("#cart-items-container");
    container.empty();
    if (cart.length === 0) {
        container.html(`
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
                <a href="Product Listing Page.html" class="continue-shopping">
                    Continue Shopping
                </a>
            </div>
        `);
        updateSummary(0);
        return;
    }
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        container.append(`
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" width="80">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p><strong>$${itemTotal.toFixed(2)}</strong></p>
                </div>
            </div>
        `);
    });
    updateSummary(subtotal);
}


function updateSummary(subtotal) {
    const shipping = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    $("#subtotal").text(`$${subtotal.toFixed(2)}`);
    $("#shipping").text(`$${shipping.toFixed(2)}`);
    $("#tax").text(`$${tax.toFixed(2)}`);
    $("#total").text(`$${total.toFixed(2)}`);
    $("#checkout-btn").prop("disabled", subtotal === 0);
}

function clearCart() {
    localStorage.removeItem("cart");
    renderCart();
    updateCartBadge();
}


function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $(".cart-badger").text(count);
}
