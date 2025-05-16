import {gemini,MODEL_CONFIG,geminiSafetySettings} from '../lib/llm';
import { Content, Part } from "@google/generative-ai";


type Character={
  name: string;
  description: string;
  personality: string;
}

type UserPersona = {
  name: string;
  description: string;
  personality: string;
} | null;

// interface ConversationPart {
//   text: string;
// }

// interface ConversationEntry {
//   role: 'user' | 'ai';
//   parts: ConversationPart[];
// }

// const conversationHistory: ConversationEntry[] = [];

const createSystemPrompt = (character: Character,userName:string, userPersona?: UserPersona,environment?:string) => {
  let prompt = `You are an expert creative writing assistant, embodying the character described below with vivid detail for an immersive conversation. Your responses must stay true to the character's personality and the established setting.
**Character**: You are ${character.name}, ${character.description}
**Character Personality**: ${character.personality}
**Environment**: ${environment}
`;

  if (userPersona) {
    prompt += `
**User Role**: The user is roleplaying as ${userPersona.name}, who is ${userPersona.description}
**User Personality**: ${userPersona.personality}
Respond as your character would to this specific persona. Acknowledge their identity and maintain a consistent dynamic between the two characters throughout the conversation.`;
  } else {
    prompt += `
**User Role**: ${userName}
Respond as your character would to the user, maintaining your unique voice and perspective throughout the conversation.`;
  }
  return prompt;
};

const generateResponse = async (userMessage: string, history: Content[], systemPrompt: string | Part | Content | undefined) => {
  try {
    const model = gemini.getGenerativeModel({
      model: MODEL_CONFIG['gemini:1.5-flash'].geminiModel,
      safetySettings: geminiSafetySettings,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: MODEL_CONFIG['gemini:1.5-flash'].temperature,
        maxOutputTokens: MODEL_CONFIG['gemini:1.5-flash'].maxTokens
      }
    });

    // conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });
    

    // Create a new chat session with history
    // const chatSession = model.startChat()
    // const response = await chatSession.sendMessage(userMessage);

    const chatSession = model.startChat({history: history });
    const result = await chatSession.sendMessage(userMessage);
    // conversationHistory.push({ role: 'ai', parts: [{ text: result.response.text() }] }); // Changed 'assistant' to 'model'
    console.log(result.response.text());
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

export {generateResponse,createSystemPrompt};

