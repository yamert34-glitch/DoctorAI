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

const viewCount = document.querySelector("[data-view-count]");

if (viewCount) {
  try {
    const storageKey = "doctor-ai-unique-browser-count-v1";
    let count = localStorage.getItem(storageKey) === "true" ? 1 : 0;

    if (count === 0) {
      localStorage.setItem(storageKey, "true");
      count = 1;
    }

    viewCount.textContent = String(count);
  } catch (error) {
    viewCount.textContent = "—";
    console.error("The local browser counter could not access browser storage.", error);
  }
}
