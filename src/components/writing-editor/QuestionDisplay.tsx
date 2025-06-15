
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BookOpen } from "lucide-react";

interface QuestionDisplayProps {
  question: string;
  onChooseQuestion: () => void;
}

const QuestionDisplay = ({ question, onChooseQuestion }: QuestionDisplayProps) => {
  if (!question) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Choose a Writing Prompt</h3>
        <p className="text-gray-500 mb-4">Select a question from our sample prompts to get started</p>
        <Button onClick={onChooseQuestion} className="bg-blue-600 hover:bg-blue-700">
          <BookOpen className="w-4 h-4 mr-2" />
          Choose Question
        </Button>
      </div>
    );
  }

  return (
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
  );
};

export default QuestionDisplay;
