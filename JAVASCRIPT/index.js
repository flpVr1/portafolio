document.querySelectorAll(".nav-container").forEach((container) => {
  const skills = container.querySelector(".skills");

  container.addEventListener("mouseenter", () => {
    skills.classList.add("show");
  });

  container.addEventListener("mouseleave", () => {
    skills.classList.remove("show");
  });
});
