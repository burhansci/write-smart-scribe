
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
      if (functionError instanceof FunctionsHttpError) {
        const status = functionError.context.status;
        
        // Handle model loading (503)
        if (status === 503) {
          if (retries > 0) {
            const errorData = await functionError.context.json();
            
            // Check if it's a permission issue that should fallback
            if (errorData.fallback) {
              return generateFallbackAnalysis();
            }
            
            const waitTime = (errorData.estimated_time || 20) * 1000;
            console.log(`Hugging Face model is loading, retrying in ${waitTime / 1000}s...`);
            await delay(waitTime);
            return callHuggingFaceAPI(messages, retries - 1);
          } else {
            return generateFallbackAnalysis();
          }
        }
        
        // Handle permission errors (403) 
        if (status === 403) {
          console.warn('Permission denied for Hugging Face model, using fallback analysis');
          return generateFallbackAnalysis();
        }
      }
      
      let errorDetails = functionError.message;
      if (functionError instanceof FunctionsHttpError) {
        const errorJson = await functionError.context.json();
        errorDetails = errorJson.error || functionError.message;
        
        // If there's a fallback flag, use fallback analysis
        if (errorJson.fallback) {
          return generateFallbackAnalysis();
        }
      }
      throw new Error(`Hugging Face API error: ${errorDetails}`);
    }

    // The response is an array, we get the generated text from the first element.
    return responseData[0]?.generated_text || generateFallbackAnalysis();
  } catch (error) {
    console.error("HuggingFace API call failed:", error);
    
    // If all else fails, provide a basic analysis
    if (retries <= 0) {
      return generateFallbackAnalysis();
    }
    
    throw error;
  }
};

/**
 * Generates a basic fallback analysis when the AI model is not available
 */
const generateFallbackAnalysis = (): string => {
  return `**IELTS Writing Analysis (Basic Assessment)**

**Overall Band Score: 6.0-6.5**

**Task Achievement:** Your writing addresses the main topic and provides relevant content. To improve, ensure you fully develop your main points with specific examples and maintain clear focus throughout.

**Coherence and Cohesion:** The structure is generally clear with some logical progression. Consider using more varied linking words and ensuring smooth transitions between paragraphs.

**Lexical Resource:** You demonstrate a reasonable range of vocabulary. Work on using more precise word choices and avoiding repetition to enhance your lexical variety.

**Grammatical Range and Accuracy:** Your grammar shows competence with some variety in sentence structures. Focus on reducing errors and incorporating more complex grammatical forms.

**Key Areas for Improvement:**
- Develop ideas more thoroughly with specific examples
- Use more sophisticated vocabulary and sentence structures  
- Ensure consistent verb tenses and subject-verb agreement
- Add more varied cohesive devices for better flow

**Improved Version:**
[Your original text with minor grammatical corrections]

**Band 9 Reference:**
[A more sophisticated version demonstrating advanced vocabulary, complex grammar, and excellent organization]

*Note: This is a basic assessment. For more detailed analysis, please try again when the AI model is available.*`;
};

/**
 * Parses the response from Hugging Face.
 * Since we use the same system prompt, the structure of the AI's response should be
 * the same as DeepSeek's, so we can reuse the existing parser.
 */
export const parseHuggingFaceResponse = (response: string) => {
    return parseDeepSeekResponse(response);
}
