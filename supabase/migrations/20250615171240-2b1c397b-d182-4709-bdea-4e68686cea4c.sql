
-- This script inserts an additional list of sample IELTS questions into your database.
-- It uses "ON CONFLICT" to avoid creating duplicate questions if they already exist.
INSERT INTO public.sample_questions (category, question, time_limit, word_count, title)
VALUES
('Work', 'Many people now work from home, and some argue that this is better for workers and employers. To what extent do you agree or disagree with this statement?', '40 minutes', '250+ words', 'Advantages and Disadvantages of Working from Home'),
('Globalization', 'Globalization is a positive development for the world. Discuss the advantages and disadvantages of globalization.', '40 minutes', '250+ words', 'The Impact of Globalization'),
('Crime', 'Some people believe that long-term prison sentences are the best way to reduce crime. Others think there are better alternative ways. Discuss both views and give your opinion.', '40 minutes', '250+ words', 'Prison Sentences vs. Alternative Punishments'),
('Art', 'Governments should spend more money on supporting the arts than on other areas like public services. Do you agree or disagree?', '40 minutes', '250+ words', 'Government Funding for the Arts'),
('Government', 'It is the government''s responsibility to provide free healthcare and education for all its citizens. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Government''s Role in Healthcare and Education'),
('Space', 'Space exploration is a waste of money and resources that could be better used to solve problems on Earth. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'The Value of Space Exploration'),
('Tourism', 'International tourism has a negative impact on the environment and local cultures. What are the problems and what can be done to mitigate them?', '40 minutes', '250+ words', 'The Negative Effects of International Tourism'),
('Transport', 'Governments should invest more in public transport rather than building more roads. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Investment in Public Transport vs. Roads'),
('Gender', 'Despite progress, gender inequality remains a significant issue worldwide. What are the main causes of this, and what measures can be taken to achieve true gender equality?', '40 minutes', '250+ words', 'Causes and Solutions for Gender Inequality'),
('Food', 'In many countries, people are eating more fast food and processed food than ever before. What are the reasons for this trend, and what are its effects on individuals and society?', '40 minutes', '250+ words', 'The Rise of Fast Food Consumption'),
('History', 'Studying history is a waste of time and has no relevance in the modern world. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'The Relevance of Studying History'),
('City Life', 'The high cost of living in big cities is a major problem. What are the causes of this issue, and what solutions can you suggest?', '40 minutes', '250+ words', 'The High Cost of Living in Cities'),
('Happiness', 'Happiness is considered very important in life. Why is it difficult to define? What factors are important in achieving happiness?', '40 minutes', '250+ words', 'Defining and Achieving Happiness'),
('Sports', 'Professional sportspeople earn far too much money. Do you agree or disagree?', '40 minutes', '250+ words', 'Salaries of Professional Athletes'),
('Water', 'Access to clean water is a basic human right, yet many people in the world lack it. What are the causes of this problem and what can be done to solve it?', '40 minutes', '250+ words', 'Global Access to Clean Water'),
('News', 'People are increasingly getting their news from social media rather than traditional news sources. What are the advantages and disadvantages of this trend?', '40 minutes', '250+ words', 'News Consumption from Social Media'),
('Music', 'Music is an important part of every culture. In what ways does music bring people together? How has technology changed the way we experience music?', '40 minutes', '250+ words', 'The Role of Music in Society'),
('Robots', 'Robots are increasingly being used in the workplace. What are the advantages and disadvantages of this trend for workers and for society as a whole?', '40 minutes', '250+ words', 'Robots in the Workplace'),
('Shopping', 'Online shopping has become extremely popular. Does this trend have more advantages or disadvantages?', '40 minutes', '250+ words', 'The Rise of Online Shopping'),
('Climate Change', 'Climate change is the biggest threat facing humanity today. What actions should governments and individuals take to address this problem?', '40 minutes', '250+ words', 'Addressing the Threat of Climate Change')
ON CONFLICT (question) DO NOTHING;
