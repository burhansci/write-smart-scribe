
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

type ScoringSystem = 'IELTS' | 'GRE';
type WritingType = 'IELTS_TASK_2' | 'GRE_ISSUE' | 'GRE_ARGUMENT';

const getDefaultWritingType = (scoringSystem: ScoringSystem): WritingType =>
  scoringSystem === 'IELTS' ? 'IELTS_TASK_2' : 'GRE_ISSUE';

// Function to generate AI-powered questions
const generateAIQuestion = async (writingType: WritingType, apiKey: string): Promise<string> => {
  const prompts = {
    'IELTS_TASK_2': `Generate a unique IELTS Task 2 writing prompt. The prompt should:
- Be about current social, educational, environmental, or technological issues
- Ask the candidate to discuss both views and give their opinion, OR agree/disagree with a statement, OR discuss advantages/disadvantages
- Be suitable for a 250+ word essay
- Be different from common IELTS questions
- Only return the question itself, nothing else`,
    
    'GRE_ISSUE': `Generate a unique GRE Issue task prompt. The prompt should:
- Present a claim about society, education, politics, technology, or human nature
- Be suitable for analytical writing where the test taker discusses their agreement/disagreement
- Be thought-provoking and allow for multiple perspectives
- Be suitable for a 300-500 word response
- Only return the statement itself, nothing else`,
    
    'GRE_ARGUMENT': `Generate a unique GRE Argument task prompt. The prompt should:
- Present a flawed argument (like a business memo, letter to editor, or report)
- Include logical fallacies or weak reasoning that can be critiqued
- Ask the test taker to evaluate the argument's reasoning
- Be suitable for a 300-500 word analysis
- Only return the argument prompt itself, nothing else`
  };

  try {
    const messages = [
      {
        role: 'system' as const,
        content: 'You are an expert test question generator. Generate only the question/prompt requested, nothing else.'
      },
      {
        role: 'user' as const,
        content: prompts[writingType]
      }
    ];

    const response = await callDeepSeekAPI(messages, apiKey);
    return response.trim();
  } catch (error) {
    console.error('Error generating AI question:', error);
    // Fallback to a basic question if AI generation fails
    const fallbacks = {
      'IELTS_TASK_2': 'Some people believe that technology has improved our lives, while others think it has created more problems. Discuss both views and give your own opinion.',
      'GRE_ISSUE': 'The best way to understand the character of a society is to examine the character of the people who choose to lead it.',
      'GRE_ARGUMENT': 'The following appeared in a memo from a company executive: "Our sales have declined over the past year. To improve our performance, we should reduce our workforce by 10% and focus on our most profitable products." Evaluate the argument and discuss how well reasoned you find it.'
    };
    return fallbacks[writingType];
  }
};

const WritingEditor = ({ onSubmissionComplete }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [scoringSystem, setScoringSystem] = useState<ScoringSystem>('IELTS');
  const [writingType, setWritingType] = useState<WritingType>(getDefaultWritingType('IELTS'));
  const [question, setQuestion] = useState<string>('');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  // Initialize question on first load
  useEffect(() => {
    generateNewQuestion('IELTS_TASK_2');
  }, []);

  // Reset type and question when scoring system changes
  useEffect(() => {
    if (scoringSystem === 'IELTS') {
      setWritingType('IELTS_TASK_2');
      generateNewQuestion('IELTS_TASK_2');
    } else {
      setWritingType('GRE_ISSUE');
      generateNewQuestion('GRE_ISSUE');
    }
  }, [scoringSystem]);

  // Reset question if writing type changes
  useEffect(() => {
    generateNewQuestion(writingType);
  }, [writingType]);

  const generateNewQuestion = async (type: WritingType) => {
    setIsGeneratingQuestion(true);
    try {
      const newQuestion = await generateAIQuestion(type, HARDCODED_API_KEY);
      setQuestion(newQuestion);
    } catch (error) {
      console.error('Failed to generate question:', error);
      toast({
        title: "Error",
        description: "Failed to generate a new question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  const getNewQuestion = () => {
    generateNewQuestion(writingType);
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
            disabled={isGeneratingQuestion}
          >
            {isGeneratingQuestion ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-base italic cursor-pointer transition hover:bg-blue-50"
          onClick={() => setText(question)}>
          {isGeneratingQuestion ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating new question...
            </div>
          ) : (
            question
          )}
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
