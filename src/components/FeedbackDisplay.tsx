
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RefreshCw, BarChart3, AlertCircle, Lightbulb, FileText, Eye, EyeOff } from "lucide-react";
import { WritingSubmission } from "@/pages/Index";
import ScoreOverview from "@/components/feedback/ScoreOverview";
import ErrorHighlighter from "@/components/feedback/ErrorHighlighter";
import ImprovementSuggestions from "@/components/feedback/ImprovementSuggestions";
import DetailedAnalysis from "@/components/feedback/DetailedAnalysis";
import SideBySideComparison from "@/components/feedback/SideBySideComparison";
import QuickInsights from "@/components/feedback/QuickInsights";

interface FeedbackDisplayProps {
  submission: WritingSubmission;
  onNewWriting: () => void;
}

const FeedbackDisplay = ({ submission, onNewWriting }: FeedbackDisplayProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showComparison, setShowComparison] = useState(false);

  const downloadFeedback = () => {
    const content = `
IELTS Writing Analysis Report
Generated on: ${submission.timestamp.toLocaleDateString()}

SCORE: ${submission.feedback?.score}

QUESTION:
${submission.question || 'No specific question provided'}

ORIGINAL TEXT:
${submission.text}

ANALYSIS:
${submission.feedback?.explanation}

MARKED ERRORS:
${submission.feedback?.markedErrors}

IMPROVEMENTS:
${submission.feedback?.improvedText}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-feedback-${submission.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!submission.feedback) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-500">Analyzing your writing...</p>
          <p className="text-sm text-gray-400">This may take a moment</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Writing Analysis</h2>
          <p className="text-gray-500">
            IELTS Writing • {submission.timestamp.toLocaleDateString()}
          </p>
          {submission.question && (
            <p className="text-sm text-blue-600 mt-1 italic">
              "{submission.question.substring(0, 100)}..."
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowComparison(!showComparison)} 
            size="sm"
          >
            {showComparison ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showComparison ? 'Hide' : 'Show'} Comparison
          </Button>
          <Button variant="outline" onClick={downloadFeedback} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={onNewWriting}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Writing
          </Button>
        </div>
      </div>

      {/* Quick Insights - Always Visible */}
      <QuickInsights feedback={submission.feedback} />

      {/* Side-by-Side Comparison - Toggle */}
      {showComparison && (
        <SideBySideComparison 
          originalText={submission.text}
          improvedText={submission.feedback.improvedText}
          markedErrors={submission.feedback.markedErrors}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Errors</span>
          </TabsTrigger>
          <TabsTrigger value="improvements" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            <span className="hidden sm:inline">Improvements</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ScoreOverview feedback={submission.feedback} />
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Your Original Text</h3>
              <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {submission.text}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {submission.text.trim().split(/\s+/).length} words
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <ErrorHighlighter 
            originalText={submission.text}
            markedErrors={submission.feedback.markedErrors}
          />
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <ImprovementSuggestions improvedText={submission.feedback.improvedText} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <DetailedAnalysis explanation={submission.feedback.explanation} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackDisplay;
