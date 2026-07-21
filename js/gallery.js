/* ==========================================================================
   GALLERY.JS
   Powers the Gallery page's lightbox: clicking a photo opens a
   full-screen view with Prev/Next navigation and a Close button (or
   Escape key). This file is only loaded on gallery.html.
   ========================================================================== */

/* --------------------------------------------------------------------------
   STEP 1: SELECT EVERYTHING WE NEED
-------------------------------------------------------------------------- */
const galleryFilterButtons = document.querySelectorAll(".gallery-filter-btn");
const galleryPhotoItemsNodeList = document.querySelectorAll(".gallery-photo-item");

/* "querySelectorAll" technically returns a "NodeList", not a true
   JavaScript Array — NodeLists support "forEach", but they're
   missing some Array features we want here, like "indexOf()".
   "Array.from()" converts a NodeList into a real Array, unlocking
   every normal Array method. */
const galleryPhotoItems = Array.from(galleryPhotoItemsNodeList);

const lightbox = document.querySelector("#lightbox");
const lightboxPhoto = document.querySelector(".lightbox-photo");
const lightboxCaption = document.querySelector(".lightbox-caption");
const lightboxCloseBtn = document.querySelector(".lightbox-close");
const lightboxPrevBtn = document.querySelector(".lightbox-arrow.prev");
const lightboxNextBtn = document.querySelector(".lightbox-arrow.next");

let currentPhotoIndex = 0;

/* --------------------------------------------------------------------------
   STEP 2: GALLERY FILTER TABS
   --------------------------------------------------------------------------
   Same pattern we used for the Popular Menu and full Menu page
   filters — reused here rather than reinvented.
-------------------------------------------------------------------------- */
galleryFilterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    galleryFilterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    const selectedCategory = button.dataset.filter;

    galleryPhotoItems.forEach(function (item) {
      const itemCategory = item.dataset.category;
      if (selectedCategory === "all" || itemCategory === selectedCategory) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

/* --------------------------------------------------------------------------
   STEP 3: OPEN THE LIGHTBOX
   --------------------------------------------------------------------------
   "openLightbox(index)" fills in the lightbox's icon and caption
   based on whichever photo item is at that position in our array,
   then reveals the lightbox itself.
-------------------------------------------------------------------------- */
function openLightbox(index) {
  currentPhotoIndex = index;

  /* Each photo item stores its own icon class and caption text as
     data-* attributes in the HTML — we just read them back here. */
  const item = galleryPhotoItems[index];
  const iconClass = item.dataset.icon;
  const caption = item.dataset.caption;

  /* Rebuilding the icon: we clear out whatever was inside
     ".lightbox-photo" and insert a fresh <i> tag with the right
     Font Awesome class. "innerHTML" lets us insert actual HTML
     (not just plain text) into an element. */
  lightboxPhoto.innerHTML = `<i class="${iconClass}"></i>`;
  lightboxCaption.textContent = caption;

  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

/* --------------------------------------------------------------------------
   STEP 4: CLICK A PHOTO TO OPEN IT
   --------------------------------------------------------------------------
   "galleryPhotoItems.indexOf(item)" finds WHERE in the array this
   particular clicked item lives, so we know which photo to show.
-------------------------------------------------------------------------- */
galleryPhotoItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const index = galleryPhotoItems.indexOf(item);
    openLightbox(index);
  });
});

/* --------------------------------------------------------------------------
   STEP 5: CLOSE BUTTON + CLICKING THE DARK BACKGROUND
-------------------------------------------------------------------------- */
lightboxCloseBtn.addEventListener("click", closeLightbox);

/* Clicking anywhere on the dark overlay closes the lightbox too —
   but ONLY if the click was on the overlay itself, not on the photo
   or caption inside it. "event.target" is the exact element that was
   clicked; comparing it to "lightbox" (the overlay) filters out
   clicks that happened on its children. */
lightbox.addEventListener("click", function (event) {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* --------------------------------------------------------------------------
   STEP 6: PREV / NEXT NAVIGATION
   --------------------------------------------------------------------------
   Same modulo wraparound trick from the testimonial slider — clicking
   Next on the last photo loops back to the first, and vice versa.
-------------------------------------------------------------------------- */
lightboxNextBtn.addEventListener("click", function () {
  const nextIndex = (currentPhotoIndex + 1) % galleryPhotoItems.length;
  openLightbox(nextIndex);
});

lightboxPrevBtn.addEventListener("click", function () {
  const prevIndex = (currentPhotoIndex - 1 + galleryPhotoItems.length) % galleryPhotoItems.length;
  openLightbox(prevIndex);
});

/* --------------------------------------------------------------------------
   STEP 7: KEYBOARD SUPPORT
   --------------------------------------------------------------------------
   Listening on "document" (instead of one specific element) catches
   key presses no matter where the visitor's focus currently is on
   the page. We check "event.key" to find out WHICH key was pressed,
   and only act if the lightbox is actually open — otherwise arrow
   keys would do nothing but we'd still be running this check on
   every single keystroke across the whole site for no reason.
-------------------------------------------------------------------------- */
document.addEventListener("keydown", function (event) {
  const isLightboxOpen = lightbox.classList.contains("open");
  if (!isLightboxOpen) {
    return;
    /* "return" here exits the function immediately, skipping
       everything below it — a clean way to say "nothing left to do
       in this case" without wrapping the rest of the function in an
       extra "if" block. */
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    lightboxNextBtn.click();
    /* Calling ".click()" on the button programmatically triggers the
       exact same click handler we already wrote above — reusing
       logic instead of duplicating the modulo math a second time. */
  } else if (event.key === "ArrowLeft") {
    lightboxPrevBtn.click();
  }
});
