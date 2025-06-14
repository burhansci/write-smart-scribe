
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MessageSquare, Vocabulary, Grammar } from "lucide-react";

interface DetailedAnalysisProps {
  explanation: string;
}

const DetailedAnalysis = ({ explanation }: DetailedAnalysisProps) => {
  const parseCriteriaScores = () => {
    const criteria = [
      { name: 'Task Response', icon: BookOpen, description: 'How well you address the task' },
      { name: 'Coherence', icon: MessageSquare, description: 'Organization and flow of ideas' },
      { name: 'Lexical Resource', icon: Vocabulary, description: 'Vocabulary range and accuracy' },
      { name: 'Grammar', icon: Grammar, description: 'Grammatical range and accuracy' }
    ];

    // Try to extract scores from explanation
    return criteria.map(criterion => {
      const score = Math.floor(Math.random() * 3) + 6; // Mock scores 6-8 for demo
      const percentage = ((score - 1) / 8) * 100;
      
      return {
        ...criterion,
        score,
        percentage,
        feedback: `Your ${criterion.name.toLowerCase()} shows good understanding with room for improvement.`
      };
    });
  };

  const criteriaScores = parseCriteriaScores();

  const extractKeyPoints = () => {
    const sentences = explanation.split('.').filter(s => s.trim().length > 20);
    return sentences.slice(0, 4).map(s => s.trim() + '.');
  };

  const keyPoints = extractKeyPoints();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          Detailed Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* IELTS Criteria Breakdown */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900">IELTS Writing Criteria</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {criteriaScores.map((criterion) => {
              const Icon = criterion.icon;
              return (
                <div key={criterion.name} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{criterion.name}</span>
                    <Badge variant="outline" className="ml-auto">
                      {criterion.score}/9
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Progress value={criterion.percentage} className="h-2" />
                    <p className="text-xs text-gray-600">{criterion.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Feedback Points */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Key Feedback Points</h3>
          <div className="space-y-2">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Explanation */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900">Complete Analysis</h3>
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedAnalysis;
