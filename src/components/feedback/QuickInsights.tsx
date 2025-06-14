
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, AlertTriangle, CheckCircle, Target } from "lucide-react";
import { AIFeedback } from "@/pages/Index";

interface QuickInsightsProps {
  feedback: AIFeedback;
}

const QuickInsights = ({ feedback }: QuickInsightsProps) => {
  const score = parseFloat(feedback.score) || 0;
  const nextBand = Math.ceil(score);
  const progress = ((score - Math.floor(score)) * 100);

  // Extract key insights from feedback
  const extractKeyInsights = () => {
    const insights = [];
    
    if (score < 6.0) {
      insights.push({
        type: 'critical',
        icon: AlertTriangle,
        title: 'Focus on Basic Structure',
        description: 'Work on clear paragraphs and basic sentence formation',
        color: 'red'
      });
    } else if (score < 7.0) {
      insights.push({
        type: 'improvement',
        icon: TrendingUp,
        title: 'Enhance Vocabulary',
        description: 'Use more varied and sophisticated vocabulary',
        color: 'orange'
      });
    } else {
      insights.push({
        type: 'good',
        icon: CheckCircle,
        title: 'Strong Foundation',
        description: 'Focus on advanced grammar and complex ideas',
        color: 'green'
      });
    }

    // Add specific improvement based on common patterns
    insights.push({
      type: 'target',
      icon: Target,
      title: `Target Band ${nextBand}`,
      description: `You're ${((nextBand - score) * 100).toFixed(0)}% away from the next band`,
      color: 'blue'
    });

    return insights;
  };

  const insights = extractKeyInsights();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Current Score Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Current Band</p>
              <p className="text-2xl font-bold text-blue-900">{feedback.score}</p>
            </div>
            <div className="text-blue-500">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-blue-600 mb-1">
              <span>Band {Math.floor(score)}</span>
              <span>Band {nextBand}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        const colorClasses = {
          red: 'from-red-50 to-red-100 border-red-200 text-red-600',
          orange: 'from-orange-50 to-orange-100 border-orange-200 text-orange-600',
          green: 'from-green-50 to-green-100 border-green-200 text-green-600',
          blue: 'from-blue-50 to-blue-100 border-blue-200 text-blue-600'
        };

        return (
          <Card key={index} className={`bg-gradient-to-br ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs opacity-80 mt-1">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickInsights;
