document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Register-Form');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms').checked;

        /* ---------- VALIDATION ---------- */

        if (name.length < 3) {
            alert('Please enter your full name.');
            return;
        }

        if (!email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (!terms) {
            alert('You must agree to the terms and conditions.');
            return;
        }

        /* ---------- REQRES REGISTER API ---------- */
        fetch('https://reqres.in/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.token) {
                    document.cookie = `token=${data.token};path=/`;
                    alert('Registration successful!');
                    window.location.href = 'Login.html';
                } else {
                    alert('Registration failed (ReqRes demo limitation)');
                }
            })
            .catch(() => {
                alert('Network error. Please try again.');
            });
    });
});