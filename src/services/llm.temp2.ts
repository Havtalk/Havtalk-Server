import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Part, Content } from "@google/generative-ai";


type CharacterSettings = {
  name: string;
  description: string;
  personality: string;
  setting: string;
  userRole: string;
  additionalContext: string;
};

type UserPersona = {
  name: string;
  description: string;
  personality: string;
} | null;

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

const createSystemPrompt = (characterSettings: CharacterSettings, userPersona?: UserPersona) => {
  let prompt = `You are an expert creative writing assistant, embodying the character described below with vivid detail for an immersive conversation. Your responses must stay true to the character's personality and the established setting. 

**Character**: You are ${characterSettings.name}, ${characterSettings.description}
**Character Personality**: ${characterSettings.personality}
**Setting**: ${characterSettings.setting}
**Additional Context**: ${characterSettings.additionalContext}
`;

  if (userPersona) {
    prompt += `
**User Role**: The user is roleplaying as ${userPersona.name}, who is ${userPersona.description}
**User Personality**: ${userPersona.personality}

Respond as your character would to this specific persona. Acknowledge their identity and maintain a consistent dynamic between the two characters throughout the conversation.`;
  } else {
    prompt += `
**User Role**: ${characterSettings.userRole}

Respond as your character would to the user, maintaining your unique voice and perspective throughout the conversation.`;
  }

  return prompt;
};

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const getAIResponse = async (
  userMessage: string, 
  history: Content[],
  systemPrompt: string | Part | Content | undefined,
  modelName: string = 'gemini:1.5-flash'
) => {
  try {
    if (!MODEL_CONFIG[modelName]) {
      modelName = 'gemini:1.5-flash'; // Default if specified model doesn't exist
    }
    
    const model = gemini.getGenerativeModel({
      model: MODEL_CONFIG[modelName].geminiModel,
      safetySettings: geminiSafetySettings,
      systemInstruction: systemPrompt,
      generationConfig: { 
        temperature: MODEL_CONFIG[modelName].temperature,
        maxOutputTokens: MODEL_CONFIG[modelName].maxTokens
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
