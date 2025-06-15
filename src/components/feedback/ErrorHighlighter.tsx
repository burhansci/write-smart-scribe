import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";

interface ErrorHighlighterProps {
  originalText: string;
  markedErrors: string;
}

interface ParsedError {
  text: string;
  type: string;
  explanation: string;
  startIndex: number;
  endIndex: number;
}

const ErrorHighlighter = ({ originalText, markedErrors }: ErrorHighlighterProps) => {
  const [showErrors, setShowErrors] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Grammar']);

  const parseErrors = (): ParsedError[] => {
    const errors: ParsedError[] = [];
    const errorRegex = /\[([^\]]+)\]\{([^:]+):\s*([^}]+)\}/g;
    let match;
    
    while ((match = errorRegex.exec(markedErrors)) !== null) {
      const [fullMatch, errorText, errorType, explanation] = match;
      const startIndex = markedErrors.indexOf(fullMatch);
      
      errors.push({
        text: errorText,
        type: errorType.trim(),
        explanation: explanation.trim(),
        startIndex,
        endIndex: startIndex + errorText.length
      });
    }
    
    return errors;
  };

  const errors = parseErrors();
  const errorsByType = errors.reduce((acc, error) => {
    if (!acc[error.type]) {
      acc[error.type] = [];
    }
    acc[error.type].push(error);
    return acc;
  }, {} as Record<string, ParsedError[]>);

  const getErrorTypeColor = (type: string) => {
    const colors = {
      'Grammar': 'bg-red-200 text-red-900 border-red-300',
      'Vocabulary': 'bg-orange-200 text-orange-900 border-orange-300',
      'Spelling': 'bg-yellow-200 text-yellow-900 border-yellow-300',
      'Word Choice': 'bg-purple-200 text-purple-900 border-purple-300',
      'Subject-Verb Agreement': 'bg-pink-200 text-pink-900 border-pink-300'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-200 text-gray-900 border-gray-300';
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const renderTextWithErrors = () => {
    if (!showErrors) {
      return <span className="text-gray-800 leading-relaxed">{originalText}</span>;
    }

    let processedText = originalText;
    const allMatches = [...markedErrors.matchAll(/\[([^\]]+)\]\{([^:]+):\s*([^}]+)\}/g)];
    
    // Sort matches by position in reverse order to avoid index shifting
    const sortedMatches = allMatches
      .map(match => ({
        match,
        index: originalText.indexOf(match[1])
      }))
      .filter(item => item.index !== -1)
      .sort((a, b) => b.index - a.index);

    sortedMatches.forEach(({ match }) => {
      const [, errorText, errorType, explanation] = match;
      const regex = new RegExp(`\\b${errorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      
      processedText = processedText.replace(regex, (matched) => {
        const colorClass = getErrorTypeColor(errorType.trim());
        return `<span class="${colorClass} px-2 py-1 rounded border-2 cursor-help font-medium shadow-sm" title="${errorType.trim()}: ${explanation.trim()}">${matched}</span>`;
      });
    });

    return <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Error Analysis ({errors.length} errors found)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowErrors(!showErrors)}
              className="flex items-center gap-2"
            >
              {showErrors ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showErrors ? 'Hide' : 'Show'} Highlighting
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Summary */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(errorsByType).map(([type, typeErrors]) => (
              <Badge key={type} variant="outline" className={getErrorTypeColor(type)}>
                {type}: {typeErrors.length}
              </Badge>
            ))}
            {errors.length === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">No errors detected</span>
              </div>
            )}
          </div>

          {/* Text with highlighting */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            {renderTextWithErrors()}
          </div>

          {showErrors && errors.length > 0 && (
            <div className="text-xs text-gray-500">
              Hover over highlighted text to see explanations
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Categories */}
      {Object.keys(errorsByType).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Error Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(errorsByType).map(([type, typeErrors]) => (
              <Collapsible 
                key={type}
                open={expandedCategories.includes(type)}
                onOpenChange={() => toggleCategory(type)}
              >
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto">
                    <div className="flex items-center gap-3">
                      {expandedCategories.includes(type) ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                      <span className="font-medium">{type}</span>
                      <Badge variant="outline" className={getErrorTypeColor(type)}>
                        {typeErrors.length}
                      </Badge>
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 mt-2 pl-7">
                  {typeErrors.map((error, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                      <div className="flex items-start gap-2">
                        <span className={`px-3 py-1 rounded text-sm font-medium border-2 ${getErrorTypeColor(type)}`}>
                          "{error.text}"
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{error.explanation}</p>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorHighlighter;
