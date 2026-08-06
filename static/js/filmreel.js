(function () {
  var DURATION = 180; // must match the animation-duration in global.css
  var track = document.querySelector(".filmreel-banner__track");
  if (!track) return;

  var start;
  try {
    start = sessionStorage.getItem("filmreelStart");
    if (!start) {
      start = Date.now();
      sessionStorage.setItem("filmreelStart", start);
    }
  } catch (e) {
    start = Date.now(); // storage blocked (e.g. private mode); just don't persist
  }

  var elapsed = ((Date.now() - start) / 1000) % DURATION;
  track.style.animationDelay = "-" + elapsed + "s";
})();
