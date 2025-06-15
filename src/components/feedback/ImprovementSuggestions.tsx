
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, Minus, ArrowRight, FlipHorizontal, Star, BookOpen, Target } from "lucide-react";

interface ImprovementSuggestionsProps {
  originalText: string;
  improvedText: string;
  band9Version?: string;
}

const ImprovementSuggestions = ({ originalText, improvedText, band9Version }: ImprovementSuggestionsProps) => {
  const [viewMode, setViewMode] = useState<'original' | 'improved' | 'band9'>('improved');

  const parseImprovements = () => {
    const improvements = [];

    // Parse additions: [+text+]
    const addMatches = [...improvedText.matchAll(/\[\+([^+\]]+)\+\]/g)];
    addMatches.forEach(match => {
      improvements.push({
        type: "addition",
        text: match[1],
        suggestion: "Add this word/phrase to improve flow and clarity",
      });
    });

    // Parse removals: [~text~]
    const removeMatches = [...improvedText.matchAll(/\[~([^~\]]+)~\]/g)];
    removeMatches.forEach(match => {
      improvements.push({
        type: "removal",
        text: match[1],
        suggestion: "Remove or replace this word for better expression",
      });
    });

    // Parse suggestions with explanations: [+text+]{explanation}
    const suggestionMatches = [...improvedText.matchAll(/\[\+([^+\]]+)\+\]\{([^}]+)\}/g)];
    suggestionMatches.forEach(match => {
      improvements.push({
        type: "suggestion",
        text: match[1],
        suggestion: match[2],
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

  const renderOriginalText = () => (
    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{originalText}</div>
  );

  const renderBand9Text = () => (
    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">{band9Version}</div>
  );

  const cycleViewMode = () => {
    if (viewMode === 'original') {
      setViewMode('improved');
    } else if (viewMode === 'improved') {
      setViewMode(band9Version ? 'band9' : 'original');
    } else {
      setViewMode('original');
    }
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'original':
        return 'Original Version';
      case 'improved':
        return 'Improved Version (Marked Changes)';
      case 'band9':
        return 'Band 9 Target Version';
      default:
        return 'Text Version';
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case 'original':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'improved':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'band9':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getNextViewLabel = () => {
    if (viewMode === 'original') {
      return 'Show Marked Improvements';
    } else if (viewMode === 'improved') {
      return band9Version ? 'Show Band 9 Version' : 'Show Original';
    } else {
      return 'Show Original';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant={viewMode === 'original' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setViewMode('original')}>
            <BookOpen className="w-3 h-3 mr-1" />
            Original
          </Badge>
          <Badge variant={viewMode === 'improved' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setViewMode('improved')}>
            <Target className="w-3 h-3 mr-1" />
            Marked Changes
          </Badge>
          {band9Version && (
            <Badge variant={viewMode === 'band9' ? 'default' : 'outline'} className="cursor-pointer bg-purple-600 hover:bg-purple-700" onClick={() => setViewMode('band9')}>
              <Star className="w-3 h-3 mr-1" />
              Band 9 Version
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cycleViewMode}
        >
          <FlipHorizontal className="w-4 h-4 mr-2" />
          {getNextViewLabel()}
        </Button>
      </div>

      {/* Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getViewIcon()}
            {getViewTitle()}
          </CardTitle>
          {viewMode === 'improved' && (
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
          )}
          {viewMode === 'band9' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-purple-800">Band 9 Features</span>
              </div>
              <ul className="text-purple-700 space-y-1 text-xs">
                <li>• Sophisticated vocabulary and precise collocations</li>
                <li>• Complex grammatical structures with sentence variety</li>
                <li>• Advanced cohesive devices and linking expressions</li>
                <li>• Formal academic register and natural flow</li>
              </ul>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className={`${viewMode === 'original' ? "bg-blue-50" : viewMode === 'improved' ? "bg-gray-50" : "bg-purple-50"} p-4 rounded-lg border`}>
            {viewMode === 'original' && renderOriginalText()}
            {viewMode === 'improved' && renderImprovedText()}
            {viewMode === 'band9' && renderBand9Text()}
          </div>
        </CardContent>
      </Card>

      {/* Key Improvements List - Only show for improved view */}
      {viewMode === 'improved' && improvements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Improvements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {improvements.slice(0, 5).map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex-shrink-0 mt-1">
                    {improvement.type === "addition" ? (
                      <Plus className="w-4 h-4 text-green-600" />
                    ) : improvement.type === "removal" ? (
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

      {/* Band 9 vs Original Comparison - Only show for band9 view */}
      {viewMode === 'band9' && band9Version && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              What Makes This Band 9?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Vocabulary Enhancement</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Sophisticated word choices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Precise collocations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Academic register</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Structure & Flow</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Complex sentence structures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Advanced linking devices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Seamless coherence</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImprovementSuggestions;
