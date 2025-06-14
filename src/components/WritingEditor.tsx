
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, RefreshCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { WritingSubmission, AIFeedback } from "@/pages/Index";
import { createDeepSeekPrompt, callDeepSeekAPI, parseDeepSeekResponse } from "@/lib/deepseek";

interface WritingEditorProps {
  onSubmissionComplete: (submission: WritingSubmission) => void;
}

// Static IELTS questions - sample from the prompts
const ieltsQuestions = [
  "As computers are being used more and more in education, there will be soon no role for teachers in the classroom. To what extent do you agree or disagree?",
  "In some countries young people are encouraged to work or travel for a year between finishing high school and starting university studies. Discuss the advantages and disadvantages for young people who decide to do this.",
  "Some people believe that a college or university education should be available to all students. Others believe that higher education should be available only to good students. Discuss these views. Which view do you agree with? Explain why.",
  "Some people believe that the best way of learning about life is by listening to the advice of family and friends. Other people believe that the best way of learning about life is through personal experience. Compare the advantages of these two different ways of learning about life. Which do you think is preferable? Use specific examples to support your preference.",
  "With the pressures on today's young people to succeed academically, some people believe that non-academic subjects at school (eg: physical education and cookery) should be removed from the syllabus so that children can concentrate wholly on academic subjects. To what extent do you agree or disagree?",
  "In many countries, sports and exercise classes are replaced with the academic subjects. Discuss the effects of this trend.",
  "Some people think high school graduates should travel or work for a period of time instead of going directly to study at university. Discuss the advantages and disadvantages of both approaches. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
  "Disruptive school students have a negative influence on others. Students who are noisy and disobedient should be grouped together and taught separately. Do you agree or disagree?",
  "Some people think that universities should not provide so much theoretical knowledge but give more practical training throughout their courses. To what extent do you agree or disagree with this opinion?",
  "People attend college or university for many different reasons (for example, new experiences, career preparation, increased knowledge). Why do you think people attend college or university?",
  "It has been said, 'Not everything that is learned is contained in books.' Compare and contrast knowledge gained from experience with knowledge gained from books. In your opinion, which source is more important? Why?",
  "Going overseas for university study is an exciting prospect for many people. But while it may offer some advantages, it is probably better to stay home because of the difficulties a student inevitably encounters living and studying in a different culture. To what extent do you agree or disagree with this statement?",
  "Many students do not finish school. Why is this, and how can the problem be solved?",
  "It is often said that the subjects taught in schools are too academic in orientation and that it would be more useful for children to learn about practical matters such as home management, work and interpersonal skills. To what extent do you agree or disagree?",
  "Nowadays environmental problems are too big to be managed by individual persons or individual countries. In other words, it is an international problem. To what extent do you agree or disagree?",
  "Nowadays we are producing more and more rubbish. Why do you think this is happening? What can governments do to help reduce the amount of rubbish produced?",
  "Scientists and the news media are presenting ever more evidence of climate change. Governments cannot be expected to solve this problem. It is the responsibility of individuals to change their lifestyle to prevent further damage. What are your views?",
  "The rising levels of congestion and air pollution found in most of the world's cities can be attributed directly to the rapidly increasing number of private cars in use. In order to reverse this decline in the quality of life in cities, attempts must be made to encourage people to use their cars less and public transport more. Discuss possible ways to encourage the use of public transport.",
  "With all the troubles in the world today, money spent on space exploration is a complete waste. The money could be better spent on other things. To what extent do you agree or disagree?",
  "Some say that the internet is making the world smaller by bringing people together. To what extent do you agree that the internet is making it easier for people to communicate with one another?",
  "Advertising is all around us, it is an unavoidable part of everyone's life. Some people say that advertising is a positive part of our lives while others say it is negative. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience.",
  "In some countries children have very strict rules of behavior, in other countries they are allowed to do almost anything they want. To what extent should children have to follow rules?",
  "Do you agree or disagree with the following statement? Parents are the best teachers. Use specific reasons and examples to support your answer.",
  "The number of overweight children in developed countries is increasing. Some people think this is due to problems such as the growing number of fast food outlets. Others believe that parents are to blame for not looking after their children's health. To what extent do you agree with these views?",
  "Some people think that a sense of competition in children should be encouraged. Others believe that children who are taught to co-operate rather than compete become more useful adults. Discuss both these views and give your own opinion."
];

const WritingEditor = ({ onSubmissionComplete }: WritingEditorProps) => {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState<string>('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  // Initialize with first question
  useEffect(() => {
    setQuestion(ieltsQuestions[0]);
  }, []);

  const getNewQuestion = () => {
    // Get next question in rotation
    const nextIndex = (currentQuestionIndex + 1) % ieltsQuestions.length;
    setCurrentQuestionIndex(nextIndex);
    setQuestion(ieltsQuestions[nextIndex]);
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
      const messages = createDeepSeekPrompt(text, 'IELTS');
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
        scoringSystem: 'IELTS',
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
          IELTS Writing Practice
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
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
            placeholder="Start writing your IELTS essay here. Write at least 50 words for meaningful analysis..."
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
