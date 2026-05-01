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
var CAROUSEL_AUTOPLAY_MS = 4000;

document.querySelectorAll('.project-carousel').forEach(function(carousel) {
  var viewport = carousel.querySelector('.project-carousel-viewport');
  var slides = Array.from(
    viewport
      ? viewport.querySelectorAll('img, video')
      : carousel.querySelectorAll(':scope > img, :scope > video')
  );
  var descs = Array.from(carousel.querySelectorAll('.desctext div'));
  if (!slides.length) return;

  if (slides.length > 1) {
    carousel.classList.add('project-carousel--slides');
  }

  var idx = 0;
  slides.forEach(function(slide, i) {
    if (slide.classList.contains('active')) idx = i;
  });

  function setActive(nextIdx) {
    var prev = slides[idx];
    prev.classList.remove('active');
    if (prev.tagName === 'VIDEO') {
      prev.pause();
    }
    if (descs[idx]) descs[idx].classList.remove('active');
    idx = nextIdx;
    var cur = slides[idx];
    cur.classList.add('active');
    if (cur.tagName === 'VIDEO') {
      cur.play().catch(function() {});
    }
    if (descs[idx]) descs[idx].classList.add('active');
  }

  function show(delta) {
    var next = ((idx + delta) % slides.length + slides.length) % slides.length;
    setActive(next);
  }

  var gifIndices = slides
    .map(function(slide, i) {
      return slide.tagName === 'IMG' && /\.gif(\?|$)/i.test(slide.src) ? i : -1;
    })
    .filter(function(i) {
      return i >= 0;
    });

  slides.forEach(function(slide, i) {
    if (slide.tagName === 'VIDEO') {
      if (i === idx) slide.play().catch(function() {});
      else slide.pause();
    }
  });

  var gifAutoplay = carousel.classList.contains('project-carousel--gif-autoplay') && gifIndices.length > 1;
  var gifPos = Math.max(0, gifIndices.indexOf(idx));
  var autoplayTimer = null;

  function advanceGifAutoplay() {
    gifPos = (gifPos + 1) % gifIndices.length;
    setActive(gifIndices[gifPos]);
  }

  function startGifAutoplay() {
    if (!gifAutoplay) return;
    stopGifAutoplay();
    autoplayTimer = setInterval(advanceGifAutoplay, CAROUSEL_AUTOPLAY_MS);
  }

  function stopGifAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  var arrowL = carousel.querySelector('.arrow-l');
  var arrowR = carousel.querySelector('.arrow-r');
  if (arrowL) arrowL.addEventListener('click', function() {
    show(-1);
    if (gifIndices.indexOf(idx) >= 0) gifPos = gifIndices.indexOf(idx);
    if (gifAutoplay) {
      stopGifAutoplay();
      startGifAutoplay();
    }
  });
  if (arrowR) arrowR.addEventListener('click', function() {
    show(1);
    if (gifIndices.indexOf(idx) >= 0) gifPos = gifIndices.indexOf(idx);
    if (gifAutoplay) {
      stopGifAutoplay();
      startGifAutoplay();
    }
  });

  if (gifAutoplay) {
    startGifAutoplay();
    carousel.addEventListener('mouseenter', stopGifAutoplay);
    carousel.addEventListener('mouseleave', startGifAutoplay);
  }
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

// Project category filter (with URL state via ?filter=)
(function() {
  var VALID = ['all', 'programming', 'games'];
  var pills = document.querySelectorAll('.filter-pill');
  var projects = document.querySelectorAll('.project-grid > .container');
  if (!pills.length || !projects.length) return;

  function normalize(value) {
    return VALID.indexOf(value) >= 0 ? value : 'all';
  }

  function apply(filter) {
    filter = normalize(filter);
    pills.forEach(function(pill) {
      var isActive = pill.dataset.filter === filter;
      pill.classList.toggle('active', isActive);
      pill.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    projects.forEach(function(project) {
      var category = project.dataset.category;
      var visible = filter === 'all' || category === filter;
      project.classList.toggle('is-hidden', !visible);
    });
  }

  function updateUrl(filter) {
    var url = new URL(window.location.href);
    if (filter === 'all') {
      url.searchParams.delete('filter');
    } else {
      url.searchParams.set('filter', filter);
    }
    window.history.replaceState(null, '', url);
  }

  pills.forEach(function(pill) {
    pill.addEventListener('click', function() {
      var filter = normalize(pill.dataset.filter);
      apply(filter);
      updateUrl(filter);
    });
  });

  var initial = normalize(new URLSearchParams(window.location.search).get('filter'));
  apply(initial);
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
