
document.addEventListener("DOMContentLoaded", function () {
    const timeFields = ['textHour', 'textMin', 'textSec'];

    timeFields.forEach(id => {
        const el = document.getElementById(id);

        // Restrict to numbers and max 2 digits
        el.addEventListener('input', () => {
            el.innerText = el.innerText.replace(/\D/g, '').slice(0, 2);
        });

        // On blur (when clicking away), pad with 0 if needed
        el.addEventListener('blur', () => {
            if (el.innerText.length === 1) {
                el.innerText = '0' + el.innerText;
            } else if (el.innerText === '') {
                el.innerText = '00';
            }
        });
    });

    // Button events
    const descText = document.getElementById('descText');
    let sparkleAudio = document.getElementById('sparkleAudio');
    let bellAudio = document.getElementById('bellAudio');

    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');

    // StopBtn disabled first
    stopBtn.setAttribute('disabled', true);
    stopBtn.style.opacity = '0.5';
    stopBtn.style.pointerEvents = 'none'; // allow clicks

    stopBtn.addEventListener('click', () => {
        stopClock();

        // Disable start, enable stop
        startBtn.setAttribute('disabled', false);
        startBtn.style.opacity = '1';
        startBtn.style.pointerEvents = 'auto';

        stopBtn.setAttribute('disabled', true);
        stopBtn.style.opacity = '0.5';
        stopBtn.style.pointerEvents = 'none'; // allow clicks
    });

    startBtn.addEventListener('click', () => {
        bellAudio.currentTime = 0;
        bellAudio.play();

        startClock();

        // Disable stop, enable start
        stopBtn.setAttribute('disabled', false);
        stopBtn.style.opacity = '1';
        stopBtn.style.pointerEvents = 'auto';

        startBtn.setAttribute('disabled', true);
        startBtn.style.opacity = '0.5';
        startBtn.style.pointerEvents = 'none'; // allow clicks
    });

    let countdownInterval = null;

    function startClock() {
        descText.innerHTML = `<span class="wave">${wrapWave("˗ˏˋ ★ ˎˊ˗ Stars are falling... ˗ˏˋ ★ ˎˊ˗")}</span>`;

        // Get values
        let hours = parseInt(document.getElementById('textHour').value) || 0;
        let minutes = parseInt(document.getElementById('textMin').value) || 0;
        let seconds = parseInt(document.getElementById('textSec').value) || 0;

        // Convert everything to seconds
        let totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Prevent multiple intervals
        if (countdownInterval) clearInterval(countdownInterval);

        countdownInterval = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(countdownInterval);
                startBtn.setAttribute('disabled', false);
                startBtn.style.opacity = '1';
                startBtn.style.pointerEvents = 'auto';

                descText.innerHTML = "˗ˏˋ ★ ˎˊ˗ Let the stars align! ˗ˏˋ ★ ˎˊ˗"

                // StopBtn disabled 
                stopBtn.setAttribute('disabled', true);
                stopBtn.style.opacity = '0.5';
                stopBtn.style.pointerEvents = 'none'; // allow clicks
                document.title = "Time's up!";
                sparkleAudio.currentTime = 0;
                sparkleAudio.play();

                // Time's up effect
                const clockText = document.getElementById('clockText');
                clockText.classList.add('time-up-effect');
                setTimeout(() => {
                    clockText.classList.remove('time-up-effect');
                }, 3000); // Remove after 3 seconds

                return;
            }

            totalSeconds--;

            // Convert back to h:m:s
            let hrs = Math.floor(totalSeconds / 3600);
            let mins = Math.floor((totalSeconds % 3600) / 60);
            let secs = totalSeconds % 60;

            // Update display
            document.getElementById('textHour').value = hrs.toString().padStart(2, '0');
            document.getElementById('textMin').value = mins.toString().padStart(2, '0');
            document.getElementById('textSec').value = secs.toString().padStart(2, '0');

            document.title = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }, 1000);
    }

    function stopClock() {
        if (countdownInterval) {
            descText.innerHTML = "˗ˏˋ ★ ˎˊ˗ Stars are resting... ˗ˏˋ ★ ˎˊ˗"

            clearInterval(countdownInterval);
            countdownInterval = null;

            document.title = "Pausing...";
        }
    }

    function wrapWave(text) {
        return text.split('').map((char, i) => {
            // Replace space with non-breaking space
            const safeChar = char === ' ' ? '&nbsp;' : char;
            return `<span style="animation-delay:${i * 0.05}s">${safeChar}</span>`;
        }).join('');
    }

    function spawnSparkles(count) {
        const sparkleBg = document.getElementById('sparkle-bg');

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('img');
            sparkle.src = './img/sparkle.png';
            sparkle.className = 'sparkle';

            // Random position
            sparkle.style.left = Math.random() * 100 + 'vw';
            sparkle.style.top = Math.random() * 100 + 'vh';

            // Random animation delay
            sparkle.style.animationDelay = (Math.random() * 10) + 's';

            sparkleBg.appendChild(sparkle);
        }
    }

    spawnSparkles(50);
});
