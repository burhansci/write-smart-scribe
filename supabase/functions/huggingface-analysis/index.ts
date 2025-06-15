
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface DeepSeekMessage {
  role: 'system' | 'user';
  content: string;
}

const HUGGINGFACE_API_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
// Using a more accessible model that should work with most HF tokens
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

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

    // Create a comprehensive prompt for writing analysis
    const analysisPrompt = `${systemPrompt}\n\nText to analyze: ${userPrompt}\n\nPlease provide a detailed IELTS writing analysis with scoring.`;

    console.log('Making request to Hugging Face with prompt length:', analysisPrompt.length);

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_API_TOKEN}`,
      },
      body: JSON.stringify({
        inputs: analysisPrompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.3,
          return_full_text: false,
        },
        options: {
          wait_for_model: true,
        }
      }),
    });

    console.log('HF Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error:', errorText);
      
      // Handle specific error cases
      if (response.status === 403) {
        return new Response(JSON.stringify({ 
          error: 'Access denied to the AI model. This could be due to token permissions or model restrictions. The analysis will try to continue with a basic response.',
          fallback: true 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `Hugging Face API error (${response.status}): ${errorText}`,
        estimated_time: 20 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseBody = await response.text();
    console.log('HF Response received, length:', responseBody.length);
    
    return new Response(responseBody, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Hugging Face edge function error:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
