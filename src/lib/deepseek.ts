
// DeepSeek API configuration and client
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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

export const createDeepSeekPrompt = (text: string, scoringSystem: 'IELTS' | 'GRE'): DeepSeekMessage[] => {
  const systemPrompt = `You are an expert ${scoringSystem} writing evaluator. The user will provide a writing sample. Your task is to do the following:

1. Score the writing:
   - Give an estimated ${scoringSystem === 'IELTS' ? 'IELTS band' : 'GRE AWA'} score.
   - Explain the score in these categories:
     a. Task Response / Issue Analysis
     b. Coherence and Cohesion
     c. Lexical Resource
     d. Grammar and Sentence Structure

2. Error Marking (Original Text):
   - Mark all grammar, spelling, and style mistakes inline using this format:
     [mistake]{ErrorType: Explanation}

3. Correction Display:
   - Show a corrected version of the user's text using these inline tags:
     [+added_word+], [~wrong_word~]

4. Enhancement Suggestions:
   - In the user's original writing, show where linking words, transitions, or better structures could be inserted using:
     [+linking_phrase+]{Suggestion}
   - Do NOT rewrite the entire writing. Only suggest local improvements.

Return your answer in 4 sections:
**Score**
**Explanation**
**Marked Errors**
**Improved with Suggestions**`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: text }
  ];
};

export const callDeepSeekAPI = async (messages: DeepSeekMessage[], apiKey: string): Promise<string> => {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0]?.message?.content || 'No response received';
};

export const parseDeepSeekResponse = (response: string) => {
  const sections = response.split('**').filter(section => section.trim());
  
  let score = '';
  let explanation = '';
  let markedErrors = '';
  let improvedText = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].toLowerCase();
    const content = sections[i + 1] || '';
    
    if (section.includes('score')) {
      score = content.trim();
    } else if (section.includes('explanation')) {
      explanation = content.trim();
    } else if (section.includes('marked errors')) {
      markedErrors = content.trim();
    } else if (section.includes('improved') || section.includes('suggestions')) {
      improvedText = content.trim();
    }
  }

  return {
    score: score || 'Score not provided',
    explanation: explanation || 'Explanation not provided',
    markedErrors: markedErrors || 'No errors marked',
    improvedText: improvedText || 'No improvements suggested'
  };
};
