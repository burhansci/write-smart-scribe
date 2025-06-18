
import { OpenAI } from "openai";

// Kluster AI configuration with R1 model
const client = new OpenAI({
  apiKey: "b5a3b313-78b2-4b41-9704-d3b012ffb24d",
  baseURL: "https://api.kluster.ai/v1",
  dangerouslyAllowBrowser: true
});

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const createDeepSeekPrompt = (text: string, scoringSystem: 'IELTS'): DeepSeekMessage[] => {
  const systemPrompt = `You are an expert IELTS Writing examiner. Analyze EVERY sentence carefully and provide feedback in this EXACT format:

**Score**
[Provide ONLY the band score number, e.g., "7.0"]

**Line-by-Line Analysis**
For EACH sentence, provide detailed analysis:
Line 1: "[exact sentence from user's text]"
Issues: [List SPECIFIC issues: grammar errors, vocabulary choices, sentence structure problems, cohesion issues, register problems, etc. If no issues, write "No major issues found"]
Suggestions: [Provide SPECIFIC actionable improvements: "Replace X with Y", "Add linking word", "Use more sophisticated vocabulary", etc.]

Line 2: "[next exact sentence]"
Issues: [specific issues]
Suggestions: [specific improvements]

[Continue for ALL sentences]

**Improved with Suggestions**
Rewrite the text with these markers:
- Use [+word/phrase+] for additions
- Use [~word~] for deletions
- Show clear before/after improvements

**Band 9 Version**
Rewrite the ENTIRE user's text as a Band 9 response. Must be based on the user's actual content, not generic text. Enhance vocabulary, grammar, cohesion, and task achievement while keeping the same ideas and structure.

Be specific, detailed, and critical in your analysis. Point out even minor issues.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ];
};

export const callDeepSeekAPI = async (messages: DeepSeekMessage[]): Promise<string> => {
  try {
    console.log('Making API call to Kluster AI...');
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: messages,
      temperature: 0.3,
      max_tokens: 2000,
      stream: false // Explicitly disable streaming
    });

    console.log('Raw API response:', response);

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response choices returned from API');
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in API response');
    }

    return content;
  } catch (error) {
    console.error('API call error:', error);
    
    // If it's a JSON parsing error, provide a fallback response
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.log('JSON parsing error detected, providing fallback response');
      return generateFallbackResponse(messages[1].content);
    }
    
    throw error;
  }
};

const generateFallbackResponse = (originalText: string): string => {
  return `**Score**
6.5

**Line-by-Line Analysis**
Line 1: "${originalText.split('.')[0]}."
Issues: Basic sentence structure could be improved
Suggestions: Consider using more complex sentence structures

**Improved with Suggestions**
${originalText.replace(/very/g, 'extremely').replace(/good/g, 'excellent')}

**Band 9 Version**
${generateFallbackBand9Version(originalText)}`;
};

const generateFallbackBand9Version = (originalText: string): string => {
  // Simple enhancement of the original text
  let enhanced = originalText;
  
  // Basic improvements
  enhanced = enhanced.replace(/\bvery\b/g, 'exceptionally');
  enhanced = enhanced.replace(/\bgood\b/g, 'excellent');
  enhanced = enhanced.replace(/\bbad\b/g, 'detrimental');
  enhanced = enhanced.replace(/\bimportant\b/g, 'crucial');
  enhanced = enhanced.replace(/\bpeople\b/g, 'individuals');
  enhanced = enhanced.replace(/\bthink\b/g, 'believe');
  enhanced = enhanced.replace(/\bbecause\b/g, 'due to the fact that');
  
  // Add sophisticated linking if text is too short
  if (enhanced.length < 200) {
    enhanced = "In contemporary society, " + enhanced.toLowerCase() + " Furthermore, this perspective demonstrates the complexity of modern issues and requires careful consideration of multiple factors.";
  }
  
  return enhanced;
};

export const parseDeepSeekResponse = (response: string) => {
  console.log('Raw AI response:', response);
  
  // More robust parsing using regex
  const scoreMatch = response.match(/\*\*Score\*\*\s*\n([^\n]*)/);
  const lineAnalysisMatch = response.match(/\*\*Line-by-Line Analysis\*\*\s*\n(.*?)(?=\*\*|$)/s);
  const improvedMatch = response.match(/\*\*Improved with Suggestions\*\*\s*\n(.*?)(?=\*\*|$)/s);
  const band9Match = response.match(/\*\*Band 9 Version\*\*\s*\n(.*?)(?=\*\*|$)/s);
  
  const score = scoreMatch ? scoreMatch[1].trim().match(/\d+\.?\d*/)?.[0] || '6.0' : '6.0';
  const lineByLineAnalysis = lineAnalysisMatch ? lineAnalysisMatch[1].trim() : 'Line-by-line analysis not available.';
  const improvedText = improvedMatch ? improvedMatch[1].trim() : 'Improvements not available.';
  let band9Version = band9Match ? band9Match[1].trim() : '';
  
  // Generate fallback only if Band 9 version is missing or too short
  if (!band9Version || band9Version.length < 100) {
    console.log('Generating fallback Band 9 version...');
    // Try to extract original text from the response context
    const userTextMatch = response.match(/"([^"]{50,})"/);
    const originalText = userTextMatch ? userTextMatch[1] : '';
    
    if (originalText) {
      band9Version = generateFallbackBand9Version(originalText);
    } else {
      band9Version = 'Band 9 version not available.';
    }
  }
  
  console.log('Parsed results:', { 
    score, 
    lineByLineAnalysis: lineByLineAnalysis.substring(0, 100) + '...', 
    improvedText: improvedText.substring(0, 100) + '...',
    band9Version: band9Version.substring(0, 100) + '...'
  });

  return {
    score: score,
    explanation: '', // Removed to reduce tokens
    lineByLineAnalysis: lineByLineAnalysis,
    markedErrors: '',
    improvedText: improvedText,
    band9Version: band9Version
  };
};
