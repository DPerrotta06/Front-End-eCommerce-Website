document.addEventListener('DOMContentLoaded', () => {

    /* ---------- AUTH GUARD ---------- */
    const token = document.cookie.match(/token=([^;]+)/);
    if (!token) {
        window.location.href = 'Login.html';
        return;
    }

    /* ---------- CART BADGE ---------- */
    const cart = JSON.parse(
        document.cookie.replace(/(?:(?:^|.*;\\s*)cart\\s*=\\s*([^;]*).*$)|^.*$/, "$1") || "[]"
    );
    document.querySelector('.cart-badger').textContent = cart.length;

    /* ---------- LOAD PROFILE (ReqRes) ---------- */
    fetch('https://reqres.in/api/users/2')
        .then(res => res.json())
        .then(data => {
            const user = data.data;

            const profileData = {
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            };

            loadProfile(profileData);
        });

    /* ---------- COOKIE LOAD ---------- */
    const savedProfile = document.cookie.match(/profile=([^;]+)/);
    if (savedProfile) {
        loadProfile(JSON.parse(decodeURIComponent(savedProfile[1])));
    }

    function loadProfile(data) {
        document.getElementById('profile-name').textContent =
            `${data.firstName || ''} ${data.lastName || ''}`.trim();

        document.getElementById('profile-email').textContent = data.email || '';

        document.getElementById('first-name').value = data.firstName || '';
        document.getElementById('last-name').value = data.lastName || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('birthdate').value = data.birthdate || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('city').value = data.city || '';
        document.getElementById('postal-code').value = data.postalCode || '';
    }

    /* ---------- SAVE PROFILE ---------- */
    document.getElementById('profile-form').addEventListener('submit', e => {
        e.preventDefault();

        const profile = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            birthdate: document.getElementById('birthdate').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postal-code').value
        };

        document.cookie = `profile=${encodeURIComponent(JSON.stringify(profile))};path=/`;
        alert('Profile updated (saved locally).');
        loadProfile(profile);
    });

    /* ---------- CANCEL ---------- */
    document.getElementById('cancel-btn').addEventListener('click', () => {
        location.reload();
    });

    /* ---------- NEWSLETTER ---------- */
    document.getElementById('newsletterBtn').addEventListener('click', () => {
        const email = document.getElementById('newsletterEmail').value;
        if (!email.includes('@')) {
            alert('Please enter a valid email');
            return;
        }
        alert('Subscribed successfully (demo)');
    });

});