
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, ExternalLink, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface SamplePromptsProps {
  onSelectPrompt: () => void;
}

const samplePrompts = [
  // Education
  {
    id: '1',
    category: 'Education',
    title: 'Technology and Teachers',
    prompt: 'As computers are being used more and more in education, there will be soon no role for teachers in the classroom. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '2',
    category: 'Education',
    title: 'Gap Year Benefits',
    prompt: 'In some countries young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '3',
    category: 'Education',
    title: 'University Access',
    prompt: 'Some people believe that a college or university education should be available to all students. Others believe that higher education should be available only to good students. Discuss these views. Which view do you agree with? Explain why.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '4',
    category: 'Education',
    title: 'Learning from Experience vs Advice',
    prompt: 'Some people believe that the best way of learning about life is by listening to the advice of family and friends. Other people believe that the best way of learning about life is through personal experience. Compare the advantages of these two different ways of learning about life. Which do you think is preferable? Use specific examples to support your preference.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '5',
    category: 'Education',
    title: 'Non-Academic Subjects',
    prompt: 'With the pressures on today\'s young people to succeed academically, some people believe that non-academic subjects at school (eg: physical education and cookery) should be removed from the syllabus so that children can concentrate wholly on academic subjects. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '6',
    category: 'Education',
    title: 'Sports vs Academic Subjects',
    prompt: 'In many countries, sports and exercise classes are replaced with the academic subjects. Discuss the effects of this trend.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '7',
    category: 'Education',
    title: 'Travel Before University',
    prompt: 'Some people think high school graduates should travel or work for a period of time instead of going directly to study at university. Discuss the advantages and disadvantages of both approaches. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '8',
    category: 'Education',
    title: 'Experience vs Direct University Study',
    prompt: 'The student who study from the school to university get benefit less and contribute less too, than those of student who go to travel or job and get skills and experience before going high. Do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '9',
    category: 'Education',
    title: 'Disruptive Students',
    prompt: 'Disruptive school students have a negative influence on others. Students who are noisy and disobedient should be grouped together and taught separately. Do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '10',
    category: 'Education',
    title: 'Theoretical vs Practical Knowledge',
    prompt: 'Some people think that universities should not provide so much theoretical knowledge but give more practical training throughout their courses. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '11',
    category: 'Education',
    title: 'Reasons for University Attendance',
    prompt: 'People attend college or university for many different reasons (for example, new experiences, career preparation, increased knowledge). Why do you think people attend college or university?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '12',
    category: 'Education',
    title: 'Overseas Education',
    prompt: 'Nowadays, education overseas has become more accessible and growing numbers of people send their offspring to study in other countries. However, this trend has its detractors.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '13',
    category: 'Education',
    title: 'Books vs Experience',
    prompt: 'It has been said, "Not everything that is learned is contained in books." Compare and contrast knowledge gained from experience with knowledge gained from books. In your opinion, which source is more important? Why?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '14',
    category: 'Education',
    title: 'Reading Only Real Events Books',
    prompt: 'Do you agree or disagree with the following statement? People should read only those books that are about real events, real people, and established facts. Use specific reasons and details to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '15',
    category: 'Education',
    title: 'Studying Abroad Challenges',
    prompt: 'Going overseas for university study is an exciting prospect for many people. But while it may offer some advantages, it is probably better to stay home because of the difficulties a student inevitably encounters living and studying in a different culture. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '16',
    category: 'Education',
    title: 'Students Not Finishing School',
    prompt: 'Many students do not finish school. Why is this, and how can the problem be solved?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '17',
    category: 'Education',
    title: 'University Education and Success',
    prompt: 'Does a university education lead to success in life?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '18',
    category: 'Education',
    title: 'Academic vs Practical Skills',
    prompt: 'It is often said that the subjects taught in schools are too academic in orientation and that it would be more useful for children to learn about practical matters such as home management, work and interpersonal skills. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Environment
  {
    id: '19',
    category: 'Environment',
    title: 'Global Environmental Problems',
    prompt: 'Nowadays environmental problems are too big to be managed by individual persons or individual countries. In other words, it is an international problem. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '20',
    category: 'Environment',
    title: 'Waste Production',
    prompt: 'Nowadays we are producing more and more rubbish. Why do you think this is happening? What can governments do to help reduce the amount of rubbish produced?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '21',
    category: 'Environment',
    title: 'Climate Change Responsibility',
    prompt: 'Scientists and the news media are presenting ever more evidence of climate change. Governments cannot be expected to solve this problem. It is the responsibility of individuals to change their lifestyle to prevent further damage. What are your views?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '22',
    category: 'Environment',
    title: 'Natural Resources',
    prompt: 'Many parts of the world are losing important natural resources, such as forests, animals, or clean water. Choose one resource that is disappearing and explain why it needs to be saved. Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '23',
    category: 'Environment',
    title: 'Waste Material Problem',
    prompt: 'The earth is being filled with waste material such as plastic bags and other rubbish. Is this really happening? What are some solutions to this problem?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '24',
    category: 'Environment',
    title: 'Public Transport vs Private Cars',
    prompt: 'The rising levels of congestion and air pollution found in most of the world\'s cities can be attributed directly to the rapidly increasing number of private cars in use. In order to reverse this decline in the quality of life in cities, attempts must be made to encourage people to use their cars less and public transport more. Discuss possible ways to encourage the use of public transport.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Technology
  {
    id: '25',
    category: 'Technology',
    title: 'Space Exploration',
    prompt: 'With all the troubles in the world today, money spent on space exploration is a complete waste. The money could be better spent on other things. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '26',
    category: 'Technology',
    title: 'Internet Communication',
    prompt: 'Some say that the internet is making the world smaller by bringing people together. To what extent do you agree that the internet is making it easier for people to communicate with one another?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '27',
    category: 'Technology',
    title: 'Internet Information Drawbacks',
    prompt: 'Internet when used as a source of information, has more drawbacks than advantages. To what extent do you agree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '28',
    category: 'Technology',
    title: 'Nuclear Technology',
    prompt: 'We have been living in the nuclear age now for over half a century. Since the first atomic bombs were developed, nuclear technology has provided governments with the ability to totally destroy the planet. Yet the technology has been put to positive use as an energy source and in certain areas of medicine. To what extent is nuclear technology a danger to life on Earth? What are the benefits and risks associated with its use?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '29',
    category: 'Technology',
    title: 'Telecommuting',
    prompt: '\'Telecommuting\' refers to workers doing their jobs from home for part of each week and communicating with their office using computer technology. Telecommuting is growing in many countries and is expected to be common for most office workers in the coming decades. How do you think society will be affected by the growth of telecommuting?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '30',
    category: 'Technology',
    title: 'Technology and Literacy',
    prompt: 'With the increasing popularity of computers and calculators, student literacy is decreasing dramatically. What are the positive and negative effects the progress of science and technology has brought about?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Media
  {
    id: '31',
    category: 'Media',
    title: 'Communication Media Comparison',
    prompt: 'Compare the advantages and disadvantages of three of the following as media for communicating information. State which you consider to be the most effective. • Comics, books, radio, television, film, theatre',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '32',
    category: 'Media',
    title: 'Television and Communication',
    prompt: 'Do you agree or disagree with the following statement? Television has destroyed communication among friends and family. Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '33',
    category: 'Media',
    title: 'News Selection',
    prompt: 'News editors decide what to broadcast on television and what to print in newspapers. What factors do you think influence these decisions? Do we become used to bad news? Would it be better if more good news was reported?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '34',
    category: 'Media',
    title: 'Television Programs for Children',
    prompt: 'Many people believe that television programs are of no value for children. Do you agree? Why or why not? Provide reasons and examples to support your response.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '35',
    category: 'Media',
    title: 'Television and Culture',
    prompt: 'Television has had a significant influence on the culture of many societies. To what extent would you say that television has positively or negatively affected the cultural development of your society?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '36',
    category: 'Media',
    title: 'Mass Media Influence',
    prompt: 'The mass media, including television, radio and newspapers, have great influence in shaping people\'s ideas. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Advertising
  {
    id: '37',
    category: 'Advertisement',
    title: 'Advertising Impact',
    prompt: 'Advertising is all around us, it is an unavoidable part of everyone\'s life. Some people say that advertising is a positive part of our lives while others say it is negative. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '38',
    category: 'Advertisement',
    title: 'Complaining About Products',
    prompt: 'When people need to complain about a product or poor service, some prefer to complain in writing and others prefer to complain in person. Which way do you prefer? Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '39',
    category: 'Advertisement',
    title: 'Advertising and Countries',
    prompt: 'Do you agree or disagree with the following statement? Advertising can tell you a lot about a country. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '40',
    category: 'Advertisement',
    title: 'Advertising and Consumption',
    prompt: 'Some people say that advertising encourages us to buy things we really do not need. Others say that advertisements tell us about new products that may improve our lives. Which viewpoint do you agree with? Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Children
  {
    id: '41',
    category: 'Children',
    title: 'Child Behavior Rules',
    prompt: 'In some countries children have very strict rules of behavior, in other countries they are allowed to do almost anything they want. To what extent should children have to follow rules?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '42',
    category: 'Children',
    title: 'Parents as Teachers',
    prompt: 'Do you agree or disagree with the following statement? Parents are the best teachers. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '43',
    category: 'Children',
    title: 'Childhood Obesity',
    prompt: 'The number of overweight children in developed countries is increasing. Some people think this is due to problems such as the growing number of fast food outlets. Others believe that parents are to blame for not looking after their children\'s health. To what extent do you agree with these views?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '44',
    category: 'Children',
    title: 'Children\'s Eating Habits',
    prompt: 'In many countries today, the eating habits and lifestyle of children are different from those of previous generations. Some people say this has had a negative effect on their health. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '45',
    category: 'Children',
    title: 'Child Labor',
    prompt: 'In many countries children are engaged in some kind of paid work. Some people regard this as completely wrong, while others consider it as valuable work experience, important for learning and taking responsibility. What is your opinion on this?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '46',
    category: 'Children',
    title: 'Home Education',
    prompt: 'Children should never be educated at home by their parents. Do you agree or disagree? Discuss the advantages and disadvantages for young people who decide to do this.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '47',
    category: 'Children',
    title: 'Competition vs Cooperation',
    prompt: 'Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults. Discuss both these views and give your own opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '48',
    category: 'Children',
    title: 'Classmates vs Parents Influence',
    prompt: 'Do you agree or disagree with the following statement? Classmates are a more important influence than parents on a child\'s success in school. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '49',
    category: 'Children',
    title: 'Countryside vs City',
    prompt: 'It is better for children to grow up in the countryside than in a big city. Do you agree or disagree? Use specific reasons and examples to develop your essay.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '50',
    category: 'Children',
    title: 'Early Education vs Play',
    prompt: 'Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Compare these two views. Which view do you agree with? Why?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '51',
    category: 'Children',
    title: 'Early Foreign Language Learning',
    prompt: 'Do you agree or disagree with the following statement? Children should begin learning a foreign language as soon as they start school. Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '52',
    category: 'Children',
    title: 'Television and Children',
    prompt: 'Do you agree or disagree with the following statement? Watching television is bad for children. Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '53',
    category: 'Children',
    title: 'Adult Decision Making for Teens',
    prompt: 'Do you agree or disagree with the following statement? Parents or other adult relatives should make important decisions for their (15 to 18 year-old) teenage children. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '54',
    category: 'Children',
    title: 'Household Tasks for Children',
    prompt: 'Do you agree or disagree with the following statement? Children should be required to help with household tasks as soon as they are able to do so. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '55',
    category: 'Children',
    title: 'Generational Changes',
    prompt: 'Children\'s lives these days are quite different from our generation\'s. Describe what are the biggest changes in younger generation and explain some factors of this phenomenon.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '56',
    category: 'Children',
    title: 'Intelligence-Based Teaching',
    prompt: 'It is widely believed that children of different levels of intelligence should be taught together, while others think that more intelligent children should be taught separately. Discuss and present your own opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '57',
    category: 'Children',
    title: 'Educational Leisure Activities',
    prompt: 'Some people believe that children\'s leisure activities must be educational, otherwise they are a complete waste of time. Do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '58',
    category: 'Children',
    title: 'Wealthy vs Poor Family Upbringing',
    prompt: 'Children who are brought up in the family that do not have a lot of money are better prepared to deal with problems when they become adults than children who are brought up by wealthy parent. Do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Young People
  {
    id: '59',
    category: 'Young People',
    title: 'Violence in Media',
    prompt: 'A lot of people believe that the amount of violence shown on TV and in the cinema affects the actions of our young people and therefore increases the amount of violence in our society today. Do you agree or disagree with this statement? What can be done to reduce violence in our society today?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '60',
    category: 'Young People',
    title: 'Action Movies and Driving',
    prompt: 'Action movies with spectacular car chases are very popular with young people. It is often said that these sorts of movies lead to an increase in car accidents among young drivers as they try to copy what they have seen in the films. Do you agree that such movies increase the amount of bad driving? What can be done to encourage young people to drive more safely?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Old People
  {
    id: '61',
    category: 'Old People',
    title: 'Care for Elderly',
    prompt: 'In Britain, when someone gets old they often go to live in a home with other old people where there are nurses to look after them. Sometimes the government has to pay for this care. Who should be responsible for our old people?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Social Issues
  {
    id: '62',
    category: 'Social Issues',
    title: 'Human Needs vs Endangered Animals',
    prompt: 'Some people think that human needs for farmland, housing, and industry are more important than saving land for endangered animals. Do you agree or disagree with this point of view? Why or why not? Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '63',
    category: 'Social Issues',
    title: 'Global Currency',
    prompt: 'Trade and travel would be a lot easier with a single, global currency that we all use. Do you agree or disagree with this statement? Would a single currency cause any problems?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '64',
    category: 'Social Issues',
    title: 'Free Education',
    prompt: 'All education, primary, secondary and further education, should be free to all people and paid for by the government. Do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '65',
    category: 'Social Issues',
    title: 'Social Welfare',
    prompt: 'Although abuse of the system are inevitable, social welfare payments are essential to protect the rights citizens have to a guaranteed minimum income in a democratic society. Discuss.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '66',
    category: 'Social Issues',
    title: 'Population Growth',
    prompt: 'The world is experiencing a dramatic increase in population. This is causing problems not only for poor, undeveloped countries, but also for industrialised and developing nations. Describe some of the problems that overpopulation causes, and suggest at least one possible solution.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '67',
    category: 'Social Issues',
    title: 'Women in Workforce',
    prompt: 'The position of women in society has changed markedly in the last twenty years. Many of the problems young people now experience, such as juvenile delinquency, arise from the fact that many married women now work and are not at home to care for their children. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '68',
    category: 'Social Issues',
    title: 'Fast Food Popularity',
    prompt: 'Why is fast-food so popular in the UAE? What are some of the implications for society?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '69',
    category: 'Social Issues',
    title: 'Capital Punishment',
    prompt: 'Without capital punishment (the death penalty) our lives are less secure and crimes of violence increase. Capital punishment is essential to control violence in society. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Family
  {
    id: '70',
    category: 'Family',
    title: 'Arranged vs Chosen Marriages',
    prompt: 'In some countries, marriages are arranged by the parents but in other cases, people choose their own marriage partner. Discuss both systems.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '71',
    category: 'Family',
    title: 'Women vs Men as Parents',
    prompt: 'Many people believe that women make better parents than men and that this is why they have the greater role in raising children in most societies. Others claim that men are just as good as women at parenting. Write an essay expressing your point of view.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '72',
    category: 'Family',
    title: 'Family Closeness',
    prompt: 'It is generally acknowledged that families are now not as close as they used to be. Give possible reasons and your recommendations.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '73',
    category: 'Family',
    title: 'Fatherhood Emphasis',
    prompt: 'Fatherhood ought to be emphasized as much as motherhood. The idea that women are solely responsible for deciding whether or not to have babies leads on to the idea that they are also responsible for bringing the children up. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Culture
  {
    id: '74',
    category: 'Culture',
    title: 'International Language',
    prompt: 'Some people think that it is important to have a single language as an international official language. Others think that it will make it difficult to identify countries and cause a loss of culture. What are your opinions on this?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '75',
    category: 'Culture',
    title: 'Cultural Customs to Adopt',
    prompt: 'Describe a custom from your country that you would like people from other countries to adopt. Explain your choice, using specific reasons and examples.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '76',
    category: 'Culture',
    title: 'Adopting New Customs',
    prompt: 'When people move to another country, some of them decide to follow the customs of the new country. Others prefer to keep their own customs. Compare these two choices. Which one do you prefer? Support your answer with specific details.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '77',
    category: 'Culture',
    title: 'Technology and World Culture',
    prompt: 'Do you agree or disagree with the following statement? Modern technology is creating a single world culture. Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Drugs
  {
    id: '78',
    category: 'Drugs',
    title: 'Smoking Bans',
    prompt: 'Some businesses now say that no one can smoke cigarettes in any of their offices. Some governments have banned smoking in all public places. Do you agree or disagree? Give reasons.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '79',
    category: 'Drugs',
    title: 'Tobacco vs Heroin Laws',
    prompt: 'Should the same laws which prohibit the sale and consumption of heroin be applied to tobacco?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '80',
    category: 'Drugs',
    title: 'Youth Drug Abuse',
    prompt: 'People in all modern societies use drugs, but today\'s youth are experimenting with both legal and illegal drugs, and at an increasingly early age. Some sociologists claim that parents and other members of society often set a bad example. Discuss the causes and some effects of widespread drug use by young people in modern day society. Make any recommendations you feel are necessary to help fight youth drug abuse.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '81',
    category: 'Drugs',
    title: 'Drug Abuse Solutions',
    prompt: 'Drug abuse is becoming a problem in our society. What are the causes of this and what are some solutions?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Health
  {
    id: '82',
    category: 'Health',
    title: 'Smoking and Healthcare Costs',
    prompt: 'Smokers can cause themselves serious health problems. The choice to smoke is made freely and with knowledge of dangers. Smokers should therefore expect to pay more for medical treatment than non-smokers. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '83',
    category: 'Health',
    title: 'Childhood Immunization',
    prompt: 'Should parents be obliged to immunize their children against childhood diseases? Or do individuals have the right to choose not to immunize their children?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '84',
    category: 'Health',
    title: 'Prevention vs Treatment',
    prompt: '"Prevention is better than cure." Out of a country\'s health budget, a large proportion should be diverted from treatment to spending on health education and preventative measures. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '85',
    category: 'Health',
    title: 'Healthcare Costs and Responsibility',
    prompt: 'The costs of medical health care are increasing all the time. Governments are finding it difficult to balance the health care budget. Should citizens be totally responsible for their own health costs and take out private health insurance, or is it better to have a comprehensive health care system which provides free health services for all? Discuss.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Foreign Language
  {
    id: '86',
    category: 'Foreign Language',
    title: 'Learning English in English-Speaking Countries',
    prompt: 'Studying the English language in an English-speaking country is the best but not the only way to learn language. Do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '87',
    category: 'Foreign Language',
    title: 'Foreign Language in Primary Schools',
    prompt: 'Learning a foreign language offers an insight into how people from other cultures think and see the world. The teaching of a foreign language should be compulsory at all primary schools. To what extent do you agree or disagree with this view?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '88',
    category: 'Foreign Language',
    title: 'English as International Language',
    prompt: 'Millions of people every year move to English-speaking countries such as Australia, Britain or America, in order to study at school, college or university. Why do so many people want to study in English? Why is English such an important international language?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Ethical Issues
  {
    id: '89',
    category: 'Ethical Issues',
    title: 'Death Penalty Ethics',
    prompt: 'By punishing murderers with the death penalty, society is also guilty of committing murder. Therefore, life in prison is a better punishment for murderers. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '90',
    category: 'Ethical Issues',
    title: 'Animal Testing',
    prompt: 'Should animals be used in testing new drugs and procedures?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Building
  {
    id: '91',
    category: 'Building',
    title: 'Movie Theater Construction',
    prompt: 'It has recently been announced that a new movie theater may be built in your neighborhood. Do you support or oppose this plan? Why? Use specific reasons and details to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '92',
    category: 'Building',
    title: 'Factory Near Community',
    prompt: 'A company has announced that it wishes to build a large factory near your community. Discuss the advantages and disadvantages of this new influence on your community. Do you support or oppose the factory? Explain your position.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '93',
    category: 'Building',
    title: 'New University Location',
    prompt: 'The government has announced that it plans to build a new university. Some people think that your community would be a good place to locate the university. Compare the advantages and disadvantages of establishing a new university in your community. Use specific details in your discussion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '94',
    category: 'Building',
    title: 'Historic vs Modern Buildings',
    prompt: 'Should a city try to preserve its old, historic buildings or destroy them and replace them with modern buildings? Use specific reasons and examples to support your opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '95',
    category: 'Building',
    title: 'Modern Buildings Similarity',
    prompt: 'In the past, buildings often reflected the culture of a society but today all modern buildings look alike and cities throughout the world are becoming more and more similar. What do you think is the reason for this, and is it a good thing or a bad thing?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '96',
    category: 'Building',
    title: 'Public Buildings',
    prompt: 'In many major cities of the world, you will find large public buildings, both new and old. Discuss the advantages and disadvantages of such buildings. How important is it for a country to construct impressive public buildings when houses are what is really required?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Lifestyle
  {
    id: '97',
    category: 'Lifestyle',
    title: 'Change vs Stability',
    prompt: 'Some people enjoy change, and they look forward to new experiences. Others like their lives to stay the same, and they do not change their usual habits. Compare these two approaches to life. Which approach do you prefer? Explain why.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '98',
    category: 'Lifestyle',
    title: 'Eating Out vs Home Cooking',
    prompt: 'Some people prefer to eat at food stands or restaurants. Other people prefer to prepare and eat food at home. Which do you prefer? Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '99',
    category: 'Lifestyle',
    title: 'Fashion Trends',
    prompt: 'Fashion trends are difficult to follow these days and it\'s widely believed that they primarily exist just to sell clothes. Some people believe that we shouldn\'t follow them and that we should dress in what we like and feel comfortable in. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '100',
    category: 'Lifestyle',
    title: 'Food Preparation Changes',
    prompt: 'Nowadays, food has become easier to prepare. Has this change improved the way people live? Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Others
  {
    id: '101',
    category: 'Others',
    title: 'International Tourism',
    prompt: 'Nowadays, international tourism is the biggest industry in the world. Unfortunately, international tourism creates tension rather than understanding between people from different cultures. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '102',
    category: 'Others',
    title: 'Physical Exercise in Schools',
    prompt: 'Some people say that physical exercise should be a required part of every school day. Other people believe that students should spend the whole school day on academic studies. Which opinion do you agree with? Use specific reasons and details to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '103',
    category: 'Others',
    title: 'Retirement Age',
    prompt: 'When should people be made to retire? 55? 65? Should there be a compulsory retirement age?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '104',
    category: 'Others',
    title: 'Senior Workers',
    prompt: 'Some people insist that senior workers 65 or over should retire but others believe that they should continue working. What is your opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '105',
    category: 'Others',
    title: 'Entertainers High Earnings',
    prompt: 'International entertainers, including sports personalities, often get paid millions of dollars in one year. In your view, with widespread poverty in the world, are these huge earnings justified?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '106',
    category: 'Others',
    title: 'Government Support for Writers',
    prompt: 'Most writers of fiction do not earn enough money to live from their writing. Do you think the government should give them financial assistance to help encourage good literature?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '107',
    category: 'Others',
    title: 'Moving Companies to Countryside',
    prompt: 'Traffic and housing problems in major cities could be solved by moving large companies and factories and their employees to the countryside. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '108',
    category: 'Others',
    title: 'Reducing Car Traffic',
    prompt: 'Every day traffic seems to get worse on our roads. How can we reduce the number of cars on our roads today? What alternatives can we offer car drivers?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '109',
    category: 'Others',
    title: 'Wealthy Nations Responsibility',
    prompt: 'Should wealthy nations be required to share their wealth among poorer nations by providing such things as food and education? Or is it the responsibility of the governments of poorer nations to look after their citizens themselves?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '110',
    category: 'Others',
    title: 'Helping Poorer Nations',
    prompt: 'Improvements in health, education and trade are essential for the development of poorer nations. However, the governments of richer nations should take more responsibility for helping the poorer nations in such areas.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '111',
    category: 'Others',
    title: 'Wealth Gap',
    prompt: 'The wealth gap between 1st world countries and 3rd world countries seems to be increasing. How can we reduce this gap? Do you think that developed countries have a duty to assist developing countries in every way?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '112',
    category: 'Others',
    title: 'Business and Profit',
    prompt: 'Do you agree or disagree with the following statement? Businesses should do anything they can to make a profit. Use specific reasons and examples to support your position.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '113',
    category: 'Others',
    title: 'Making Important Decisions',
    prompt: 'Do you agree or disagree with the following statement? A person should never make an important decision alone. Use specific reasons and examples to support your answer.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '114',
    category: 'Others',
    title: 'Community Improvement',
    prompt: 'You have decided to give several hours of your time each month to improve the community where you live. What is one thing you will do to improve your community? Why? Use specific reasons and details to explain your choice.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  }
];

const SamplePrompts = ({ onSelectPrompt }: SamplePromptsProps) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  const categories = ['ALL', 'Education', 'Environment', 'Technology', 'Media', 'Advertisement', 'Children', 'Young People', 'Old People', 'Social Issues', 'Family', 'Culture', 'Drugs', 'Health', 'Foreign Language', 'Ethical Issues', 'Building', 'Lifestyle', 'Others'];

  // Load used questions from localStorage
  useEffect(() => {
    const loadUsedQuestions = () => {
      const used = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
      setUsedQuestions(used);
    };

    loadUsedQuestions();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadUsedQuestions();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredPrompts = samplePrompts.filter(prompt => {
    const matchesCategory = filter === 'ALL' || prompt.category === filter;
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const usePrompt = (prompt: string) => {
    localStorage.setItem('selectedPrompt', prompt);
    onSelectPrompt();
    toast({
      title: "Question Selected",
      description: "Question has been selected. Start writing your essay!",
    });
  };

  const isQuestionUsed = (question: string) => {
    return usedQuestions.includes(question);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">IELTS Writing Questions</h2>
          <div className="text-sm text-gray-500">
            {filteredPrompts.length} questions available • {usedQuestions.length} completed
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions by title, content, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPrompts.map((prompt) => {
          const isUsed = isQuestionUsed(prompt.prompt);
          
          return (
            <Card key={prompt.id} className={`hover:shadow-md transition-shadow ${isUsed ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <Badge variant="default" className="mr-2">
                        {prompt.category}
                      </Badge>
                      {prompt.title}
                      {isUsed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-normal">Completed</span>
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>⏰ {prompt.timeLimit}</span>
                      <span>📝 {prompt.wordCount}</span>
                    </div>
                  </div>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {prompt.prompt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isUsed ? "outline" : "default"}
                    onClick={() => usePrompt(prompt.prompt)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isUsed ? "Practice Again" : "Use This Question"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyPrompt(prompt.prompt)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No questions found matching your search.</p>
          <Button onClick={() => { setSearchTerm(''); setFilter('ALL'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Practice with these IELTS questions to improve your writing skills.</p>
        <p>Questions you've completed will be marked with a green checkmark!</p>
      </div>
    </div>
  );
};

export default SamplePrompts;
