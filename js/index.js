document.querySelectorAll(".nav-container").forEach((container) => {
  const skills = container.querySelector(".skills");

  container.addEventListener("mouseenter", () => {
    skills.classList.add("show");
  });

  container.addEventListener("mouseleave", () => {
    skills.classList.remove("show");
  });
});

window.addEventListener("beforeunload", function () {
  localStorage.setItem("scrollY", window.scrollY);
});

window.addEventListener("load", function () {
  const savedScroll = localStorage.getItem("scrollY");
  if (savedScroll !== null) {
    window.scrollTo(0, parseInt(savedScroll));
  }
});
