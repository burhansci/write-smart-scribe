
import { DeepSeekMessage, parseDeepSeekResponse } from "@/lib/deepseek";

const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Calls the Hugging Face Inference API.
 * It uses an instruction-tuned model and includes a retry mechanism in case the model is loading.
 */
export const callHuggingFaceAPI = async (messages: DeepSeekMessage[], retries = 3): Promise<string> => {
  // HuggingFace expects a single string prompt. We'll format our messages.
  const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
  const userPrompt = messages.find(m => m.role === 'user')?.content || '';
  
  // This format is optimized for instruction-following models like Mistral.
  const fullPrompt = `<s>[INST] ${systemPrompt} \n\nHere is the text to analyze: \n\n${userPrompt} [/INST]`;

  try {
    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1500, // Kept reasonable for the free tier to avoid timeouts.
          return_full_text: false, // We only want the generated part, not the prompt.
          temperature: 0.3,
        }
      }),
    });

    if (response.status === 503) { // This status means the model is loading.
      if (retries > 0) {
        const errorData = await response.json();
        const waitTime = (errorData.estimated_time || 20) * 1000; // Wait time in ms.
        console.log(`Hugging Face model is loading, retrying in ${waitTime / 1000}s...`);
        await delay(waitTime);
        return callHuggingFaceAPI(messages, retries - 1); // Retry the call.
      } else {
        throw new Error('The free analysis model is currently unavailable after multiple retries. Please try again later.');
      }
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    // The response is an array, we get the generated text from the first element.
    return data[0]?.generated_text || 'No response received from Hugging Face.';
  } catch (error) {
    console.error("HuggingFace API call failed:", error);
    throw error;
  }
};

/**
 * Parses the response from Hugging Face.
 * Since we use the same system prompt, the structure of the AI's response should be
 * the same as DeepSeek's, so we can reuse the existing parser.
 */
export const parseHuggingFaceResponse = (response: string) => {
    return parseDeepSeekResponse(response);
}

