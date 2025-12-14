function subscribeNewsletter() {
    const email = document.getElementById("newsletterEmail").value;
    if(!email.includes("@")) {
        alert("Please enter a valid email");
        return;
    }
    alert("Subscribed successfully (Demo)");
}
/*
const cart = JSON.parse(document.cookie.replace(/(?:(?:^|.*;\\s*)cart\\s*=\\s*([^;]*).*$)|^.*$/, "$1") || "[]");
document.querySelector(".cart-badger").textContent = cart.length;
*/