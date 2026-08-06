(function () {
  var carousels = document.querySelectorAll(".music-carousel");

  carousels.forEach(function (carousel) {
    var track = carousel.querySelector(".music-cards");
    var prev = carousel.querySelector(".music-carousel__btn--prev");
    var next = carousel.querySelector(".music-carousel__btn--next");
    if (!track || !prev || !next) return;

    function scrollByCard(dir) {
      var card = track.querySelector(".music-card");
      var amount = card ? card.getBoundingClientRect().width + 12 : track.clientWidth * 0.8;
      track.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

    prev.addEventListener("click", function () { scrollByCard(-1); });
    next.addEventListener("click", function () { scrollByCard(1); });

    function updateButtons() {
      var max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollWidth <= track.clientWidth || track.scrollLeft >= max;
    }

    track.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);
    updateButtons();
  });
})();
