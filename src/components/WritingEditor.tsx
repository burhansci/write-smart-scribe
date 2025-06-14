
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";
import { createDeepSeekPrompt, callDeepSeekAPI, parseDeepSeekResponse } from "@/lib/deepseek";
import ApiKeyInput from "./ApiKeyInput";

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
}

const WritingEditor = ({ onSubmissionComplete }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [scoringSystem, setScoringSystem] = useState<'IELTS' | 'GRE'>('IELTS');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  useEffect(() => {
    setApiKey(HARDCODED_API_KEY);
  }, []);

  const analyzeWriting = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (text.trim().length < 50) {
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
        description: "Your writing has been analyzed via OpenRouter. Check the feedback tab.",
      });

    } catch (error) {
      console.error('OpenRouter analysis error:', error);
      toast({
        title: "Analysis Error",
        description: error instanceof Error ? error.message : "Failed to analyze your writing. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  return (
    <div className="space-y-6">
      <ApiKeyInput onApiKeySet={setApiKey} currentApiKey={apiKey} />
      
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Send className="w-5 h-5 text-blue-600" />
          </div>
          Writing Practice
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="scoring-system">Scoring System</Label>
            <Select value={scoringSystem} onValueChange={(value: 'IELTS' | 'GRE') => setScoringSystem(value)}>
              <SelectTrigger id="scoring-system">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IELTS">IELTS Writing</SelectItem>
                <SelectItem value="GRE">GRE Analytical Writing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-500 pt-6">
            Words: {wordCount}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="writing-area">Your Writing</Label>
          <Textarea
            id="writing-area"
            placeholder="Start writing your essay or paragraph here. Write at least 50 words for meaningful analysis..."
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
                Analyzing via OpenRouter...
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
