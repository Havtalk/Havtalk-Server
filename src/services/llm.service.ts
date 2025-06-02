import {gemini,MODEL_CONFIG,geminiSafetySettings} from '../lib/llm';
import { Content, Part } from "@google/generative-ai";


type Character={
  name: string;
  description: string;
  personality: string;
  environment?: string | null;
  backstory?: string | null;
  role?: string | null;
  goals?: string | null;
  quirks?: string | null;
  tone?: string | null;
  speechStyle?: string | null;
  exampleDialogues?: any;
  additionalInfo?: string | null;
  tags?: string[];
}

type UserPersona = {
  name: string;
  description: string;
  personality: string;
  backstory?: string | null;
} | null;

const createSystemPrompt = (character: Character, userName: string, userPersona?: UserPersona, environment?: string | null) => {
  let prompt = `You are an expert creative writing assistant, embodying the character described below with vivid detail for an immersive conversation. Your responses must stay true to the character's personality and the established setting.

**Character Identity**: You are ${character.name}, ${character.description}`;

  // Add role if available
  if (character.role) {
    prompt += `
**Character Role**: ${character.role}`;
  }

  // Add personality
  prompt += `
**Character Personality**: ${character.personality}`;

  // Add backstory if available
  if (character.backstory) {
    prompt += `
**Character Backstory**: ${character.backstory}`;
  }

  // Add goals if available
  if (character.goals) {
    prompt += `
**Character Goals & Motivations**: ${character.goals}`;
  }

  // Add quirks if available
  if (character.quirks) {
    prompt += `
**Character Quirks & Habits**: ${character.quirks}`;
  }

  // Add tone if available
  if (character.tone) {
    prompt += `
**Speaking Tone**: ${character.tone}`;
  }

  // Add speech style if available
  if (character.speechStyle) {
    prompt += `
**Speech Style**: ${character.speechStyle}`;
  }

  // Add environment (prioritize passed environment, then character's environment)
  const currentEnvironment = environment || character.environment;
  if (currentEnvironment) {
    prompt += `
**Environment/Setting**: ${currentEnvironment}`;
  }

  // Add additional info if available
  if (character.additionalInfo) {
    prompt += `
**Additional Character Details**: ${character.additionalInfo}`;
  }

  // Add example dialogues for few-shot learning
  if (character.exampleDialogues && Array.isArray(character.exampleDialogues)) {
    prompt += `
**Example Interactions**:`;
    character.exampleDialogues.forEach((dialogue: any, index: number) => {
      prompt += `
Example ${index + 1}:
User: "${dialogue.user}"
${character.name}: "${dialogue.character}"`;
    });
  }

  // Add user persona information
  if (userPersona) {
    prompt += `

**User Role**: The user is roleplaying as ${userPersona.name}, who is ${userPersona.description}
**User Personality**: ${userPersona.personality}`;
    
    if (userPersona.backstory) {
      prompt += `
**User Backstory**: ${userPersona.backstory}`;
    }
    
    prompt += `

Respond as ${character.name} would to this specific persona. Acknowledge their identity and maintain a consistent dynamic between the two characters throughout the conversation. Consider how your character's personality, goals, and quirks would interact with the user's persona.`;
  } else {
    prompt += `

**User Role**: ${userName}
Respond as ${character.name} would to the user, maintaining your unique voice, personality traits, speech style, and perspective throughout the conversation.`;
  }

  // Add behavioral guidelines
  prompt += `

**Behavioral Guidelines**:
- Stay completely in character at all times
- Use the specified speech style and tone consistently
- Incorporate your character's quirks and habits naturally
- Reference your backstory and goals when relevant
- Maintain the established environment and setting
- Keep responses engaging and true to your personality
- If example dialogues were provided, use them as a reference for your speaking pattern`;

  // Add tags context if available
  if (character.tags && character.tags.length > 0) {
    prompt += `
- Remember you embody the themes: ${character.tags.join(', ')}`;
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

    const chatSession = model.startChat({history: history });
    
    const result = await chatSession.sendMessage(userMessage);
    console.log(result.response.text());
    const response = result.response.text();
    return response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

// Add new streaming function
const generateStreamingResponse = async (userMessage: string, history: Content[], systemPrompt: string | Part | Content | undefined) => {
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

    const chatSession = model.startChat({history: history });
    const result = await chatSession.sendMessageStream(userMessage);
    
    return result.stream;
  } catch (error) {
    console.error("Error generating streaming response:", error);
    throw error;
  }
}

export {generateResponse, generateStreamingResponse, createSystemPrompt};

