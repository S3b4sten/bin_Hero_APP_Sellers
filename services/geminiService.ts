import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiSuggestion } from "../types";

export const getAIListingHelp = async (imageBase64: string, itemName?: string): Promise<GeminiSuggestion & { name: string }> => {
  // Récupération de la clé (gérée par votre vite.config.ts)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("ERREUR CRITIQUE : Clé API manquante ou non chargée.");
    throw new Error("Clé API manquante");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Utilisez un modèle standard stable. "gemini-3" n'existe probablement pas encore, 
    // "gemini-1.5-flash" est très rapide pour ce cas d'usage.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    // Préparation de l'image pour le SDK Web
    const imagePart = {
      inlineData: {
        data: imageBase64.split(',')[1] || imageBase64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Nettoyage du JSON (au cas où le modèle ajoute des balises markdown ```json ... ```)
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(cleanedText);

    return data as GeminiSuggestion & { name: string };

  } catch (error) {
    console.error("ERREUR GEMINI API:", error);
    // On relance l'erreur pour voir le problème dans la console du navigateur (F12)
    // ou on retourne le fallback si on veut vraiment continuer
    return {
      name: itemName || "Objet non identifié (Erreur API)",
      suggestedPrice: 0,
      description: "L'analyse IA a échoué. Vérifiez la console (F12) pour l'erreur exacte.",
      category: "Erreur"
    };
  }
};