import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, BookOpen, History, FileText, Loader2 } from "lucide-react";
import WritingEditor from "@/components/WritingEditor";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import WritingHistory from "@/components/WritingHistory";
import SamplePrompts from "@/components/SamplePrompts";
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

export interface WritingSubmission {
  id: string;
  text: string;
  scoringSystem: 'IELTS';
  timestamp: Date;
  feedback?: AIFeedback;
  question?: string;
}

export interface AIFeedback {
  score: string;
  explanation: string;
  lineByLineAnalysis: string;
  markedErrors: string;
  improvedText: string;
  band9Version: string;
}

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentSubmission, setCurrentSubmission] = useState<WritingSubmission | null>(null);
  const [activeTab, setActiveTab] = useState("write");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/auth');
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleSubmissionComplete = (submission: WritingSubmission) => {
    setCurrentSubmission(submission);
    setActiveTab("feedback");
  };

  const handleNewWriting = () => {
    setCurrentSubmission(null);
    setActiveTab("write");
  };

  const handleChooseQuestion = () => {
    setActiveTab("samples");
  };

  const handleQuestionSelected = () => {
    setActiveTab("write");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 relative">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Writing Coach
          </h1>
          <p className="text-xl text-gray-600">
            Improve your IELTS writing with AI-powered scoring
          </p>
        </header>

        {session && (
          <div className="absolute top-8 right-4 flex items-center gap-4">
            <span className="text-sm text-gray-700 hidden sm:inline">{session.user.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="samples" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <Card className="p-6">
              <WritingEditor 
                onSubmissionComplete={handleSubmissionComplete} 
                onChooseQuestion={handleChooseQuestion}
              />
            </Card>
          </TabsContent>

          <TabsContent value="feedback">
            {currentSubmission ? (
              <FeedbackDisplay 
                submission={currentSubmission} 
                onNewWriting={handleNewWriting}
              />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-500 mb-4">No feedback available yet.</p>
                <Button onClick={() => setActiveTab("write")}>
                  Start Writing
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history">
            <WritingHistory onSelectSubmission={(submission) => {
              setCurrentSubmission(submission);
              setActiveTab("feedback");
            }} />
          </TabsContent>

          <TabsContent value="samples">
            <SamplePrompts onSelectPrompt={handleQuestionSelected} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
