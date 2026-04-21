// JS for Sibgha Website - Countdown, Hearts, Birthday Song, Admin-Controlled Timer, Sibgha Enforcement

// Get dynamic target date (admin sets via localStorage)
function getTargetDate() {
    const stored = localStorage.getItem('targetDate');
    if (stored) {
        const date = new Date(stored);
        if (!isNaN(date.getTime())) return date.getTime();
    }
    // Default
    return new Date('2026-04-12T00:00:00+05:00').getTime();
}

// Floating Hearts (global)
function createHeart() {
    const heartsContainer = document.querySelector('.hearts-container') || document.body;
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.className = 'heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
    heartsContainer.appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

let heartInterval = setInterval(createHeart, 300);

// Main Countdown (for main page)
function updateCountdown() {
    const target = getTargetDate();
    const now = new Date().getTime();
    const distance = target - now;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
}

let mainCountdownInterval;

// Sibgha Timer Update (styled like main)
function updateSibghaTimer(el) {
    const target = getTargetDate();
    const now = new Date().getTime();
    const distance = target - now;
    if (distance <= 0) {
        if (el && el.parentElement) el.parentElement.remove();
        location.reload();
        return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (el) el.innerHTML = `
        <span>${days.toString().padStart(2,'0')}<span style="font-size:0.6em;"> Days</span></span>
        <span>${hours.toString().padStart(2,'0')}<span style="font-size:0.6em;"> Hours</span></span>
        <span>${minutes.toString().padStart(2,'0')}<span style="font-size:0.6em;"> Min</span></span>
        <span>${seconds.toString().padStart(2,'0')}<span style="font-size:0.6em;"> Sec</span></span>
    `;
}

// Admin UI injection (calendar + image upload) - only for admin
function injectAdminPanel() {
    const username = sessionStorage.getItem('username') || '';
    if (username !== 'admin') return;

    const adminDiv = document.createElement('div');
    adminDiv.innerHTML = `
        <section class="admin-panel" style="max-width:900px;margin:40px auto;padding:30px;background:rgba(255,255,255,0.95);backdrop-filter:blur(15px);border-radius:25px;box-shadow:0 20px 60px rgba(0,0,0,0.2);text-align:center;border:2px solid #FF1493;">
            <h2 style="color:#FF1493;margin-bottom:20px;">Admin Panel 👑</h2>
<div style="display:flex;flex-direction:column;gap:20px;">
                <div>
                    <label>Set Timer Date & Time 📅⏰</label>
                    <input type="date" id="admin-date" style="padding:12px;border:2px solid #FFC0CB;border-radius:10px;margin-right:5px;">
                    <input type="time" id="admin-time" style="padding:12px;border:2px solid #FFC0CB;border-radius:10px;">
                    <button onclick="setTargetDateTime()" style="padding:12px 20px;background:#FF69B4;color:white;border:none;border-radius:10px;cursor:pointer;">Set</button>
                    <p id="current-date" style="color:#666;margin-top:5px;"></p>
                </div>
                <div>
                    <label>Upload Picture for Monkey Page 🖼️ (replace first img)</label>
                    <input type="file" id="admin-pic" accept="image/*" style="padding:12px;border:2px solid #FFC0CB;border-radius:10px;">
                    <button onclick="setAdminPic()" style="padding:12px 20px;background:#FF1493;color:white;border:none;border-radius:10px;cursor:pointer;">Upload</button>
                    <p id="current-pic" style="color:#666;margin-top:5px;">Current saved.</p>
                </div>
            </div>
        </section>
    `;
    const mainContent = document.querySelector('#main-content') || document.body;
    mainContent.insertBefore(adminDiv, mainContent.firstChild);
    // Init date
    const dateInput = document.getElementById('admin-date');
    dateInput.valueAsDate = new Date(localStorage.getItem('targetDate') || '2026-04-12');
    document.getElementById('current-date').textContent = `Target: ${new Date(getTargetDate()).toLocaleDateString()}`;
    // Init pic status
    document.getElementById('current-pic').textContent = localStorage.getItem('adminPic') ? 'Pic saved.' : 'No pic saved.';
}

// Set target date
function setTargetDate() {
    const input = document.getElementById('admin-date');
    const dateStr = input.value;
    if (dateStr) {
        localStorage.setItem('targetDate', new Date(dateStr + 'T00:00:00+05:00').toISOString());
        alert('Date updated!');
        document.getElementById('current-date').textContent = `Target: ${new Date(getTargetDate()).toLocaleDateString()}`;
    }
}

// Set admin pic (base64)
function setAdminPic() {
    const input = document.getElementById('admin-pic');
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            localStorage.setItem('adminPic', e.target.result);
            alert('Picture uploaded! Reload monkey.html to see.');
            document.getElementById('current-pic').textContent = 'Pic saved.';
        };
        reader.readAsDataURL(file);
    }
}

// Set target date (admin)
function setTargetDateTime() {
    const dateInput = document.getElementById('admin-date');
    const timeInput = document.getElementById('admin-time');
    const dateStr = dateInput.value;
    const timeStr = timeInput.value;
    if (dateStr) {
        const dateTimeStr = dateStr + 'T' + timeStr + ':00+05:00';
        localStorage.setItem('targetDate', new Date(dateTimeStr).toISOString());
        alert('Date & Time updated!');
        document.getElementById('current-date').textContent = `Target: ${new Date(getTargetDate()).toLocaleString()}`;
    }
}

// Enforce for Sibgha
function enforceSibghaTimer() {
    const loggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const username = sessionStorage.getItem('username') || '';
    const now = new Date().getTime();
    const target = getTargetDate();

    if (!loggedIn || username !== 'Sibgha' || now >= target) {
        // Allow normal (start countdown, admin panel if admin)
        if (!mainCountdownInterval) {
            mainCountdownInterval = setInterval(updateCountdown, 1000);
            updateCountdown();
        }
        injectAdminPanel();
        // Load admin pic on monkey page
        const picImg = document.getElementById('admin-pic-img');
        if (picImg) {
            const picData = localStorage.getItem('adminPic');
            if (picData) picImg.src = picData;
        }
        return;
    }

    // Sibgha pre-date: full timer
    document.body.innerHTML = `
        <div class="hearts-container" style="position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;"></div>
        <div id="sibgha-timer-full" style="position:fixed;top:0;left:0;width:100vw;height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;background:linear-gradient(135deg,#FFB6C1,#FF69B4);color:white;font-family:'Georgia',serif;z-index:10000;">
            <h1 style="font-size:clamp(2.5em,12vw,5em);margin-bottom:20px;text-shadow:0 0 20px #FF1493;">Welcome Sibgha! ⏳💖</h1>
            <p style="font-size:1.5em;max-width:80%;margin-bottom:40px;">Wait for your birthday surprise...</p>
            <div id="sibgha-countdown" style="font-size:clamp(4em,20vw,10em);font-weight:bold;display:flex;justify-content:center;gap:10px;flex-wrap:wrap;text-shadow:0 0 30px #FF1493;"></div>
            <p style="font-size:1.2em;opacity:0.9;">Time remaining</p>
            <button onclick="logout()" style="margin-top:30px;padding:15px 30px;font-size:1.2em;background:#FF1493;color:white;border:none;border-radius:50px;cursor:pointer;box-shadow:0 10px 30px rgba(255,20,147,0.5);">Logout 💕</button>
        </div>
        <style>
            @keyframes pulse {0%,100%{transform:scale(1);}50%{transform:scale(1.05);}}
            .heart {position:absolute;top:100%;color:#FF69B4;font-size:20px;pointer-events:none;animation:float-up 4s linear forwards;}
            @keyframes float-up {to{top:-100px;opacity:0;}}
            #sibgha-countdown span {background:linear-gradient(45deg,#FF69B4,#FFC0CB);padding:15px;border-radius:15px;min-width:120px;text-align:center;box-shadow:0 10px 30px rgba(255,105,180,0.5);}
            #sibgha-countdown span span {font-size:0.5em;display:block;}
        </style>
    `;
    heartInterval = setInterval(createHeart, 300);
    const countdownEl = document.getElementById('sibgha-countdown');
    setInterval(() => updateSibghaTimer(countdownEl), 1000);
    updateSibghaTimer(countdownEl);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    // Auto-play welcome MP4 audio FIRST, before any body replacement
    const welcomeSong = document.getElementById('welcome-audio');
    if (welcomeSong) {
welcomeSong.volume = 0.8;
        welcomeSong.play().catch(e => console.log('Autoplay prevented:', e));
    }

    enforceSibghaTimer();
});

// Photo Modal
function openModal(src) {
    const modal = document.getElementById('modal');
    if (modal) {
        const modalImg = document.getElementById('modal-img');
        modal.style.display = 'block';
        if (modalImg) modalImg.src = src;
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};

// Birthday Song
function initSong() {
    const songButton = document.getElementById('play-song');
    const lyricsDiv = document.getElementById('lyrics');
    if (!songButton || !lyricsDiv) return;

    const birthdayLyrics = `💖 Happy Birthday to You 💖
🎵 Happy Birthday to You 🎵
🌹 Happy Birthday Dear Sibgha 🌹
💕 Happy Birthday to You! 💕

I love you forever! ❤️`;

    let audioContext;
    songButton.addEventListener('click', () => {
        if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const notes = [392,392,440,392,523,494,466,466,440,466,587,523,392,392,440,392,523,494,784,740,698,659];
        let time = 0;
        notes.forEach(freq => {
            setTimeout(() => playNote(freq, 0.3), time * 500);
            time++;
        });
        lyricsDiv.textContent = birthdayLyrics;
        lyricsDiv.classList.remove('hidden');
        setTimeout(() => lyricsDiv.classList.add('hidden'), 10000);
    });
}

function playNote(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Sibgha Voice Player\nfunction playVoice() {\n    const audio = document.getElementById('sibgha-voice');\n    const btn = document.getElementById('voice-btn');\n    if (!audio) return;\n    if (audio.paused) {\n        audio.volume = 0.6;\n        audio.play().catch(e => console.log('Voice autoplay prevented:', e));\n        btn.textContent = '⏸️ Pause Voice ⏸️';\n    } else {\n        audio.pause();\n        btn.textContent = '🎤 Sibgha Voice 🎤';\n    }\n}\n\n// Logout\nfunction logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Auto-init song/modal
