
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
  issues: string;
  suggestions: string;
  hasIssues: boolean;
  severity: 'high' | 'medium' | 'low' | 'none';
}

const LineByLineAnalysis = ({ originalText, lineByLineAnalysis }: LineByLineAnalysisProps) => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);

  const parseDetailedLineAnalysis = (): LineAnalysis[] => {
    const lines: LineAnalysis[] = [];
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('Parsing detailed line analysis:', lineByLineAnalysis);
    
    sentences.forEach((sentence, index) => {
      const lineNumber = index + 1;
      let issues = '';
      let suggestions = '';
      let hasIssues = false;
      let severity: 'high' | 'medium' | 'low' | 'none' = 'none';
      
      // Look for this line's analysis in the AI response with more flexible matching
      const linePatterns = [
        new RegExp(`Line ${lineNumber}:.*?(?=Line ${lineNumber + 1}:|$)`, 's'),
        new RegExp(`${lineNumber}\\..*?(?=${lineNumber + 1}\\.|$)`, 's'),
        new RegExp(`Sentence ${lineNumber}:.*?(?=Sentence ${lineNumber + 1}:|$)`, 's')
      ];
      
      let lineMatch = null;
      for (const pattern of linePatterns) {
        lineMatch = lineByLineAnalysis.match(pattern);
        if (lineMatch) break;
      }
      
      if (lineMatch) {
        const lineContent = lineMatch[0];
        console.log(`Found analysis for line ${lineNumber}:`, lineContent);
        
        // Extract issues with multiple patterns
        const issuesPatterns = [
          /Issues:\s*([^\n]*(?:\n(?!Suggestions:)[^\n]*)*)/s,
          /Problems:\s*([^\n]*(?:\n(?!Suggestions:)[^\n]*)*)/s,
          /Errors:\s*([^\n]*(?:\n(?!Suggestions:)[^\n]*)*)/s
        ];
        
        for (const pattern of issuesPatterns) {
          const match = lineContent.match(pattern);
          if (match) {
            issues = match[1].trim();
            break;
          }
        }
        
        // Extract suggestions with multiple patterns
        const suggestionsPatterns = [
          /Suggestions:\s*([^\n]*(?:\n(?!Line \d+:|Sentence \d+:|\d+\.)[^\n]*)*)/s,
          /Improvements:\s*([^\n]*(?:\n(?!Line \d+:|Sentence \d+:|\d+\.)[^\n]*)*)/s,
          /Recommendations:\s*([^\n]*(?:\n(?!Line \d+:|Sentence \d+:|\d+\.)[^\n]*)*)/s
        ];
        
        for (const pattern of suggestionsPatterns) {
          const match = lineContent.match(pattern);
          if (match) {
            suggestions = match[1].trim();
            break;
          }
        }
      }
      
      // Determine if there are issues and their severity
      if (issues && issues.length > 0) {
        const lowerIssues = issues.toLowerCase();
        if (lowerIssues.includes('no issues') || lowerIssues.includes('no major issues') || lowerIssues.includes('acceptable')) {
          hasIssues = false;
          severity = 'none';
        } else if (lowerIssues.includes('grammar') || lowerIssues.includes('error') || lowerIssues.includes('incorrect')) {
          hasIssues = true;
          severity = 'high';
        } else if (lowerIssues.includes('awkward') || lowerIssues.includes('unclear') || lowerIssues.includes('weak')) {
          hasIssues = true;
          severity = 'medium';
        } else {
          hasIssues = true;
          severity = 'low';
        }
      }
      
      // Enhanced fallback analysis if no AI analysis found
      if (!issues && !suggestions) {
        console.log(`No AI analysis found for line ${lineNumber}, using enhanced fallback`);
        const analysisResult = performDetailedFallbackAnalysis(sentence.trim());
        issues = analysisResult.issues;
        suggestions = analysisResult.suggestions;
        hasIssues = analysisResult.hasIssues;
        severity = analysisResult.severity;
      }
      
      lines.push({
        lineNumber,
        sentence: sentence.trim(),
        issues: issues || 'No specific issues identified',
        suggestions: suggestions || 'Consider adding more sophisticated vocabulary or complex structures',
        hasIssues,
        severity
      });
    });
    
    return lines;
  };

  const performDetailedFallbackAnalysis = (sentence: string) => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let severity: 'high' | 'medium' | 'low' | 'none' = 'none';

    // Check for common IELTS issues
    if (sentence.includes(' very ')) {
      issues.push('Overuse of "very" - too basic for academic writing');
      suggestions.push('Replace "very" with more sophisticated intensifiers like "exceptionally", "remarkably", or use stronger adjectives');
      severity = 'medium';
    }

    if (sentence.match(/\b(good|bad|nice|big|small)\b/)) {
      issues.push('Basic vocabulary - not suitable for high band scores');
      suggestions.push('Use more precise vocabulary: excellent/outstanding, detrimental/adverse, substantial/significant, etc.');
      severity = 'medium';
    }

    if (sentence.includes("don't") || sentence.includes("can't") || sentence.includes("won't")) {
      issues.push('Contractions are too informal for IELTS academic writing');
      suggestions.push('Use full forms: do not, cannot, will not for formal academic tone');
      severity = 'high';
    }

    if (!sentence.match(/^[A-Z]/) && sentence.length > 3) {
      issues.push('Sentence should start with capital letter');
      suggestions.push('Begin sentence with proper capitalization');
      severity = 'high';
    }

    if (sentence.split(' ').length < 5) {
      issues.push('Very short sentence - may lack development');
      suggestions.push('Consider expanding with supporting details, examples, or complex structures');
      severity = 'low';
    }

    if (sentence.split(' ').length > 30) {
      issues.push('Very long sentence - may be difficult to follow');
      suggestions.push('Consider breaking into shorter, clearer sentences or using better punctuation');
      severity = 'medium';
    }

    if (!sentence.match(/\b(however|moreover|furthermore|nevertheless|consequently|therefore|thus|hence)\b/i) && sentence.length > 50) {
      issues.push('Missing cohesive devices for better flow');
      suggestions.push('Add linking words like "furthermore", "however", "consequently" to improve coherence');
      severity = 'low';
    }

    return {
      issues: issues.length > 0 ? issues.join('; ') : '',
      suggestions: suggestions.length > 0 ? suggestions.join('; ') : '',
      hasIssues: issues.length > 0,
      severity: issues.length > 0 ? severity : 'none' as const
    };
  };

  const toggleLine = (lineNumber: number) => {
    setExpandedLines(prev => 
      prev.includes(lineNumber) 
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const lines = parseDetailedLineAnalysis();
  const totalIssues = lines.filter(line => line.hasIssues).length;
  const highSeverityIssues = lines.filter(line => line.severity === 'high').length;
  const mediumSeverityIssues = lines.filter(line => line.severity === 'medium').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      case 'low': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getSeverityIcon = (severity: string, hasIssues: boolean) => {
    if (!hasIssues) return <CheckCircle className="w-4 h-4 text-green-500" />;
    
    switch (severity) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'medium': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'low': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" />
          Detailed Line-by-Line Analysis
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {lines.length} sentences analyzed
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {totalIssues} issues found
          </Badge>
          {highSeverityIssues > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {highSeverityIssues} critical
            </Badge>
          )}
          {mediumSeverityIssues > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {mediumSeverityIssues} moderate
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
                      {getSeverityIcon(line.severity, line.hasIssues)}
                      {line.hasIssues && (
                        <span className={`text-xs font-medium ${getSeverityColor(line.severity)}`}>
                          {line.severity.toUpperCase()}
                        </span>
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
                <div className={`${line.severity === 'high' ? 'bg-red-50 border-red-100' : line.severity === 'medium' ? 'bg-orange-50 border-orange-100' : 'bg-yellow-50 border-yellow-100'} p-3 rounded-lg border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className={`w-4 h-4 ${getSeverityColor(line.severity)}`} />
                    <span className={`font-medium ${getSeverityColor(line.severity).replace('text-', 'text-').replace('600', '800')}`}>
                      Issues Identified
                    </span>
                  </div>
                  <p className={`text-sm ${getSeverityColor(line.severity).replace('600', '700')}`}>
                    {line.issues}
                  </p>
                </div>
              )}
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Specific Suggestions</span>
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
