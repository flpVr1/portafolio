const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend funcionando ✔");
});

app.post("/procesar-formulario", upload.single("adjunto"), (req, res) => {
  const { nombre, apellido, email, telefono, asunto, mensaje } = req.body;
  const archivo = req.file;

  const nuevoMensaje = {
    fecha: new Date().toISOString(),
    nombre,
    apellido,
    email,
    telefono,
    asunto,
    mensaje,
    archivo: archivo ? archivo.filename : null,
  };

  // Guardar en JSON
  try {
    const data = fs.existsSync("data.json")
      ? JSON.parse(fs.readFileSync("data.json"))
      : [];
    data.push(nuevoMensaje);
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
    console.log("✅ Mensaje guardado en data.json");
  } catch (error) {
    console.error("❌ Error al guardar el mensaje:", error);
  }

  // Enviar correo
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `Nuevo mensaje de ${nombre} ${apellido} (${asunto})`,
    html: `
      <h3>Mensaje recibido desde el formulario:</h3>
      <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${telefono}</p>
      <p><strong>Asunto:</strong> ${asunto}</p>
      <p><strong>Mensaje:</strong><br>${mensaje}</p>
    `,
    attachments: archivo
      ? [
          {
            filename: archivo.originalname,
            path: archivo.path,
          },
        ]
      : [],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error al enviar correo:", error);
      return res.status(500).json({ mensaje: "Error al enviar el correo" });
    }
    console.log("📬 Correo enviado:", info.response);
    res.status(200).json({ mensaje: "Formulario enviado correctamente." });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
