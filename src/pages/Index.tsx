
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenTool, BookOpen, History, FileText } from "lucide-react";
import WritingEditor from "@/components/WritingEditor";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import WritingHistory from "@/components/WritingHistory";
import SamplePrompts from "@/components/SamplePrompts";

export interface WritingSubmission {
  id: string;
  text: string;
  scoringSystem: 'IELTS' | 'GRE';
  timestamp: Date;
  feedback?: AIFeedback;
}

export interface AIFeedback {
  score: string;
  explanation: string;
  markedErrors: string;
  improvedText: string;
}

const Index = () => {
  const [currentSubmission, setCurrentSubmission] = useState<WritingSubmission | null>(null);
  const [activeTab, setActiveTab] = useState("write");

  const handleSubmissionComplete = (submission: WritingSubmission) => {
    setCurrentSubmission(submission);
    setActiveTab("feedback");
  };

  const handleNewWriting = () => {
    setCurrentSubmission(null);
    setActiveTab("write");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Writing Coach
          </h1>
          <p className="text-xl text-gray-600">
            Improve your writing with AI-powered IELTS & GRE scoring
          </p>
        </header>

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
              Samples
            </TabsTrigger>
          </TabsList>

          <TabsContent value="write">
            <Card className="p-6">
              <WritingEditor onSubmissionComplete={handleSubmissionComplete} />
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
            <SamplePrompts onSelectPrompt={() => setActiveTab("write")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
