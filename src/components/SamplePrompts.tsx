
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, ExternalLink, Search } from "lucide-react";
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
    prompt: 'Some people believe that the best way of learning about life is by listening to the advice of family and friends. Other people believe that the best way of learning about life is through personal experience. Compare the advantages of these two different ways of learning about life. Which do you think is preferable?',
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
    title: 'Theoretical vs Practical Knowledge',
    prompt: 'Some people think that universities should not provide so much theoretical knowledge but give more practical training throughout their courses. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '8',
    category: 'Education',
    title: 'Books vs Experience',
    prompt: 'It has been said, "Not everything that is learned is contained in books." Compare and contrast knowledge gained from experience with knowledge gained from books. In your opinion, which source is more important? Why?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '9',
    category: 'Education',
    title: 'Overseas Education',
    prompt: 'Going overseas for university study is an exciting prospect for many people. But while it may offer some advantages, it is probably better to stay home because of the difficulties a student inevitably encounters living and studying in a different culture. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '10',
    category: 'Education',
    title: 'Academic vs Practical Skills',
    prompt: 'It is often said that the subjects taught in schools are too academic in orientation and that it would be more useful for children to learn about practical matters such as home management, work and interpersonal skills. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Environment
  {
    id: '11',
    category: 'Environment',
    title: 'Global Environmental Problems',
    prompt: 'Nowadays environmental problems are too big to be managed by individual persons or individual countries. In other words, it is an international problem. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '12',
    category: 'Environment',
    title: 'Waste Production',
    prompt: 'Nowadays we are producing more and more rubbish. Why do you think this is happening? What can governments do to help reduce the amount of rubbish produced?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '13',
    category: 'Environment',
    title: 'Climate Change Responsibility',
    prompt: 'Scientists and the news media are presenting ever more evidence of climate change. Governments cannot be expected to solve this problem. It is the responsibility of individuals to change their lifestyle to prevent further damage. What are your views?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '14',
    category: 'Environment',
    title: 'Public Transport vs Private Cars',
    prompt: 'The rising levels of congestion and air pollution found in most of the world\'s cities can be attributed directly to the rapidly increasing number of private cars in use. In order to reverse this decline in the quality of life in cities, attempts must be made to encourage people to use their cars less and public transport more. Discuss possible ways to encourage the use of public transport.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Technology
  {
    id: '15',
    category: 'Technology',
    title: 'Space Exploration',
    prompt: 'With all the troubles in the world today, money spent on space exploration is a complete waste. The money could be better spent on other things. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '16',
    category: 'Technology',
    title: 'Internet Communication',
    prompt: 'Some say that the internet is making the world smaller by bringing people together. To what extent do you agree that the internet is making it easier for people to communicate with one another?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '17',
    category: 'Technology',
    title: 'Nuclear Technology',
    prompt: 'We have been living in the nuclear age now for over half a century. Since the first atomic bombs were developed, nuclear technology has provided governments with the ability to totally destroy the planet. Yet the technology has been put to positive use as an energy source and in certain areas of medicine. To what extent is nuclear technology a danger to life on Earth? What are the benefits and risks associated with its use?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '18',
    category: 'Technology',
    title: 'Telecommuting',
    prompt: '\'Telecommuting\' refers to workers doing their jobs from home for part of each week and communicating with their office using computer technology. Telecommuting is growing in many countries and is expected to be common for most office workers in the coming decades. How do you think society will be affected by the growth of telecommuting?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Media
  {
    id: '19',
    category: 'Media',
    title: 'Television and Communication',
    prompt: 'Television has destroyed communication among friends and family. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '20',
    category: 'Media',
    title: 'News Selection',
    prompt: 'News editors decide what to broadcast on television and what to print in newspapers. What factors do you think influence these decisions? Do we become used to bad news? Would it be better if more good news was reported?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '21',
    category: 'Media',
    title: 'Television and Culture',
    prompt: 'Television has had a significant influence on the culture of many societies. To what extent would you say that television has positively or negatively affected the cultural development of your society?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Advertising
  {
    id: '22',
    category: 'Advertising',
    title: 'Advertising Impact',
    prompt: 'Advertising is all around us, it is an unavoidable part of everyone\'s life. Some people say that advertising is a positive part of our lives while others say it is negative. Discuss both views and give your own opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '23',
    category: 'Advertising',
    title: 'Advertising and Consumption',
    prompt: 'Some people say that advertising encourages us to buy things we really do not need. Others say that advertisements tell us about new products that may improve our lives. Which viewpoint do you agree with?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Children
  {
    id: '24',
    category: 'Children',
    title: 'Child Behaviour Rules',
    prompt: 'In some countries children have very strict rules of behaviour, in other countries they are allowed to do almost anything they want. To what extent should children have to follow rules?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '25',
    category: 'Children',
    title: 'Parents as Teachers',
    prompt: 'Parents are the best teachers. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '26',
    category: 'Children',
    title: 'Childhood Obesity',
    prompt: 'The number of overweight children in developed countries is increasing. Some people think this is due to problems such as the growing number of fast food outlets. Others believe that parents are to blame for not looking after their children\'s health. To what extent do you agree with these views?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '27',
    category: 'Children',
    title: 'Competition vs Cooperation',
    prompt: 'Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults. Discuss both these views and give your own opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '28',
    category: 'Children',
    title: 'Early Education vs Play',
    prompt: 'Some people think that children should begin their formal education at a very early age and should spend most of their time on school studies. Others believe that young children should spend most of their time playing. Compare these two views. Which view do you agree with? Why?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Social Issues
  {
    id: '29',
    category: 'Social Issues',
    title: 'Global Currency',
    prompt: 'Trade and travel would be a lot easier with a single, global currency that we all use. Do you agree or disagree with this statement? Would a single currency cause any problems?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '30',
    category: 'Social Issues',
    title: 'Free Education',
    prompt: 'All education, primary, secondary and further education, should be free to all people and paid for by the government. Do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '31',
    category: 'Social Issues',
    title: 'Population Growth',
    prompt: 'The world is experiencing a dramatic increase in population. This is causing problems not only for poor, undeveloped countries, but also for industrialised and developing nations. Describe some of the problems that overpopulation causes, and suggest at least one possible solution.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '32',
    category: 'Social Issues',
    title: 'Women in Workforce',
    prompt: 'The position of women in society has changed markedly in the last twenty years. Many of the problems young people now experience, such as juvenile delinquency, arise from the fact that many married women now work and are not at home to care for their children. To what extent do you agree or disagree with this opinion?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Culture
  {
    id: '33',
    category: 'Culture',
    title: 'International Language',
    prompt: 'Some people think that it is important to have a single language as an international official language. Others think that it will make it difficult to identify countries and cause a loss of culture. What are your opinions on this?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '34',
    category: 'Culture',
    title: 'Adopting New Customs',
    prompt: 'When people move to another country, some of them decide to follow the customs of the new country. Others prefer to keep their own customs. Compare these two choices. Which one do you prefer?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  // Health
  {
    id: '35',
    category: 'Health',
    title: 'Smoking and Healthcare Costs',
    prompt: 'Smokers can cause themselves serious health problems. The choice to smoke is made freely and with knowledge of dangers. Smokers should therefore expect to pay more for medical treatment than non-smokers. To what extent do you agree or disagree?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '36',
    category: 'Health',
    title: 'Prevention vs Treatment',
    prompt: '"Prevention is better than cure." Out of a country\'s health budget, a large proportion should be diverted from treatment to spending on health education and preventative measures. To what extent do you agree or disagree with this statement?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  }
];

const SamplePrompts = ({ onSelectPrompt }: SamplePromptsProps) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['ALL', 'Education', 'Environment', 'Technology', 'Media', 'Advertising', 'Children', 'Social Issues', 'Culture', 'Health'];

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
      description: "Prompt copied to clipboard. Go to the Write tab to start.",
    });
  };

  const usePrompt = (prompt: string) => {
    localStorage.setItem('selectedPrompt', prompt);
    onSelectPrompt();
    toast({
      title: "Prompt Selected",
      description: "Switch to the Write tab to start writing with this prompt.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">IELTS Writing Prompts</h2>
          <div className="text-sm text-gray-500">
            {filteredPrompts.length} prompts available
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prompts by title, content, or category..."
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
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Badge variant="default" className="mr-2">
                      {prompt.category}
                    </Badge>
                    {prompt.title}
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
                  variant="default"
                  onClick={() => usePrompt(prompt.prompt)}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Use This Prompt
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
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No prompts found matching your search.</p>
          <Button onClick={() => { setSearchTerm(''); setFilter('ALL'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Practice with these IELTS prompts to improve your writing skills.</p>
        <p>Remember to time yourself for realistic test conditions!</p>
      </div>
    </div>
  );
};

export default SamplePrompts;
