function goBack() {
  // Überprüfen, ob die vorherige Seite auf moritzgauss.com liegt
  if (document.referrer.includes('moritzgauss.com')) {
    window.history.back();
  } else {
    // Zur Startseite weiterleiten
    window.location.href = '/';
  }
}
