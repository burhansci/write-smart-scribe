
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SamplePromptsProps {
  onSelectPrompt: () => void;
}

const samplePrompts = [
  {
    id: '1',
    type: 'IELTS',
    title: 'Technology and Education',
    prompt: 'Some people believe that technology has made learning more efficient, while others argue that it has made students more dependent and less creative. Discuss both views and give your own opinion.',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '2',
    type: 'IELTS',
    title: 'Environmental Protection',
    prompt: 'Many countries are concerned about environmental problems. What are the main environmental problems in your country? What solutions can you suggest?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '3',
    type: 'GRE',
    title: 'Leadership and Consensus',
    prompt: 'The best way to teach is to praise positive actions and ignore negative ones. Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning.',
    timeLimit: '30 minutes',
    wordCount: '300-500 words'
  },
  {
    id: '4',
    type: 'GRE',
    title: 'Technology and Society',
    prompt: 'As we acquire more knowledge, things do not become more comprehensible, but more complex and mysterious. Write a response in which you discuss the extent to which you agree or disagree with the statement.',
    timeLimit: '30 minutes',
    wordCount: '300-500 words'
  },
  {
    id: '5',
    type: 'IELTS',
    title: 'Work-Life Balance',
    prompt: 'In many countries, people are working longer hours. What are the reasons for this trend? Is this a positive or negative development?',
    timeLimit: '40 minutes',
    wordCount: '250+ words'
  },
  {
    id: '6',
    type: 'GRE',
    title: 'Innovation and Risk',
    prompt: 'In any field—business, politics, education, government—those in power should be required to step down after five years. Write a response discussing your views on the policy and explain your reasoning.',
    timeLimit: '30 minutes',
    wordCount: '300-500 words'
  }
];

const SamplePrompts = ({ onSelectPrompt }: SamplePromptsProps) => {
  const [filter, setFilter] = useState<'ALL' | 'IELTS' | 'GRE'>('ALL');

  const filteredPrompts = filter === 'ALL' 
    ? samplePrompts 
    : samplePrompts.filter(prompt => prompt.type === filter);

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard. Go to the Write tab to start.",
    });
  };

  const usePrompt = (prompt: string) => {
    // Store the selected prompt in localStorage so WritingEditor can use it
    localStorage.setItem('selectedPrompt', prompt);
    onSelectPrompt();
    toast({
      title: "Prompt Selected",
      description: "Switch to the Write tab to start writing with this prompt.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Sample Writing Prompts</h2>
        <div className="flex gap-2">
          <Button
            variant={filter === 'ALL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('ALL')}
          >
            All
          </Button>
          <Button
            variant={filter === 'IELTS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('IELTS')}
          >
            IELTS
          </Button>
          <Button
            variant={filter === 'GRE' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('GRE')}
          >
            GRE
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPrompts.map((prompt) => (
          <Card key={prompt.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Badge variant={prompt.type === 'IELTS' ? 'default' : 'secondary'} className="mr-2">
                      {prompt.type}
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

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Practice with these prompts to improve your writing skills.</p>
        <p>Remember to time yourself for realistic test conditions!</p>
      </div>
    </div>
  );
};

export default SamplePrompts;
