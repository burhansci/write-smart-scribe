
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

const questions = [
  { category: 'Technology', question: 'Technology is making communication easier in today\'s world, but at the expense of personal contact. Do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Education', question: 'Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake. What is your opinion?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Environment', question: 'Some people believe that the best way to protect the environment is for the government to impose strict regulations on businesses and individuals. Others argue that individuals should take more responsibility. Discuss both views and give your own opinion.', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Health', question: 'Preventive medicine is becoming more and more important in modern society. Some people think that governments should invest more in preventive measures rather than in treatments. To what extent do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Social Issues', question: 'In many countries, the gap between the rich and the poor is widening. What problems can this cause, and what are the solutions?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Media', question: 'The media plays a significant role in shaping public opinion. To what extent do you think the media influences society?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Young People', question: 'Many young people today are leaving their rural hometowns to work in big cities. What are the reasons for this trend? What are the advantages and disadvantages of this development?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Family', question: 'The traditional family structure has changed in recent years. What are the causes of these changes, and what impact have they had on society?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Culture', question: 'Some people believe that it is important for a country to preserve its traditional culture. Others argue that culture should be allowed to evolve and change with time. Discuss both views and give your opinion.', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Lifestyle', question: 'The fast pace of modern life is having a negative effect on people\'s health and well-being. What are the main problems associated with a fast-paced lifestyle, and what can be done to reduce them?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Education', question: 'Some people believe that students should be taught in mixed-ability classes, while others think that students should be streamed according to their academic ability. Discuss both views and give your opinion.', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Environment', question: 'Many people believe that individuals can do little to help the environment, and that it is the responsibility of governments and large corporations. To what extent do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Technology', question: 'The use of artificial intelligence is growing rapidly. What are the potential benefits and drawbacks of this development?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Health', question: 'Many people are choosing to eat vegetarian diets. Why are people choosing this type of diet? Do the advantages of vegetarianism outweigh the disadvantages?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Social Issues', question: 'Consumerism is becoming increasingly prevalent in many countries. What are the positive and negative effects of a consumerist society?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Advertisement', question: 'Advertising aimed at children should be banned. To what extent do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Children', question: 'Children today are under more pressure than ever before. What are the causes of this pressure, and what can be done to alleviate it?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Old People', question: 'In many societies, the elderly are not respected as they were in the past. What are the reasons for this? What problems might this cause?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Foreign Language', question: 'Learning a foreign language is essential for success in today\'s globalized world. To what extent do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Ethical Issues', question: 'Animal testing is a necessary evil in the development of new products and medicines. To what extent do you agree or disagree?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Building', question: 'Modern architecture is often criticized for being bland and characterless. What are your views on this?', time_limit: '40 minutes', word_count: '250+ words' },
  { category: 'Drugs', question: 'The use of performance-enhancing drugs in sports is a major problem. What can be done to combat this issue?', time_limit: '40 minutes', word_count: '250+ words' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { clear } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
    );

    if (clear) {
      const { error: deleteError } = await supabaseAdmin
        .from('sample_questions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

      if (deleteError) throw deleteError;
    }

    const formattedQuestions = questions.map(q => ({
      ...q,
      title: q.question.split('.')[0],
    }));

    const { error } = await supabaseAdmin
      .from('sample_questions')
      .upsert(formattedQuestions, { onConflict: 'question' });

    if (error) {
      throw error;
    }
    
    const message = clear 
      ? `Successfully reset and seeded ${questions.length} questions.`
      : `Successfully seeded ${questions.length} questions.`;

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
