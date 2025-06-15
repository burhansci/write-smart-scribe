
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Copy, ExternalLink, Search, Check, Loader2, Database, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SamplePromptsProps {
  onSelectPrompt: () => void;
}

interface SampleQuestion {
  id: string;
  category: string;
  question: string;
  title: string | null;
  time_limit: string | null;
  word_count: string | null;
}

const fetchSampleQuestions = async (): Promise<SampleQuestion[]> => {
  const { data, error } = await supabase
    .from('sample_questions')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching sample questions:", error);
    throw new Error(error.message);
  }
  return data || [];
};

const SamplePrompts = ({ onSelectPrompt }: SamplePromptsProps) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [isSeeding, setIsSeeding] = useState(false);

  const categories = ['ALL', 'Education', 'Environment', 'Technology', 'Media', 'Advertisement', 'Children', 'Young People', 'Old People', 'Social Issues', 'Family', 'Culture', 'Drugs', 'Health', 'Foreign Language', 'Ethical Issues', 'Building', 'Lifestyle', 'Others'];

  const { data: rawPrompts = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['sampleQuestions'],
    queryFn: fetchSampleQuestions,
  });

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error loading questions",
        description: "Could not fetch sample questions from the database.",
        variant: "destructive",
      });
    }
  }, [isError]);

  // Load used questions from localStorage
  useEffect(() => {
    const loadUsedQuestions = () => {
      const used = JSON.parse(localStorage.getItem('usedQuestions') || '[]');
      setUsedQuestions(used);
    };

    loadUsedQuestions();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadUsedQuestions();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const handleSeedQuestions = async (clear = false) => {
    setIsSeeding(true);
    toast({
      title: "Seeding in progress...",
      description: "Populating the database with sample questions. Please wait.",
    });
    try {
      const { data, error } = await supabase.functions.invoke('seed-questions', {
        body: { clear },
      });

      if (error) throw new Error(error.message);

      if (data.error) throw new Error(data.error);
      
      toast({
        title: "Success!",
        description: data.message,
      });
      refetch(); // Refetch the questions
    } catch (error: any) {
      toast({
        title: "Seeding failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const prompts = rawPrompts.map(prompt => ({
    id: prompt.id,
    category: prompt.category,
    title: prompt.title || 'Untitled Question',
    prompt: prompt.question,
    timeLimit: prompt.time_limit || '40 minutes',
    wordCount: prompt.word_count || '250+ words',
  }));

  const filteredPrompts = prompts.filter(prompt => {
    const matchesCategory = filter === 'ALL' || prompt.category === filter;
    const matchesSearch = searchTerm === '' || 
      prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prompt.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  const usePrompt = (prompt: string) => {
    localStorage.setItem('selectedPrompt', prompt);
    onSelectPrompt();
    toast({
      title: "Question Selected",
      description: "Question has been selected. Start writing your essay!",
    });
  };

  const isQuestionUsed = (question: string) => {
    return usedQuestions.includes(question);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="mt-4 text-gray-500">Loading questions...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <h3 className="text-lg font-semibold text-red-600">Error</h3>
        <p className="text-gray-500">Could not load sample questions. Please try again later.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">IELTS Writing Questions</h2>
          <div className="text-sm text-gray-500">
            {filteredPrompts.length} questions available • {usedQuestions.length} completed
          </div>
        </div>

        <Card className="p-4 bg-gray-50 border">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h3 className="font-semibold">Database Actions</h3>
                    <p className="text-sm text-gray-600">Populate the database with sample questions.</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Button onClick={() => handleSeedQuestions(false)} disabled={isSeeding} size="sm">
                        {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
                        Seed Questions
                    </Button>
                    <Button variant="outline" onClick={() => handleSeedQuestions(true)} disabled={isSeeding} size="sm">
                        {isSeeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2"/>}
                        Reset & Seed
                    </Button>
                </div>
            </div>
        </Card>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search questions by title, content, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(category)}
              className="text-xs"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPrompts.map((prompt) => {
          const isUsed = isQuestionUsed(prompt.prompt);
          
          return (
            <Card key={prompt.id} className={`hover:shadow-md transition-shadow ${isUsed ? 'bg-green-50 border-green-200' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2 flex items-center gap-2">
                      <Badge variant="default" className="mr-2">
                        {prompt.category}
                      </Badge>
                      {prompt.title}
                      {isUsed && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-xs font-normal">Completed</span>
                        </div>
                      )}
                    </CardTitle>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>⏰ {prompt.timeLimit}</span>
                      <span>📝 {prompt.wordCount}</span>
                    </div>
                  </div>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {prompt.prompt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={isUsed ? "outline" : "default"}
                    onClick={() => usePrompt(prompt.prompt)}
                    className="flex-1"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {isUsed ? "Practice Again" : "Use This Question"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyPrompt(prompt.prompt)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrompts.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No questions found matching your search or no questions in the database.</p>
          <Button onClick={() => { setSearchTerm(''); setFilter('ALL'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Practice with these IELTS questions to improve your writing skills.</p>
        <p>Questions you've completed will be marked with a green checkmark!</p>
      </div>
    </div>
  );
};

export default SamplePrompts;
