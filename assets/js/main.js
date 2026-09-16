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

// 5. logika terminal interaktif mini
  const termInput = document.getElementById("terminalInput");
  const termOutput = document.getElementById("terminalOutput");

  if (termInput && termOutput) {
    const commands = {
      help: () => `
Perintah yang tersedia:
  <span class="term-highlight">neofetch</span>  : Informasi sistem & environment
  <span class="term-highlight">skills</span>    : Ringkasan stack teknologi
  <span class="term-highlight">projects</span>  : Daftar proyek pilihan
  <span class="term-highlight">clear</span>     : Membersihkan layar terminal
  <span class="term-highlight">contact</span>   : Informasi kontak langsung
      `,
      neofetch: () => `
<span class="term-highlight">azis@fedora-workstation</span>
--------------------
<span class="term-accent">OS:</span> Fedora Linux (Workstation Edition)
<span class="term-accent">Host:</span> Undergraduate IT Student
<span class="term-accent">Shell:</span> Bash
<span class="term-accent">Editor:</span> Visual Studio Code
<span class="term-accent">Engine:</span> Godot Engine 4.x
<span class="term-accent">AI Toolkit:</span> Google AI Studio & LLM APIs
      `,
      skills: () => `
Core Tech:
- Python (CLI & Data Validation)
- GDScript (Game Architecture)
- Bash & Linux Environment
- Vanilla Web (HTML, Glassmorphism CSS, JS)
      `,
      projects: () => `
Repositori Utama:
1. <a href="https://github.com/AzisKarlsefniAccountForTI/PBO" target="_blank" style="color:#38bdf8;">[PBO] Inventaris BMN CLI</a>
2. <a href="https://github.com/AzisKarlsefniAccountForTI/pixel-game" target="_blank" style="color:#38bdf8;">[Game] Pixel Fighting 2D (Godot)</a>
3. [Publikasi] Buku Etika Profesi IT
      `,
      contact: () => `
Kontak:
- Email: <a href="https://mail.google.com/mail/?view=cm&fs=1&to=azizkhoirul4816@gmail.com" target="_blank" style="color:#38bdf8;">azizkhoirul4816@gmail.com</a>
- GitHub: <a href="https://github.com/AzisKarlsefniAccountForTI" target="_blank" style="color:#38bdf8;">AzisKarlsefniAccountForTI</a>
      `,
      clear: () => {
        termOutput.innerHTML = "";
        return null;
      }
    };

    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const rawVal = termInput.value.trim();
        const cmd = rawVal.toLowerCase();
        
        if (cmd === "") return;

        // Cetak perintah user
        const userLine = document.createElement("div");
        userLine.className = "terminal-line";
        userLine.innerHTML = `<span class="term-prompt">azis@fedora:~$</span> ${escapeHtml(rawVal)}`;
        termOutput.appendChild(userLine);

        // Eksekusi respon
        if (commands[cmd]) {
          const res = commands[cmd]();
          if (res !== null) {
            const resLine = document.createElement("div");
            resLine.className = "terminal-line";
            resLine.innerHTML = res.replace(/\n/g, "<br>");
            termOutput.appendChild(resLine);
          }
        } else {
          const errLine = document.createElement("div");
          errLine.className = "terminal-line text-muted";
          errLine.innerHTML = `bash: ${escapeHtml(rawVal)}: perintah tidak ditemukan. Ketik <span class="term-highlight">'help'</span>.`;
          termOutput.appendChild(errLine);
        }

        termInput.value = "";
        termOutput.scrollTop = termOutput.scrollHeight;
      }
    });

    function escapeHtml(string) {
      return String(string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }