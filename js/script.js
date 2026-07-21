/* ==========================================================================
   SCRIPT.JS
   This is our GENERAL, site-wide JavaScript file — for behavior that
   isn't specific to just the navbar (navbar.js) or just the gallery
   (gallery.js). Right now, it handles the Popular Menu filter tabs.
   ========================================================================== */

/* --------------------------------------------------------------------------
   STEP 1: SELECT THE ELEMENTS WE NEED
   --------------------------------------------------------------------------
   "querySelectorAll" grabs EVERY element matching a selector and
   returns them as a list (technically a "NodeList") we can loop over.
-------------------------------------------------------------------------- */
const filterButtons = document.querySelectorAll(".menu-filter-btn");
const menuItems = document.querySelectorAll(".menu-item");

/* --------------------------------------------------------------------------
   updateVisibleCount()
   --------------------------------------------------------------------------
   A small reusable function that updates the "Showing X items" text
   (full Menu page only). We call it once immediately below (so the
   count is correct as soon as the page loads) AND again every time a
   filter button is clicked.
-------------------------------------------------------------------------- */
function updateVisibleCount() {
  const menuCountEl = document.querySelector("#full-menu-count");

  /* The Home page preview doesn't have a "#full-menu-count" element,
     so we check it actually exists before using it — trying to
     update an element that doesn't exist would throw an error and
     stop the rest of our script from running. */
  if (menuCountEl) {
    /* ":not(.hidden)" combined with querySelectorAll grabs only the
       menu items that DON'T have the "hidden" class — in other
       words, the ones currently visible. ".length" tells us how many
       that is. */
    const visibleCount = document.querySelectorAll(".menu-item:not(.hidden)").length;
    menuCountEl.textContent = `Showing ${visibleCount} item${visibleCount === 1 ? "" : "s"}`;
    /* This is a "template literal" (backticks instead of quotes) —
       it lets us drop a variable straight into a string using
       ${...}. The ternary at the end (condition ? a : b) adds an "s"
       unless there's exactly 1 item, so it reads "1 item" vs
       "2 items" correctly. */
  }
}

updateVisibleCount();

/* --------------------------------------------------------------------------
   STEP 2: LOOP THROUGH EVERY FILTER BUTTON AND LISTEN FOR CLICKS
   --------------------------------------------------------------------------
   "forEach" is another way to loop through a list (like the "for...of"
   loop we used in navbar.js). It runs the function once for EACH item
   in the list, and gives us that item as "button" each time.
-------------------------------------------------------------------------- */
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    /* ----------------------------------------------------------------
       STEP 3: UPDATE WHICH BUTTON LOOKS "ACTIVE"
       ----------------------------------------------------------------
       First, remove ".active" from EVERY button (clearing the old
       selection), then add ".active" only to the one that was just
       clicked. This guarantees only ONE button is ever highlighted
       at a time.
    ---------------------------------------------------------------- */
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    /* ----------------------------------------------------------------
       STEP 4: READ WHICH CATEGORY WAS CLICKED
       ----------------------------------------------------------------
       "data-filter" is a custom HTML attribute we wrote directly on
       each button, e.g. <button data-filter="coffee">. JavaScript can
       read ANY "data-*" attribute through ".dataset", using the part
       after "data-" as the property name. This is the standard way to
       attach small pieces of information to HTML elements for
       JavaScript to use later.
    ---------------------------------------------------------------- */
    const selectedCategory = button.dataset.filter;

    /* ----------------------------------------------------------------
       STEP 5: SHOW OR HIDE EACH MENU ITEM BASED ON THE SELECTED CATEGORY
       ---------------------------------------------------------------- */
    menuItems.forEach(function (item) {
      const itemCategory = item.dataset.category;

      /* If the clicked filter is "all", OR this item's category
         matches the selected filter, show it. Otherwise, hide it. */
      if (selectedCategory === "all" || itemCategory === selectedCategory) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });

    /* Recalculate the visible item count (full Menu page only) now
       that some items may have just been hidden or shown. */
    updateVisibleCount();
  });
});

/* ==========================================================================
   TESTIMONIAL SLIDER
   ==========================================================================
   Shows one customer quote at a time, with Prev/Next arrows, clickable
   dots, and gentle auto-rotation every few seconds.
   ========================================================================== */

const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".testimonial-dot");
const prevButton = document.querySelector(".testimonial-arrow.prev");
const nextButton = document.querySelector(".testimonial-arrow.next");

/* Not every page has a testimonial slider (only the Home page does).
   "if (nextButton)" checks whether the element actually exists before
   we try to use it — since script.js is shared across every page,
   this guard stops us from getting an error on pages where these
   elements are missing. Everything slider-related lives INSIDE this
   "if" block. */
if (nextButton) {

  /* "let" (instead of "const") is used here because this variable's
     value CHANGES over time as the visitor clicks through slides.
     "const" is for values that never get reassigned; "let" is for
     values that do. */
  let currentSlide = 0;

  /* ------------------------------------------------------------------
     showSlide(index)
     ------------------------------------------------------------------
     A reusable FUNCTION that displays exactly one slide (and matching
     dot) based on the index passed in. Writing this as its own
     function means the Prev button, Next button, dot clicks, AND the
     auto-rotate timer can all reuse the exact same logic instead of
     repeating it four times.
  ------------------------------------------------------------------ */
  function showSlide(index) {
    /* First, remove ".active" from every slide and every dot... */
    slides.forEach(function (slide) {
      slide.classList.remove("active");
    });
    dots.forEach(function (dot) {
      dot.classList.remove("active");
    });

    /* ...then add ".active" back to only the one at "index". */
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  /* ------------------------------------------------------------------
     PREV / NEXT BUTTON CLICKS
     ------------------------------------------------------------------
     The "%" (modulo) operator returns the REMAINDER after division.
     We use it here as a wraparound trick: once currentSlide would go
     past the last slide (or below 0), modulo wraps it back around to
     the start (or end) instead of breaking.

     Example with 3 slides (slides.length === 3):
       currentSlide = 2, click Next -> (2 + 1) % 3 = 0  (wraps to first)
       currentSlide = 0, click Prev -> (0 - 1 + 3) % 3 = 2 (wraps to last)
  ------------------------------------------------------------------ */
  nextButton.addEventListener("click", function () {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  });

  prevButton.addEventListener("click", function () {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  });

  /* ------------------------------------------------------------------
     DOT CLICKS
     ------------------------------------------------------------------
     Each dot has a "data-slide" attribute (e.g. data-slide="1").
     Reading ".dataset.slide" gives us that number as a STRING ("1"),
     so we wrap it in "Number()" to convert it into an actual number
     we can use for array indexing.
  ------------------------------------------------------------------ */
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const slideIndex = Number(dot.dataset.slide);
      showSlide(slideIndex);
    });
  });

  /* ------------------------------------------------------------------
     AUTO-ROTATE
     ------------------------------------------------------------------
     "setInterval(function, delay)" repeatedly runs a function every
     "delay" milliseconds (1000ms = 1 second) until the page is closed
     or "clearInterval" is called. Here, it advances to the next slide
     automatically every 6 seconds.
  ------------------------------------------------------------------ */
  setInterval(function () {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  }, 6000);

} // end of "if (nextButton)" testimonial slider block

/* ==========================================================================
   NEWSLETTER FORM VALIDATION
   ==========================================================================
   When the visitor submits the email form, we check whether the
   typed text LOOKS like a valid email address, then show a styled
   success or error message — instead of letting the page reload
   (which is a plain HTML form's default behavior).
   ========================================================================== */

const newsletterForm = document.querySelector(".newsletter-form");
const newsletterMessage = document.querySelector("#newsletter-message");

/* Just like the slider above, not every page has a newsletter form
   (only the Home page does), so we guard the whole block behind an
   existence check. */
if (newsletterForm) {

  /* A "regular expression" (regex) is a pattern used to match text.
     This one checks for the basic shape of an email address:
     "something@something.something" — it isn't a perfect, 100%
     accurate email checker (no simple pattern truly is), but it
     catches the most common typos, like a missing "@" or ".". */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  newsletterForm.addEventListener("submit", function (event) {
    /* "event.preventDefault()" stops the form's default behavior,
       which is to reload the page and send the data to a server. We
       need to stop that here since we don't have a real server set
       up yet — we're just demonstrating the validation logic. */
    event.preventDefault();

    const emailInput = document.querySelector("#newsletter-email");
    const typedEmail = emailInput.value.trim();
    /* ".trim()" removes any accidental leading/trailing spaces the
       visitor might have typed, so " a@b.com " still counts as valid. */

    /* ".test()" checks whether "typedEmail" matches our pattern, and
       gives back "true" or "false". */
    const isValidEmail = emailPattern.test(typedEmail);

    if (isValidEmail) {
      newsletterMessage.textContent = "You're in! Check your inbox to confirm.";
      newsletterMessage.classList.remove("error");
      newsletterMessage.classList.add("show", "success");
      emailInput.value = "";
      /* Clearing the input after a successful signup is a small but
         important UX touch — it visually confirms the submission
         went through. */
    } else {
      newsletterMessage.textContent = "Please enter a valid email address.";
      newsletterMessage.classList.remove("success");
      newsletterMessage.classList.add("show", "error");
    }
  });

} // end of "if (newsletterForm)" newsletter block

/* ==========================================================================
   ANIMATED STAT COUNTERS (About page)
   ==========================================================================
   Numbers like "10+" or "50,000+" count up from 0 the FIRST time they
   scroll into view, instead of just appearing instantly. This uses
   the "IntersectionObserver" API — a browser tool built specifically
   for detecting when an element enters or leaves the visible screen,
   without the performance cost of manually checking scroll position
   on every single scroll event.
   ========================================================================== */

const statNumbers = document.querySelectorAll(".about-stat-number");

/* Guard clause again: only the About page has these elements. */
if (statNumbers.length > 0) {

  /* --------------------------------------------------------------------
     animateCount(element)
     --------------------------------------------------------------------
     Counts a single element's number up from 0 to its target value.
  -------------------------------------------------------------------- */
  function animateCount(element) {
    /* We stored the FINAL number in a "data-target" attribute in the
       HTML (e.g. data-target="50000"), so JavaScript knows what to
       count up TO. "Number()" converts that string into an actual
       number we can do math with. */
    const targetValue = Number(element.dataset.target);
    const duration = 1500; // total animation length, in milliseconds
    const frameRate = 30; // how many times per second we update the number
    const totalFrames = Math.round((duration / 1000) * frameRate);
    let currentFrame = 0;

    const countTimer = setInterval(function () {
      currentFrame++;

      /* "Math.round()" rounds to the nearest whole number — without
         it, we'd briefly see decimals like "23.7" flash by, which
         looks broken for a counter like "cups served". */
      const progress = currentFrame / totalFrames;
      const currentValue = Math.round(targetValue * progress);
      element.textContent = currentValue.toLocaleString() + "+";
      /* ".toLocaleString()" adds thousands-separator commas
         automatically (50000 -> "50,000") for a more polished look. */

      /* Once we've drawn every frame, stop the timer and make sure
         the FINAL number is exactly correct (rounding during the
         animation can occasionally land 1 off from the true target). */
      if (currentFrame >= totalFrames) {
        clearInterval(countTimer);
        element.textContent = targetValue.toLocaleString() + "+";
      }
    }, duration / totalFrames);
  }

  /* --------------------------------------------------------------------
     THE OBSERVER
     --------------------------------------------------------------------
     "new IntersectionObserver(callback)" creates a watcher. The
     callback function runs automatically whenever an observed element
     scrolls into (or out of) view. "entries" is a list of every
     element being watched, along with whether it's currently visible.
  -------------------------------------------------------------------- */
  const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      /* "entry.isIntersecting" is "true" once the element has
         scrolled into the visible viewport. */
      if (entry.isIntersecting) {
        animateCount(entry.target);

        /* "unobserve" tells the observer to STOP watching this
           element — otherwise, scrolling past it again later would
           restart the count-up animation every single time. */
        statsObserver.unobserve(entry.target);
      }
    });
  });

  /* Tell the observer which elements to watch — one line replaces
     what would otherwise be a manual scroll-position calculation. */
  statNumbers.forEach(function (statNumber) {
    statsObserver.observe(statNumber);
  });
}

/* ==========================================================================
   CONTACT FORM VALIDATION
   ==========================================================================
   Checks the Name, Email, and Message fields when the form is
   submitted, shows an inline error under any invalid field, and
   displays a success message once everything looks good.
   ========================================================================== */

const contactForm = document.querySelector("#contact-form");

/* Guard clause: only the Contact page has this form. */
if (contactForm) {

  const contactEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    /* An ARRAY OF OBJECTS: instead of writing three nearly-identical
       validation blocks by hand, we describe each field's rules as
       one object, put all three objects in an array, and loop
       through them. This is the "array of objects" pattern for
       modeling a list of similar things. */
    const fields = [
      {
        input: document.querySelector("#contact-name"),
        errorEl: document.querySelector("#contact-name-error"),
        isValid: function (value) {
          return value.trim().length > 0;
        },
        message: "Please enter your name.",
      },
      {
        input: document.querySelector("#contact-email"),
        errorEl: document.querySelector("#contact-email-error"),
        isValid: function (value) {
          return contactEmailPattern.test(value.trim());
        },
        message: "Please enter a valid email address.",
      },
      {
        input: document.querySelector("#contact-message"),
        errorEl: document.querySelector("#contact-message-error"),
        isValid: function (value) {
          return value.trim().length > 0;
        },
        message: "Please enter a message.",
      },
    ];

    /* "let" because this starts "true" and may flip to "false" as we
       loop through the fields below. */
    let formIsValid = true;

    /* Looping through our array of field objects, running EACH
       field's own "isValid" function against its own current value.
       This is the payoff of the array-of-objects pattern: adding a
       4th field later just means adding one more object above —
       nothing below this line needs to change. */
    fields.forEach(function (field) {
      const value = field.input.value;

      if (field.isValid(value)) {
        field.input.classList.remove("error");
        field.errorEl.classList.remove("show");
      } else {
        field.input.classList.add("error");
        field.errorEl.textContent = field.message;
        field.errorEl.classList.add("show");
        formIsValid = false;
      }
    });

    const successMessage = document.querySelector("#contact-success-message");

    if (formIsValid) {
      successMessage.classList.add("show");
      contactForm.reset();
      /* ".reset()" is a built-in form method that clears every field
         back to its default (empty) value — much simpler than
         manually setting each input's ".value" to "" one at a time. */
    } else {
      successMessage.classList.remove("show");
    }
  });

} // end of "if (contactForm)" contact form block
