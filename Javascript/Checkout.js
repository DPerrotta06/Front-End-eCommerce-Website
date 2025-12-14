$(document).ready(function () {
    loadCartItems();
    updateCartCount();
    $("input[name='delivery-option']").on("change", calculateTotals);
    $("#order-btn").on("click", placeOrder);
});


function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
        $("#item-cart-list").html("<p>Your cart is empty.</p>");
        return;
    }
    $("#item-cart-list").empty();
    cart.forEach(item => {
        $("#item-cart-list").append(`
            <div class="checkout-item">
                <h4>${item.name}</h4>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `);
    });
    calculateTotals();
}


function calculateTotals() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    let deliveryFee = getDeliveryFee();
    let tax = subtotal * 0.15; // 15% tax
    let total = subtotal + tax + deliveryFee;
    $("#sub-price").text(`$${subtotal.toFixed(2)}`);
    $("#tax-price").text(`$${tax.toFixed(2)}`);
    $("#toatl-price").text(`$${total.toFixed(2)}`);
}


function getDeliveryFee() {
    if ($("#same-day").is(":checked")) return 15;
    if ($("#regular").is(":checked")) return 5;
    if ($("#not-rush").is(":checked")) return 0;
    return 0;
}


function placeOrder() {
    if (!validateForm()) {
        alert("Please complete all required fields.");
        return;
    }
    const order = {
        orderId: "ORD-" + Date.now(),
        customer: {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phonenumber").val(),
            address: $("#checkout-address").val()
        },
        delivery: $("input[name='delivery-option']:checked").attr("id"),
        items: JSON.parse(localStorage.getItem("cart")) || [],
        total: $("#toatl-price").text(),
        date: new Date().toLocaleString()
    };
    localStorage.setItem("latestOrder", JSON.stringify(order));
    localStorage.removeItem("cart");
    window.location.href = "Order Confirmation Page.html";
}


function validateForm() {
    if (!$("#name").val()) return false;
    if (!$("#email").val()) return false;
    if (!$("#checkout-address").val()) return false;
    if (!$("input[name='delivery-option']:checked").length) return false;
    return true;
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(count);
}
