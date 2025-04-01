//Zurück-Funktion mit Fallback
function goBack() {
    if (document.referrer && document.referrer.includes('moritzgauss.com')) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const moritzElement = document.querySelector(".moritz");
    if (!moritzElement) {
        console.error("Element '.moritz' not found!");
        return;
    }

    let isFlipping = false;
    const originalHTML = moritzElement.innerHTML; // Store original styled HTML

    function randomChar() {
        const symbols = "✪✹❦♬♪♩★❥✱♫♠♞♥";
        return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function glitchText(element, duration = 300) {
        if (isFlipping) return;
        isFlipping = true;

        // Generate a glitch effect while preserving letter-spacing
        let scrambledHTML = `
            <span class="studio-tag">${randomChar()}${randomChar()}${randomChar()}</span>
            <span class="glitch-effect">${randomChar()}${randomChar()}${randomChar()}${randomChar()}</span>
            <span class="glitch-effect"> ${randomChar()}${randomChar()}${randomChar()}</span>
        `;

        element.innerHTML = scrambledHTML;

        setTimeout(() => {
            element.innerHTML = originalHTML; // Restore original styled HTML
            isFlipping = false;
        }, duration);
    }

    let lastScrollTop = 0;
    let ticking = false;

    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(() => {
                let currentScroll = window.scrollY;
                if (Math.abs(currentScroll - lastScrollTop) > 50) {
                    glitchText(moritzElement);
                    lastScrollTop = currentScroll;
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

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

    const images = document.querySelectorAll(".offering-item img");
    if (images.length === 0) {
        console.warn("No images found for zoom functionality.");
        return;
    }

    const zoomedContainer = document.createElement("div");
    const zoomedImage = document.createElement("img");

    zoomedContainer.classList.add("zoomed-container");
    zoomedImage.classList.add("zoomed-image");
    zoomedContainer.appendChild(zoomedImage);
    document.body.appendChild(zoomedContainer);

    function openZoomedImage(src) {
        zoomedImage.src = src;
        zoomedImage.classList.add("active");
        zoomedContainer.classList.add("active");
    }

    function closeZoomedImage() {
        zoomedImage.classList.remove("active");
        zoomedContainer.classList.remove("active");
    }

    images.forEach((img) => {
        img.addEventListener("click", () => {
            openZoomedImage(img.src);
        });
    });

    zoomedContainer.addEventListener("click", (e) => {
        if (e.target === zoomedContainer || e.target === zoomedImage) {
            closeZoomedImage();
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
            ? `Hey Moritz,\n\nIch würde gerne ein Gespräch vereinbaren am ${formattedDate} um ${selectedTime}.\n\nLiebe Grüße,\n[Ihr Name / Firma / E-Mail-Adresse]`
            : `Hey Moritz,\n\nI would like to schedule a call with you on ${formattedDate} at ${selectedTime}.\n\nBest regards,\n[Your Name / Company / Email Address]`;

        let mailtoLink = `mailto:email@moritzgauss.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    });
}

const coverFlow = document.querySelector(".coverflow-track");
const items = document.querySelectorAll(".coverflow-item");
const flipSound = new Audio("flip.mp3"); // Sound für das Scrollen
let index = Math.floor(items.length / 2);

function updateCoverFlow() {
    items.forEach((item, i) => {
        let offset = i - index;
        let scale = Math.max(1 - Math.abs(offset) * 0.2, 0.6);
        let rotateY = offset * 50;
        let translateX = offset * 250;

        item.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
        item.style.opacity = Math.abs(offset) > 2 ? 0 : 1; // Unsichtbar, wenn zu weit links/rechts
        item.style.zIndex = -Math.abs(offset);
    });
}

function handleScroll(e) {
    let direction = e.deltaY > 0 ? 1 : -1;
    if ((direction === 1 && index < items.length - 1) || (direction === -1 && index > 0)) {
        index += direction;
        flipSound.play();
        updateCoverFlow();
    }
}

function handleSwipeStart(e) {
    startX = e.touches[0].clientX;
}

function handleSwipeEnd(e) {
    let diff = startX - e.changedTouches[0].clientX;
    if (diff > 50 && index < items.length - 1) {
        index++;
    } else if (diff < -50 && index > 0) {
        index--;
    }
    flipSound.play();
    updateCoverFlow();
}

window.addEventListener("wheel", handleScroll);
window.addEventListener("touchstart", handleSwipeStart);
window.addEventListener("touchend", handleSwipeEnd);

updateCoverFlow();

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".nav a");
    const popups = document.querySelectorAll(".popup");

    links.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));
            
            if (target) {
                // Falls das Popup bereits aktiv ist, schließe es
                if (target.classList.contains("active")) {
                    target.classList.remove("active");
                } else {
                    // Vorherige aktive Popups schließen
                    popups.forEach(popup => popup.classList.remove("active"));

                    // Neues Popup öffnen
                    target.classList.add("active");
                }
            }
        });
    });

    // Klicken außerhalb des Popups schließt es
    document.addEventListener("click", function (event) {
        if (!event.target.closest(".popup") && !event.target.closest(".nav a")) {
            popups.forEach(popup => popup.classList.remove("active"));
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleRadio");
    const radioSection = document.getElementById("radioSection");

    toggleButton.addEventListener("click", function(event) {
        event.preventDefault();

        if (radioSection.style.maxHeight === "0px" || !radioSection.style.maxHeight) {
            radioSection.style.maxHeight = "400px"; // Höhe anpassen
        } else {
            radioSection.style.maxHeight = "0px";
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let lang = navigator.language || navigator.userLanguage;
    let isGerman = lang.startsWith("de");

    if (isGerman) {
        translateToGerman();
    }
});

function translateToGerman() {
    // Navigation
    document.querySelector("a[href='#details']").textContent = "Details";
    document.querySelector("a[href='#offers']").textContent = "Angebote";
    document.querySelector("a[href='#experience']").textContent = "Erfahrung";
    document.querySelector("a[href='#clients']").textContent = "Kunden";
    document.querySelector("a[href='#pricing']").textContent = "Preise";
    document.querySelector("#toggleRadio").textContent = "Radio";

    // "Go Back"-Link
    const goBackElement = document.querySelector(".go-back");
    if (goBackElement) {
        goBackElement.textContent = "(Zurück)";
    }

    // Popups
    document.querySelector("#details p").innerHTML = "Ich konzipiere und gestalte Websites, die durchdacht, visuell prägnant und funktional sind. Mein Fokus liegt auf alleinstehenden digitalen Identitäten – für anspruchsvolle Projekte, die mehr als Standardlösungen brauchen. Als Industriedesigner (B.A.) bringe ich dabei mein Verständnis für Gestaltung und Funktionalität mit ein. Wenn das nach deinem Vorhaben klingt, mach einen Termin unten oder direkt an: <a href='mailto:email@moritzgauss.com'>email@moritzgauss.com</a>.";

    document.querySelector("#offers").innerHTML = `
        <p>1. Visuelles Design und Branding<br>Gestaltung kohärenter visueller Elemente, die mit der Markenidentität übereinstimmen, einschließlich Farbschemata, Typografie und Bildsprache.</p>
        <p>2. Individuelle Grafiken und Icons<br>Erstellung einzigartiger Grafiken und Icons, die das Website-Design bereichern und die Nutzererfahrung verbessern.</p>
        <p>3. Interaktive Elemente<br>Einbindung interaktiver Features wie Animationen, Hover-Effekte und klickbare Elemente für eine dynamische Benutzererfahrung.</p>
        <p>4. Strukturierte Inhaltsdarstellung<br>Übersichtliche, logische und ästhetische Anordnung von Inhalten für eine bessere Lesbarkeit.</p>
    `;

    document.querySelector("#experience").innerHTML = `
        <p>Akademische Ausbildung<br>Industriedesign-Studium als Grundlage für methodisches Webdesign.</p>
        <p>Freiberufliche Erfahrung<br>Jahre der Zusammenarbeit mit Kunden zur Entwicklung maßgeschneiderter digitaler Erlebnisse.</p>
        <p>Interdisziplinäre Fähigkeiten<br>Kombination aus digitaler Kunst, Branding und UI/UX-Design.</p>
    `;

    document.querySelector("#clients").innerHTML = `
        <p>Liste ausgewählter Kunden</p>
        <p><a href="https://1902site.framer.website" target="_blank"><i>(In Arbeit)</i> seit 19.02.20 Gegen Rassismus</a></p>
        <p><a href="https://instagram.com/hfg.radio" target="_blank"><i>(In Arbeit)</i> HFG Offenbach Radio</a></p>
        <p><a href="https://oscardiazvisual.com">Oscar Diaz (Barcelona, Spanien)<a/></p>
        <p><a href="https://www.nookcph.com" target="_blank">Nook Agency (Kopenhagen, Dänemark)</a></p>
        <p><a href="https://germanistan.eu" target="_blank">Germanistan Musiklabel (München, Deutschland)</a></p>
        <p><a href="https://www.13senses-agency.ch" target="_blank">13 Senses Agency (Luzern, Schweiz)</a></p>
        <p><a href="https://www.byebambi.com" target="_blank">Bye Bambi Modemarke (Windsor, Australien)</a></p>
    `;

    document.querySelector("#pricing").innerHTML = `
        <p>Jedes Projekt ist einzigartig, und ich biete flexible Preisoptionen.</p>

        <div class="pricing-container">
            <div class="package">
                <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Zeichenf1.png" alt="Basis-Paket" class="pricing-image">
                <p>Basis-Paket<br>800 EUR</p>
                <ul>
                    <li>Einfache Website mit bis zu 5 Seiten</li>
                    <li>Grundlegende SEO-Optimierung</li>
                    <li>Responsives Design für Mobil- und Desktop</li>
                    <li>Integration von Social Media und Kontaktformular</li>
                </ul>
            </div>

            <div class="package">
                <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Bild45465.jpg" alt="Erweitertes Paket" class="pricing-image">
                <p>Erweitertes Paket<br>1600 EUR</p>
                <ul>
                    <li>Individuelle Website mit bis zu 10 Seiten</li>
                    <li>Erweiterte Designelemente und Animationen</li>
                    <li>Verbesserte SEO und Performance-Optimierung</li>
                    <li>Integration von E-Commerce oder Blog-Funktionalität</li>
                </ul>
            </div>

            <div class="package">
                <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Mockup2-p-3200.jpg" alt="Premium-Paket" class="pricing-image">
                <p>Premium-Paket<br>3000 EUR</p>
                <ul>
                    <li>Vollständig individuelle Webanwendung oder Website mit unbegrenzten Seiten</li>
                    <li>Komplexe Funktionen wie Benutzeranmeldung, Zahlungsabwicklung oder API-Integrationen</li>
                    <li>Umfassende SEO- und Analyse-Setups</li>
                    <li>6 Monate laufender Support und Wartung</li>
                </ul>
            </div>
        </div>
    `;

        document.querySelector(".offerings-header h4").textContent = "Kontakt";
        document.querySelector(".contact-card p").innerHTML = "Designs: Fertig in 2 - 4 Wochen<br>Entwicklung: Launch in 2 - 8 Wochen";
        document.querySelector(".time-selector label").textContent = "Wähle einen Termin für einen ersten Call (Mo-Fr / 10:00-17:00)";
        document.querySelector("#whatsapp-btn").textContent = "E-Mail senden";

}

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