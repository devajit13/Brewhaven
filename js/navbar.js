/* ==========================================================================
   NAVBAR.JS
   This file handles the small interactive behaviors of the navbar:
   opening and closing the mobile menu when the hamburger icon is
   clicked. Keeping navbar behavior in its own file (separate from
   gallery.js or script.js) makes it easy to find later.
   ========================================================================== */

/* --------------------------------------------------------------------------
   STEP 1: SELECT THE ELEMENTS WE NEED
   --------------------------------------------------------------------------
   "document.querySelector()" searches the HTML page for the first
   element matching a CSS-style selector, and gives us back that
   element so we can work with it in JavaScript.

   Think of it like using Ctrl+F to search a page, but instead of
   just finding the text, JavaScript hands you the actual element.
-------------------------------------------------------------------------- */
const navbarToggle = document.querySelector(".navbar-toggle");
const navbarLinks = document.querySelector(".navbar-links");

/* --------------------------------------------------------------------------
   STEP 2: LISTEN FOR CLICKS ON THE HAMBURGER BUTTON
   --------------------------------------------------------------------------
   "addEventListener" tells the browser: "watch this element, and when
   a specific event happens (like a 'click'), run this function."

   This is how JavaScript reacts to what the user does on the page.
-------------------------------------------------------------------------- */
navbarToggle.addEventListener("click", function () {
  /* "classList.toggle()" is a handy method: if the element does NOT
     have the class yet, it ADDS it. If it already has the class, it
     REMOVES it. This is perfect for on/off switches like a menu. */
  navbarToggle.classList.toggle("open");
  navbarLinks.classList.toggle("show");
});

/* --------------------------------------------------------------------------
   STEP 3: CLOSE THE MOBILE MENU WHEN A LINK IS CLICKED
   --------------------------------------------------------------------------
   Without this, if someone opens the mobile menu and taps "Menu" to
   go to the Menu page, the menu would still be technically "open"
   when the new page loads. This loop makes sure every link closes
   the menu first.
-------------------------------------------------------------------------- */

/* "querySelectorAll" is like "querySelector" but it grabs EVERY
   matching element on the page (not just the first one) and gives
   us back a list of them. */
const allNavLinks = document.querySelectorAll(".navbar-link");

/* A "for...of" loop lets us go through each item in a list one at a
   time. Here, "link" represents one navbar link during each pass
   through the loop. */
for (const link of allNavLinks) {
  link.addEventListener("click", function () {
    navbarToggle.classList.remove("open");
    navbarLinks.classList.remove("show");
  });
}
