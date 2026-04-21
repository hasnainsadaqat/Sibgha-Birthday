// Login-specific script - hearts + login logic (loaded before main script.js to avoid override)
function createHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    document.querySelector('.hearts-container').appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}
const heartInterval = setInterval(createHeart, 300);

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;
            if ((
            user === 'admin' || user === 'sibgha') && pass === 'sibgha') {
                sessionStorage.setItem('loggedIn', 'true');
                sessionStorage.setItem('username', user);
                window.location.href = 'sibgha.html';
            } else {
                clearInterval(heartInterval);
                document.body.classList.add('shake');
                const fuckyou = document.getElementById('fuckyou');
                if (fuckyou) fuckyou.classList.remove('hidden');
                setTimeout(() => {
                    document.body.classList.remove('shake');
                }, 1000);
            }
        });
    }
});
