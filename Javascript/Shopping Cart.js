function subscribeNewsletter() {
    const email = document.getElementById("newsletterEmail").value;
    if(!email.includes("@")) {
        alert("Please enter a valid email");
        return;
    }
    alert("Subscribed successfully (Demo)");
}