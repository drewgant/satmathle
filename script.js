const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-menu");
    });
}

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("mobile-menu");
    });
});

window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 40) {
        navbar.style.boxShadow = "0 15px 35px rgba(0,0,0,.12)";
        navbar.style.height = "74px";
    } else {
        navbar.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
        navbar.style.height = "82px";
    }
});