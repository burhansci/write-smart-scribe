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
  
  // Split by double asterisks to find sections
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
      // Look for the actual score in the content
      const scoreMatch = sectionContent.match(/(?:estimated\s+)?(?:ielts\s+band\s+score|gre\s+awa\s+score):\s*([0-9.]+)/i);
      if (scoreMatch) {
        score = scoreMatch[1];
      } else {
        // Fallback: extract first line that contains a number
        const lines = sectionContent.split('\n').filter(line => line.trim());
        for (const line of lines) {
          const numberMatch = line.match(/([0-9.]+)/);
          if (numberMatch) {
            score = numberMatch[1];
            break;
          }
        }
      }
      if (!score) {
        score = sectionContent.trim();
      }
    } else if (sectionHeader.includes('explanation')) {
      explanation = sectionContent.trim();
    } else if (sectionHeader.includes('marked') && sectionHeader.includes('error')) {
      markedErrors = sectionContent.trim();
    } else if (sectionHeader.includes('improved') || sectionHeader.includes('suggestions')) {
      improvedText = sectionContent.trim();
    }
  }

  console.log('Parsed results:', { score, explanation: explanation.substring(0, 100), markedErrors: markedErrors.substring(0, 100), improvedText: improvedText.substring(0, 100) });

  return {
    score: score || 'Score not provided',
    explanation: explanation || 'Explanation not provided',
    markedErrors: markedErrors || 'No errors marked',
    improvedText: improvedText || 'No improvements suggested'
  };
};
