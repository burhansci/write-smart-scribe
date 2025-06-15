
import 'https://deno.land/x/xhr@0.1.0/mod.ts';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

interface DeepSeekMessage {
  role: 'system' | 'user';
  content: string;
}

const HUGGINGFACE_API_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');
// Using a more accessible and reliable text generation model
const HUGGINGFACE_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

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
          max_length: 1000,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
          return_full_text: false,
        },
        options: {
          wait_for_model: true,
          use_cache: false,
        }
      }),
    });

    console.log('HF Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HF API Error:', errorText);
      
      // Handle specific error cases
      if (response.status === 403 || response.status === 404) {
        console.warn('Model access denied or not found, using fallback analysis');
        return new Response(JSON.stringify({ 
          error: 'AI model temporarily unavailable. Providing basic analysis.',
          fallback: true 
        }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: `Hugging Face API error (${response.status}): ${errorText}`,
        estimated_time: 20,
        fallback: true 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const responseData = await response.json();
    console.log('HF Response received:', responseData);
    
    // Handle different response formats
    let generatedText = '';
    if (Array.isArray(responseData) && responseData.length > 0) {
      generatedText = responseData[0].generated_text || '';
    } else if (responseData.generated_text) {
      generatedText = responseData.generated_text;
    } else {
      console.warn('Unexpected response format, using fallback');
      return new Response(JSON.stringify([{ 
        generated_text: '',
        fallback: true 
      }]), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify([{ generated_text: generatedText }]), {
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
