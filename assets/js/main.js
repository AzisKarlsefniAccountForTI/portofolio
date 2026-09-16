document.addEventListener("DOMContentLoaded", () => {
  // 1. spotlight kursor mengikuti mouse
  const glow = document.getElementById("cursorGlow");
  if (glow) {
    window.addEventListener("pointermove", (e) => {
      glow.animate(
        {
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
        },
        { duration: 400, fill: "forwards" }
      );
    });
  }

  // 2. animasi progress bar saat di-scroll
  const progressBars = document.querySelectorAll(".progress-fill");
  if (progressBars.length > 0) {
    // simpan target lebar asli lalu set awal ke 0
    progressBars.forEach((bar) => {
      const targetWidth = bar.style.width || "0%";
      bar.dataset.targetWidth = targetWidth;
      bar.style.width = "0%";
      bar.style.transition = "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)";
    });

    const skillSection = document.getElementById("skills");
    if (skillSection) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              progressBars.forEach((bar) => {
                bar.style.width = bar.dataset.targetWidth;
              });
              obs.unobserve(entry.target); // animasi jalan sekali saja
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(skillSection);
    }
  }

  // 3. efek 3d tilt ringan pada kartu kaca
  const cards = document.querySelectorAll(".interactive-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      card.style.transition = "transform 0.4s ease";
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "transform 0.1s ease-out";
    });
  });

  // 4. scrollspy tautan navigasi
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.style.opacity = link.getAttribute("href") === `#${current}` ? "1" : "0.75";
      link.style.fontWeight = link.getAttribute("href") === `#${current}` ? "700" : "500";
    });
  });
});