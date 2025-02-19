function goBack() {
  if (document.referrer.includes('moritzgauss.com')) {
    window.history.back();
  } else {
    window.location.href = '/';
  }
}
    function updateClock() {
        const now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');

        document.querySelector('.hours').textContent = hours;
        document.querySelector('.minutes').textContent = minutes;

        const minuteSpan = document.querySelector('.minutes');
        minuteSpan.style.transform = 'scale(1.2)';
        setTimeout(() => {
            minuteSpan.style.transform = 'scale(1)';
        }, 300);
    }

    setInterval(updateClock, 1000);
    updateClock();

    const dateInput = document.getElementById('date');
    dateInput.setAttribute("min", new Date().toISOString().split("T")[0]); 

    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const day = selectedDate.getDay(); // 

        if (day === 0 || day === 6) {
            alert("Please choose a weekday (Monday - Friday).");
            this.value = "";
        }
    });


    const timeSelect = document.getElementById('time');
    for (let hour = 10; hour <= 16; hour++) {
        for (let min = 0; min < 60; min += 15) {
            let timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            let option = new Option(timeStr, timeStr);
            timeSelect.appendChild(option);
        }
    }


    document.getElementById('whatsapp-button').addEventListener('click', function() {
        let selectedDate = dateInput.value;
        let selectedTime = timeSelect.value;

        if (!selectedDate || !selectedTime) {
            alert("Please select a date and time.");
            return;
        }

        let message = `Hey, I want to book a time on ${selectedDate} at ${selectedTime}.`;
        let url = `https://wa.me/004915737365084?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
    });