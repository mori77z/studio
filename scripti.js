//Zurück-Funktion mit Fallback
function goBack() {
    if (document.referrer && document.referrer.includes('moritzgauss.com')) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.querySelector(".text-me");
    let isFlipping = false;

    function randomChar() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function glitchText(duration = 300) {
        if (isFlipping) return; 
        isFlipping = true;

        const textBeforeClock = "Now ";
        const textAfterClock = " is the perfect time to send me a message!";

        let scrambledBefore = textBeforeClock.split("").map(char => 
            char === " " ? " " : randomChar()
        ).join("");

        let scrambledAfter = textAfterClock.split("").map(char => 
            char === " " ? " " : randomChar()
        ).join("");

        // Set the new scrambled text while keeping the clock untouched
        textElement.innerHTML = `
            ${scrambledBefore}<span id="hours">${document.getElementById('hours').textContent}</span>:<span id="minutes">${document.getElementById('minutes').textContent}</span>:<span id="seconds">${document.getElementById('seconds').textContent}</span>${scrambledAfter}
        `;

        setTimeout(() => {
            textElement.innerHTML = `
                Now <span id="hours">${document.getElementById('hours').textContent}</span>:<span id="minutes">${document.getElementById('minutes').textContent}</span>:<span id="seconds">${document.getElementById('seconds').textContent}</span> is the perfect time to send me a message!
            `;
            isFlipping = false;
        }, duration);
    }

    // Glitch only on significant scroll (50px movement)
    let lastScrollTop = 0;
    window.addEventListener("scroll", function () {
        let currentScroll = window.scrollY;
        if (Math.abs(currentScroll - lastScrollTop) > 50) {
            glitchText();
            lastScrollTop = currentScroll;
        }
    });

    // Keep the clock ticking
    function updateClock() {
        const now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        let seconds = now.getSeconds().toString().padStart(2, '0');

        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (hoursEl && minutesEl && secondsEl) {
            hoursEl.textContent = hours;
            minutesEl.textContent = minutes;
            secondsEl.textContent = seconds;
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
});

// Datumsauswahl auf Werktage & korrekten Starttag beschränken
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');

if (dateInput) {
    function getNextValidDate() {
        let today = new Date();
        if (today.getHours() >= 16) {
            today.setDate(today.getDate() + 1);
        }
        while (today.getDay() === 0 || today.getDay() === 6) {
            today.setDate(today.getDate() + 1);
        }
        return today.toISOString().split("T")[0];
    }

    dateInput.setAttribute("min", getNextValidDate());

    dateInput.addEventListener('input', function () {
        if (!this.value) return;

        const selectedDate = new Date(this.value);
        const day = selectedDate.getDay();

        if (day === 0 || day === 6) {
            alert("Please choose a weekday (Monday - Friday).");
            this.value = "";
            if (timeSelect) timeSelect.disabled = true;
        } else {
            if (timeSelect) timeSelect.disabled = false;
        }
    });
}

// Zeitauswahl von 10-16 Uhr in 15-Minuten-Schritten
if (timeSelect) {
    function populateTimeOptions() {
        timeSelect.innerHTML = "";
        for (let hour = 10; hour <= 16; hour++) {
            for (let min = 0; min < 60; min += 15) {
                let timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                let option = new Option(timeStr, timeStr);
                timeSelect.appendChild(option);
            }
        }
    }
    populateTimeOptions();
}

// E-Mail-Button mit Datum & Uhrzeit
const emailBtn = document.getElementById('whatsapp-btn');

if (emailBtn) {
    emailBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (!dateInput || !timeSelect) return;

        let selectedDate = dateInput.value;
        let selectedTime = timeSelect.value;

        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time.");
            return;
        }

        let dateParts = selectedDate.split("-");
        let formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        let lang = navigator.language || navigator.userLanguage;
        let isGerman = lang.startsWith("de");

        let subject = isGerman ? "Anfrage für einen Call" : "Request for a first Call";
        let body = isGerman
            ? `Hey Moritz,%0D%0A%0D%0AIch würde gerne ein Gespräch vereinbaren am ${formattedDate} um ${selectedTime}.%0D%0A%0D%0ALiebe Grüße,%0D%0A[Ihr Name / Firma / E-Mail-Adresse]`
            : `Hey Moritz,%0D%0A%0D%0AI would like to schedule a call with you on ${formattedDate} at ${selectedTime}.%0D%0A%0D%0ABest regards,%0D%0A[Your Name / Company / Email Address]`;

        let mailtoLink = `mailto:moritzgg99@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    });
}

const coverFlow = document.querySelector("#coverFlow .coverflow-track");
const items = document.querySelectorAll("#coverFlow .coverflow-item");
let index = Math.floor(items.length / 2);
let startX = 0;
let currentX = 0;
let isDragging = false;

const flipSound = new Audio("flip.mp3"); // Füge deine Sounddatei ein

function updateCoverFlow() {
    const containerWidth = document.querySelector("#coverFlow").offsetWidth;
    const itemWidth = items[0].offsetWidth;
    const centerOffset = (containerWidth - itemWidth) / 2;

    items.forEach((item, i) => {
        let offset = i - index;
        let scale = 1 - Math.abs(offset) * 0.1;
        let rotateY = offset * 25; /* Weniger Rotation */
        let translateX = offset * 220 - centerOffset; 

        item.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
        item.style.opacity = 1 - Math.abs(offset) * 0.4;
        item.style.zIndex = -Math.abs(offset);
    });
}

function handleTouchStart(e) {
    if (!e.target.closest("#coverFlow")) return;
    startX = e.touches[0].clientX;
    isDragging = true;
}

function handleTouchMove(e) {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
}

function handleTouchEnd() {
    if (!isDragging) return;
    let diff = startX - currentX;

    if (diff > 50 && index < items.length - 1) {
        index++;
        flipSound.play(); // Sound abspielen
    } else if (diff < -50 && index > 0) {
        index--;
        flipSound.play(); // Sound abspielen
    }

    isDragging = false;
    requestAnimationFrame(updateCoverFlow);
}

coverFlow.addEventListener("touchstart", handleTouchStart);
coverFlow.addEventListener("touchmove", handleTouchMove);
coverFlow.addEventListener("touchend", handleTouchEnd);

updateCoverFlow();

// Touch-Event nur für Cover Flow aktivieren
document.querySelector("#coverFlow").addEventListener("touchstart", handleTouchStart, { passive: true });
document.querySelector("#coverFlow").addEventListener("touchmove", handleTouchMove, { passive: true });
document.querySelector("#coverFlow").addEventListener("touchend", handleTouchEnd);

updateCoverFlow();

/* WhatsApp-Button mit Datum & Uhrzeit
const whatsappBtn = document.getElementById('whatsapp-btn');

if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevents page jump since it's an <a> tag

        let selectedDate = dateInput.value;
        let selectedTime = timeSelect.value;

        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time.");
            return;
        }

        // Convert date format from YYYY-MM-DD to DD.MM.YYYY
        let dateParts = selectedDate.split("-");
        let formattedDate = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;

        // Detect browser language (default to English if not German)
        let lang = navigator.language || navigator.userLanguage;
        let isGerman = lang.startsWith("de");

        // Generate message based on detected language
        let message;
        if (isGerman) {
            message = `Hey Moritz, ich würde gerne ein Gespräch vereinbaren am ${formattedDate} um ${selectedTime}. Liebe Grüße, [Ihr Name / Firma / E-Mail-Adresse]`;
        } else {
            message = `Hey Moritz, I would like to schedule a call with you on ${formattedDate} at ${selectedTime}. Best regards, [Your Name / Company / Email Address]`;
        }

        let url = `https://wa.me/4915737365084?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });
}
*/