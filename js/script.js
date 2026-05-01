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

// Right-click on a project card → "Copy focus link" custom menu
(function() {
  var cards = document.querySelectorAll('.project-grid > .container[id]');
  if (!cards.length) return;

  var menu = document.createElement('div');
  menu.className = 'card-context-menu';
  menu.setAttribute('role', 'menu');
  menu.hidden = true;

  var copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'card-context-menu__item';
  copyBtn.setAttribute('role', 'menuitem');
  var DEFAULT_LABEL = 'Copy focus link';
  copyBtn.textContent = DEFAULT_LABEL;
  menu.appendChild(copyBtn);
  document.body.appendChild(menu);

  var activeCard = null;

  function buildLink(card) {
    var base = window.location.href.split('?')[0].split('#')[0];
    return base + '?topic=' + encodeURIComponent(card.id);
  }

  function show(x, y, card) {
    activeCard = card;
    menu.hidden = false;
    menu.style.left = '0px';
    menu.style.top = '0px';
    var rect = menu.getBoundingClientRect();
    var px = Math.min(x, window.innerWidth - rect.width - 8);
    var py = Math.min(y, window.innerHeight - rect.height - 8);
    menu.style.left = Math.max(8, px) + 'px';
    menu.style.top = Math.max(8, py) + 'px';
  }

  function hide() {
    menu.hidden = true;
    activeCard = null;
    copyBtn.textContent = DEFAULT_LABEL;
  }

  function flash(label, ms) {
    copyBtn.textContent = label;
    setTimeout(hide, ms || 800);
  }

  cards.forEach(function(card) {
    card.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      show(e.clientX, e.clientY, card);
    });
  });

  copyBtn.addEventListener('click', function() {
    if (!activeCard) return hide();
    var url = buildLink(activeCard);
    var done = function() { flash('Copied!'); };
    var fail = function() { flash('Copy failed', 1200); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done).catch(fail);
    } else {
      var ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        done();
      } catch (err) {
        fail();
      }
      document.body.removeChild(ta);
    }
  });

  document.addEventListener('mousedown', function(e) {
    if (!menu.hidden && !menu.contains(e.target)) hide();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
  window.addEventListener('blur', hide);
})();

// Topic focus from URL — filter wins, so only honour ?topic= when no real filter is set.
// If both are present, drop ?topic= from the URL on load.
var FOCUS_EL = (function() {
  var qs = new URLSearchParams(window.location.search);
  var filter = qs.get('filter');
  var topic = qs.get('topic');
  if (filter && filter !== 'all') {
    if (topic) {
      var url = new URL(window.location.href);
      url.searchParams.delete('topic');
      window.history.replaceState(null, '', url);
    }
    return null;
  }
  return topic ? document.getElementById(topic) : null;
})();

function clearFocus() {
  if (FOCUS_EL) FOCUS_EL.classList.remove('is-focused');
  FOCUS_EL = null;
  var url = new URL(window.location.href);
  if (url.searchParams.has('topic')) {
    url.searchParams.delete('topic');
    window.history.replaceState(null, '', url);
  }
}

if (FOCUS_EL) {
  FOCUS_EL.classList.add('is-focused');
}

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
      if (filter !== 'all') clearFocus();
      apply(filter);
      updateUrl(filter);
    });
  });

  var initial = normalize(new URLSearchParams(window.location.search).get('filter'));
  apply(initial);
})();

// Scroll to focused card on initial paint (and once more on full load
// so images settling in don't leave the card off-screen)
function scrollToFocus() {
  if (!FOCUS_EL) return;
  FOCUS_EL.scrollIntoView({ block: 'center', behavior: 'instant' });
}
document.addEventListener('DOMContentLoaded', scrollToFocus);
window.addEventListener('load', scrollToFocus);
