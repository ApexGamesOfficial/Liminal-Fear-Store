/* =========================================================
   LIMINAL FEAR STORE
   script.js — v0.1
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const body = document.body;

const cartButton = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const cartClose = document.getElementById("cartClose");
const continueShopping = document.getElementById("continueShopping");

const searchButton = document.getElementById("searchButton");
const productSearch = document.getElementById("productSearch");

const filterButtons = document.querySelectorAll(".filter");
const productCards = document.querySelectorAll(".product-card");

const navLinks = document.querySelectorAll(".nav-link");


/* =========================================================
   CART DRAWER
   ========================================================= */

function openCart() {
  if (!cartDrawer || !cartBackdrop) return;

  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");

  cartDrawer.setAttribute("aria-hidden", "false");

  body.classList.add("cart-open");

  if (cartClose) {
    cartClose.focus();
  }
}


function closeCart() {
  if (!cartDrawer || !cartBackdrop) return;

  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");

  cartDrawer.setAttribute("aria-hidden", "true");

  body.classList.remove("cart-open");
}


if (cartButton) {
  cartButton.addEventListener("click", openCart);
}

if (cartClose) {
  cartClose.addEventListener("click", closeCart);
}

if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCart);
}

if (continueShopping) {
  continueShopping.addEventListener("click", () => {
    closeCart();

    const shopSection = document.getElementById("shop");

    if (shopSection) {
      shopSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  });
}


/* ---------- ESC closes cart ---------- */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
  }
});


/* =========================================================
   SEARCH BUTTON
   ========================================================= */

if (searchButton && productSearch) {
  searchButton.addEventListener("click", () => {

    const shopSection = document.getElementById("shop");

    if (shopSection) {
      shopSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

    /*
      Wait for scrolling to begin before focusing.
    */

    window.setTimeout(() => {
      productSearch.focus();
    }, 450);

  });
}


/* =========================================================
   PRODUCT FILTERING
   ========================================================= */

let activeFilter = "all";


function setActiveFilter(filterName) {
  activeFilter = filterName;

  filterButtons.forEach((button) => {

    const buttonFilter = button.dataset.filter;

    button.classList.toggle(
      "active",
      buttonFilter === filterName
    );

  });

  filterProducts();
}


function filterProducts() {

  /*
    There are intentionally no fake products in v0.1.

    Once real Fourthwall products are connected,
    each product card can use:

    data-category="plushies"
    data-name="Wanderer Plush"

    and this filtering system will work.
  */

  const searchValue = productSearch
    ? productSearch.value.trim().toLowerCase()
    : "";


  productCards.forEach((card) => {

    const category =
      (card.dataset.category || "").toLowerCase();

    const productName =
      (card.dataset.name || "").toLowerCase();


    const matchesCategory =
      activeFilter === "all" ||
      category === activeFilter;


    const matchesSearch =
      searchValue === "" ||
      productName.includes(searchValue);


    card.hidden = !(
      matchesCategory &&
      matchesSearch
    );

  });

}


filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    const filterName =
      button.dataset.filter || "all";

    setActiveFilter(filterName);

  });

});


if (productSearch) {
  productSearch.addEventListener(
    "input",
    filterProducts
  );
}


/* =========================================================
   COLLECTION CARDS
   ========================================================= */

const collectionCards =
  document.querySelectorAll(".collection-card");


collectionCards.forEach((card) => {

  card.addEventListener("click", () => {

    const heading =
      card.querySelector("h3");

    if (!heading) return;


    const collectionName =
      heading.textContent
        .trim()
        .toLowerCase();


    const validFilters = [
      "plushies",
      "apparel",
      "stickers",
      "drinkware"
    ];


    if (
      validFilters.includes(collectionName)
    ) {
      setActiveFilter(collectionName);
    }

  });

});


/* =========================================================
   SMOOTH INTERNAL LINKS
   ========================================================= */

const internalLinks =
  document.querySelectorAll('a[href^="#"]');


internalLinks.forEach((link) => {

  link.addEventListener("click", (event) => {

    const targetId =
      link.getAttribute("href");


    /*
      Ignore empty # links.
    */

    if (
      !targetId ||
      targetId === "#"
    ) {
      event.preventDefault();
      return;
    }


    const target =
      document.querySelector(targetId);


    if (!target) return;


    event.preventDefault();


    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  });

});


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

const sections = [
  document.getElementById("home"),
  document.getElementById("shop"),
  document.getElementById("collections"),
  document.getElementById("contact")
].filter(Boolean);


function updateActiveNavigation() {

  /*
    Offset gives the section a little breathing room
    before changing the active navbar tab.
  */

  const scrollPosition =
    window.scrollY + 220;


  let currentSection = "home";


  sections.forEach((section) => {

    if (
      section.offsetTop <= scrollPosition
    ) {
      currentSection = section.id;
    }

  });


  navLinks.forEach((link) => {

    const href =
      link.getAttribute("href");


    link.classList.toggle(
      "active",
      href === `#${currentSection}`
    );

  });

}


window.addEventListener(
  "scroll",
  updateActiveNavigation,
  { passive: true }
);


updateActiveNavigation();


/* =========================================================
   NAVBAR SCROLL BEHAVIOR
   ========================================================= */

const siteHeader =
  document.querySelector(".site-header");


function updateHeader() {

  if (!siteHeader) return;


  /*
    Once the visitor leaves the hero,
    the navbar stays accessible.
  */

  if (window.scrollY > 90) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }

}


window.addEventListener(
  "scroll",
  updateHeader,
  { passive: true }
);


updateHeader();


/* =========================================================
   FEAR WORDMARK FALLBACK
   ========================================================= */

const fearImage =
  document.querySelector(".fear-word img");


if (fearImage) {

  fearImage.addEventListener(
    "error",
    () => {

      const fearContainer =
        fearImage.closest(".fear-word");


      if (!fearContainer) return;


      /*
        If the image path is wrong, we still show FEAR
        instead of leaving a giant blank space.
      */

      fearImage.style.display = "none";

      fearContainer.classList.add(
        "fear-fallback"
      );


      if (
        !fearContainer.querySelector(
          ".fear-fallback-text"
        )
      ) {

        const fallback =
          document.createElement("span");


        fallback.className =
          "fear-fallback-text";


        fallback.textContent =
          "FEAR";


        fearContainer.appendChild(
          fallback
        );

      }

    }
  );

}


/* =========================================================
   READY
   ========================================================= */

document.documentElement.classList.add(
  "liminal-fear-ready"
);
