
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle2 } from "lucide-react";

interface SideBySideComparisonProps {
  originalText: string;
  improvedText: string;
  markedErrors: string;
}

const SideBySideComparison = ({ originalText, improvedText, markedErrors }: SideBySideComparisonProps) => {
  const renderOriginalWithErrors = () => {
    let processedText = originalText;
    
    // Find errors from markedErrors and highlight them in original text
    const errorMatches = [...markedErrors.matchAll(/\[([^\]]+)\]\{([^:]+):\s*([^}]+)\}/g)];
    
    errorMatches.forEach((match) => {
      const [, errorText] = match;
      const regex = new RegExp(`\\b${errorText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      processedText = processedText.replace(regex, `<mark class="bg-red-100 text-red-800 px-1 rounded">${errorText}</mark>`);
    });

    return <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  const renderImprovedText = () => {
    let processedText = improvedText;
    
    // Highlight improvements
    processedText = processedText.replace(/\[\+([^+\]]+)\+\]/g, '<mark class="bg-green-100 text-green-800 px-1 rounded font-medium">$1</mark>');
    processedText = processedText.replace(/\[~([^~\]]+)~\]/g, '<span class="line-through text-gray-500">$1</span>');
    processedText = processedText.replace(/\[\+([^+\]]+)\+\]\{([^}]+)\}/g, '<mark class="bg-green-100 text-green-800 px-1 rounded font-medium">$1</mark>');
    
    return <div className="text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedText }} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          Before & After Comparison
        </CardTitle>
        <div className="flex gap-2 text-sm">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Errors highlighted in red
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Improvements in green
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Original Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">Original Text</h3>
              <Badge variant="outline" className="text-red-600 border-red-200">
                With Errors
              </Badge>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 max-h-96 overflow-y-auto">
              {renderOriginalWithErrors()}
            </div>
          </div>

          {/* Improved Text */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-900">Improved Version</h3>
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Enhanced
              </Badge>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200 max-h-96 overflow-y-auto">
              {renderImprovedText()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SideBySideComparison;
