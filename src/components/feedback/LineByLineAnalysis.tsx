
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { List, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Lightbulb, Target } from "lucide-react";

interface LineByLineAnalysisProps {
  originalText: string;
  lineByLineAnalysis: string;
}

interface LineAnalysis {
  lineNumber: number;
  sentence: string;
  issues: string[];
  suggestions: string[];
  priority: 'High' | 'Medium' | 'Low';
  categories: string[];
}

const LineByLineAnalysis = ({ originalText, lineByLineAnalysis }: LineByLineAnalysisProps) => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);

  const parseLineByLineAnalysis = (): LineAnalysis[] => {
    const lines: LineAnalysis[] = [];
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Parse the AI response for line-by-line feedback
    const lineMatches = [...lineByLineAnalysis.matchAll(/Line (\d+):\s*"([^"]+)"\s*Issues:\s*([^\n]+)\s*Suggestions:\s*([^\n]+)\s*Priority:\s*(\w+)/g)];
    
    sentences.forEach((sentence, index) => {
      const lineNumber = index + 1;
      const aiAnalysis = lineMatches.find(match => parseInt(match[1]) === lineNumber);
      
      if (aiAnalysis) {
        const [, , , issues, suggestions, priority] = aiAnalysis;
        lines.push({
          lineNumber,
          sentence: sentence.trim(),
          issues: issues.split(',').map(i => i.trim()),
          suggestions: suggestions.split(',').map(s => s.trim()),
          priority: priority as 'High' | 'Medium' | 'Low',
          categories: extractCategories(issues)
        });
      } else {
        // Fallback for sentences without AI analysis
        lines.push({
          lineNumber,
          sentence: sentence.trim(),
          issues: [],
          suggestions: [],
          priority: 'Low',
          categories: []
        });
      }
    });
    
    return lines;
  };

  const extractCategories = (issues: string): string[] => {
    const categories = [];
    const issuesLower = issues.toLowerCase();
    
    if (issuesLower.includes('vocabulary') || issuesLower.includes('word choice')) categories.push('Vocabulary');
    if (issuesLower.includes('grammar') || issuesLower.includes('tense')) categories.push('Grammar');
    if (issuesLower.includes('spelling')) categories.push('Spelling');
    if (issuesLower.includes('punctuation')) categories.push('Punctuation');
    if (issuesLower.includes('phrasing') || issuesLower.includes('clarity')) categories.push('Phrasing');
    if (issuesLower.includes('style') || issuesLower.includes('tone')) categories.push('Style');
    
    return categories;
  };

  const toggleLine = (lineNumber: number) => {
    setExpandedLines(prev => 
      prev.includes(lineNumber) 
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Vocabulary': 'bg-blue-100 text-blue-800',
      'Grammar': 'bg-red-100 text-red-800',
      'Spelling': 'bg-yellow-100 text-yellow-800',
      'Punctuation': 'bg-purple-100 text-purple-800',
      'Phrasing': 'bg-indigo-100 text-indigo-800',
      'Style': 'bg-pink-100 text-pink-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const lines = parseLineByLineAnalysis();
  const totalIssues = lines.reduce((sum, line) => sum + line.issues.length, 0);
  const highPriorityIssues = lines.filter(line => line.priority === 'High').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" />
          Line-by-Line Analysis
        </CardTitle>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {lines.length} sentences analyzed
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {totalIssues} total issues
          </Badge>
          {highPriorityIssues > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {highPriorityIssues} high priority
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {lines.map((line) => (
          <Collapsible 
            key={line.lineNumber}
            open={expandedLines.includes(line.lineNumber)}
            onOpenChange={() => toggleLine(line.lineNumber)}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start p-3 h-auto text-left hover:bg-gray-50"
              >
                <div className="flex items-start gap-3 w-full">
                  {expandedLines.includes(line.lineNumber) ? 
                    <ChevronDown className="w-4 h-4 mt-1 flex-shrink-0" /> : 
                    <ChevronRight className="w-4 h-4 mt-1 flex-shrink-0" />
                  }
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Line {line.lineNumber}
                      </span>
                      {line.issues.length > 0 && (
                        <>
                          <Badge className={getPriorityColor(line.priority)}>
                            {line.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {line.issues.length} issue{line.issues.length !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                      {line.issues.length === 0 && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 leading-relaxed">
                      "{line.sentence}"
                    </div>
                    
                    {line.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {line.categories.map((category, idx) => (
                          <Badge key={idx} variant="outline" className={`text-xs ${getCategoryColor(category)}`}>
                            {category}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pl-7 pr-3 pb-3 space-y-3">
              {line.issues.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Issues Found</span>
                  </div>
                  <ul className="space-y-1">
                    {line.issues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-700">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {line.suggestions.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Suggestions</span>
                  </div>
                  <ul className="space-y-1">
                    {line.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="text-sm text-green-700">• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {line.issues.length === 0 && line.suggestions.length === 0 && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <span className="text-sm text-green-700">This sentence looks good!</span>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {lines.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No line-by-line analysis available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LineByLineAnalysis;
