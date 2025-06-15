
-- This script inserts a third, larger list of sample IELTS questions into your database.
-- It uses "ON CONFLICT" to avoid creating duplicate questions if they already exist.
INSERT INTO public.sample_questions (category, question, time_limit, word_count, title)
VALUES
-- Technology
('Technology', 'Some people believe that technology has made our lives too complex, and we should aim for a simpler lifestyle. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Technology and Life Complexity'),
('Technology', 'The internet has transformed the way we learn. What are the advantages and disadvantages of online learning?', '40 minutes', '250+ words', 'Online Learning Pros and Cons'),
-- Education
('Education', 'It is more important for schoolchildren to learn about local history than world history. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Local vs. World History in Schools'),
('Education', 'Standardized tests are not a good measure of a student''s ability. Do you agree or disagree?', '40 minutes', '250+ words', 'Effectiveness of Standardized Tests'),
('Education', 'Some people think that it is better for children to go to a single-sex school. Others prefer co-educational schools. Discuss both views and give your opinion.', '40 minutes', '250+ words', 'Single-Sex vs. Co-Educational Schools'),
-- Environment
('Environment', 'Nuclear power is a clean and safe source of energy and should be promoted. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Nuclear Power as an Energy Source'),
('Environment', 'Water pollution is a growing problem that needs urgent attention. What are the main causes of water pollution and what measures can be taken?', '40 minutes', '250+ words', 'Causes and Solutions for Water Pollution'),
-- Health
('Health', 'The responsibility for health should be shared between individuals and the government. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Responsibility for Public Health'),
('Health', 'Alternative medicine, such as acupuncture and homeopathy, is becoming more popular. Should it be integrated into mainstream healthcare systems?', '40 minutes', '250+ words', 'Alternative Medicine in Healthcare'),
-- Social Issues
('Social Issues', 'The rise of the "gig economy" (e.g., Uber, food delivery) provides flexibility but lacks job security. Discuss the advantages and disadvantages for workers.', '40 minutes', '250+ words', 'The Gig Economy''s Impact on Workers'),
('Social Issues', 'CCTV cameras are increasingly used in public places. Do the benefits of increased security outweigh the loss of privacy?', '40 minutes', '250+ words', 'CCTV and Privacy vs. Security'),
-- Media
('Media', 'The news media should not be allowed to publish details of people''s private lives, unless it is in the public interest. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Media Intrusion into Private Lives'),
('Media', 'Do you think that celebrities have a right to privacy, or is being in the public eye part of their job?', '40 minutes', '250+ words', 'Celebrity Privacy Rights'),
-- Young People
('Young People', 'Young people are often more influenced by their friends than by their parents or teachers. Is this a positive or negative development?', '40 minutes', '250+ words', 'Peer Influence on Young People'),
('Young People', 'What are the main challenges facing young people in your country today? Suggest some solutions.', '40 minutes', '250+ words', 'Challenges for Today''s Youth'),
-- Family
('Family', 'The roles of mothers and fathers in the family have changed significantly in recent decades. What are the reasons for this, and is it a positive or negative development?', '40 minutes', '250+ words', 'Changing Parental Roles'),
-- Culture
('Culture', 'Museums and art galleries are not as important as they used to be. Do you agree or disagree?', '40 minutes', '250+ words', 'The Importance of Museums Today'),
('Culture', 'Maintaining cultural traditions is more important than adopting modern ways of life. Discuss both views and give your own opinion.', '40 minutes', '250+ words', 'Tradition vs. Modernity'),
-- Lifestyle
('Lifestyle', 'Many people pursue a minimalist lifestyle, owning fewer possessions. What are the benefits and drawbacks of this approach to life?', '40 minutes', '250+ words', 'The Minimalist Lifestyle'),
-- Advertisement
('Advertisement', 'Advertising is often criticized for creating artificial needs and making people dissatisfied with what they have. To what extent do you agree?', '40 minutes', '250+ words', 'The Negative Effects of Advertising'),
-- Children
('Children', 'Should parents be responsible for teaching their children about right and wrong, or is this the role of schools?', '40 minutes', '250+ words', 'Who Should Teach Morality to Children?'),
-- Old People
('Old People', 'As life expectancy increases, societies will have more old people than young people. What will be the positive and negative effects on society?', '40 minutes', '250+ words', 'An Aging Population'),
-- Foreign Language
('Foreign Language', 'Is it better to learn a foreign language as a child or as an adult? Discuss the advantages of each.', '40 minutes', '250+ words', 'Learning a Language: Child vs. Adult'),
-- Ethical Issues
('Ethical Issues', 'Zoos are cruel to wild animals and should be closed down. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'The Ethics of Zoos'),
-- Building
('Building', 'Governments should ensure that all new buildings are environmentally friendly. Do you agree or disagree?', '40 minutes', '250+ words', 'Green Architecture Mandates'),
-- Drugs
('Drugs', 'Some people argue that the use of soft drugs like marijuana should be legalized. What are the arguments for and against this?', '40 minutes', '250+ words', 'Legalization of Soft Drugs'),
-- Work
('Work', 'Job satisfaction is more important than job security. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Job Satisfaction vs. Job Security'),
('Work', 'Some people believe that it is best to stay in one job for life, while others think it is better to change jobs several times. Discuss both views and give your own opinion.', '40 minutes', '250+ words', 'Job Hopping vs. Lifelong Employment'),
-- Globalization
('Globalization', 'Globalization threatens the identity of individual nations. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Globalization and National Identity'),
-- Crime
('Crime', 'Should juvenile offenders be treated in the same way as adult criminals? Discuss.', '40 minutes', '250+ words', 'Juvenile vs. Adult Justice'),
-- Art
('Art', 'Is art a luxury or a necessity? Discuss.', '40 minutes', '250+ words', 'Art: Luxury or Necessity?'),
-- Government
('Government', 'Is it better to have a government with strong central control, or one where power is given to local regions? Discuss.', '40 minutes', '250+ words', 'Centralized vs. Decentralized Government'),
-- Space
('Space', 'Should private companies be allowed to lead space exploration and missions, or should this remain under government control? Discuss the pros and cons.', '40 minutes', '250+ words', 'Private vs. Public Space Exploration'),
-- Tourism
('Tourism', 'Eco-tourism is often seen as a solution to the negative impacts of tourism. What is eco-tourism, and is it always a positive development?', '40 minutes', '250+ words', 'The Reality of Eco-Tourism'),
-- Transport
('Transport', 'The most effective way to solve traffic congestion in cities is to provide free public transport 24 hours a day. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Free Public Transport to Solve Congestion'),
-- Gender
('Gender', 'Men and women are naturally different, so they are suited to different roles in society. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Gender Roles in Society'),
-- Food
('Food', 'The global demand for food is rising. What are the main causes of this, and what can be done to meet this demand?', '40 minutes', '250+ words', 'Rising Global Food Demand'),
-- History
('History', 'Historical films and books are more for entertainment than for learning. Do you agree or disagree?', '40 minutes', '250+ words', 'Historical Fiction as Education'),
-- City Life
('City Life', 'Living in a big city is more stressful than living in the countryside. To what extent do you agree?', '40 minutes', '250+ words', 'City Life vs. Countryside Stress'),
-- Happiness
('Happiness', 'Can money buy happiness? Discuss the relationship between wealth and happiness.', '40 minutes', '250+ words', 'Money and Happiness'),
-- Sports
('Sports', 'Extreme sports like rock climbing and skydiving have become very popular. Why do people take part in such dangerous activities? Should they be banned?', '40 minutes', '250+ words', 'The Appeal and Dangers of Extreme Sports'),
-- Water
('Water', 'Some people believe that water should be free for all, while others believe it should be treated as a commercial product. Discuss both views.', '40 minutes', '250+ words', 'Water: A Right or a Commodity?'),
-- News
('News', 'Does 24-hour news coverage do more harm than good? Discuss.', '40 minutes', '250+ words', 'The Impact of 24-Hour News'),
-- Music
('Music', 'Some people believe that traditional music is more valuable than modern music. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Traditional vs. Modern Music'),
-- Robots
('Robots', 'As robots and AI become more capable, what jobs will be left for humans to do? Is this a positive or negative outlook for the future?', '40 minutes', '250+ words', 'The Future of Human Work with AI'),
-- Shopping
('Shopping', 'Consumerism and the pressure to buy new things is a major cause of unhappiness. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Consumerism and Unhappiness'),
-- Climate Change
('Climate Change', 'Individuals can do nothing to stop climate change; only governments and large corporations can make a difference. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'Individual vs. Corporate Action on Climate'),
-- 'Others' category for broader topics
('Others', 'What is the most important invention of the last 100 years? Why?', '40 minutes', '250+ words', 'Most Important Invention'),
('Others', 'Is it more important to be a good person or a successful person? Discuss.', '40 minutes', '250+ words', 'Goodness vs. Success'),
('Technology', 'Social media has a negative impact on mental health. To what extent do you agree?', '40 minutes', '250+ words', 'Social Media and Mental Health'),
('Education', 'Homework is an unnecessary burden on children and should be abolished. Do you agree or disagree?', '40 minutes', '250+ words', 'The Case Against Homework'),
('Environment', 'Recycling is the most important action individuals can take to protect the environment. To what extent do you agree?', '40 minutes', '250+ words', 'The Importance of Recycling'),
('Health', 'Should governments tax sugary drinks and other unhealthy foods to improve public health?', '40 minutes', '250+ words', 'Taxes on Unhealthy Foods'),
('Work', 'The retirement age should be raised as people are living longer. Discuss the advantages and disadvantages.', '40 minutes', '250+ words', 'Raising the Retirement Age'),
('Social Issues', 'Immigration has a largely positive impact on the host country. To what extent do you agree or disagree?', '40 minutes', '250+ words', 'The Impact of Immigration'),
('Tourism', 'Tourism does more harm than good. Discuss.', '40 minutes', '250+ words', 'The Harms and Benefits of Tourism'),
('City Life', 'What are the main advantages and disadvantages of living in a multicultural city?', '40 minutes', '250+ words', 'Living in a Multicultural City'),
('Family', 'Should parents be allowed to choose their child''s gender? Discuss the ethical implications.', '40 minutes', '250+ words', 'Gender Selection Ethics')
ON CONFLICT (question) DO NOTHING;
