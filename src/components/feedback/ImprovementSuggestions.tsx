
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, Minus, ArrowRight } from "lucide-react";

interface ImprovementSuggestionsProps {
  improvedText: string;
}

const ImprovementSuggestions = ({ improvedText }: ImprovementSuggestionsProps) => {
  const parseImprovements = () => {
    const improvements = [];
    
    // Parse additions: [+text+]
    const addMatches = [...improvedText.matchAll(/\[\+([^+\]]+)\+\]/g)];
    addMatches.forEach(match => {
      improvements.push({
        type: 'addition',
        text: match[1],
        suggestion: 'Add this word/phrase to improve flow and clarity'
      });
    });

    // Parse removals: [~text~]
    const removeMatches = [...improvedText.matchAll(/\[~([^~\]]+)~\]/g)];
    removeMatches.forEach(match => {
      improvements.push({
        type: 'removal',
        text: match[1],
        suggestion: 'Remove or replace this word for better expression'
      });
    });

    // Parse suggestions with explanations: [+text+]{explanation}
    const suggestionMatches = [...improvedText.matchAll(/\[\+([^+\]]+)\+\]\{([^}]+)\}/g)];
    suggestionMatches.forEach(match => {
      improvements.push({
        type: 'suggestion',
        text: match[1],
        suggestion: match[2]
      });
    });

    return improvements;
  };

  const improvements = parseImprovements();
  
  const renderImprovedText = () => {
    let processedText = improvedText;
    
    // Replace improvement markers with styled spans
    processedText = processedText.replace(/\[\+([^+\]]+)\+\]/g, '<span class="bg-green-100 text-green-800 px-1 rounded font-medium">$1</span>');
    processedText = processedText.replace(/\[~([^~\]]+)~\]/g, '<span class="bg-red-100 text-red-800 line-through px-1 rounded">$1</span>');
    processedText = processedText.replace(/\[\+([^+\]]+)\+\]\{([^}]+)\}/g, '<span class="bg-green-100 text-green-800 px-1 rounded font-medium">$1</span>');
    
    return <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <div className="space-y-4">
      {/* Improved Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Improved Version
          </CardTitle>
          <div className="flex gap-2 text-sm">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Plus className="w-3 h-3 mr-1" />
              Added words
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <Minus className="w-3 h-3 mr-1" />
              Words to remove
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border">
            {renderImprovedText()}
          </div>
        </CardContent>
      </Card>

      {/* Key Improvements List */}
      {improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvements.slice(0, 5).map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 mt-1">
                    {improvement.type === 'addition' ? (
                      <Plus className="w-4 h-4 text-green-600" />
                    ) : improvement.type === 'removal' ? (
                      <Minus className="w-4 h-4 text-red-600" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      "{improvement.text}"
                    </div>
                    <div className="text-sm text-gray-600">
                      {improvement.suggestion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImprovementSuggestions;
