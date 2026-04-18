// Back to top button
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

// Update background image on project card hover
var thumbnail = document.querySelector('.project-bkgimg');
if (thumbnail) {
  document.querySelectorAll('.project-grid .project').forEach(function(project) {
    var img = project.querySelector('.project-carousel img');
    if (!img) return;
    project.addEventListener('mouseenter', function() {
      thumbnail.style.backgroundImage = 'url(' + img.src + ')';
    });
  });
}

// Per-carousel navigation — each carousel manages its own index
document.querySelectorAll('.project-carousel').forEach(function(carousel) {
  var imgs = Array.from(carousel.querySelectorAll(':scope > img'));
  var descs = Array.from(carousel.querySelectorAll('.desctext div'));
  if (!imgs.length) return;

  var idx = 0;
  imgs.forEach(function(img, i) {
    if (img.classList.contains('active')) idx = i;
  });

  function show(n) {
    imgs[idx].classList.remove('active');
    if (descs[idx]) descs[idx].classList.remove('active');
    idx = ((idx + n) % imgs.length + imgs.length) % imgs.length;
    imgs[idx].classList.add('active');
    if (descs[idx]) descs[idx].classList.add('active');
  }

  var arrowL = carousel.querySelector('.arrow-l');
  var arrowR = carousel.querySelector('.arrow-r');
  if (arrowL) arrowL.addEventListener('click', function() { show(-1); });
  if (arrowR) arrowR.addEventListener('click', function() { show(1); });
});

// Desc toggle
document.querySelectorAll('.desc-toggle').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var body = btn.previousElementSibling;
    var project = btn.closest('.project');
    var expanded = body.classList.toggle('expanded');
    if (project) {
      project.querySelectorAll('.preview-extra').forEach(function(extra) {
        extra.classList.toggle('is-visible', expanded);
      });
    }
    btn.textContent = expanded ? 'Less ↑' : 'More ↓';
  });
});

// Hero/about detection for scroll classes and nav dots
(function() {
  var htmlsec = document.getElementsByTagName("html")[0];
  var hero = document.getElementById("home");
  var aboutid = document.getElementById("about");
  var navdots = document.querySelectorAll(".scrollbar .dot");
  var sections = document.querySelectorAll("section");

  function inViewport(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }

  function onScroll() {
    if (inViewport(hero)) {
      htmlsec.classList.add("hero-view", "scroll-snap");
      htmlsec.classList.remove("fixed");
    } else if (inViewport(aboutid)) {
      htmlsec.classList.remove("hero-view", "fixed");
      htmlsec.classList.add("scroll-snap");
    } else {
      htmlsec.classList.remove("hero-view", "scroll-snap", "fixed");
    }

    sections.forEach(function(sec, i) {
      if (navdots[i]) navdots[i].classList.toggle("active", inViewport(sec));
    });
  }

  window.onscroll = onScroll;
  onScroll();
})();

// URL topic scrolling
document.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var topic = urlParams.get('topic');
  if (topic) {
    var el = document.getElementById(topic);
    if (el) window.scrollTo({ top: el.offsetTop, behavior: "instant" });
  }
});
