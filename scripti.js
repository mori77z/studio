// Zurück-Funktion mit Fallback
function goBack() {
  if (document.referrer && document.referrer.includes('moritzgauss.com')) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // Elemente abfragen
  const moritzElement = document.querySelector(".moritz");
  if (!moritzElement) {
    console.warn("Element '.moritz' nicht gefunden!");
    return;
  }

  // Glitch Effekt
  let isFlipping = false;
  const originalHTML = moritzElement.innerHTML;
  const symbols = "✪✹❦♬♪♩★❥✱♫♠♞♥";

  function randomChar() {
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

  function glitchText(element, duration = 300) {
    if (isFlipping) return;
    isFlipping = true;

    const scrambledHTML = `
      <span class="studio-tag">${randomChar()}${randomChar()}${randomChar()}</span>
      <span class="glitch-effect">${randomChar()}${randomChar()}${randomChar()}${randomChar()}</span>
      <span class="glitch-effect"> ${randomChar()}${randomChar()}${randomChar()}</span>
    `;

    element.innerHTML = scrambledHTML;

    setTimeout(() => {
      element.innerHTML = originalHTML;
      isFlipping = false;
    }, duration);
  }

  // Nur Glitch bei Scroll
  let lastScroll = window.pageYOffset || document.documentElement.scrollTop;
  let ticking = false;
  let lastGlitchScroll = lastScroll;

  function onScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (Math.abs(currentScroll - lastGlitchScroll) > 50) {
      glitchText(moritzElement);
      lastGlitchScroll = currentScroll;
    }

    lastScroll = currentScroll <= 0 ? 0 : currentScroll;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
});

  const images = document.querySelectorAll(".offering-item img");
  if (images.length) {
    const zoomedContainer = document.createElement("div");
    const zoomedImage = document.createElement("img");

    zoomedContainer.classList.add("zoomed-container");
    zoomedImage.classList.add("zoomed-image");
    zoomedContainer.appendChild(zoomedImage);
    document.body.appendChild(zoomedContainer);

    function openZoomedImage(src) {
      zoomedImage.src = src;
      zoomedContainer.classList.add("active");
    }

    function closeZoomedImage() {
      zoomedContainer.classList.remove("active");
    }

    images.forEach(img => {
      img.addEventListener("click", () => openZoomedImage(img.src));
    });

    zoomedContainer.addEventListener("click", e => {
      if (e.target === zoomedContainer || e.target === zoomedImage) {
        closeZoomedImage();
      }
    });
  }

  const dateInput = document.getElementById('date');
  const timeSelect = document.getElementById('time');

  if (dateInput) {
    function getNextValidDate() {
      let today = new Date();
      if (today.getHours() >= 16) today.setDate(today.getDate() + 1);
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
        alert("Bitte wählen Sie einen Werktag (Montag - Freitag).");
        this.value = "";
        if (timeSelect) timeSelect.disabled = true;
      } else {
        if (timeSelect) timeSelect.disabled = false;
      }
    });
  }

  if (timeSelect) {
    timeSelect.innerHTML = "";
    for (let h = 10; h <= 16; h++) {
      for (let m = 0; m < 60; m += 15) {
        const timeStr = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
        timeSelect.appendChild(new Option(timeStr, timeStr));
      }
    }
  }

  const emailBtn = document.getElementById('whatsapp-btn');
  if (emailBtn) {
    emailBtn.addEventListener('click', e => {
      e.preventDefault();

      if (!dateInput || !timeSelect) return;

      const selectedDate = dateInput.value;
      const selectedTime = timeSelect.value;

      if (!selectedDate || !selectedTime) {
        alert("Bitte wählen Sie Datum und Uhrzeit aus.");
        return;
      }

      const [y, mo, d] = selectedDate.split("-");
      const formattedDate = `${d}.${mo}.${y}`;

      const lang = navigator.language || navigator.userLanguage;
      const isGerman = lang.startsWith("de");

      const subject = isGerman ? "Anfrage für einen Call" : "Request for a first Call";
      const body = isGerman
        ? `Hey Moritz,\n\nIch würde gerne ein Gespräch vereinbaren am ${formattedDate} um ${selectedTime}.\n\nLiebe Grüße,\n[Ihr Name / Firma / E-Mail-Adresse]`
        : `Hey Moritz,\n\nI would like to schedule a call with you on ${formattedDate} at ${selectedTime}.\n\nBest regards,\n[Your Name / Company / Email Address]`;

      window.location.href = `mailto:email@moritzgauss.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

  const popups = document.querySelectorAll(".popup");

  function openPopupById(id) {
    popups.forEach(p => p.classList.remove("active"));
    const target = document.getElementById(id);
    if (target) target.classList.add("active");
  }

  if (window.location.hash) {
    openPopupById(window.location.hash.substring(1));
  }

  const links = document.querySelectorAll(".nav a");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("href").substring(1);
      const target = document.getElementById(id);
      if (!target) return;

      if (target.classList.contains("active")) {
        target.classList.remove("active");
      } else {
        popups.forEach(p => p.classList.remove("active"));
        target.classList.add("active");
      }

      history.replaceState(null, null, `#${id}`);
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".popup") && !e.target.closest(".nav a")) {
      popups.forEach(p => p.classList.remove("active"));
      history.replaceState(null, null, window.location.pathname);
    }
  });

  const toggleButton = document.getElementById("toggleRadio");
  const radioSection = document.getElementById("radioSection");
  if (toggleButton && radioSection) {
    toggleButton.addEventListener("click", e => {
      e.preventDefault();
      if (radioSection.style.maxHeight === "0px" || !radioSection.style.maxHeight) {
        radioSection.style.maxHeight = "400px";
      } else {
        radioSection.style.maxHeight = "0px";
      }
    });
  }

  // --- Übersetzungsfunktion ausklammern ---
  // if ((navigator.language || navigator.userLanguage).startsWith("de")) {
  //   translateToGerman();
  // }

  // function translateToGerman() {
  //   const navMap = {
  //     '#details': "Details",
  //     '#offers': "Angebote",
  //     '#experience': "Erfahrung",
  //     '#clients': "Arbeiten",
  //     '#pricing': "Preise"
  //   };

  //   Object.entries(navMap).forEach(([selector, text]) => {
  //     const el = document.querySelector(`a[href='${selector}']`);
  //     if (el) el.textContent = text;
  //   });

  //   const details = document.querySelector("#details p");
  //   if (details) details.innerHTML = "Ich konzipiere und gestalte Websites, die durchdacht, visuell prägnant und funktional sind. Mein Fokus liegt auf alleinstehenden digitalen Identitäten – für anspruchsvolle Projekte, die mehr als Standardlösungen brauchen. Als Industriedesigner (B.A.) bringe ich dabei mein Verständnis für Gestaltung und Funktionalität mit ein. Mach gerne einen Termin unten oder schick mir eine Anfrage an: <a href='mailto:email@moritzgauss.com'>email@moritzgauss.com</a>.";

  //   const offers = document.querySelector("#offers");
  //   if (offers) offers.innerHTML = `
  //     <p>1. Visuelles Design und Branding:<br>Gestaltung kohärenter visueller Elemente, die mit Ihrer Markenidentität übereinstimmen, einschließlich Farbschemata, Typografie und Bildsprache.</p>
  //     <p>2. Individuelle Grafiken und Icons:<br>Erstellung einzigartiger Grafiken und Icons, die Ihr Website-Design bereichern und die Nutzererfahrung verbessern.</p>
  //     <p>3. Interaktive Elemente:<br>Einbindung interaktiver Features wie Animationen, Hover-Effekte und klickbare Elemente für eine dynamische Benutzererfahrung.</p>
  //     <p>4. Strukturierte Inhaltsdarstellung:<br>Übersichtliche, logische und ästhetische Anordnung von Inhalten für eine bessere Lesbarkeit.</p>
  //   `;

  //   const experience = document.querySelector("#experience");
  //   if (experience) experience.innerHTML = `
  //     <p>Akademische Ausbildung:<br>Mein Studium des Industriedesigns bildet die Grundlage für einen methodischen Ansatz im Webdesign.</p>
  //     <p>Freiberufliche Erfahrung:<br>Jahrelange Zusammenarbeit mit Kunden bei der Entwicklung maßgeschneiderter digitaler Erlebnisse.</p>
  //     <p>Interdisziplinäre Fähigkeiten:<br>Eine Kombination aus Creative Coding, Branding und UI/UX-Design für umfassende Lösungen.</p>
  //   `;

  //   const pricing = document.querySelector("#pricing");
  //   if (pricing) pricing.innerHTML = `
  //     <p>Jedes Projekt ist einzigartig, und ich biete flexible Preisoptionen, die auf Ihre spezifischen Bedürfnisse zugeschnitten sind.</p>
  //     <div class="pricing-container">
  //       <div class="package">
  //         <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Zeichenf1.png" alt="Basis-Paket" class="pricing-image">
  //         <p>Basis-Paket<br>800 EUR</p>
  //         <ul>
  //           <li>Einfache Website mit bis zu 5 Seiten</li>
  //           <li>Grundlegende SEO-Optimierung</li>
  //           <li>Responsives Design für Mobilgeräte und Desktop</li>
  //           <li>Integration von Social Media und Kontaktformularen</li>
  //         </ul>
  //       </div>
  //       <div class="package">
  //         <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Bild45465.jpg" alt="Erweitertes Paket" class="pricing-image">
  //         <p>Erweitertes Paket<br>1600 EUR</p>
  //         <ul>
  //           <li>Individuelle Website mit bis zu 10 Seiten</li>
  //           <li>Erweiterte Designelemente und Animationen</li>
  //           <li>Verbesserte SEO und Performance-Optimierung</li>
  //           <li>Integration von E-Commerce oder Blog-Funktionalität</li>
  //         </ul>
  //       </div>
  //       <div class="package">
  //         <img src="https://raw.githubusercontent.com/mori77z/library/refs/heads/main/Mockup2-p-3200.jpg" alt="Premium-Paket" class="pricing-image">
  //         <p>Premium-Paket<br>3000 EUR</p>
  //         <ul>
  //           <li>Vollständig individuelle Webanwendung oder Website mit unbegrenzten Seiten</li>
  //           <li>Komplexe Funktionen wie Benutzeranmeldung, Zahlungsabwicklung oder API-Integrationen</li>
  //           <li>Umfassende SEO- und Analyse-Setups</li>
  //           <li>6 Monate laufender Support und Wartung</li>
  //         </ul>
  //       </div>
  //     </div>
  //   `;

  //   const contactCardP = document.querySelector(".contact-card p");
  //   if(contactCardP) contactCardP.innerHTML = "Designs: Fertig in 2 - 4 Wochen<br>Entwicklung: Launch in 2 - 8 Wochen";

  //   const timeSelectorLabel = document.querySelector(".time-selector label");
  //   if(timeSelectorLabel) timeSelectorLabel.textContent = "Wähle einen Termin für einen ersten Call (Mo-Fr / 10:00-17:00)";

  //   const whatsappBtn = document.getElementById("whatsapp-btn");
  //   if(whatsappBtn) whatsappBtn.textContent = "E-Mail senden";

  //   const toggleRadio = document.getElementById("toggleRadio");
  //   if(toggleRadio) toggleRadio.textContent = "Radio";
  // }

  // --- Fade-In für Offerings ---
  function fadeInOfferings() {
    const isMobile = window.innerWidth < 768;
    const offeringItems = document.querySelectorAll('.offering-item');
    const offeringHeaders = document.querySelectorAll('.offerings-header, .offerings-header h4');

    if (isMobile) {
      offeringItems.forEach(item => item.classList.add('fade-in'));
      offeringHeaders.forEach(header => header.style.opacity = 1);
    } else {
      offeringHeaders.forEach(header => header.style.opacity = 1);
      offeringItems.forEach((item, i) => {
        setTimeout(() => {
          item.classList.add('fade-in');
        }, 200 * i); 
      });
    }
  }

  fadeInOfferings();
});