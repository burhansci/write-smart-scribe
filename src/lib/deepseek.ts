
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
  const systemPrompt = `You are an expert IELTS Writing examiner. Provide focused feedback in this EXACT format:

**Score**
[Provide ONLY the band score number, e.g., "7.0"]

**Line-by-Line Analysis**
For each sentence, provide:
Line [number]: "[original sentence]"
Issues: [specific problems found]
Suggestions: [how to improve]

**Improved with Suggestions**
Show improvements using these markers:
- [+word/phrase+] for additions
- [~word~] for removals
- Original sentence → Improved sentence examples

**Band 9 Version**
Rewrite the ENTIRE original text as a Band 9 response. This must be a complete rewrite of the user's actual text, not generic content.

Keep responses concise and practical.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ];
};

export const callDeepSeekAPI = async (messages: DeepSeekMessage[]): Promise<string> => {
  const response = await client.chat.completions.create({
    model: "deepseek-ai/DeepSeek-V3-0324",
    messages: messages,
    temperature: 0.3,
    max_tokens: 3000,
  });

  return response.choices[0]?.message?.content || 'No response received';
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
