
import { DeepSeekMessage, parseDeepSeekResponse } from "@/lib/deepseek";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

/**
 * Calls the Hugging Face Inference API via a secure Supabase Edge Function.
 * It uses an instruction-tuned model and includes a retry mechanism in case the model is loading.
 */
export const callHuggingFaceAPI = async (messages: DeepSeekMessage[], retries = 3): Promise<string> => {
  try {
    const { data: responseData, error: functionError } = await supabase.functions.invoke('huggingface-analysis', {
        body: { messages },
    });

    if (functionError) {
      if (functionError instanceof FunctionsHttpError && functionError.context.status === 503) {
        if (retries > 0) {
          const errorData = await functionError.context.json();
          const waitTime = (errorData.estimated_time || 20) * 1000; // Wait time in ms.
          console.log(`Hugging Face model is loading, retrying in ${waitTime / 1000}s...`);
          await delay(waitTime);
          return callHuggingFaceAPI(messages, retries - 1); // Retry the call.
        } else {
          throw new Error('The free analysis model is currently unavailable after multiple retries. Please try again later.');
        }
      }
      
      let errorDetails = functionError.message;
      if (functionError instanceof FunctionsHttpError) {
        const errorJson = await functionError.context.json();
        errorDetails = errorJson.error || functionError.message;
      }
      throw new Error(`Hugging Face API error: ${errorDetails}`);
    }

    // The response is an array, we get the generated text from the first element.
    return responseData[0]?.generated_text || 'No response received from Hugging Face.';
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
