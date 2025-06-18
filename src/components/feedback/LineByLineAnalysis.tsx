
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { List, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Lightbulb } from "lucide-react";

interface LineByLineAnalysisProps {
  originalText: string;
  lineByLineAnalysis: string;
}

interface LineAnalysis {
  lineNumber: number;
  sentence: string;
  issues: string;
  suggestions: string;
  hasIssues: boolean;
}

const LineByLineAnalysis = ({ originalText, lineByLineAnalysis }: LineByLineAnalysisProps) => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);

  const parseSimpleLineAnalysis = (): LineAnalysis[] => {
    const lines: LineAnalysis[] = [];
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('Parsing line analysis:', lineByLineAnalysis);
    
    sentences.forEach((sentence, index) => {
      const lineNumber = index + 1;
      let issues = '';
      let suggestions = '';
      let hasIssues = false;
      
      // Look for this line's analysis in the AI response
      const linePattern = new RegExp(`Line ${lineNumber}:.*?(?=Line ${lineNumber + 1}:|$)`, 's');
      const lineMatch = lineByLineAnalysis.match(linePattern);
      
      if (lineMatch) {
        const lineContent = lineMatch[0];
        
        // Extract issues
        const issuesMatch = lineContent.match(/Issues:\s*([^\n]*(?:\n(?!Suggestions:)[^\n]*)*)/);
        if (issuesMatch) {
          issues = issuesMatch[1].trim();
          hasIssues = issues.length > 0 && !issues.toLowerCase().includes('no issues');
        }
        
        // Extract suggestions
        const suggestionsMatch = lineContent.match(/Suggestions:\s*([^\n]*(?:\n(?!Line \d+:)[^\n]*)*)/);
        if (suggestionsMatch) {
          suggestions = suggestionsMatch[1].trim();
        }
      }
      
      // Fallback basic analysis if no AI analysis found
      if (!issues && !suggestions) {
        if (sentence.includes(' very ')) {
          issues = 'Overuse of "very" - consider stronger adjectives';
          suggestions = 'Replace "very" with more sophisticated vocabulary';
          hasIssues = true;
        } else if (sentence.includes("don't") || sentence.includes("can't")) {
          issues = 'Contractions are too informal for academic writing';
          suggestions = 'Use full forms (do not, cannot) for formal tone';
          hasIssues = true;
        }
      }
      
      lines.push({
        lineNumber,
        sentence: sentence.trim(),
        issues: issues || 'No specific issues identified',
        suggestions: suggestions || 'Sentence structure is acceptable',
        hasIssues
      });
    });
    
    return lines;
  };

  const toggleLine = (lineNumber: number) => {
    setExpandedLines(prev => 
      prev.includes(lineNumber) 
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const lines = parseSimpleLineAnalysis();
  const totalIssues = lines.filter(line => line.hasIssues).length;

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
            {totalIssues} issues found
          </Badge>
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
                      {line.hasIssues ? (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-700 leading-relaxed">
                      "{line.sentence}"
                    </div>
                  </div>
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="pl-7 pr-3 pb-3 space-y-3">
              {line.hasIssues && (
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-800">Issues Found</span>
                  </div>
                  <p className="text-sm text-orange-700">{line.issues}</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Suggestions</span>
                </div>
                <p className="text-sm text-blue-700">{line.suggestions}</p>
              </div>
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
