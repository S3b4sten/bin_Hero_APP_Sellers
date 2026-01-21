import { GoogleGenerativeAI } from "@google/generative-ai";
import { GeminiSuggestion } from "../types";

export const getAIListingHelp = async (imageBase64: string, itemName?: string): Promise<GeminiSuggestion & { name: string }> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("ERREUR : Clé API manquante !");
    alert("Clé API manquante. Vérifiez la configuration sur Render.");
    throw new Error("Clé API manquante");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // CHANGEMENT ICI : Utilisation de "gemini-1.5-pro" qui est le modèle principal
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

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

    // Nettoyage de l'image (au cas où)
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
    
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText) as GeminiSuggestion & { name: string };

  } catch (error) {
    console.error("ERREUR GEMINI (Voir détails) :", error);
    // On affiche l'erreur à l'utilisateur pour comprendre ce qui se passe
    alert(`Erreur IA : ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    
    return {
      name: itemName || "Erreur Technique",
      suggestedPrice: 0,
      description: "L'IA n'a pas pu répondre. Vérifiez la console.",
      category: "Erreur"
    };
  }
};