document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("nav a");
  const nav = document.querySelector("nav.navbar");

  // Get sections corresponding to nav links
  const sections = Array.from(navLinks)
    .map(link => link.getAttribute("href"))
    .filter(href => href.startsWith("#"))
    .map(id => document.querySelector(id))
    .filter(Boolean);

  const getCurrentSection = () => {
    let current = sections[0];
    const scrollPos = window.scrollY + nav.offsetHeight + 10; // account for fixed navbar
    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section;
      }
    });
    return current;
  };

  const updateActiveLink = () => {
    const currentSection = getCurrentSection();
    navLinks.forEach(link => link.classList.remove("active"));
    const activeLink = Array.from(navLinks).find(
      link => link.getAttribute("href") === "#" + currentSection.id
    );
    if (activeLink) activeLink.classList.add("active");
  };

  const onScroll = () => {
    // Toggle 'scrolled' class
    if (window.scrollY > 20) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");

    // Update active link
    updateActiveLink();
  };

  window.addEventListener("scroll", onScroll);
  onScroll(); // run on load

  navLinks.forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navHeight = nav.offsetHeight; // height of navbar
        const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth" // this enables smooth scrolling
        });
      }
    }
  });
});


  // --- Carousel Code ---
  (() => {
    const AUTO_MS = 4000;
    const carousel = document.getElementById("carousel");
    const slides = Array.from(carousel.querySelectorAll(".slide"));
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsWrap = document.getElementById("dots");

    slides.forEach((_, i) => {
      const d = document.createElement("span");
      d.className = "dot" + (i === 0 ? " active" : "");
      const f = document.createElement("span");
      f.className = "fill";
      d.appendChild(f);
      dotsWrap.appendChild(d);
    });

    const dots = Array.from(dotsWrap.querySelectorAll(".dot"));
    let current = 0;
    let timer = null;

    function centerSlide(index, animate = true) {
      const viewport = document.querySelector(".carousel-viewport");
      const vpRect = viewport.getBoundingClientRect();
      const slideEl = slides[index];
      const slideRect = slideEl.getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      const slideOffsetLeft = slideRect.left - carouselRect.left;
      const desiredTranslate =
        slideOffsetLeft - (vpRect.width - slideRect.width) / 2;
      if (!animate) carousel.style.transition = "none";
      carousel.style.transform = `translateX(${-desiredTranslate}px)`;
      if (!animate) {
        void carousel.offsetWidth;
        carousel.style.transition = "";
      }
    }

    function update(index) {
      slides.forEach(s => s.classList.remove("active"));
      slides[index].classList.add("active");

      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index);
        const fill = dot.querySelector(".fill");
        fill.style.transition = "none";
        fill.style.width = "0%";
        void fill.offsetWidth;
        fill.style.transition = `width ${AUTO_MS}ms linear`;
        if (i === index) {
          setTimeout(() => (fill.style.width = "100%"), 50);
        }
      });
      centerSlide(index);
    }

    function next() {
      current = (current + 1) % slides.length;
      update(current);
    }

    function prev() {
      current = (current - 1 + slides.length) % slides.length;
      update(current);
    }

    nextBtn.addEventListener("click", () => {
      next();
      restartTimer();
    });
    prevBtn.addEventListener("click", () => {
      prev();
      restartTimer();
    });
    dots.forEach((dot, i) =>
      dot.addEventListener("click", () => {
        current = i;
        update(current);
        restartTimer();
      })
    );

    const wrap = document.querySelector(".carousel-wrap");
    wrap.addEventListener("mouseenter", () => pauseTimer());
    wrap.addEventListener("mouseleave", () => startTimer());

    function startTimer() {
      pauseTimer();
      timer = setInterval(() => next(), AUTO_MS);
      const activeFill = dots[current].querySelector(".fill");
      activeFill.style.transition = `width ${AUTO_MS}ms linear`;
      activeFill.style.width = "100%";
    }

    function pauseTimer() {
      clearInterval(timer);
      timer = null;
      dots.forEach(dot => {
        const fill = dot.querySelector(".fill");
        const computed = window.getComputedStyle(fill).width;
        fill.style.transition = "none";
        fill.style.width = computed;
      });
    }

    function restartTimer() {
      pauseTimer();
      setTimeout(startTimer, 800);
    }

    slides.forEach(slide => {
      slide.addEventListener("mouseenter", () => slide.classList.add("hovering"));
      slide.addEventListener("mouseleave", () => slide.classList.remove("hovering"));
    });

    update(current);
    setTimeout(() => centerSlide(current, false), 80);
    startTimer();
    window.addEventListener("resize", () => setTimeout(() => centerSlide(current, false), 100));
  })();
});
