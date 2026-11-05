const form = document.getElementById("contact-form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nombre = form.nombre.value.trim();
  const email = form.email.value.trim();
  const mensaje = form.mensaje.value.trim();

  const asunto = encodeURIComponent(`Mensaje de ${nombre} desde tu portafolio`);
  const cuerpo = encodeURIComponent(`${mensaje}\n\nNombre: ${nombre}\nEmail: ${email}`);

  window.location.href = `mailto:gerardomonterroza39@gmail.com?subject=${asunto}&body=${cuerpo}`;
  form.reset();
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