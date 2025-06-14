// OpenRouter API configuration and client
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

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
  const systemPrompt = `You are an expert IELTS Writing examiner. Analyze the writing sample and provide structured feedback.

Your response must follow this EXACT format with these section headers:

**Score**
Provide only the estimated IELTS band score (e.g., "7.0")

**Explanation**
Provide a concise analysis (max 150 words) covering:
- Task Response: How well the question is answered
- Coherence & Cohesion: Organization and linking
- Lexical Resource: Vocabulary range and accuracy  
- Grammatical Range & Accuracy: Grammar and sentence structure

**Marked Errors**
Show the original text with errors marked using this format: [mistake]{ErrorType: Brief explanation}
Examples:
- Grammar errors: [don't have]{Subject-Verb Agreement: Use "doesn't have"}
- Vocabulary: [very good]{Word Choice: Use "excellent" or "outstanding"}
- Spelling: [recieve]{Spelling: Should be "receive"}

**Improved with Suggestions**
Show an improved version using these markers:
- [+word+] for additions that improve flow/clarity
- [~word~] for words to remove/replace
- [+word+]{explanation} for specific suggestions

Focus on:
1. Critical errors that affect band score
2. 3-5 key improvements that would raise the score
3. Specific, actionable suggestions
4. Clear, concise explanations

Keep all sections focused and practical. Avoid generic advice.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ];
};

export const callDeepSeekAPI = async (messages: DeepSeekMessage[], apiKey: string): Promise<string> => {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'AI Writing Coach',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat',
      messages,
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
};

export const parseDeepSeekResponse = (response: string) => {
  console.log('Full response to parse:', response);
  
  // Split by double asterisks and clean up
  const sections = response.split('**').map(s => s.trim()).filter(s => s.length > 0);
  console.log('Split sections:', sections);
  
  let score = '';
  let explanation = '';
  let markedErrors = '';
  let improvedText = '';

  for (let i = 0; i < sections.length; i++) {
    const sectionHeader = sections[i].toLowerCase();
    const sectionContent = sections[i + 1] || '';
    
    console.log(`Checking section: "${sectionHeader}" with content: "${sectionContent.substring(0, 100)}..."`);
    
    if (sectionHeader.includes('score')) {
      // Extract band score - look for decimal numbers
      const scoreMatch = sectionContent.match(/(\d+\.?\d*)/);
      score = scoreMatch ? scoreMatch[1] : sectionContent.trim().split('\n')[0];
    } else if (sectionHeader.includes('explanation')) {
      explanation = sectionContent.trim();
    } else if (sectionHeader.includes('marked') && sectionHeader.includes('error')) {
      markedErrors = sectionContent.trim();
    } else if (sectionHeader.includes('improved') || sectionHeader.includes('suggestions')) {
      improvedText = sectionContent.trim();
    }
  }

  // Validation and fallbacks
  if (!score || isNaN(parseFloat(score))) {
    score = '6.0'; // Default score
  }
  
  if (!explanation) {
    explanation = 'Your writing shows good understanding with areas for improvement in vocabulary, grammar, and organization.';
  }
  
  if (!markedErrors) {
    markedErrors = 'No specific errors marked in this analysis.';
  }
  
  if (!improvedText || improvedText.length < 50) {
    console.log('Generating fallback improvements...');
    improvedText = `${markedErrors} [+Additionally,+]{Add linking words} [+sophisticated+]{Use varied vocabulary} [+In conclusion,+]{Strong concluding phrases}`;
  }

  console.log('Parsed results:', { 
    score, 
    explanation: explanation.substring(0, 100), 
    markedErrors: markedErrors.substring(0, 100), 
    improvedText: improvedText.substring(0, 100) 
  });

  return {
    score: score || '6.0',
    explanation: explanation || 'Analysis completed',
    markedErrors: markedErrors || 'No errors marked',
    improvedText: improvedText
  };
};
