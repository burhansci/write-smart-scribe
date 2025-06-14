
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Calendar } from "lucide-react";
import { WritingSubmission } from "@/pages/Index";

interface WritingHistoryProps {
  onSelectSubmission: (submission: WritingSubmission) => void;
}

const WritingHistory = ({ onSelectSubmission }: WritingHistoryProps) => {
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);

  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('writingSubmissions') || '[]');
    // Convert timestamp strings back to Date objects
    const parsedSubmissions = savedSubmissions.map((sub: any) => ({
      ...sub,
      timestamp: new Date(sub.timestamp)
    }));
    setSubmissions(parsedSubmissions);
  }, []);

  const deleteSubmission = (id: string) => {
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem('writingSubmissions', JSON.stringify(updatedSubmissions));
  };

  const clearAllHistory = () => {
    setSubmissions([]);
    localStorage.removeItem('writingSubmissions');
  };

  if (submissions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-600">No Writing History</h3>
          <p className="text-gray-500">Your analyzed writings will appear here.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Writing History</h2>
        <Button variant="outline" onClick={clearAllHistory} className="text-red-600">
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    <Badge variant="outline" className="mr-2">
                      {submission.scoringSystem}
                    </Badge>
                    {submission.feedback?.score || 'Processing...'}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {submission.timestamp.toLocaleDateString()} at {submission.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectSubmission(submission)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSubmission(submission.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-gray-50 p-3 rounded text-sm">
                <p className="text-gray-700 line-clamp-3">
                  {submission.text.substring(0, 200)}
                  {submission.text.length > 200 && '...'}
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {submission.text.trim().split(/\s+/).length} words
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WritingHistory;
