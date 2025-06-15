import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";
import { createDeepSeekPrompt, callDeepSeekAPI, parseDeepSeekResponse } from "@/lib/deepseek";
import { callHuggingFaceAPI, parseHuggingFaceResponse } from "@/lib/huggingface";
import { supabase } from '@/integrations/supabase/client';
import WritingModeToggle from './writing-editor/WritingModeToggle';
import QuestionDisplay from './writing-editor/QuestionDisplay';
import FreeWritingInfo from './writing-editor/FreeWritingInfo';
import WritingEditorActions from './writing-editor/WritingEditorActions';

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
  onChooseQuestion: () => void;
}

const WritingEditor = ({ onSubmissionComplete, onChooseQuestion }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState<string>('');
  const [writingMode, setWritingMode] = useState<'question' | 'free'>('question');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const HARDCODED_API_KEY = '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';

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

  const saveSubmission = async (parsedFeedback: AIFeedback) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Not Authenticated", description: "You must be logged in to save your writing.", variant: "destructive" });
      setIsAnalyzing(false);
      return;
    }
    
    const submissionData = {
      user_id: user.id,
      text,
      scoring_system: 'IELTS',
      question: writingMode === 'question' ? (question || undefined) : undefined,
      score: parsedFeedback.score,
      explanation: parsedFeedback.explanation,
      line_by_line_analysis: parsedFeedback.lineByLineAnalysis,
      marked_errors: parsedFeedback.markedErrors,
      improved_text: parsedFeedback.improvedText,
      band9_version: parsedFeedback.band9Version,
    };

    const { data: newSubmission, error } = await supabase
      .from('writing_submissions')
      .insert(submissionData)
      .select()
      .single();
    
    if (error) {
      throw error;
    }

    const submissionForState: WritingSubmission = {
      id: newSubmission.id,
      text: newSubmission.text,
      scoringSystem: 'IELTS',
      timestamp: new Date(newSubmission.created_at),
      feedback: {
        score: newSubmission.score || "",
        explanation: newSubmission.explanation || "",
        lineByLineAnalysis: newSubmission.line_by_line_analysis || "",
        markedErrors: newSubmission.marked_errors || "",
        improvedText: newSubmission.improved_text || "",
        band9Version: newSubmission.band9_version || "",
      },
      question: newSubmission.question || undefined,
    };

    if (writingMode === 'question' && question) {
      const usedQuestions = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
      if (!usedQuestions.includes(question)) {
        usedQuestions.push(question);
        localStorage.setItem('usedQuestions', JSON.stringify(usedQuestions));
      }
    }

    onSubmissionComplete(submissionForState);
    setText('');
    setQuestion('');
    
    toast({
      title: "Analysis Complete!",
      description: "Your writing has been analyzed and saved. Check the feedback tab.",
    });
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
    const messages = createDeepSeekPrompt(text, 'IELTS');

    try {
      let parsedFeedback: AIFeedback;
      try {
        // Attempt 1: Use the primary provider (OpenRouter)
        console.log('Starting OpenRouter analysis...');
        const response = await callDeepSeekAPI(messages, HARDCODED_API_KEY);
        console.log('OpenRouter response:', response);
        parsedFeedback = parseDeepSeekResponse(response);
        console.log('Parsed feedback:', parsedFeedback);
      } catch (error) {
        // Check if it's a credit issue (402) or similar message
        if (error instanceof Error && (error.message.includes('402') || error.message.toLowerCase().includes('insufficient'))) {
          console.warn('OpenRouter credit issue. Falling back to Hugging Face.');
          toast({
            title: "Using Free Alternative",
            description: "Falling back to a free analysis model. This may take a moment...",
            duration: 5000,
          });

          // Attempt 2: Fallback to the free provider (Hugging Face)
          const hfResponse = await callHuggingFaceAPI(messages);
          console.log('Hugging Face response:', hfResponse);
          parsedFeedback = parseHuggingFaceResponse(hfResponse);
          console.log('Parsed Hugging Face feedback:', parsedFeedback);
        } else {
          throw error; // Re-throw any other errors
        }
      }

      await saveSubmission(parsedFeedback);

    } catch (error) {
      console.error('Analysis error:', error);
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

        <WritingModeToggle writingMode={writingMode} onModeChange={handleModeChange} />

        {writingMode === 'question' && (
          <QuestionDisplay question={question} onChooseQuestion={onChooseQuestion} />
        )}

        {writingMode === 'free' && <FreeWritingInfo />}

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

        <WritingEditorActions 
          isAnalyzing={isAnalyzing}
          wordCount={wordCount}
          writingMode={writingMode}
          question={question}
          onAnalyze={analyzeWriting}
        />
      </CardContent>
    </div>
  );
};

export default WritingEditor;
