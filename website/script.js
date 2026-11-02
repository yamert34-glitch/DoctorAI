const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!expanded));
  navigation?.classList.toggle("is-open", !expanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation?.classList.remove("is-open");
  });
});

document.querySelectorAll(".mission-exhibit").forEach((exhibit) => {
  const buttons = exhibit.querySelectorAll("[data-brief-button]");
  const number = exhibit.querySelector("[data-brief-number]");
  const title = exhibit.querySelector("[data-brief-title]");
  const copy = exhibit.querySelector("[data-brief-copy]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      number.textContent = button.dataset.number;
      title.textContent = button.dataset.title;
      copy.textContent = button.dataset.copy;
    });
  });

  const frame = exhibit.querySelector(".mission-exhibit__frame");
  const reticle = exhibit.querySelector(".mission-exhibit__reticle");

  if (frame && reticle && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    frame.addEventListener("pointermove", (event) => {
      const bounds = frame.getBoundingClientRect();
      reticle.style.left = `${event.clientX - bounds.left}px`;
      reticle.style.top = `${event.clientY - bounds.top}px`;
      frame.classList.add("is-tracking");
    });

    frame.addEventListener("pointerleave", () => {
      frame.classList.remove("is-tracking");
    });
  }
});
