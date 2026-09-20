/* =========================================================
   LIMINAL FEAR STORE
   script.js — v0.2
   ========================================================= */

"use strict";


/* =========================================================
   HELPERS
   ========================================================= */

const body = document.body;

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}


/* =========================================================
   ELEMENTS
   ========================================================= */

const siteHeader = $("#siteHeader");

/* Search */
const searchButton = $("#searchButton");
const navSearchPanel = $("#navSearchPanel");
const navSearchInput = $("#navSearchInput");
const searchClose = $("#searchClose");
const searchResults = $("#searchResults");

/* Cart */
const cartButton = $("#cartButton");
const cartDrawer = $("#cartDrawer");
const cartBackdrop = $("#cartBackdrop");
const cartClose = $("#cartClose");

/* Discount */
const discountPopup = $("#discountPopup");
const discountBackdrop = $("#discountBackdrop");
const discountClose = $("#discountClose");
const discountSkip = $("#discountSkip");
const discountForm = $("#discountForm");
const discountEmail = $("#discountEmail");
const openDiscount = $("#openDiscount");


/* =========================================================
   BODY SCROLL LOCK
   ========================================================= */

function updateBodyLock() {
  const cartOpen =
    cartDrawer?.classList.contains("open");

  const discountOpen =
    discountPopup?.classList.contains("open");

  body.classList.toggle(
    "overlay-open",
    Boolean(cartOpen || discountOpen)
  );
}


/* =========================================================
   STICKY NAVBAR
   ========================================================= */

function updateNavbar() {
  if (!siteHeader) return;

  siteHeader.classList.toggle(
    "scrolled",
    window.scrollY > 30
  );
}

window.addEventListener(
  "scroll",
  updateNavbar,
  { passive: true }
);

updateNavbar();


/* =========================================================
   SEARCH
   ========================================================= */

function openSearch() {
  if (!navSearchPanel) return;

  /*
    Don't let the cart and search overlap.
  */

  closeCart();

  navSearchPanel.classList.add("open");

  navSearchPanel.setAttribute(
    "aria-hidden",
    "false"
  );

  searchButton?.setAttribute(
    "aria-expanded",
    "true"
  );

  window.setTimeout(() => {
    navSearchInput?.focus();
  }, 120);
}


function closeSearch() {
  if (!navSearchPanel) return;

  navSearchPanel.classList.remove("open");

  navSearchPanel.setAttribute(
    "aria-hidden",
    "true"
  );

  searchButton?.setAttribute(
    "aria-expanded",
    "false"
  );
}


function toggleSearch() {
  if (!navSearchPanel) return;

  if (
    navSearchPanel.classList.contains("open")
  ) {
    closeSearch();
  } else {
    openSearch();
  }
}


searchButton?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
    toggleSearch();
  }
);


searchClose?.addEventListener(
  "click",
  closeSearch
);


navSearchPanel?.addEventListener(
  "click",
  (event) => {
    event.stopPropagation();
  }
);


/* =========================================================
   SEARCH DATA

   IMPORTANT:
   These are categories, NOT fake products.

   Later we'll replace/extend this with actual merchandise.
   ========================================================= */

const searchableDestinations = [
  {
    name: "Plushies",
    type: "Collection",
    url: "collections.html#plushies"
  },

  {
    name: "Apparel",
    type: "Collection",
    url: "collections.html#apparel"
  },

  {
    name: "Stickers",
    type: "Collection",
    url: "collections.html#stickers"
  },

  {
    name: "Drinkware",
    type: "Collection",
    url: "collections.html#drinkware"
  },

  {
    name: "Wanderer",
    type: "Character",
    url: "collections.html#plushies"
  },

  {
    name: "Bacteria",
    type: "Character",
    url: "collections.html#plushies"
  },

  {
    name: "Cap'n Clark",
    type: "Character",
    url: "collections.html#plushies"
  }
];


/* =========================================================
   RENDER SEARCH RESULTS
   ========================================================= */

function renderSearchResults(query) {
  if (!searchResults) return;

  const cleanedQuery =
    query.trim().toLowerCase();


  if (!cleanedQuery) {
    searchResults.innerHTML = `
      <p class="search-hint">
        Search plushies, apparel, stickers,
        drinkware and more.
      </p>
    `;

    return;
  }


  const matches =
    searchableDestinations.filter((item) => {
      return (
        item.name
          .toLowerCase()
          .includes(cleanedQuery) ||

        item.type
          .toLowerCase()
          .includes(cleanedQuery)
      );
    });


  if (matches.length === 0) {
    searchResults.innerHTML = `
      <p class="search-hint">
        No matching products or collections yet.
      </p>
    `;

    return;
  }


  searchResults.innerHTML =
    matches
      .map((item) => {
        return `
          <a
            class="search-result-item"
            href="${item.url}"
          >
            <span>
              <strong>
                ${escapeHTML(item.name)}
              </strong>

              <small>
                ${escapeHTML(item.type)}
              </small>
            </span>

            <span class="search-result-arrow">
              →
            </span>
          </a>
        `;
      })
      .join("");
}


navSearchInput?.addEventListener(
  "input",
  () => {
    renderSearchResults(
      navSearchInput.value
    );
  }
);


/* =========================================================
   SEARCH — CLICK OUTSIDE
   ========================================================= */

document.addEventListener(
  "click",
  (event) => {
    if (!navSearchPanel) return;

    const clickedSearchButton =
      searchButton?.contains(event.target);

    const clickedPanel =
      navSearchPanel.contains(event.target);

    if (
      !clickedSearchButton &&
      !clickedPanel
    ) {
      closeSearch();
    }
  }
);


/* =========================================================
   CART
   ========================================================= */

function openCart() {
  if (
    !cartDrawer ||
    !cartBackdrop
  ) {
    return;
  }

  closeSearch();
  closeDiscount();

  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");

  cartDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  updateBodyLock();

  window.setTimeout(() => {
    cartClose?.focus();
  }, 150);
}


function closeCart() {
  if (
    !cartDrawer ||
    !cartBackdrop
  ) {
    return;
  }

  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");

  cartDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  updateBodyLock();
}


cartButton?.addEventListener(
  "click",
  openCart
);

cartClose?.addEventListener(
  "click",
  closeCart
);

cartBackdrop?.addEventListener(
  "click",
  closeCart
);


/* =========================================================
   DISCOUNT POPUP STORAGE
   ========================================================= */

/*
  This controls how often the popup is allowed to appear.

  We're intentionally making it uncommon.

  DISMISS COOLDOWN:
  7 days

  SUCCESS COOLDOWN:
  30 days

  The offer itself should NOT issue a real discount until
  the commerce/email backend is configured.
*/

const DISCOUNT_STORAGE = {
  lastShown:
    "liminalFearDiscountLastShown",

  dismissed:
    "liminalFearDiscountDismissed",

  submitted:
    "liminalFearDiscountSubmitted"
};


const ONE_DAY =
  24 * 60 * 60 * 1000;

const DISMISS_COOLDOWN =
  7 * ONE_DAY;

const SUBMIT_COOLDOWN =
  30 * ONE_DAY;


/* =========================================================
   SAFE LOCAL STORAGE
   ========================================================= */

function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}


function storageSet(key, value) {
  try {
    localStorage.setItem(
      key,
      String(value)
    );
  } catch {
    /*
      Store still works if storage
      is unavailable.
    */
  }
}


/* =========================================================
   DISCOUNT ELIGIBILITY
   ========================================================= */

function canShowDiscount() {
  const now = Date.now();

  const lastShown =
    Number(
      storageGet(
        DISCOUNT_STORAGE.lastShown
      )
    ) || 0;

  const dismissed =
    Number(
      storageGet(
        DISCOUNT_STORAGE.dismissed
      )
    ) || 0;

  const submitted =
    Number(
      storageGet(
        DISCOUNT_STORAGE.submitted
      )
    ) || 0;


  /*
    Don't show again soon after somebody
    entered their email.
  */

  if (
    submitted &&
    now - submitted < SUBMIT_COOLDOWN
  ) {
    return false;
  }


  /*
    Don't annoy somebody who said no.
  */

  if (
    dismissed &&
    now - dismissed < DISMISS_COOLDOWN
  ) {
    return false;
  }


  /*
    Even if they didn't interact with it,
    don't keep showing it repeatedly.
  */

  if (
    lastShown &&
    now - lastShown < DISMISS_COOLDOWN
  ) {
    return false;
  }


  return true;
}


/* =========================================================
   DISCOUNT OPEN / CLOSE
   ========================================================= */

function openDiscount({
  automatic = false
} = {}) {

  if (
    !discountPopup ||
    !discountBackdrop
  ) {
    return;
  }


  closeSearch();
  closeCart();


  discountPopup.classList.add("open");
  discountBackdrop.classList.add("open");

  discountPopup.setAttribute(
    "aria-hidden",
    "false"
  );


  if (automatic) {
    storageSet(
      DISCOUNT_STORAGE.lastShown,
      Date.now()
    );
  }


  updateBodyLock();


  window.setTimeout(() => {
    discountEmail?.focus();
  }, 180);
}


function closeDiscount({
  dismissed = false
} = {}) {

  if (
    !discountPopup ||
    !discountBackdrop
  ) {
    return;
  }


  discountPopup.classList.remove("open");
  discountBackdrop.classList.remove("open");

  discountPopup.setAttribute(
    "aria-hidden",
    "true"
  );


  if (dismissed) {
    storageSet(
      DISCOUNT_STORAGE.dismissed,
      Date.now()
    );
  }


  updateBodyLock();
}


/* =========================================================
   MANUAL DISCOUNT BUTTON
   ========================================================= */

openDiscount?.addEventListener(
  "click",
  () => {
    openDiscount({
      automatic: false
    });
  }
);


/* =========================================================
   DISMISS DISCOUNT
   ========================================================= */

discountClose?.addEventListener(
  "click",
  () => {
    closeDiscount({
      dismissed: true
    });
  }
);


discountSkip?.addEventListener(
  "click",
  () => {
    closeDiscount({
      dismissed: true
    });
  }
);


discountBackdrop?.addEventListener(
  "click",
  () => {
    closeDiscount({
      dismissed: true
    });
  }
);


/* =========================================================
   OCCASIONAL AUTOMATIC DISCOUNT POPUP
   ========================================================= */

/*
  We do NOT immediately throw this at the visitor.

  Requirements:
  - Wait at least 18 seconds.
  - Visitor must still be on the page.
  - Popup must be eligible.
  - Only a 35% chance on an eligible visit.

  Combined with the 7-day cooldown,
  this keeps it occasional instead of annoying.
*/

function scheduleDiscountOffer() {
  if (!canShowDiscount()) {
    return;
  }


  const delay =
    18000 +
    Math.floor(
      Math.random() * 14000
    );


  window.setTimeout(() => {

    if (
      document.visibilityState !== "visible"
    ) {
      return;
    }


    if (!canShowDiscount()) {
      return;
    }


    const chance =
      Math.random();


    if (chance > 0.35) {
      return;
    }


    openDiscount({
      automatic: true
    });

  }, delay);
}


window.setTimeout(() => {
  openDiscount({
    automatic: false
  });
}, 3000);


/* =========================================================
   DISCOUNT FORM
   ========================================================= */

discountForm?.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    if (!discountEmail) {
      return;
    }


    const email =
      discountEmail.value.trim();


    if (!email) {
      discountEmail.focus();
      return;
    }


    if (
      !discountEmail.checkValidity()
    ) {
      discountEmail.reportValidity();
      return;
    }


    /*
      IMPORTANT:

      We are NOT generating a fake discount code
      and we are NOT pretending this email has
      been sent anywhere.

      Once the real mailing/promotion backend is
      connected, this is where we'll send it.
    */

    storageSet(
      DISCOUNT_STORAGE.submitted,
      Date.now()
    );


    showDiscountPendingState();
  }
);


/* =========================================================
   DISCOUNT PENDING STATE
   ========================================================= */

function showDiscountPendingState() {
  if (!discountForm) return;


  const discountDescription =
    $(".discount-description");


  if (discountDescription) {
    discountDescription.textContent =
      "Thanks! The store's email offer system is being prepared. No discount has been issued yet.";
  }


  discountForm.innerHTML = `
    <div class="discount-pending">
      EMAIL SAVED FOR THIS SESSION
    </div>
  `;


  if (discountSkip) {
    discountSkip.textContent =
      "CONTINUE EXPLORING";
  }
}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") {
      return;
    }


    if (
      discountPopup?.classList.contains(
        "open"
      )
    ) {
      closeDiscount({
        dismissed: true
      });

      return;
    }


    if (
      cartDrawer?.classList.contains(
        "open"
      )
    ) {
      closeCart();
      return;
    }


    if (
      navSearchPanel?.classList.contains(
        "open"
      )
    ) {
      closeSearch();
    }

  }
);


/* =========================================================
   SMOOTH SAME-PAGE LINKS
   ========================================================= */

$$('a[href^="#"]').forEach(
  (link) => {

    link.addEventListener(
      "click",
      (event) => {

        const href =
          link.getAttribute("href");


        if (
          !href ||
          href === "#"
        ) {
          return;
        }


        const target =
          document.querySelector(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  }
);


/* =========================================================
   HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   FEAR IMAGE FALLBACK
   ========================================================= */

const fearImage =
  $(".fear-word img");


if (fearImage) {

  fearImage.addEventListener(
    "error",
    () => {

      const container =
        fearImage.closest(
          ".fear-word"
        );


      if (!container) {
        return;
      }


      fearImage.style.display =
        "none";


      const fallback =
        document.createElement(
          "span"
        );


      fallback.className =
        "fear-fallback-text";


      fallback.textContent =
        "FEAR";


      container.appendChild(
        fallback
      );

    }
  );

}


/* =========================================================
   LIMINAL WORDMARK FALLBACK
   ========================================================= */

const liminalImage =
  $(".liminal-wordmark");


if (liminalImage) {

  liminalImage.addEventListener(
    "error",
    () => {

      const fallback =
        document.createElement(
          "strong"
        );


      fallback.className =
        "liminal-fallback-text";


      fallback.textContent =
        "LIMINAL";


      liminalImage.replaceWith(
        fallback
      );

    }
  );

}


/* =========================================================
   READY
   ========================================================= */

document.documentElement.classList.add(
  "liminal-fear-ready"
);
