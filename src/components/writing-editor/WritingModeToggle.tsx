
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool } from "lucide-react";

interface WritingModeToggleProps {
  writingMode: 'question' | 'free';
  onModeChange: (mode: 'question' | 'free') => void;
}

const WritingModeToggle = ({ writingMode, onModeChange }: WritingModeToggleProps) => {
  return (
    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
      <Button
        type="button"
        variant={writingMode === 'question' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('question')}
        className="flex-1"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        Choose Question
      </Button>
      <Button
        type="button"
        variant={writingMode === 'free' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('free')}
        className="flex-1"
      >
        <PenTool className="w-4 h-4 mr-2" />
        Free Writing
      </Button>
    </div>
  );
};

export default WritingModeToggle;
