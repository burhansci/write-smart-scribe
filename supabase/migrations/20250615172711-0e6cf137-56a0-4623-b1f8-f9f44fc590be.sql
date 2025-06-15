
-- This script inserts a fourth list of sample IELTS questions into your database.
-- It uses "ON CONFLICT" to avoid creating duplicate questions if they already exist.
INSERT INTO public.sample_questions (category, question, time_limit, word_count, title)
VALUES
-- Work & Career
('Work', 'The trend of ''job hopping'' is becoming more common, especially among younger generations. Is this a positive or negative career strategy?', '40 minutes', '250+ words', 'The Strategy of Job Hopping'),
('Work', 'Is a four-day work week a viable option for most businesses and employees? Discuss the advantages and disadvantages.', '40 minutes', '250+ words', 'The Four-Day Work Week'),
-- Technology & Internet
('Technology', 'How has the rise of social media influencers changed the nature of advertising and consumerism?', '40 minutes', '250+ words', 'The Impact of Social Media Influencers'),
('Technology', 'Are we becoming too dependent on technology in our daily lives? Discuss the potential dangers of this over-reliance.', '40 minutes', '250+ words', 'Over-Reliance on Technology'),
-- Education
('Education', 'Should subjects like art, music, and drama be considered as important as science and mathematics in school curricula?', '40 minutes', '250+ words', 'The Importance of Arts in Education'),
('Education', 'What are the benefits of lifelong learning and continuous education in a person''s career and personal life?', '40 minutes', '250+ words', 'The Value of Lifelong Learning'),
-- Environment & Development
('Environment', 'Some argue that economic development is too often prioritized over environmental protection. What is your opinion on this issue?', '40 minutes', '250+ words', 'Economic Development vs. Environment'),
('Environment', 'What can individuals do to live a more environmentally friendly lifestyle? Discuss some practical steps.', '40 minutes', '250+ words', 'Living an Eco-Friendly Life'),
-- Health & Lifestyle
('Health', 'To what extent is an individual''s lifestyle responsible for their health, compared to genetic factors or access to healthcare?', '40 minutes', '250+ words', 'Lifestyle and Health Responsibility'),
('Health', 'Should smoking be completely banned in all public places, including outdoor areas? Discuss the arguments for and against.', '40 minutes', '250+ words', 'Banning Smoking in Public Places'),
-- Globalization & Culture
('Globalization', 'Does globalization inevitably lead to a loss of cultural diversity around the world?', '40 minutes', '250+ words', 'Globalization and Cultural Diversity'),
('Culture', 'Is it important to protect minority languages from extinction? Why or why not?', '40 minutes', '250+ words', 'Protecting Minority Languages'),
('Culture', 'Should museums and art galleries be free for all citizens and tourists?', '40 minutes', '250+ words', 'Free Access to Museums'),
-- Crime & Punishment
('Crime', 'Many believe that community service is a better punishment for minor offenses than short prison sentences. To what extent do you agree?', '40 minutes', '250+ words', 'Community Service vs. Prison'),
('Crime', 'Is capital punishment (the death penalty) a just and effective deterrent to serious crime?', '40 minutes', '250+ words', 'The Ethics of Capital Punishment'),
-- Art & Censorship
('Art', 'Should art that is considered offensive by some people be banned or censored by authorities?', '40 minutes', '250+ words', 'Censorship in Art'),
-- Government & Society
('Government', 'To what extent should governments have the power to regulate the internet and social media platforms?', '40 minutes', '250+ words', 'Government Regulation of the Internet'),
('Government', 'Should voting in national elections be compulsory for all adult citizens?', '40 minutes', '250+ words', 'Compulsory Voting'),
-- Space Exploration
('Space', 'Is the money spent on space exploration programs a good use of public funds, or should it be redirected to solve problems on Earth?', '40 minutes', '250+ words', 'The Value of Space Exploration Funding'),
-- Tourism
('Tourism', 'What are the pros and cons of tourism for a developing country?', '40 minutes', '250+ words', 'Tourism in Developing Countries'),
('Tourism', 'How can tourism be managed in a way that respects the local culture and protects the natural environment?', '40 minutes', '250+ words', 'Sustainable Tourism Management'),
-- Transport
('Transport', 'As cities become more crowded, what is the best way to manage urban traffic and reduce congestion?', '40 minutes', '250+ words', 'Managing Urban Traffic Congestion'),
-- Gender
('Gender', 'Should companies be required by law to have a certain percentage of female executives on their boards?', '40 minutes', '250+ words', 'Gender Quotas in Business'),
-- Food & Ethics
('Food', 'Genetically modified (GM) foods have the potential to solve world hunger, but many people are opposed to them. Discuss both sides of the argument.', '40 minutes', '250+ words', 'The Debate on GM Foods'),
('Food', 'Is it ethical to eat meat? Discuss the arguments for and against vegetarianism.', '40 minutes', '250+ words', 'The Ethics of Eating Meat'),
-- History
('History', 'Why is it important for a country to preserve its historic buildings and monuments?', '40 minutes', '250+ words', 'Preserving Historic Buildings'),
('History', 'Can we truly learn lessons from history, or are we doomed as a society to repeat its mistakes?', '40 minutes', '250+ words', 'Learning from History'),
-- City Life
('City Life', 'What can be done to reduce noise pollution in large cities?', '40 minutes', '250+ words', 'Reducing Noise Pollution in Cities'),
('City Life', 'What are the main challenges and benefits of raising a family in a large, modern city?', '40 minutes', '250+ words', 'Raising a Family in a City'),
-- Happiness
('Happiness', 'Does a country''s economic success necessarily translate to the happiness and well-being of its citizens?', '40 minutes', '250+ words', 'Economic Success and Citizen Happiness'),
('Happiness', 'What is more important for a person''s happiness: a high salary or high job satisfaction?', '40 minutes', '250+ words', 'Salary vs. Job Satisfaction'),
-- Sports
('Sports', 'Should professional athletes be expected to serve as role models for young people?', '40 minutes', '250+ words', 'Athletes as Role Models'),
('Sports', 'Are competitive sports generally good for the psychological development of children?', '40 minutes', '250+ words', 'Competitive Sports for Children'),
-- Global Issues
('Water', 'The world is facing a growing water crisis. What are the main causes and what can be done to ensure water security for all?', '40 minutes', '250+ words', 'The Global Water Crisis'),
('Climate Change', 'Who should bear the primary financial burden of tackling climate change: developed nations or developing nations?', '40 minutes', '250+ words', 'Financial Responsibility for Climate Change'),
('Climate Change', 'What is the role of international cooperation in addressing climate change effectively?', '40 minutes', '250+ words', 'International Cooperation on Climate'),
-- Media & News
('News', 'Has the rise of citizen journalism (news reported by ordinary people, often via social media) been a positive or negative development?', '40 minutes', '250+ words', 'The Rise of Citizen Journalism'),
('News', 'How can ordinary people distinguish between real news and "fake news" in the modern media landscape?', '40 minutes', '250+ words', 'Distinguishing Real vs. Fake News'),
('Media', 'Does the modern media have too much power and influence in shaping public opinion and political outcomes?', '40 minutes', '250+ words', 'The Power of Modern Media'),
-- Music
('Music', 'How does music affect individuals and society as a whole?', '40 minutes', '250+ words', 'The Societal Impact of Music'),
('Music', 'Should all children be required to learn a musical instrument in school?', '40 minutes', '250+ words', 'Mandatory Music Education'),
-- Robots & AI
('Robots', 'What are the ethical implications of creating highly intelligent robots that may rival human intelligence?', '40 minutes', '250+ words', 'Ethical Implications of Advanced AI'),
('Robots', 'Will robots, automation, and AI lead to mass unemployment in the future? Discuss the potential societal impact.', '40 minutes', '250+ words', 'Automation and Mass Unemployment'),
-- Shopping & Consumerism
('Shopping', 'What is the impact of consumer culture on the environment?', '40 minutes', '250+ words', 'Consumer Culture and the Environment'),
('Shopping', 'How has the convenience of online shopping changed the way people live and interact with their communities?', '40 minutes', '250+ words', 'The Social Impact of Online Shopping'),
-- Society & Family
('Social Issues', 'What can be done at a government and individual level to reduce homelessness in society?', '40 minutes', '250+ words', 'Solving the Problem of Homelessness'),
('Family', 'Should elderly parents be cared for by their adult children at home, or is it better for them to live in professional nursing homes?', '40 minutes', '250+ words', 'Caring for Elderly Parents'),
('Family', 'Has the definition and structure of "family" changed in your country in recent generations? What are the effects of these changes?', '40 minutes', '250+ words', 'The Changing Definition of Family'),
('Young People', 'What are the greatest pressures on young people today that were not faced by previous generations?', '40 minutes', '250+ words', 'Modern Pressures on Youth'),
('Social Issues', 'Is it the responsibility of the government to provide free or subsidized housing for all of its citizens?', '40 minutes', '250+ words', 'Government Responsibility for Housing')
ON CONFLICT (question) DO NOTHING;
