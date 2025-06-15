
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface DeepSeekMessage {
  role: 'system' | 'user';
  content: string;
}

const HUGGINGFACE_API_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json() as { messages: DeepSeekMessage[] };

    if (!HUGGINGFACE_API_TOKEN) {
      return new Response(JSON.stringify({ error: "Hugging Face API token is not configured on the server." }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!messages) {
      return new Response(JSON.stringify({ error: '`messages` are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
    const userPrompt = messages.find(m => m.role === 'user')?.content || '';

    const fullPrompt = `<s>[INST] ${systemPrompt} \n\nHere is the text to analyze: \n\n${userPrompt} [/INST]`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1500,
          return_full_text: false,
          temperature: 0.3,
        }
      }),
    });

    // Proxy status and body directly to the client. The client has the retry logic.
    const responseBody = await response.text();
    const headers = { ...corsHeaders, 'Content-Type': 'application/json' };
    
    return new Response(responseBody, {
      status: response.status,
      headers,
    });

  } catch (error) {
    console.error("Hugging Face edge function error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
