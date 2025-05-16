import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, Content } from "@google/generative-ai";

export const geminiSafetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];
export const MODEL_CONFIG = {
    'gemini:1.5-flash': {
        temperature: 0.7,
        maxTokens: 500,
        api: 'gemini',
        geminiModel: 'gemini-1.5-flash'
    },
    'gemini:1.5-pro': {
        temperature: 0.7,
        maxTokens: 500,
        api: 'gemini',
        geminiModel: 'gemini-1.5-pro'
    },
};

export const gemini=new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

