import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, Content } from "@google/generative-ai";

type CharacterSettings = {
  name: string;
  description: string;
  personality: string;
  setting: string;
  userRole: string;
  additionalContext: string;
};

const geminiSafetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODEL_CONFIG = {
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

const createSystemPrompt = (characterSettings:CharacterSettings) => {
  return `You are an expert creative writing assistant, embodying the character and scenario described below with vivid detail for a fictional roleplay. Your responses are creative and stay true to the character's personality. The scenario is:

**Setting**: ${characterSettings.setting}
**Character**: You are ${characterSettings.name}, ${characterSettings.description}
**Character Personality**: ${characterSettings.personality}
**User Role**: ${characterSettings.userRole}
**Additional Context**: ${characterSettings.additionalContext}

Respond as this character would, maintaining their unique voice and perspective throughout our conversation.`;
};

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const getAIResponse = async (userMessage:string, history:Content[],systemPrompt:string | Part | Content | undefined) => {
  try {
      const model = gemini.getGenerativeModel({
          model: MODEL_CONFIG['gemini:1.5-flash'].geminiModel,
          safetySettings: geminiSafetySettings,
          systemInstruction:systemPrompt,
          generationConfig: { 
              temperature: MODEL_CONFIG['gemini:1.5-flash'].temperature,
              maxOutputTokens: MODEL_CONFIG['gemini:1.5-flash'].maxTokens
          }
      });
      
      // Create a new chat session with history
      const chatSession = model.startChat({ 
          history: history 
      });
      
      // Send the message and get the response
      const result = await chatSession.sendMessage(userMessage);
      return result.response.text() || "I'm not sure what to say.";
  } catch (error) {
      console.error("Error fetching AI response:", error.message);
      throw new Error(`AI error: ${error.message}`);
  }
};
