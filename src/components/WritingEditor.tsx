
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
}

const WritingEditor = ({ onSubmissionComplete }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [scoringSystem, setScoringSystem] = useState<'IELTS' | 'GRE'>('IELTS');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      // Create the prompt for AI analysis
      const prompt = `You are an expert ${scoringSystem} writing evaluator. The user will provide a writing sample. Your task is to do the following:

1. Score the writing:
   - Give an estimated ${scoringSystem === 'IELTS' ? 'IELTS band' : 'GRE AWA'} score.
   - Explain the score in these categories:
     a. Task Response / Issue Analysis
     b. Coherence and Cohesion
     c. Lexical Resource
     d. Grammar and Sentence Structure

2. Error Marking (Original Text):
   - Mark all grammar, spelling, and style mistakes inline using this format:
     [mistake]{ErrorType: Explanation}

3. Correction Display:
   - Show a corrected version of the user's text using these inline tags:
     [+added_word+], [~wrong_word~]

4. Enhancement Suggestions:
   - In the user's original writing, show where linking words, transitions, or better structures could be inserted using:
     [+linking_phrase+]{Suggestion}
   - Do NOT rewrite the entire writing. Only suggest local improvements.

Return your answer in 4 sections:
**Score**
**Explanation**
**Marked Errors**
**Improved with Suggestions**

Here is the writing sample:
${text}`;

      // Simulate AI response for now - in production, this would call DeepSeek-V1
      const simulatedResponse = await simulateAIAnalysis(text, scoringSystem);
      
      const submission: WritingSubmission = {
        id: Date.now().toString(),
        text,
        scoringSystem,
        timestamp: new Date(),
        feedback: simulatedResponse
      };

      // Save to localStorage
      const savedSubmissions = JSON.parse(localStorage.getItem('writingSubmissions') || '[]');
      savedSubmissions.unshift(submission);
      localStorage.setItem('writingSubmissions', JSON.stringify(savedSubmissions.slice(0, 10))); // Keep only last 10

      onSubmissionComplete(submission);
      setText('');
      
      toast({
        title: "Analysis Complete!",
        description: "Your writing has been analyzed. Check the feedback tab.",
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze your writing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulate AI analysis - replace with actual DeepSeek-V1 API call
  const simulateAIAnalysis = async (text: string, system: 'IELTS' | 'GRE'): Promise<AIFeedback> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const score = system === 'IELTS' ? 
      `Band ${(Math.random() * 2 + 6).toFixed(1)}` : 
      `AWA Score: ${(Math.random() * 2 + 4).toFixed(1)}`;

    return {
      score,
      explanation: `Your writing demonstrates ${system === 'IELTS' ? 'good task response' : 'clear issue analysis'} with coherent structure. There are opportunities to improve vocabulary range and grammatical accuracy.`,
      markedErrors: text.replace(/\b(the)\b/g, '[the]{Article: Consider if this article is necessary}')
                       .replace(/\b(and)\b/g, '[and]{Conjunction: Consider using more varied linking words}'),
      improvedText: text.replace(/\b(However)\b/g, '[+Furthermore+]')
                       .replace(/\b(very)\b/g, '[~very~][+extremely+]')
    };
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
