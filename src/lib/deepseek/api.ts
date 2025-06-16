
import { DeepSeekMessage, DeepSeekResponse } from './types';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export const callDeepSeekAPI = async (messages: DeepSeekMessage[], apiKey: string): Promise<string> => {
  console.log('Making DeepSeek API call with key:', apiKey.substring(0, 20) + '...');
  
  const requestBody = {
    model: 'deepseek-chat',
    messages,
    temperature: 0.3,
    max_tokens: 3800,
  };

  console.log('Request body:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('API Error Response:', errorText);
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data: DeepSeekResponse = await response.json();
  console.log('API Response:', data);
  return data.choices[0]?.message?.content || 'No response received';
};
