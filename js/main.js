"use strict";
/*1. DOM ELEMENTS*/

const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.querySelector(".primary-nav");
const dropdowns = document.querySelectorAll(".dropdown");


/* 2. MOBILE NAVIGATION*/

function openMobileMenu() {
    if (!navToggle || !primaryNav) return;

    primaryNav.classList.add("active");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
}

function closeMobileMenu() {
    if (!navToggle || !primaryNav) return;

    primaryNav.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");

    closeAllDropdowns();
}

function toggleMobileMenu() {
    if (!navToggle || !primaryNav) return;

    const isOpen = primaryNav.classList.contains("active");

    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (navToggle) {
    navToggle.addEventListener("click", toggleMobileMenu);
}


/*3. DROPDOWN FUNCTIONS */

function openDropdown(dropdown) {
    const button = dropdown.querySelector(".dropdown-toggle");

    if (!button) return;

    dropdown.classList.add("open");
    button.setAttribute("aria-expanded", "true");
}

function closeDropdown(dropdown) {
    const button = dropdown.querySelector(".dropdown-toggle");

    if (!button) return;

    dropdown.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
}

function closeAllDropdowns(except = null) {
    dropdowns.forEach((dropdown) => {
        if (dropdown !== except) {
            closeDropdown(dropdown);
        }
    });
}


/* 4. DROPDOWN BUTTONS*/

dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");

    if (!button) return;

    button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const isOpen = dropdown.classList.contains("open");

        closeAllDropdowns(dropdown);

        if (isOpen) {
            closeDropdown(dropdown);
        } else {
            openDropdown(dropdown);
        }
    });
});


/* 5. CLOSE MENU WHEN NAV LINK IS CLICKED*/

const navLinks = document.querySelectorAll(
    ".primary-nav a:not(.dropdown-toggle)"
);

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeAllDropdowns();

        if (window.innerWidth <= 900) {
            closeMobileMenu();
        }
    });
});


/* 6. CLOSE DROPDOWNS WHEN CLICKING OUTSIDE*/

document.addEventListener("click", (event) => {
    const clickedInsideDropdown = event.target.closest(".dropdown");

    if (!clickedInsideDropdown) {
        closeAllDropdowns();
    }

    const clickedInsideNavigation =
        event.target.closest(".primary-nav") ||
        event.target.closest(".nav-toggle");

    if (
        window.innerWidth <= 900 &&
        !clickedInsideNavigation
    ) {
        closeMobileMenu();
    }
});


/* 7. ESCAPE KEY SUPPORT*/

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    closeAllDropdowns();

    if (window.innerWidth <= 900) {
        closeMobileMenu();

        if (navToggle) {
            navToggle.focus();
        }
    }
});


/*8. KEYBOARD DROPDOWN SUPPORT */

dropdowns.forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-toggle");
    const menuLinks = dropdown.querySelectorAll(".dropdown-menu a");

    if (!button) return;

    button.addEventListener("keydown", (event) => {

        if (event.key === "ArrowDown") {
            event.preventDefault();

            openDropdown(dropdown);

            if (menuLinks.length > 0) {
                menuLinks[0].focus();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            openDropdown(dropdown);

            if (menuLinks.length > 0) {
                menuLinks[menuLinks.length - 1].focus();
            }
        }
    });

    menuLinks.forEach((link, index) => {

        link.addEventListener("keydown", (event) => {

            if (event.key === "ArrowDown") {
                event.preventDefault();

                const nextIndex =
                    (index + 1) % menuLinks.length;

                menuLinks[nextIndex].focus();
            }

            if (event.key === "ArrowUp") {
                event.preventDefault();

                const previousIndex =
                    (index - 1 + menuLinks.length) %
                    menuLinks.length;

                menuLinks[previousIndex].focus();
            }

            if (event.key === "Escape") {
                event.preventDefault();

                closeDropdown(dropdown);
                button.focus();
            }

            if (event.key === "Home") {
                event.preventDefault();
                menuLinks[0].focus();
            }

            if (event.key === "End") {
                event.preventDefault();
                menuLinks[menuLinks.length - 1].focus();
            }
        });
    });
});


/* 9. CLOSE MOBILE MENU WHEN WINDOW EXPANDS */

let previousWidth = window.innerWidth;

window.addEventListener("resize", () => {

    const currentWidth = window.innerWidth;

    /*
     * If the browser moves from mobile navigation
     * back to desktop navigation, reset the menu state.
     */
    if (previousWidth <= 900 && currentWidth > 900) {
        closeMobileMenu();
        closeAllDropdowns();
    }

    previousWidth = currentWidth;
});


/* 10. ACTIVE PAGE NAVIGATION */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const allNavLinks =
        document.querySelectorAll(".primary-nav a[href]");

    allNavLinks.forEach((link) => {

        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) {
            return;
        }

        const linkPage =
            href.split("/").pop().split("#")[0];

        if (linkPage === currentPage) {

            /*
             * Don't mark dropdown section links as the
             * primary active navigation item.
             */
            if (!link.closest(".dropdown-menu")) {
                link.classList.add("active");
                link.setAttribute("aria-current", "page");
            }
        }
    });
}

setActiveNavigation();


/* 11. SCROLL STATE FOR HEADER */

const siteHeader = document.querySelector(".site-header");

function updateHeaderOnScroll() {

    if (!siteHeader) return;

    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener(
    "scroll",
    updateHeaderOnScroll,
    { passive: true }
);

updateHeaderOnScroll();


/* 12. SMOOTH SCROLL FOR SAME-PAGE ANCHORS */

const samePageLinks =
    document.querySelectorAll('a[href*="#"]');

samePageLinks.forEach((link) => {

    link.addEventListener("click", (event) => {

        const href = link.getAttribute("href");

        if (!href || href === "#") {
            return;
        }

        const hashPosition = href.indexOf("#");

        if (hashPosition === -1) {
            return;
        }

        const targetId =
            href.substring(hashPosition + 1);

        const currentPath =
            window.location.pathname.split("/").pop() ||
            "index.html";

        const linkPath =
            href.substring(0, hashPosition);

        const normalizedLinkPath =
            linkPath === ""
                ? currentPath
                : linkPath.split("/").pop();

        if (normalizedLinkPath !== currentPath) {
            return;
        }

        const target =
            document.getElementById(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior:
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",
            block: "start"
        });

        /*
         * Give keyboard users a logical focus target.
         */
        if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
        }

        target.focus({
            preventScroll: true
        });

        if (window.innerWidth <= 900) {
            closeMobileMenu();
        }
    });
});


/*13. PREVENT BODY SCROLL WHILE MOBILE MENU IS OPEN */

const bodyStyle = document.createElement("style");

bodyStyle.textContent = `
    @media (max-width: 900px) {
        body.menu-open {
            overflow: hidden;
        }
    }
`;

document.head.appendChild(bodyStyle);


/* 14. INITIAL ARIA STATE */

if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
}

dropdowns.forEach((dropdown) => {

    const button =
        dropdown.querySelector(".dropdown-toggle");

    if (button) {
        button.setAttribute("aria-expanded", "false");
    }
});
    document.addEventListener("DOMContentLoaded", function () {
        const backToTop = document.getElementById("back-to-top");

        if (!backToTop) return;

        function toggleBackToTop() {
            if (window.scrollY > 500) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        }

        window.addEventListener("scroll", toggleBackToTop, { passive: true });

        backToTop.addEventListener("click", function () {
            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? "auto" : "smooth"
            });
        });

        toggleBackToTop();
    });

/*15. EXPOSE CLEAN INITIAL STATE*/

document.documentElement.classList.add("js-enabled");


/* END OF MAIN.JS */