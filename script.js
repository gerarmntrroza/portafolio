const FORM_URL = "https://formspree.io/f/myeevpwj";
const form = document.getElementById("contact-form");
const statusBox = document.getElementById("form-status");
const submitBtn = form.querySelector(".form__submit");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  statusBox.textContent = "";
  statusBox.className = "form__status";

  try {
    const response = await fetch(FORM_URL, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });

    if (!response.ok) {
      throw new Error("Error al enviar");
    }

    form.reset();
    statusBox.textContent = "¡Mensaje enviado! Te responderé pronto.";
    statusBox.classList.add("is-ok");
  } catch (error) {
    statusBox.textContent = "No se pudo enviar. Intenta de nuevo o escríbeme por correo.";
    statusBox.classList.add("is-error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar mensaje";
  }
});

const nav = document.getElementById("nav");
const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelectorAll(".nav__links a");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

navToggle.addEventListener("click", () => {
  setMenu(!nav.classList.contains("is-open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
  }
});

window.matchMedia("(min-width: 901px)").addEventListener("change", () => {
  setMenu(false);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".gallery").forEach((gallery) => {
  const track = gallery.querySelector(".gallery__track");
  const prev = gallery.querySelector(".gallery__btn--prev");
  const next = gallery.querySelector(".gallery__btn--next");
  const count = gallery.querySelector(".gallery__count");
  const total = track.children.length;

  function update() {
    const index = Math.round(track.scrollLeft / track.clientWidth);
    count.textContent = `${index + 1} / ${total}`;
    prev.disabled = index === 0;
    next.disabled = index === total - 1;
  }

  function move(direction) {
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: reduceMotion.matches ? "auto" : "smooth",
    });
  }

  prev.addEventListener("click", () => move(-1));
  next.addEventListener("click", () => move(1));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);

  update();
});

const watchedSections = document.querySelectorAll(".hero, main section[id]");
const menuLinks = document.querySelectorAll(".nav__links a");

function markActive(id) {
  menuLinks.forEach((link) => {
    if (id && link.getAttribute("href") === `#${id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        markActive(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

watchedSections.forEach((section) => sectionObserver.observe(section));

window.addEventListener(
  "scroll",
  () => {
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
    if (atBottom) {
      markActive("contact");
    }
  },
  { passive: true }
);