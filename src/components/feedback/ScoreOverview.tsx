
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp } from "lucide-react";
import { AIFeedback } from "@/pages/Index";

interface ScoreOverviewProps {
  feedback: AIFeedback;
}

const ScoreOverview = ({ feedback }: ScoreOverviewProps) => {
  const overallScore = parseFloat(feedback.score) || 0;
  const scorePercentage = (overallScore / 9) * 100;

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <BarChart3 className="w-5 h-5" />
          Your IELTS Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-900">{feedback.score}</div>
            <div className="text-sm text-blue-600">Overall Band Score</div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-lg px-4 py-2">
            Band {feedback.score}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress to Band 9</span>
            <span className="text-gray-800">{Math.round(scorePercentage)}%</span>
          </div>
          <Progress value={scorePercentage} className="h-2" />
        </div>

        <div className="bg-white rounded-lg p-3 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Next Target</span>
          </div>
          <p className="text-sm text-gray-600">
            Aim for Band {Math.ceil(overallScore)} by focusing on vocabulary range and grammatical accuracy.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreOverview;
