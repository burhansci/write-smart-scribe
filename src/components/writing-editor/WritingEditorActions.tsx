
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface WritingEditorActionsProps {
  isAnalyzing: boolean;
  wordCount: number;
  writingMode: 'question' | 'free';
  question: string;
  onAnalyze: () => void;
}

const WritingEditorActions = ({ isAnalyzing, wordCount, writingMode, question, onAnalyze }: WritingEditorActionsProps) => {
  const isButtonDisabled = isAnalyzing || wordCount < 1 || (writingMode === 'question' && !question);

  return (
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-500">
        Minimum 50 words recommended for analysis
      </p>
      <Button 
        onClick={onAnalyze} 
        disabled={isButtonDisabled}
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
  );
};

export default WritingEditorActions;
