import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup standard body parsers with generous limits for image uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Google Gemini Client with safe fallback guards
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("SUCCESS: Gemini AI Core successfully loaded.");
  } catch (err) {
    console.error("ERROR: Failed to initialize GoogleGenAI:", err);
  }
} else {
  console.log("WARNING: GEMINI_API_KEY is not configured or left at default. Falling back to simulated creative chaos.");
}

// ---------------- LOCAL SIMULATION DATA FOR FALLBACKS ----------------
const FALLBACK_CONCEPTS = [
  {
    title: "SISTEMA DESBOCADO",
    concept: "Un manifiesto sobre el colapso urbano fusionando diseño editorial industrial brutalista con tipografías Y2K sobredimensionadas.",
    limitations: [
      "Usar solo verde neón y blanco roto",
      "Prohibido usar fuentes con serif",
      "Toda la tipografía debe estar girada 90 grados"
    ],
    palette: ["#000000", "#00FF66", "#FAF9F6", "#7B2CBF"],
    composition: "Asimetría total. Un bloque tipográfico colosal ocupa el 70% de la pantalla, recortado por los bordes. El resto contiene coordenadas aleatorias y texturas de escaneo fototérmico."
  },
  {
    title: "MUTACIÓN ANÁLOGA",
    concept: "Colisión visual entre tipografía suiza ultra-limpia y texturas de copiadora xerográfica sobrecalentada que desvanece la legibilidad.",
    limitations: [
      "No usar alineaciones de texto comunes",
      "Sólo usar círculos negros rellenos de textura",
      "Tener un elemento estirado al 800% de escala"
    ],
    palette: ["#0B0C10", "#FF003C", "#EAEAEA", "#FFEA00"],
    composition: "Toda la información se apila en una columna ultra-estrecha de 100px. Un círculo distorsionado en el centro sirve de punto de anclaje visual, imitando un error tipográfico clásico."
  },
  {
    title: "CRT NOSTALGIA DESTRUIDA",
    concept: "Ilustración de interfaz de computadora retro de los 80 que experimenta un bucle de desbordamiento de memoria cromática.",
    limitations: [
      "Usar tipografía monosepaciada estirada horizontalmente",
      "Estrictamente usar 3 colores de neón",
      "Prohibido el uso de imágenes realistas"
    ],
    palette: ["#03001e", "#7303c0", "#ec38bc", "#fdeff9"],
    composition: "Múltiples ventanas superpuestas con bordes de pixels rotos, simulando una consola en modo DOS en medio de un glitch estético salvaje."
  }
];

const FALLBACK_MIXES = [
  {
    hybridName: "Bauhaus-Grit",
    philosophy: "La sobriedad y geometría matemática del siglo XX colisiona con el ruido analógico del punk urbano y la deformación digital xerográfica.",
    typographicRules: "Fuentes sans-serif pesadas como Impact o Helvetica condensada, apiladas verticalmente y cortadas por franjas horizontales de alto contraste.",
    posterPrompt: "Diseña un cartel conmemorativo de una orquesta de sintetizadores brutalistas usando rectángulos perfectos que gotean ruido visual y glitches analógicos.",
    visualDirectives: [
      "Estructura modular rígida rota por un glitch cruzado",
      "Saturación total en fondos negros profundos",
      "Elementos tipográficos gigantes superpuestos"
    ]
  },
  {
    hybridName: "Cyber-Suizo",
    philosophy: "El purismo minimalista, la cuadrícula invisible y el rigor tipográfico helvético infectados por el neón, la paranoia de datos y las distorsiones CRT cyberpunk.",
    typographicRules: "Usa familias neo-grotescas en tamaños diminutos con tracking extremadamente amplio, contrastando con letras aisladas de proporciones colosales.",
    posterPrompt: "Un cartel que muestre instrucciones de desmantelamiento de hardware obsoleto en una cuadrícula suiza perfecta, iluminada con bordes de color magenta digital fosforescente.",
    visualDirectives: [
      "Cuadrícula simétrica estricta",
      "Resplandores magenta y azul eléctrico sutiles",
      "Insertos de código de terminal legibles en tamaño miniatura"
    ]
  }
];

// ---------------- API ENDPOINTS ----------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    aiEnabled: ai !== null,
    timestamp: new Date().toISOString()
  });
});

// Endpoint: AI Creative Concept Generator
app.post("/api/gemini/generate-concept", async (req, res) => {
  const { blockType, userInputs } = req.body;
  if (!ai) {
    console.log("No AI client. Serving pre-baked concept.");
    const randomIdx = Math.floor(Math.random() * FALLBACK_CONCEPTS.length);
    return res.json({
      ...FALLBACK_CONCEPTS[randomIdx],
      simulated: true,
      message: "Usando motor local de redundancia. ¡Configura tu GEMINI_API_KEY para desbloquear el caos real en la nube!"
    });
  }

  try {
    const prompt = `Crea un concepto visual experimental creativo para romper un bloqueo comercial/artístico.
El usuario tiene un bloqueo en la categoría: "${blockType}". 
Detalles adicionales proporcionados por el usuario: "${userInputs || 'Ninguno'}".

Genera un concepto rebelde, underground, punk o brutalista que se burle de las reglas de diseño tradicionales para liberar su mente.
Debes devolver la respuesta estrictamente en JSON compatible con este esquema:
{
  "title": "Nombre de la intervención artística o concepto en mayúsculas",
  "concept": "Explicación del concepto retador y la vibra visual (máximo 3 frases)",
  "limitations": ["Limitación extrema 1", "Limitación extrema 2", "Limitación extrema 3"],
  "palette": ["Hex1", "Hex2", "Hex3", "Hex4"],
  "composition": "Descripción de la composición asimétrica y el caos visual sugerido"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            concept: { type: Type.STRING },
            limitations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            palette: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            composition: { type: Type.STRING }
          },
          required: ["title", "concept", "limitations", "palette", "composition"]
        }
      }
    });

    const text = response.text || "";
    const parsedData = JSON.parse(text);
    res.json({ ...parsedData, simulated: false });
  } catch (error: any) {
    console.error("Error in generate-concept:", error);
    res.status(500).json({
      error: "Failed to generate concept",
      details: error.message,
      fallback: FALLBACK_CONCEPTS[0]
    });
  }
});

// Endpoint: Style Mixer
app.post("/api/gemini/mix-styles", async (req, res) => {
  const { styleA = "", styleB = "" } = req.body || {};
  const sA = String(styleA).toLowerCase();
  const sB = String(styleB).toLowerCase();
  
  if (!ai) {
    console.log("No AI client. Serving pre-baked style mix.");
    const matched = FALLBACK_MIXES.find(m => 
      (m.hybridName && m.hybridName.toLowerCase().includes(sA)) || 
      (m.hybridName && m.hybridName.toLowerCase().includes(sB))
    ) || FALLBACK_MIXES[0];
    return res.json({
      ...matched,
      simulated: true,
      message: "Mezclador local activado. ¡Configura tu GEMINI_API_KEY para combinaciones salvajes infinitas!"
    });
  }

  try {
    const prompt = `Mezcla estos dos movimientos de diseño gráfico de forma extrema y rebelde: "${styleA}" + "${styleB}".
Explica cómo conviven sus filosofías que teóricamente chocan y da directrices para romper moldes.

Responde estrictamente en formato JSON con el siguiente esquema:
{
  "hybridName": "Nombre original e híbrido del estilo",
  "philosophy": "Filosofía del choque de estilos en un breve párrafo provocativo",
  "typographicRules": "Reglas de tipografía para este nuevo estilo bizarro",
  "posterPrompt": "Prompt descriptivo detallado para armar una composición gráfica basadas en esta mezcla",
  "visualDirectives": ["Directriz de diseño 1", "Directriz de diseño 2", "Directriz de diseño 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hybridName: { type: Type.STRING },
            philosophy: { type: Type.STRING },
            typographicRules: { type: Type.STRING },
            posterPrompt: { type: Type.STRING },
            visualDirectives: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["hybridName", "philosophy", "typographicRules", "posterPrompt", "visualDirectives"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ ...parsedData, simulated: false });
  } catch (error: any) {
    console.error("Error in style-mixer:", error);
    res.status(500).json({
      error: "Failed to generate style mix",
      details: error.message,
      fallback: FALLBACK_MIXES[0]
    });
  }
});

// Endpoint: Anti-Perfectionism Attack
app.post("/api/gemini/anti-perfectionism", async (req, res) => {
  const { currentDuration, toolRepeats, detailClicks } = req.body;
  
  const minutes = Math.round((currentDuration || 120000) / 60000);
  
  if (!ai) {
    return res.json({
      snarkyRemark: `¡Llevas ${minutes} minutos analizando obsesivamente pixeles diminutos en este canvas! Estás atrapado en la espiral de lo corporativo y aburrido.`,
      destructionDirective: "ALERTA ANTI-EDICIÓN: ¡Activa la deformación extrema, rota el lienzo 180° y añade un tachón gigante magenta fosforescente sobre tu elemento principal!",
      simulated: true
    });
  }

  try {
    const prompt = `Un usuario está sufriendo de obsesión y perfeccionismo estúpido en su canvas de diseño. 
Metadatos: lleva ${minutes} minutos en la sesión con ${detailClicks || 12} reajustes milimétricos innecesarios.

Escribe una respuesta corta y ácida en español con actitud punk, brutalista y artística que diga algo provocativo y le ordene DESTRUIR, estropear deliberadamente o distorsionar drásticamente su diseño para revivir su creatividad orgánica.
Devuelve un JSON estrictamente con este formato:
{
  "snarkyRemark": "Comentario ingenioso, rebelde y burlón en español sobre su obsesión con el detalle",
  "destructionDirective": "Una orden directa, loca e imprevista para forzar distorsión física, cromática o textual en su cartel actual"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            snarkyRemark: { type: Type.STRING },
            destructionDirective: { type: Type.STRING }
          },
          required: ["snarkyRemark", "destructionDirective"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ ...parsedData, simulated: false });
  } catch (error: any) {
    console.error("Error in anti-perfectionism:", error);
    res.json({
      snarkyRemark: "Has estado atrapado en simetrías por demasiado tiempo.",
      destructionDirective: "Quita la mitad de los elementos o estíralos verticalmente al 500%."
    });
  }
});

// Endpoint: Analyze uploaded design
app.post("/api/gemini/analyze-design", async (req, res) => {
  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "No image content provided" });
  }

  if (!ai) {
    return res.json({
      critique: "Vemos tu composición. De manera local sugerimos que es un excelente boceto estructurado, pero le falta alma rebelde. La cuadrícula ejerce un control dictatorial sobre tus ideas.",
      destructionInstruction: "Agrega un canal de distorsión RGB salvaje, rompe las tipografías recortando sílabas y superpon un bloque negro opaco del 40% del tamaño total con texto en rotación de 12 grados.",
      perfectionismLevel: 8,
      glitchRecommendation: "Efecto espejo invertido con un barrido vertical retro CRT.",
      simulated: true,
      message: "Simulación crítica local. ¡Configura GEMINI_API_KEY para desatar una evaluación implacable con visión neuronal real!"
    });
  }

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    
    const imagePart = {
      inlineData: {
        mimeType: "image/png",
        data: cleanBase64,
      },
    };
    
    const textPart = {
      text: `Actúa como un crítico de diseño underground ultra-honesto y rebelde, enemigo jurado de las agencias de marketing corporativo y los dashboards corporativos limpios de Silicon Valley.
Analiza esta imagen y describe cómo estropearla artísticamente y llenarla de personalidad salvaje e inesperada.

Devuelve estrictamente un JSON conforme a este esquema exacto:
{
  "critique": "Tu análisis brutal e inspirador en español (sin tapujos, criticando el exceso de simetría o limpieza)",
  "destructionInstruction": "Instrucción técnica-artística extrema para vandalizar su cartel en el editor",
  "perfectionismLevel": 7, // nivel de limpieza del 1 al 10
  "glitchRecommendation": "Recomendación específica de deformación, pixelados, glitch, o ruidos analógicos coherente con los colores de la obra"
}`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING },
            destructionInstruction: { type: Type.STRING },
            perfectionismLevel: { type: Type.INTEGER },
            glitchRecommendation: { type: Type.STRING }
          },
          required: ["critique", "destructionInstruction", "perfectionismLevel", "glitchRecommendation"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json({ ...parsedData, simulated: false });
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    res.status(500).json({
      error: "Could not analyze image due to server glitch",
      details: error.message
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ERROR SERVER ON] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("FATAL: Failed to start rebel server:", err);
});
