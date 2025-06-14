import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";
import { createDeepSeekPrompt, callDeepSeekAPI, parseDeepSeekResponse } from "@/lib/deepseek";

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
}

const IELTS_TASK_2_PROMPTS: string[] = [
  "Some people believe that professional workers such as doctors and teachers should be paid more than sports and entertainment personalities. To what extent do you agree or disagree?",
  "Many people think that the government should spend money on faster public transport. Others think that there are other important priorities (e.g., cost, environment). Discuss both views and give your opinion.",
  "It is better for students to study in groups rather than alone. Do you agree or disagree?",
  "In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.",
  "Some believe that people should make efforts to fight climate change, while others think it is better to learn to live with it. Discuss both views and give your own opinion."
];

const GRE_ISSUE_PROMPTS: string[] = [
  "To understand the most important characteristics of a society, one must study its major cities.",
  "Governments should focus on solving the immediate problems of today rather than on trying to solve the anticipated problems of the future.",
  "Educational institutions have a responsibility to dissuade students from pursuing fields of study in which they are unlikely to succeed.",
  "The measure of a society’s progress is the well-being of its least fortunate members.",
  "Originality does not mean thinking something that was never thought before; it means putting old ideas together in new ways."
];

const GRE_ARGUMENT_PROMPTS: string[] = [
  "The following appeared as part of a letter to the editor of a scientific journal: 'A recent study of eighteen rhesus monkeys provides evidence that vision is improved when daily supplements of beta-carotene are included in their diets. Based on this study, it seems clear that people who include foods high in beta-carotene, such as carrots, in their diets will have better vision.' Evaluate the argument and discuss how well reasoned you find it.",
  "The following appeared in a memorandum from the business department of the Apogee Company: 'A recent review of Apogee’s customer service policies has led to the recommendation that all Apogee employees undergo training in customer relations. The Apogee Company is facing increased competition, and this training will help maintain our reputation for excellent service.' Evaluate the argument and discuss how well reasoned you find it.",
  "The following appeared in a memorandum from the manager of WWAC Radio Station: ‘WWAC must change from rock-and-roll to continuous news if it is to attract more listeners and remain financially viable.' Evaluate the argument and discuss how well reasoned you find it.",
  "The following appeared as part of an article in a magazine devoted to regional lifestyles: 'Since many people enjoy recreational activities such as fishing and camping, we should build new parks to boost local tourism and the economy.' Evaluate the argument and discuss how well reasoned you find it.",
  "The following is from a letter to a publisher: 'Since its release, the literary magazine, The Modern Review, has seen a decline in subscriptions. Introducing more reviews of popular fiction should revive interest.' Evaluate the argument and discuss how well reasoned you find it."
];

type ScoringSystem = 'IELTS' | 'GRE';
type WritingType = 'IELTS_TASK_2' | 'GRE_ISSUE' | 'GRE_ARGUMENT';

const getDefaultWritingType = (scoringSystem: ScoringSystem): WritingType =>
  scoringSystem === 'IELTS' ? 'IELTS_TASK_2' : 'GRE_ISSUE';

const getPromptList = (writingType: WritingType): string[] => {
  switch (writingType) {
    case 'IELTS_TASK_2': return IELTS_TASK_2_PROMPTS;
    case 'GRE_ISSUE': return GRE_ISSUE_PROMPTS;
    case 'GRE_ARGUMENT': return GRE_ARGUMENT_PROMPTS;
    default: return [];
  }
};

// Function to get next unique question
const getNextUniquePrompt = (writingType: WritingType): string => {
  const storageKey = `usedPrompts_${writingType}`;
  const allPrompts = getPromptList(writingType);
  const usedPrompts = JSON.parse(localStorage.getItem(storageKey) || '[]');
  
  // If all prompts have been used, reset the used prompts list
  if (usedPrompts.length >= allPrompts.length) {
    localStorage.setItem(storageKey, '[]');
    const firstPrompt = allPrompts[0];
    localStorage.setItem(storageKey, JSON.stringify([firstPrompt]));
    return firstPrompt;
  }
  
  // Find unused prompts
  const unusedPrompts = allPrompts.filter(prompt => !usedPrompts.includes(prompt));
  
  // Get random unused prompt
  const selectedPrompt = unusedPrompts[Math.floor(Math.random() * unusedPrompts.length)];
  
  // Add to used prompts
  const updatedUsedPrompts = [...usedPrompts, selectedPrompt];
  localStorage.setItem(storageKey, JSON.stringify(updatedUsedPrompts));
  
  return selectedPrompt;
};

const WritingEditor = ({ onSubmissionComplete }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>('IELTS');
  const [writingType, setWritingType] = useState<WritingType>(getDefaultWritingType('IELTS'));
  const [question, setQuestion] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  // Initialize question on first load
  useEffect(() => {
    setQuestion(getNextUniquePrompt('IELTS_TASK_2'));
  }, []);

  // Reset type and question when scoring system changes
  useEffect(() => {
    if (scoringSystem === 'IELTS') {
      setWritingType('IELTS_TASK_2');
      setQuestion(getNextUniquePrompt('IELTS_TASK_2'));
    } else {
      setWritingType('GRE_ISSUE');
      setQuestion(getNextUniquePrompt('GRE_ISSUE'));
    }
  }, [scoringSystem]);

  // Reset question if writing type changes
  useEffect(() => {
    setQuestion(getNextUniquePrompt(writingType));
  }, [writingType]);

  const getNewQuestion = () => {
    setQuestion(getNextUniquePrompt(writingType));
  };

  const analyzeWriting = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (text.trim().split(/\s+/).filter(word => word.length > 0).length < 50) {
      toast({
        title: "Error", 
        description: "Please write at least 50 words for meaningful analysis.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      console.log('Starting OpenRouter analysis...');
      const messages = createDeepSeekPrompt(text, scoringSystem);
      const response = await callDeepSeekAPI(messages, HARDCODED_API_KEY);
      console.log('OpenRouter response:', response);
      
      const parsedFeedback = parseDeepSeekResponse(response);
      console.log('Parsed feedback:', parsedFeedback);
      
      const feedback: AIFeedback = {
        score: parsedFeedback.score,
        explanation: parsedFeedback.explanation,
        markedErrors: parsedFeedback.markedErrors,
        improvedText: parsedFeedback.improvedText
      };
      
      const submission: WritingSubmission = {
        id: Date.now().toString(),
        text,
        scoringSystem,
        timestamp: new Date(),
        feedback
      };

      // Save to localStorage
      const savedSubmissions = JSON.parse(localStorage.getItem('writingSubmissions') || '[]');
      savedSubmissions.unshift(submission);
      localStorage.setItem('writingSubmissions', JSON.stringify(savedSubmissions.slice(0, 10)));

      onSubmissionComplete(submission);
      setText('');
      
      toast({
        title: "Analysis Complete!",
        description: "Your writing has been analyzed. Check the feedback tab.",
      });

    } catch (error) {
      console.error('OpenRouter analysis error:', error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze your writing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          Writing Practice
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label htmlFor="scoring-system">Scoring System</Label>
            <Select value={scoringSystem} onValueChange={(value: ScoringSystem) => setScoringSystem(value)}>
              <SelectTrigger id="scoring-system">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IELTS">IELTS Writing</SelectItem>
                <SelectItem value="GRE">GRE Analytical Writing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {scoringSystem === 'GRE' && (
            <div className="flex-1 min-w-[200px]">
              <Label htmlFor="writing-type">Writing Type</Label>
              <Select value={writingType} onValueChange={(value: WritingType) => setWritingType(value)}>
                <SelectTrigger id="writing-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GRE_ISSUE">Analyze an Issue</SelectItem>
                  <SelectItem value="GRE_ARGUMENT">Analyze an Argument</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="text-sm text-gray-500 pt-6 min-w-[80px]">
            Words: {wordCount}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-semibold">Question:</Label>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="New Question"
            onClick={getNewQuestion}
          >
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-base italic cursor-pointer transition hover:bg-blue-50"
          onClick={() => setText(question)}>
          {question}
        </div>
        <div className="text-xs text-gray-500 pl-1 mb-2">
          Click the question to insert it into the editor.
        </div>

        <div className="space-y-2">
          <Label htmlFor="writing-area">Your Writing</Label>
          <Textarea
            id="writing-area"
            placeholder="Start writing your essay or argument here. Write at least 50 words for meaningful analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] text-base leading-relaxed"
            disabled={isAnalyzing}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Minimum 50 words recommended for analysis
          </p>
          <Button 
            onClick={analyzeWriting} 
            disabled={isAnalyzing || wordCount < 1}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Analyze Writing
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default WritingEditor;
