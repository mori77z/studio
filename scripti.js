// Zurück-Funktion mit Fallback
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

        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    setInterval(updateClock, 1000);
    updateClock();
});


// Datumsauswahl auf Werktage & korrekten Starttag beschränken
const dateInput = document.getElementById('date');
const timeSelect = document.getElementById('time');

// Prüfen, ob Elemente existieren, bevor darauf zugegriffen wird
if (dateInput) {
    // Nächsten gültigen Tag als Minimum setzen
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
        const selectedDate = new Date(this.value);
        const day = selectedDate.getDay();

        if (day === 0 || day === 6) {
            alert("Please choose a weekday (Monday - Friday).");
            this.value = "";
            timeSelect.disabled = true;
        } else {
            timeSelect.disabled = false;
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

// WhatsApp-Button mit Datum & Uhrzeit
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
