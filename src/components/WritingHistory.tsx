
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, Calendar, HelpCircle, Loader2 } from "lucide-react";
import { WritingSubmission } from "@/pages/Index";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface WritingHistoryProps {
  onSelectSubmission: (submission: WritingSubmission) => void;
}

const WritingHistory = ({ onSelectSubmission }: WritingHistoryProps) => {
  const [submissions, setSubmissions] = useState<WritingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('writing_submissions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching submissions:', error);
          toast({ title: "Error", description: "Could not fetch writing history.", variant: "destructive" });
        } else if (data) {
          const parsedSubmissions: WritingSubmission[] = data.map((sub: any) => ({
            id: sub.id,
            text: sub.text,
            scoringSystem: 'IELTS',
            timestamp: new Date(sub.created_at),
            question: sub.question,
            feedback: {
              score: sub.score,
              explanation: sub.explanation,
              lineByLineAnalysis: sub.line_by_line_analysis,
              markedErrors: sub.marked_errors,
              improvedText: sub.improved_text,
              band9Version: sub.band9_version,
            }
          }));
          setSubmissions(parsedSubmissions);
        }
      }
      setLoading(false);
    };

    fetchSubmissions();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchSubmissions();
      }
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const deleteSubmission = async (id: string) => {
    const originalSubmissions = [...submissions];
    const updatedSubmissions = submissions.filter(sub => sub.id !== id);
    setSubmissions(updatedSubmissions);

    const { error } = await supabase
      .from('writing_submissions')
      .delete()
      .match({ id });

    if (error) {
      console.error('Error deleting submission:', error);
      toast({ title: "Error", description: "Could not delete submission.", variant: "destructive" });
      setSubmissions(originalSubmissions);
    }
  };

  const clearAllHistory = async () => {
    const originalSubmissions = [...submissions];
    setSubmissions([]);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from('writing_submissions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing history:', error);
        toast({ title: "Error", description: "Could not clear history.", variant: "destructive" });
        setSubmissions(originalSubmissions);
      }
    }
  };

  if (loading) {
    return <Card className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" /></Card>;
  }

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
                  {submission.question && (
                    <div className="mt-2 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700 italic line-clamp-2">
                        {submission.question}
                      </p>
                    </div>
                  )}
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
