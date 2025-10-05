
import { GoogleGenAI, Type } from "@google/genai";
import type { CaseStudy } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const SYMPTOM_ANALYZER_SYSTEM_INSTRUCTION = `You are an AI radiology information assistant. Your purpose is to provide general, educational information based on user-provided text from a radiology report. You are not a radiologist or a doctor. Do not provide a diagnosis, medical advice, or treatment plans. Your response should be easy to understand for a layperson, explaining complex radiological terms in simple language. Structure your response with a brief, neutral overview of the findings. You MUST conclude every response with the following exact disclaimer, enclosed in a separate section: '**DISCLAIMER:** This is not a medical diagnosis. The information provided is for educational purposes only and is not a substitute for professional medical advice from a qualified radiologist or your referring physician. Please consult with your healthcare provider for any health concerns.'`;

const CASE_STUDY_SYSTEM_INSTRUCTION = `You are an AI assistant specializing in creating radiology case studies for educational purposes. Based on the user's input (e.g., a condition, a modality, an anatomical region), generate a comprehensive and realistic radiology case study. This should include patient history, imaging findings (descriptive), differential diagnosis based on the findings, and a final conclusion or impression. The output must strictly follow the provided JSON schema. Ensure all fields are populated with plausible and detailed radiological information.`;

const TITLE_GENERATION_SYSTEM_INSTRUCTION = `You are an expert at creating short, concise titles. Based on the user's first message in a conversation, create a title that is no more than 5 words long. The title should accurately summarize the main topic of the message.`;


export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: symptoms,
      config: {
        systemInstruction: SYMPTOM_ANALYZER_SYSTEM_INSTRUCTION,
        temperature: 0.5,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    throw new Error("Failed to get analysis from AI. Please try again later.");
  }
};

export const generateCaseStudy = async (scenario: string): Promise<CaseStudy> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a case study for the following scenario: ${scenario}`,
      config: {
        systemInstruction: CASE_STUDY_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Title of the case study." },
            patientProfile: {
              type: Type.OBJECT,
              properties: {
                age: { type: Type.INTEGER, description: "Patient's age." },
                gender: { type: Type.STRING, description: "Patient's gender." },
                background: { type: Type.STRING, description: "Brief patient background, including relevant clinical history." },
              },
              required: ["age", "gender", "background"],
            },
            presentingComplaint: { type: Type.STRING, description: "The main reason for the imaging study." },
            historyOfPresentingIllness: { type: Type.STRING, description: "Detailed clinical history relevant to the imaging." },
            pastMedicalHistory: { type: Type.STRING, description: "Patient's relevant past medical history." },
            differentialDiagnosis: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of possible diagnoses based on imaging findings." },
            investigations: { type: Type.STRING, description: "Description of the imaging modality (e.g., CT, MRI) and findings." },
            managementPlan: { type: Type.STRING, description: "The proposed next steps or management based on the findings." },
            discussionPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key learning points from the case, focusing on radiological interpretation." },
          },
          required: ["title", "patientProfile", "presentingComplaint", "historyOfPresentingIllness", "pastMedicalHistory", "differentialDiagnosis", "investigations", "managementPlan", "discussionPoints"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error generating case study:", error);
    throw new Error("Failed to generate case study. The model may have returned an invalid format. Please try again.");
  }
};

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a title for a chat that starts with this message: "${firstMessage}"`,
            config: {
                systemInstruction: TITLE_GENERATION_SYSTEM_INSTRUCTION,
                temperature: 0.3,
            },
        });
        return response.text.replace(/"/g, ''); // Clean up quotes
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat"; // Fallback title
    }
};
