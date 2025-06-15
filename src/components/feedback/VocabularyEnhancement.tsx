
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type } from "lucide-react";

interface VocabularyEnhancementProps {
  vocabularyEnhancement: string;
}

const VocabularyEnhancement = ({ vocabularyEnhancement }: VocabularyEnhancementProps) => {
  // Parse vocabulary improvements from the text
  const parseVocabularyExamples = (text: string) => {
    const examples = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('→')) {
        const parts = line.split('→');
        if (parts.length === 2) {
          const before = parts[0].replace(/^[•-]\s*["']?/, '').replace(/["']$/, '').trim();
          const afterPart = parts[1].split('(')[0].replace(/["']?/, '').trim();
          const reason = line.match(/\(([^)]+)\)/)?.[1] || '';
          
          if (before && afterPart) {
            examples.push({ before, after: afterPart, reason });
          }
        }
      }
    }
    
    return examples;
  };

  const examples = parseVocabularyExamples(vocabularyEnhancement);
  const generalAnalysis = vocabularyEnhancement.split('BASIC→SOPHISTICATED')[0].trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Type className="w-5 h-5 text-blue-600" />
          </div>
          Vocabulary & Phrasing Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {generalAnalysis && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-blue-800 leading-relaxed">{generalAnalysis}</p>
          </div>
        )}

        {examples.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Basic → Sophisticated Examples</h4>
            {examples.map((example, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid gap-3">
                  <div>
                    <span className="text-sm font-medium text-orange-600">Basic:</span>
                    <p className="text-orange-700 bg-orange-50 p-2 rounded mt-1">"{example.before}"</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-600">Sophisticated:</span>
                    <p className="text-green-700 bg-green-50 p-2 rounded mt-1">"{example.after}"</p>
                  </div>
                  {example.reason && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                      <strong>Enhancement:</strong> {example.reason}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {examples.length === 0 && !generalAnalysis && (
          <p className="text-gray-500 italic">No specific vocabulary enhancements identified in this analysis.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularyEnhancement;
