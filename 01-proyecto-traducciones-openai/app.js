//importar dependencias
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

// cargar configuracion(apikey, port)
dotenv.config();

//cargar express
const app = express();
const PORT = process.env.PORT || 3000;
// servir frontend
app.use("/front", express.static("public"));

app.get("/api", (req, res) => {
  res.json({ message: "¡Funciona!" });
});

// middleware para procesar json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//instancia de openai y pasar el api key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

//ruta /  endpoint / url
app.post("/api/traducir", async (req, res) => {
  const { text, targetLang } = req.body;

  const promptSystem1 = `Eres un traductor experto.`;
  const promptSystem2 =
    `Solo puedes responder con una traduccion directa del texto que el usuario te envie.` +                                                                     
    " Cualquier otra respuesta o conversacion, esta prohibida.";
  const promptUser = `Traduce el siguiente texto al idioma ${targetLang}:\n\n${text}\n\nTraducción:`;                                                          
  //funcionalidad de traducir con IA
  // LLamar al LLM o modelo de openai
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: promptSystem1 + "\n" + promptSystem2 },      
        { role: "user", content: promptUser },
      ],
      max_tokens: 500,
      response_format: { type: "text" },
    });

    const translatedText = completion.choices[0].message.content;

    return res.status(200).json({ translatedText });
  } catch (error) {
    console.log("Error al traducir:", error);
    return res.status(500).json({ error: "Error al traducir" });
  }
});

// Servir el backend
app.listen(PORT, () => {
  console.log("Servidor escuchando en http://localhost:" + PORT);
});