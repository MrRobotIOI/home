let slideIndex = [1, 1];
let slideId = ["mySlides1", "mySlides2"];
const AUTOPLAY_MS = 4000;
let autoplayTimers = [null, null];

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  let i;
  let x = document.getElementsByClassName(slideId[no]);
  if (!x.length) {
    return;
  }
  if (n > x.length) {
    slideIndex[no] = 1;
  }
  if (n < 1) {
    slideIndex[no] = x.length;
  }
  for (i = 0; i < x.length; i++) {
    x[i].classList.remove("slide-active");
  }
  x[slideIndex[no] - 1].classList.add("slide-active");
}

function startAutoplay(no) {
  if (autoplayTimers[no]) {
    clearInterval(autoplayTimers[no]);
  }
  let x = document.getElementsByClassName(slideId[no]);
  if (!x.length) {
    return;
  }
  autoplayTimers[no] = setInterval(function () {
    plusSlides(1, no);
  }, AUTOPLAY_MS);
}

function stopAutoplay(no) {
  if (autoplayTimers[no]) {
    clearInterval(autoplayTimers[no]);
    autoplayTimers[no] = null;
  }
}

function initSlideshow(no) {
  let x = document.getElementsByClassName(slideId[no]);
  if (!x.length) {
    return;
  }
  showSlides(slideIndex[no], no);
  startAutoplay(no);
  let container = x[0].closest(".slideshow-container");
  if (container) {
    container.addEventListener("mouseenter", function () {
      stopAutoplay(no);
    });
    container.addEventListener("mouseleave", function () {
      startAutoplay(no);
    });
  }
}

initSlideshow(0);
initSlideshow(1);