import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ElementType, WireframeData } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

// Define the schema for the UI structure
// Note: Recursive schemas need careful definition, we simplify strictly for stability
const styleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    flexDirection: { type: Type.STRING, enum: ['row', 'col'] },
    justifyContent: { type: Type.STRING, enum: ['start', 'center', 'end', 'between'] },
    alignItems: { type: Type.STRING, enum: ['start', 'center', 'end'] },
    backgroundColor: { type: Type.STRING, description: "Tailwind color class e.g., 'bg-blue-500'" },
    color: { type: Type.STRING, description: "Tailwind text color class e.g., 'text-white'" },
    width: { type: Type.STRING, description: "Tailwind width class e.g., 'w-full'" },
    padding: { type: Type.STRING, description: "Tailwind padding class e.g., 'p-4'" },
    borderRadius: { type: Type.STRING, description: "Tailwind rounded class e.g., 'rounded-lg'" },
  }
};

const componentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    type: { type: Type.STRING, enum: Object.values(ElementType) },
    label: { type: Type.STRING, description: "Text content for buttons, headers, labels" },
    placeholder: { type: Type.STRING, description: "Placeholder for inputs" },
    style: styleSchema,
    children: {
      type: Type.ARRAY,
      items: {
         type: Type.OBJECT,
         // Recursive reference is tricky in pure JSON schema for some parsers, so we define a simplified nested structure.
         // We explicitly define properties one level deep to provide structure to the model.
         properties: {
             id: { type: Type.STRING },
             type: { type: Type.STRING, enum: Object.values(ElementType) },
             label: { type: Type.STRING },
             placeholder: { type: Type.STRING },
             style: styleSchema,
             children: { type: Type.ARRAY, items: { type: Type.OBJECT } } // 2 levels deep is usually enough for basic wireframes
         }
      } 
    }
  },
  required: ['id', 'type']
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    rootElements: {
      type: Type.ARRAY,
      items: componentSchema
    }
  },
  required: ['title', 'rootElements']
};

export const generateWireframe = async (prompt: string): Promise<WireframeData> => {
  const ai = getAiClient();

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a UI wireframe structure based on this description: "${prompt}". 
      Generate a hierarchical component tree. 
      Use 'container' types with flex-col or flex-row styles to organize layout.
      Use 'card' for grouped sections.
      Ensure the output is a valid JSON matching the schema.
      If the user describes a complex app, break it down into logical sections.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        thinkingConfig: { thinkingBudget: 1024 }, // Small budget for logic
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as WireframeData;
    return data;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};