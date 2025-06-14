
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart3, Edit3, Lightbulb, Download, RefreshCw } from "lucide-react";
import { WritingSubmission } from "@/pages/Index";

interface FeedbackDisplayProps {
  submission: WritingSubmission;
  onNewWriting: () => void;
}

const FeedbackDisplay = ({ submission, onNewWriting }: FeedbackDisplayProps) => {
  const [activeView, setActiveView] = useState("score");

  const formatTextWithMarkings = (text: string, type: 'errors' | 'improvements') => {
    if (type === 'errors') {
      // Format error markings: [mistake]{ErrorType: Explanation}
      return text.split(/(\[[^\]]+\]\{[^}]+\})/).map((part, index) => {
        const errorMatch = part.match(/\[([^\]]+)\]\{([^}]+)\}/);
        if (errorMatch) {
          const [, mistake, explanation] = errorMatch;
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="bg-red-100 border-2 border-red-300 rounded px-1 cursor-help text-red-800">
                    {mistake}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }
        return <span key={index}>{part}</span>;
      });
    } else {
      // Format improvements: [+added+], [~removed~]
      return text.split(/(\[[+~][^[\]]*[+~]\])/).map((part, index) => {
        if (part.match(/\[\+[^[\]]*\+\]/)) {
          const word = part.slice(2, -2);
          return (
            <span key={index} className="bg-green-100 text-green-800 px-1 rounded">
              {word}
            </span>
          );
        }
        if (part.match(/\[~[^[\]]*~\]/)) {
          const word = part.slice(2, -2);
          return (
            <span key={index} className="bg-red-100 text-red-800 line-through px-1 rounded">
              {word}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      });
    }
  };

  const downloadFeedback = () => {
    const content = `
Writing Analysis Report
Generated on: ${submission.timestamp.toLocaleDateString()}
Scoring System: ${submission.scoringSystem}

SCORE: ${submission.feedback?.score}

EXPLANATION:
${submission.feedback?.explanation}

ORIGINAL TEXT:
${submission.text}

FEEDBACK:
${submission.feedback?.markedErrors}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `writing-feedback-${submission.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!submission.feedback) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 mb-4">Loading feedback...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Writing Analysis</h2>
          <p className="text-gray-500">
            {submission.scoringSystem} • {submission.timestamp.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadFeedback}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={onNewWriting}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Writing
          </Button>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="score" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Score
          </TabsTrigger>
          <TabsTrigger value="errors" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Errors
          </TabsTrigger>
          <TabsTrigger value="improvements" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Improvements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="score" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Score
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {submission.feedback.score}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {submission.feedback.explanation}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Original Text</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {submission.text}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Error Analysis</CardTitle>
              <p className="text-sm text-gray-500">
                Hover over highlighted words to see explanations
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {formatTextWithMarkings(submission.feedback.markedErrors, 'errors')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="improvements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Improvements</CardTitle>
              <p className="text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                  Green: Added words
                </span>
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs line-through">
                  Red: Words to replace
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-800 leading-relaxed">
                  {formatTextWithMarkings(submission.feedback.improvedText, 'improvements')}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackDisplay;
