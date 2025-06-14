
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

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
    acc[error.type] = (acc[error.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const renderTextWithErrors = () => {
    if (!showErrors) {
      return <span className="text-gray-800 leading-relaxed">{originalText}</span>;
    }

    let processedText = markedErrors;
    const errorMatches = [...markedErrors.matchAll(/\[([^\]]+)\]\{([^:]+):\s*([^}]+)\}/g)];
    
    // Replace error markers with highlighted spans
    errorMatches.reverse().forEach((match, index) => {
      const [fullMatch, errorText, errorType, explanation] = match;
      const replacement = (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="bg-red-100 border-b-2 border-red-300 rounded px-1 cursor-help text-red-800 hover:bg-red-200 transition-colors">
                {errorText}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-1">
                <div className="font-medium text-red-600">{errorType}</div>
                <div className="text-sm">{explanation}</div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      
      processedText = processedText.replace(fullMatch, `<HIGHLIGHT_${index}>`);
    });

    // Split by highlight markers and render
    const parts = processedText.split(/<HIGHLIGHT_\d+>/);
    const result = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) result.push(<span key={`text-${i}`}>{parts[i]}</span>);
      if (i < errorMatches.length) {
        const match = errorMatches[errorMatches.length - 1 - i];
        const [, errorText, errorType, explanation] = match;
        result.push(
          <TooltipProvider key={`error-${i}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="bg-red-100 border-b-2 border-red-300 rounded px-1 cursor-help text-red-800 hover:bg-red-200 transition-colors">
                  {errorText}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-medium text-red-600">{errorType}</div>
                  <div className="text-sm">{explanation}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    }
    
    return <div className="text-gray-800 leading-relaxed">{result}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Error Analysis
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowErrors(!showErrors)}
            className="flex items-center gap-2"
          >
            {showErrors ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showErrors ? 'Hide' : 'Show'} Errors
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Error Summary */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(errorsByType).map(([type, count]) => (
            <Badge key={type} variant="outline" className="text-red-600 border-red-200">
              {type}: {count}
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
  );
};

export default ErrorHighlighter;
