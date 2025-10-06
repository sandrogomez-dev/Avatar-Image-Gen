//importar dependencias
import express from "express";
import dotenv from "dotenv";
// import OpenAI from "openai";
import axios from "axios";

// cargar configuracion(apikey, port)
dotenv.config();

//cargar express
const app = express();
const PORT = process.env.PORT || 3000;
// servir frontend
app.use("/", express.static("public"));

app.get("/api", (req, res) => {
  res.json({ message: "¡Funciona!" });
});

// middleware para procesar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para generar imagenes con IA
app.post("/api/gen-img", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  const { category } = req.body;

  let prompt = `
    Eres un diseñador gráfico experto en crear imágenes de alta calidad.
    Tu objetivo final es crear un avatar para un ${category} siguiendo las especificaciones detalladas a continuación.
    Especificaciones del avatar:
    -Estilo: Cartoon
    -Dimensiones: 256x256 píxeles
    -Fondo de la imagen: Color solido
    -Protagonista del avatar: ${category}
    -El formato de la imagen sera cuadrado o rectangular.

    -El avatar debe ser visualmente atractivo y profesional.
    -El avatar debe ser adecuado para su uso en perfiles de redes sociales y plataformas en línea.
    -El avatar debe transmitir la personalidad y el estilo del usuario.
    -El avatar debe ser único y original, evitando cualquier similitud con imágenes existentes.
    -El avatar debe ser entregado en formato PNG con fondo transparente.
    -El avatar debe ser creado utilizando herramientas y técnicas de diseño gráfico avanzadas.
    para hacer bien el trabajo debemos cumplir con todas las especificaciones dadas.
    -No incluir texto en la imagen.
    -No incluir marcas de agua en la imagen.
    `;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "dall-e-2",
        prompt: prompt,
        n: 1,
        size: "256x256",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl: imageUrl });
  } catch (error) {
    console.log("Error al generar la imagen:", error);
    res.status(500).json({ error: "Error al generar la imagen" });
  }
});

// Servir el backend
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:" + PORT);
});
