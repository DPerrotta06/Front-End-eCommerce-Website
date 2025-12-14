const regEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/gm;
const regPw = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&_])[A-Za-z\d@$!%?&_]{8,}$/gm;
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('Register-Form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const terms = document.getElementById('terms-and-conditions').checked;
        if (name.length < 3) {
            alert('Please enter your full name.');
            return;
        }
        if (!regEmail.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (!regPw.test(password)) {
            alert('Password must be at least one lowercase, at least one uppercase, at least one number, at least one special character and must have a length of at least 8.');
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
                    window.location.href = '../HTML/Login.html';
                } else {
                    document.cookie = `token=mock-token-123;path=/`;
                    alert('Registration successful (mock)');
                    window.location.href = '../HTML/Login.html';
                }
            })
            .catch(() => {
                document.cookie = `token=mock-token-123;path=/`;
                alert('Registration successful (offline demo mode)');
                window.location.href = '../HTML/Login.html';
            });
    });
});