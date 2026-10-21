// FAQ toggle
document.querySelectorAll(".faq-item").forEach(item => {
    item.querySelector(".faq-question").addEventListener("click", () => {
        item.classList.toggle("open");
    });
});

// Mobile menu (hamburger)
const navbar = document.querySelector(".navbar");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

function setMenuOpen(open) {
    navbar.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

navToggle.addEventListener("click", () => {
    setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
});

// Close after choosing a link
navLinks.addEventListener("click", e => {
    if (e.target.closest("a")) setMenuOpen(false);
});

// Close with Escape and return focus to the button
document.addEventListener("keydown", e => {
    if (e.key === "Escape" && navbar.classList.contains("menu-open")) {
        setMenuOpen(false);
        navToggle.focus();
    }
});

// Reset the menu when the viewport grows back to desktop
window.matchMedia("(min-width: 701px)").addEventListener("change", e => {
    if (e.matches) setMenuOpen(false);
});
