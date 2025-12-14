$(document).ready(function () {
    loadOrderDetails();
    updateCartCount();
});


function loadOrderDetails() {
    const order = JSON.parse(localStorage.getItem("latestOrder"));
    if (!order) {
        $("#order-items-list").html("<p>No order found.</p>");
        return;
    }
    $("#order-num span").text(order.orderId);
    const orderDate = new Date(order.date);
    const deliveryDate = getEstimatedDelivery(order.delivery, orderDate);
    $("#estimated-delivery span").text(
        `Your order should arrive on: ${deliveryDate}`
    );
    let subtotal = 0;
    $("#order-items-list").empty();
    order.items.forEach(item => {
        subtotal += item.price * item.quantity;
        $("#order-items-list").append(`
            <div class="order-item">
                <p><strong>${item.name}</strong></p>
                <p>Price: $${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
            </div>
        `);
    });
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    $("#sub-price").text(`$${subtotal.toFixed(2)}`);
    $("#tax-price").text(`$${tax.toFixed(2)}`);
    $("#toatl-price").text(`$${total.toFixed(2)}`);
}


function getEstimatedDelivery(type, date) {
    let days = 5;
    if (type === "same-day") days = 1;
    if (type === "regular") days = 3;
    if (type === "not-rush") days = 7;
    const delivery = new Date(date);
    delivery.setDate(delivery.getDate() + days);
    return delivery.toDateString();
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").text(count);
}
