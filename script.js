$(document).ready(function () {
  // Variables pour le slider
  let currentIndex = 0;
  const sections = $('.slider .function');
  const totalSections = sections.length;

  // Fonction pour mettre à jour le slider
  function updateSlider() {
    const offset = -currentIndex * 110;
    $('.slider').css('transform', `translateX(${offset}%)`);
  }

  // Navigation avec les boutons flèches
  $('.nav-right').on('click', function () {
    if (currentIndex < totalSections - 1) {
      currentIndex++;
      updateSlider();
    } else {
      currentIndex = 0;
      updateSlider();
    }
  }); 

  $('.nav-left').on('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    } else {
      currentIndex = totalSections - 1;
      updateSlider();
    }
  });

  // Détection tactile pour le swipe
  let touchStartX = 0;
  let touchEndX = 0;

  $('.slider-container').on('touchstart', function (e) {
    touchStartX = e.originalEvent.touches[0].clientX;
  });

  $('.slider-container').on('touchmove', function (e) {
    touchEndX = e.originalEvent.touches[0].clientX;
  });

  $('.slider-container').on('touchend', function () {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > 50 && currentIndex > 0) {
      currentIndex--;
    } else if (swipeDistance < -50 && currentIndex < totalSections - 1) {
      currentIndex++;
    }
    updateSlider();
  });

  // Horloge
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour12: false });
    $('#current-time').text(time);
  }
  setInterval(updateClock, 1000);

  // Minuteur
  let timerInterval;
  $('#start-timer').on('click', function () {
    let time = parseInt($('#minuteur-input').val());
    if (isNaN(time) || time <= 0) {
      alert('Veuillez entrer un temps valide.');
      return;
    }
    $('#timer-display').text(formatTime(time));
    timerInterval = setInterval(function () {
      time--;
      $('#timer-display').text(formatTime(time));
      if (time <= 0) {
        clearInterval(timerInterval);
        alert('Temps écoulé !');
      }
    }, 1000);
  });

  $('#stop-timer').on('click', function () {
    clearInterval(timerInterval);
  });

  // Chronomètre
  let chronoInterval;
  let chronoTime = 0;
  let chronoRunning = false;

  $('#start-stop-chrono').on('click', function () {
    if (!chronoRunning) {
      chronoInterval = setInterval(function () {
        chronoTime++;
        $('#chrono-display').text(formatTime(chronoTime));
      }, 1000);
      chronoRunning = true;
    } else {
      clearInterval(chronoInterval);
      chronoRunning = false;
    }
  });

  $('#reset-chrono').on('click', function () {
    clearInterval(chronoInterval);
    chronoTime = 0;
    chronoRunning = false;
    $('#chrono-display').text('00:00:00');
    $('#lap-times').empty();
  });

  $('#lap-chrono').on('click', function () {
    $('#lap-times').append(`<li>${formatTime(chronoTime)}</li>`);
  });

  // Réveil
  setInterval(function () {
    const now = new Date();
    const currentTime = now.toTimeString().substr(0, 5);
    $('#alarm-list li').each(function () {
      const alarmTime = $(this).data('time');
      if (alarmTime === currentTime) {
        alert(`Réveil : ${$(this).data('message')}`);
        $(this).remove();
      }
    });
  }, 1000);

  $('#set-alarm').on('click', function () {
    const alarmTime = $('#alarm-time').val();
    const alarmMessage = $('#alarm-message').val();
    if (!alarmTime || !alarmMessage) {
      alert('Veuillez entrer une heure et un message.');
      return;
    }
    $('#alarm-list').append(
      `<li data-time="${alarmTime}" data-message="${alarmMessage}">
        ${alarmTime} - ${alarmMessage}
      </li>`
    );
  });

  // Fonction utilitaire pour formater le temps
  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
});
