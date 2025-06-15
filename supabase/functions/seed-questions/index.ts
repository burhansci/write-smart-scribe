
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const questions = [
  {
    title: "Competition vs Cooperation in Schools",
    question: "Some people believe that children should be taught to compete in school. Others believe that teamwork and cooperation are more important. Discuss both views and give your own opinion.",
    category: "Education",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Environmental Problems and Solutions",
    question: "Environmental problems such as pollution and climate change are becoming increasingly serious. What are the main causes of these problems? What solutions can you suggest?",
    category: "Environment",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Impact of Technology on Communication",
    question: "Technology has revolutionized the way we communicate. Do the advantages of this development outweigh the disadvantages?",
    category: "Technology",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Influence of Media on Society",
    question: "The media plays a significant role in shaping public opinion and society. To what extent do you agree or disagree with this statement?",
    category: "Media",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Advertising and Consumerism",
    question: "Some people argue that advertising encourages consumers to buy things they do not need. Others say that advertising is a source of information. Discuss both views and give your opinion.",
    category: "Advertisement",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Modern Lifestyles and Health",
    question: "Many people today have unhealthy lifestyles. What are the causes of this? What measures can be taken to encourage people to live healthier lives?",
    category: "Health",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Importance of Foreign Language",
    question: "Some believe that it is essential for everyone to learn a foreign language. To what extent do you agree or disagree?",
    category: "Foreign Language",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Family Structures",
    question: "The structure of the family has changed over the last few decades. What are the main changes and what are the effects of these changes on society?",
    category: "Family",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Responsibilities of Young People",
    question: "Some people think that young people should be free to choose their own career, while others believe that they should follow their parents' advice. Discuss both views.",
    category: "Young People",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Caring for Old People",
    question: "In many countries, the proportion of old people is increasing. Does this trend have more positive or negative effects on society?",
    category: "Old People",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Social Media and Relationships",
    question: "Social media has changed the way people form and maintain relationships. Is this a positive or negative development?",
    category: "Social Issues",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Cultural Heritage Preservation",
    question: "Some people think that it is more important to spend public money on promoting new projects than on preserving cultural heritage. To what extent do you agree or disagree?",
    category: "Culture",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Ethical Issues in Science",
    question: "Scientific research should be controlled by governments rather than private companies. To what extent do you agree or disagree?",
    category: "Ethical Issues",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Urban vs. Rural Living",
    question: "Some people prefer to live in a city, while others prefer to live in the countryside. What are the advantages and disadvantages of both?",
    category: "Lifestyle",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
  {
    title: "Modern Architecture",
    question: "Many modern buildings are criticized for being ugly and not fitting in with their surroundings. What is your opinion on this?",
    category: "Building",
    time_limit: "40 minutes",
    word_count: "250+ words",
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Use service role key to bypass RLS for admin actions
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { clear } = await req.json().catch(() => ({ clear: false }));

    if (clear) {
      const { error: deleteError } = await supabaseClient
        .from('sample_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
      
      if (deleteError) {
        console.error('Error deleting questions:', deleteError);
        throw deleteError;
      }
    }

    const { data, error } = await supabaseClient
      .from('sample_questions')
      .upsert(questions, { onConflict: 'question' });

    if (error) {
      console.error('Error upserting questions:', error);
      throw error;
    }

    const count = data ? data.length : questions.length;
    const message = clear 
      ? `Database reset. ${count} questions seeded successfully.`
      : `${count} questions seeded successfully.`;

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in seed-questions function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
