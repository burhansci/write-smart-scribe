import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, BookOpen, PenTool } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";
import { createDeepSeekPrompt, callDeepSeekAPI, parseDeepSeekResponse } from "@/lib/deepseek";

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
  onChooseQuestion: () => void;
}

const WritingEditor = ({ onSubmissionComplete, onChooseQuestion }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState<string>('');
  const [writingMode, setWritingMode] = useState<'question' | 'free'>('question');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  // Listen for selected prompts from localStorage
  useEffect(() => {
    const checkForSelectedPrompt = () => {
      const selectedPrompt = localStorage.getItem('selectedPrompt');
      if (selectedPrompt) {
        setQuestion(selectedPrompt);
        setWritingMode('question');
        localStorage.removeItem('selectedPrompt');
      }
    };

    checkForSelectedPrompt();
    
    // Listen for storage changes
    const handleStorageChange = () => {
      checkForSelectedPrompt();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
      const messages = createDeepSeekPrompt(text, 'IELTS');
      const response = await callDeepSeekAPI(messages, HARDCODED_API_KEY);
      console.log('OpenRouter response:', response);
      
      const parsedFeedback = parseDeepSeekResponse(response);
      console.log('Parsed feedback:', parsedFeedback);
      
      const feedback: AIFeedback = {
        score: parsedFeedback.score,
        explanation: parsedFeedback.explanation,
        lineByLineAnalysis: parsedFeedback.lineByLineAnalysis,
        markedErrors: parsedFeedback.markedErrors,
        improvedText: parsedFeedback.improvedText,
        cohesionAnalysis: parsedFeedback.cohesionAnalysis,
        vocabularyEnhancement: parsedFeedback.vocabularyEnhancement,
        grammarImprovements: parsedFeedback.grammarImprovements,
        band9Version: parsedFeedback.band9Version
      };
      
      const submission: WritingSubmission = {
        id: Date.now().toString(),
        text,
        scoringSystem: 'IELTS',
        timestamp: new Date(),
        feedback,
        question: writingMode === 'question' ? (question || undefined) : undefined
      };

      // Save to localStorage
      const savedSubmissions = JSON.parse(localStorage.getItem('writingSubmissions') || '[]');
      savedSubmissions.unshift(submission);
      localStorage.setItem('writingSubmissions', JSON.stringify(savedSubmissions.slice(0, 10)));

      // Track used questions only for question mode
      if (writingMode === 'question' && question) {
        const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
        if (!usedQuestions.includes(question)) {
          usedQuestions.push(question);
          localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
        }
      }

      onSubmissionComplete(submission);
      setText('');
      setQuestion('');
      
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

  const handleModeChange = (mode: 'question' | 'free') => {
    setWritingMode(mode);
    if (mode === 'free') {
      setQuestion('');
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
          IELTS Writing Practice
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Words: {wordCount}
          </div>
        </div>

        {/* Writing Mode Toggle */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <Button
            type="button"
            variant={writingMode === 'question' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('question')}
            className="flex-1"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Choose Question
          </Button>
          <Button
            type="button"
            variant={writingMode === 'free' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('free')}
            className="flex-1"
          >
            <PenTool className="w-4 h-4 mr-2" />
            Free Writing
          </Button>
        </div>

        {/* Question Mode */}
        {writingMode === 'question' && (
          <>
            {!question ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Choose a Writing Prompt</h3>
                <p className="text-gray-500 mb-4">Select a question from our sample prompts to get started</p>
                <Button onClick={onChooseQuestion} className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Choose Question
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Label className="font-semibold">Selected Question:</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onChooseQuestion}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Change Question
                  </Button>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-base italic">
                  {question}
                </div>
              </div>
            )}
          </>
        )}

        {/* Free Writing Mode */}
        {writingMode === 'free' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <PenTool className="w-5 h-5 text-green-600" />
              <Label className="font-semibold text-green-800">Free Writing Mode</Label>
            </div>
            <p className="text-green-700 text-sm">
              Write about any topic you choose. Your writing will still be analyzed using IELTS criteria.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="writing-area">Your Writing</Label>
          <Textarea
            id="writing-area"
            placeholder={
              writingMode === 'question' 
                ? (question ? "Start writing your IELTS essay here..." : "Please choose a question first to start writing...")
                : "Start writing about any topic you choose..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[300px] text-base leading-relaxed"
            disabled={isAnalyzing || (writingMode === 'question' && !question)}
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Minimum 50 words recommended for analysis
          </p>
          <Button 
            onClick={analyzeWriting} 
            disabled={isAnalyzing || wordCount < 1 || (writingMode === 'question' && !question)}
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
