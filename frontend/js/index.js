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

document.getElementById("contactForm").addEventListener("submit", function (e) {
  if (!this.checkValidity()) {
    e.preventDefault();
    alert("Te faltan algunos datos, por favor complétalos!");
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  // Verificación del formulario
  if (!form) {
    console.warn("⚠️ No se encontró el formulario con ID 'contactForm'");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:3000/procesar-formulario", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje || "✅ Formulario enviado correctamente.");
        form.reset();
      } else {
        alert("❌ Error al enviar el formulario.");
        console.error("Respuesta del servidor:", data);
      }
    } catch (error) {
      alert("❌ No se pudo enviar el formulario. Revisa tu conexión.");
      console.error("Error de red:", error);
    }
  });
});
