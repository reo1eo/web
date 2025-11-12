document.addEventListener("DOMContentLoaded", () => {
  // ===== Navigation Buttons =====
  const navButtons = {
    "all-btn": "gallery.html",
    "purposive-btn": "purposive.html",
    "pathfit-btn": "pathfit.html",
    "nstp-btn": "nstp.html",
    "feur-btn": "feur.html",
  };

  Object.entries(navButtons).forEach(([id, page]) => {
    const button = document.getElementById(id);
    if (button) button.addEventListener("click", () => (window.location.href = page));
  });

  // ===== Gallery & Modal =====
  const galleryGrid = document.querySelector(".gallery-grid");
  const modal = document.getElementById("imageModal");
  const modalContent = document.querySelector(".modal-content");
  const closeBtn = document.querySelector(".close");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  let currentIndex = 0;

  // ===== Load gallery items dynamically for gallery.html =====
  if (window.location.pathname.endsWith("gallery.html")) {
    const subjects = ["Purposive", "Pathfit", "Nstp", "Feur"];
    subjects.forEach(async (subject) => {
      try {
        const res = await fetch(`${subject}.html`);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const items = doc.querySelectorAll(".gallery-item");
        items.forEach((item) => galleryGrid.appendChild(item.cloneNode(true)));
        galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
      } catch (err) {
        console.error(`Failed to load ${subject}:`, err);
      }
    });
  }

  // ===== Modal functions =====
  const openModal = (item) => {
    galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    currentIndex = galleryItems.indexOf(item);

    // Clear previous content
    modalContent.innerHTML = "";
    modalContent.style.position = "relative";

    const img = item.querySelector("img");
    const video = item.querySelector("video");
    const overlay = item.querySelector(".overlay");

    // Create wrapper for media + overlay
    const mediaWrapper = document.createElement("div");
    mediaWrapper.classList.add("media-wrapper");
    Object.assign(mediaWrapper.style, {
      position: "relative",
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    });

    // Image handling
    if (img) {
      const modalImg = document.createElement("img");
      modalImg.src = img.src;
      Object.assign(modalImg.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
      });
      mediaWrapper.appendChild(modalImg);
    }

    // Video handling
    if (video) {
      const modalVideo = document.createElement("video");
      modalVideo.src = video.src;
      modalVideo.controls = true;
      modalVideo.autoplay = true;
      modalVideo.muted = false;
      modalVideo.volume = 1;
      Object.assign(modalVideo.style, {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        display: "block",
      });
      mediaWrapper.appendChild(modalVideo);
    }

    // Overlay inside wrapper (title in yellow, description in white)
    if (overlay) {
      const modalOverlay = document.createElement("div");
      modalOverlay.classList.add("overlay");
      Object.assign(modalOverlay.style, {
        position: "absolute",
        bottom: "20px",
        left: "20px",
        pointerEvents: "none",
        textAlign: "left",
        lineHeight: "1.2",
        opacity: "0",
        transition: "opacity 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        background: "rgba(0,0,0,0.3)",
        padding: "8px 14px",
        borderRadius: "6px"
      });

      const title = document.createElement("div");
      title.textContent = overlay.dataset.title || "Title";
      Object.assign(title.style, {
        color: "gold",
        fontSize: "1.8rem",
        fontWeight: "700",
        textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
        margin: "0",
      });

      const description = document.createElement("div");
      description.textContent = overlay.dataset.description || "Description";
      Object.assign(description.style, {
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "500",
        textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
        margin: "0",
      });

      modalOverlay.appendChild(title);
      modalOverlay.appendChild(description);
      mediaWrapper.appendChild(modalOverlay);

      // Hover effect: show overlay on hover
      mediaWrapper.addEventListener("mouseenter", () => {
        modalOverlay.style.opacity = "1";
      });
      mediaWrapper.addEventListener("mouseleave", () => {
        modalOverlay.style.opacity = "0";
      });
    }

    modalContent.appendChild(mediaWrapper);
    modal.classList.add("show");
    document.body.classList.add("modal-open");
  };

  // ===== Close Modal =====
  const closeModal = () => {
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");

    const video = modalContent.querySelector("video");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  // ===== Navigation =====
  const showItem = (index) => {
    galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
    currentIndex = (index + galleryItems.length) % galleryItems.length;
    openModal(galleryItems[currentIndex]);
  };

  // ===== Event Listeners =====
  galleryGrid.addEventListener("click", (e) => {
    const item = e.target.closest(".gallery-item");
    if (!item) return;
    openModal(item);
  });

  closeBtn.addEventListener("click", closeModal);
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showItem(currentIndex - 1);
  });
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showItem(currentIndex + 1);
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;
    if (e.key === "ArrowRight") showItem(currentIndex + 1);
    else if (e.key === "ArrowLeft") showItem(currentIndex - 1);
    else if (e.key === "Escape") closeModal();
  });
});
