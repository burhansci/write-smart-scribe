
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { List, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Lightbulb, Target, ArrowRight } from "lucide-react";

interface LineByLineAnalysisProps {
  originalText: string;
  lineByLineAnalysis: string;
}

interface DetailedIssue {
  type: string;
  phrase: string;
  explanation: string;
}

interface DetailedSuggestion {
  original: string;
  replacement: string;
  reason: string;
}

interface LineAnalysis {
  lineNumber: number;
  sentence: string;
  detailedIssues: DetailedIssue[];
  detailedSuggestions: DetailedSuggestion[];
  priority: 'High' | 'Medium' | 'Low';
  categories: string[];
}

const LineByLineAnalysis = ({ originalText, lineByLineAnalysis }: LineByLineAnalysisProps) => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);

  const parseDetailedLineAnalysis = (): LineAnalysis[] => {
    const lines: LineAnalysis[] = [];
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('Parsing line-by-line analysis:', lineByLineAnalysis);
    
    // Enhanced parsing for the new detailed format
    const lineBlocks = lineByLineAnalysis.split(/Line \d+:/);
    
    sentences.forEach((sentence, index) => {
      const lineNumber = index + 1;
      const lineBlock = lineBlocks.find(block => 
        block.includes(`"${sentence.trim()}"`) || 
        block.includes(sentence.trim().substring(0, 30))
      );
      
      let detailedIssues: DetailedIssue[] = [];
      let detailedSuggestions: DetailedSuggestion[] = [];
      let priority: 'High' | 'Medium' | 'Low' = 'Low';
      
      if (lineBlock) {
        // Parse specific issues
        const issuesMatch = lineBlock.match(/Specific Issues:(.*?)(?=Specific Suggestions:|Priority:|$)/s);
        if (issuesMatch) {
          const issuesText = issuesMatch[1];
          const issueMatches = [...issuesText.matchAll(/•\s*([^:]+):\s*"([^"]+)"\s*→\s*Issue:\s*([^\n•]+)/g)];
          
          detailedIssues = issueMatches.map(match => ({
            type: match[1].trim(),
            phrase: match[2].trim(),
            explanation: match[3].trim()
          }));
        }
        
        // Parse specific suggestions
        const suggestionsMatch = lineBlock.match(/Specific Suggestions:(.*?)(?=Priority:|$)/s);
        if (suggestionsMatch) {
          const suggestionsText = suggestionsMatch[1];
          const suggestionMatches = [...suggestionsText.matchAll(/•\s*(?:Replace|Change)\s*"([^"]+)"\s*(?:with|to)\s*"([^"]+)"\s*→\s*Reason:\s*([^\n•]+)/g)];
          
          detailedSuggestions = suggestionMatches.map(match => ({
            original: match[1].trim(),
            replacement: match[2].trim(),
            reason: match[3].trim()
          }));
        }
        
        // Parse priority
        const priorityMatch = lineBlock.match(/Priority:\s*(\w+)/);
        if (priorityMatch) {
          priority = priorityMatch[1] as 'High' | 'Medium' | 'Low';
        }
      }
      
      // Fallback analysis for sentences without detailed AI feedback
      if (detailedIssues.length === 0 && detailedSuggestions.length === 0) {
        const basicIssues = analyzeBasicIssues(sentence.trim());
        detailedIssues = basicIssues.issues;
        detailedSuggestions = basicIssues.suggestions;
      }
      
      const categories = extractCategories(detailedIssues.map(i => i.type).join(', '));
      
      lines.push({
        lineNumber,
        sentence: sentence.trim(),
        detailedIssues,
        detailedSuggestions,
        priority,
        categories
      });
    });
    
    return lines;
  };

  const analyzeBasicIssues = (sentence: string) => {
    const issues: DetailedIssue[] = [];
    const suggestions: DetailedSuggestion[] = [];
    
    // Basic analysis when AI doesn't provide detailed feedback
    if (sentence.includes(' very ')) {
      issues.push({
        type: 'Word Choice',
        phrase: 'very',
        explanation: 'Overused intensifier in academic writing'
      });
      suggestions.push({
        original: 'very',
        replacement: 'significantly/considerably/extremely',
        reason: 'More sophisticated vocabulary for academic writing'
      });
    }
    
    if (sentence.includes(' alot ')) {
      issues.push({
        type: 'Spelling',
        phrase: 'alot',
        explanation: 'Incorrect spelling of "a lot"'
      });
      suggestions.push({
        original: 'alot',
        replacement: 'a lot',
        reason: 'Correct spelling improves accuracy'
      });
    }
    
    if (sentence.match(/\b(don't|can't|won't|isn't|aren't)\b/)) {
      const contraction = sentence.match(/\b(don't|can't|won't|isn't|aren't)\b/)?.[0] || '';
      issues.push({
        type: 'Style',
        phrase: contraction,
        explanation: 'Contractions are too informal for academic writing'
      });
    }
    
    return { issues, suggestions };
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

  const highlightIssues = (sentence: string, issues: DetailedIssue[]) => {
    let highlightedSentence = sentence;
    
    issues.forEach(issue => {
      const regex = new RegExp(`\\b${issue.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlightedSentence = highlightedSentence.replace(
        regex, 
        `<mark class="bg-red-200 px-1 rounded">${issue.phrase}</mark>`
      );
    });
    
    return highlightedSentence;
  };

  const lines = parseDetailedLineAnalysis();
  const totalIssues = lines.reduce((sum, line) => sum + line.detailedIssues.length, 0);
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
                      {line.detailedIssues.length > 0 && (
                        <>
                          <Badge className={getPriorityColor(line.priority)}>
                            {line.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {line.detailedIssues.length} issue{line.detailedIssues.length !== 1 ? 's' : ''}
                          </span>
                        </>
                      )}
                      {line.detailedIssues.length === 0 && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <span 
                        dangerouslySetInnerHTML={{ 
                          __html: `"${highlightIssues(line.sentence, line.detailedIssues)}"` 
                        }} 
                      />
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
              {line.detailedIssues.length > 0 && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-red-800">Specific Issues Found</span>
                  </div>
                  <div className="space-y-2">
                    {line.detailedIssues.map((issue, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-red-100 text-red-700 text-xs">
                            {issue.type}
                          </Badge>
                          <code className="bg-red-100 text-red-800 px-1 rounded text-xs">
                            "{issue.phrase}"
                          </code>
                        </div>
                        <p className="text-sm text-red-700">{issue.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {line.detailedSuggestions.length > 0 && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-800">Specific Suggestions</span>
                  </div>
                  <div className="space-y-2">
                    {line.detailedSuggestions.map((suggestion, idx) => (
                      <div key={idx} className="bg-white p-2 rounded border border-green-200">
                        <div className="flex items-center gap-2 mb-1 text-sm">
                          <code className="bg-red-100 text-red-800 px-1 rounded text-xs">
                            "{suggestion.original}"
                          </code>
                          <ArrowRight className="w-3 h-3 text-gray-500" />
                          <code className="bg-green-100 text-green-800 px-1 rounded text-xs">
                            "{suggestion.replacement}"
                          </code>
                        </div>
                        <p className="text-sm text-green-700">{suggestion.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {line.detailedIssues.length === 0 && line.detailedSuggestions.length === 0 && (
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
