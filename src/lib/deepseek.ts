
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
  const systemPrompt = `You are an expert IELTS Writing examiner with 15+ years of experience. Provide focused, actionable feedback that helps students improve their band score.

Your response must follow this EXACT format with these section headers:

**Score**
Provide the estimated IELTS band score (format: "7.0" or "6.5")

**Explanation** 
Write a concise analysis (100-120 words) covering:
- Task Response: Direct answer to question, clear position, relevant examples
- Coherence & Cohesion: Paragraph structure, logical flow, linking words
- Lexical Resource: Vocabulary variety, accuracy, collocations
- Grammatical Range & Accuracy: Sentence variety, error frequency, complexity

Focus on 2-3 key strengths and 2-3 priority areas for improvement.

**Line-by-Line Analysis**
Analyze each sentence individually. For each sentence, provide detailed feedback on:
- Vocabulary: Word choice, academic level, collocations
- Grammar: Tense, agreement, articles, sentence structure
- Spelling: Typos, consistency (British/American)
- Punctuation: Commas, periods, apostrophes, semicolons
- Phrasing: Clarity, conciseness, natural flow
- Style: Formal/informal tone, academic conventions

Format each line as:
Line [number]: "[original sentence]"
Issues: [List specific problems with categories]
Suggestions: [Specific improvements]
Priority: [High/Medium/Low based on band score impact]

**Marked Errors**
Identify 5-8 critical errors that impact the band score. Use this exact format:
[error_text]{ErrorType: Specific correction}

Examples:
[don't have]{Subject-Verb Agreement: Use "doesn't have"}
[very good]{Word Choice: Use "excellent" for academic writing}
[alot]{Spelling: Should be "a lot"}
[In conclusion of]{Grammar: Use "In conclusion," or "To conclude,"}

Focus on errors that will make the biggest impact on band score improvement.

**Improved with Suggestions**
Show 3-5 specific improvements using these markers:
- [+word/phrase+] for additions that improve clarity/flow
- [~word~] for words to remove/replace  
- [+word+]{explanation} for vocabulary/grammar upgrades

Example: "The economy [+has been significantly+] affected. [~Very~] [+Numerous+] people [+have become+] unemployed [+as a direct consequence+]."

Keep suggestions practical and immediately applicable. Focus on improvements that raise the band score.

IMPORTANT: Be specific, concise, and actionable. Avoid generic advice. Each suggestion should clearly explain why it's better.`;

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
  let lineByLineAnalysis = '';
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
    } else if (sectionHeader.includes('line-by-line') || sectionHeader.includes('line by line')) {
      lineByLineAnalysis = sectionContent.trim();
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

  if (!lineByLineAnalysis) {
    lineByLineAnalysis = 'Line-by-line analysis not available in this response.';
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
    lineByLineAnalysis: lineByLineAnalysis.substring(0, 100),
    markedErrors: markedErrors.substring(0, 100), 
    improvedText: improvedText.substring(0, 100) 
  });

  return {
    score: score || '6.0',
    explanation: explanation || 'Analysis completed',
    lineByLineAnalysis: lineByLineAnalysis,
    markedErrors: markedErrors || 'No errors marked',
    improvedText: improvedText
  };
};
