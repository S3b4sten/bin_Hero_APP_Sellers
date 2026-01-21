import { GoogleGenerativeAI } from "@google/generative-ai"; // Nouvelle librairie
import { GeminiSuggestion } from "../types";

export const getAIListingHelp = async (imageBase64: string, itemName?: string): Promise<GeminiSuggestion & { name: string }> => {
  // Récupération de la clé API
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("ERREUR : Clé API manquante !");
    alert("Clé API manquante. Vérifiez la configuration.");
    throw new Error("Clé API manquante");
  }

  try {
    // Initialisation avec la nouvelle librairie
    const genAI = new GoogleGenerativeAI(apiKey);
    // Utilisation de la version stable spécifique
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" }); // Modèle rapide

    const prompt = `Analyze this image of a returned item. 
    1. Identify exactly what the item is and provide a clear, concise name (max 40 chars).
    2. Suggest a fair original resale price in EUR for a liquidation bin store.
    3. Write a short, catchy 2-sentence description focusing on its features.
    4. Categorize it (e.g., Electronics, Home, Kitchen, Fashion, Toys).
    ${itemName ? `Note: The user says this might be "${itemName}".` : ""}
    Output ONLY valid JSON following this schema:
    {
      "name": "string",
      "suggestedPrice": number,
      "description": "string",
      "category": "string"
    }`;

    // Préparation de l'image (retrait du préfixe data:image/...)
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    
    // Nettoyage du JSON (au cas où l'IA ajoute des balises Markdown)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText) as GeminiSuggestion & { name: string };

  } catch (error) {
    console.error("ERREUR DÉTAILLÉE GEMINI :", error); // <--- Regardez ceci dans la console F12
    return {
      name: itemName || "Erreur d'analyse",
      suggestedPrice: 0,
      description: "Impossible d'analyser l'image. Vérifiez votre clé API.",
      category: "Erreur"
    };
  }
};