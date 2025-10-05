import type { CaseStudy } from "../types";

const OLLAMA_API_URL = "https://homolographic-adrianne-involucral.ngrok-free.dev/api/chat";
const OLLAMA_MODEL = "mistral";

const SYMPTOM_ANALYZER_SYSTEM_INSTRUCTION = `You are an AI radiology information assistant. Your purpose is to provide general, educational information based on user-provided text from a radiology report. You are not a radiologist or a doctor. Do not provide a diagnosis, medical advice, or treatment plans. Your response should be easy to understand for a layperson, explaining complex radiological terms in simple language. Structure your response with a brief, neutral overview of the findings. You MUST conclude every response with the following exact disclaimer, enclosed in a separate section: '**DISCLAIMER:** This is not a medical diagnosis. The information provided is for educational purposes only and is not a substitute for professional medical advice from a qualified radiologist or your referring physician. Please consult with your healthcare provider for any health concerns.'`;

const CASE_STUDY_SYSTEM_INSTRUCTION = `You are an AI assistant specializing in creating radiology case studies for educational purposes. Based on the user's input (e.g., a condition, a modality, an anatomical region), generate a comprehensive and realistic radiology case study. This should include patient history, imaging findings (descriptive), differential diagnosis based on the findings, and a final conclusion or impression. The output must be a single, valid JSON object that strictly follows this structure: { "title": "...", "patientProfile": { "age": ..., "gender": "...", "background": "..." }, "presentingComplaint": "...", "historyOfPresentingIllness": "...", "pastMedicalHistory": "...", "differentialDiagnosis": ["..."], "investigations": "...", "managementPlan": "...", "discussionPoints": ["..."] }. Do not include any explanatory text or markdown formatting before or after the JSON object.`;

const TITLE_GENERATION_SYSTEM_INSTRUCTION = `You are an expert at creating short, concise titles. Based on the user's first message in a conversation, create a title that is no more than 5 words long. The title should accurately summarize the main topic of the message. Respond with only the title text, without any quotes or extra formatting.`;


const callOllamaAPI = async (systemInstruction: string, userMessage: string, isJson = false) => {
    try {
        const response = await fetch(OLLAMA_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: [
                    { role: 'system', content: systemInstruction },
                    { role: 'user', content: userMessage },
                ],
                stream: false,
                format: isJson ? 'json' : undefined,
            }),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Ollama API Error:", errorBody);
            throw new Error(`Failed to get response from Ollama. Status: ${response.status}`);
        }

        const data = await response.json();
        return data.message.content;

    } catch (error) {
        console.error("Error calling Ollama API:", error);
        if (error instanceof Error && error.message.includes('Failed to fetch')) {
            throw new Error("Could not connect to the Ollama API server at " + OLLAMA_API_URL + ". Please ensure the server is online and accessible.");
        }
        throw error;
    }
};


export const analyzeSymptoms = async (symptoms: string): Promise<string> => {
    return callOllamaAPI(SYMPTOM_ANALYZER_SYSTEM_INSTRUCTION, symptoms);
};

export const generateCaseStudy = async (scenario: string): Promise<CaseStudy> => {
    const jsonString = await callOllamaAPI(CASE_STUDY_SYSTEM_INSTRUCTION, `Generate a case study for the following scenario: ${scenario}`, true);
    try {
        // The API with format: 'json' should return a string that is a valid JSON.
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing case study JSON from Ollama:", error, "Received:", jsonString);
        throw new Error("Failed to generate case study. The model may have returned an invalid format. Please try again.");
    }
};

export const generateChatTitle = async (firstMessage: string): Promise<string> => {
    const title = await callOllamaAPI(TITLE_GENERATION_SYSTEM_INSTRUCTION, `Generate a title for a chat that starts with this message: "${firstMessage}"`);
    return title.replace(/"/g, '').trim();
};