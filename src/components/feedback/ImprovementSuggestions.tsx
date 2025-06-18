
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, Minus, ArrowRight, FlipHorizontal, Star, BookOpen, Target, Zap } from "lucide-react";

interface ImprovementSuggestionsProps {
  originalText: string;
  improvedText: string;
  band9Version?: string;
}

const ImprovementSuggestions = ({ originalText, improvedText, band9Version }: ImprovementSuggestionsProps) => {
  const [viewMode, setViewMode] = useState<'original' | 'improved' | 'band9'>('improved');

  const parseEnhancedImprovements = () => {
    const improvements = [];

    // Enhanced parsing for additions: [+text+] or [ADD]
    const addMatches = [...improvedText.matchAll(/\[\+([^+\]]+)\+\]|\[ADD\+([^+\]]+)\+\]/g)];
    addMatches.forEach(match => {
      const text = match[1] || match[2];
      improvements.push({
        type: "addition",
        text: text,
        suggestion: `Add "${text}" to enhance precision and academic register`,
        severity: "improvement"
      });
    });

    // Enhanced parsing for removals: [-text-] or [~text~]
    const removeMatches = [...improvedText.matchAll(/\[-([^-\]]+)-\]|\[~([^~\]]+)~\]/g)];
    removeMatches.forEach(match => {
      const text = match[1] || match[2];
      improvements.push({
        type: "removal",
        text: text,
        suggestion: `Remove "${text}" as it's too basic/informal for IELTS academic writing`,
        severity: "critical"
      });
    });

    // Enhanced parsing for replacements: {new|old}
    const replaceMatches = [...improvedText.matchAll(/\{([^|]+)\|([^}]+)\}/g)];
    replaceMatches.forEach(match => {
      improvements.push({
        type: "replacement",
        text: `${match[2]} → ${match[1]}`,
        suggestion: `Replace "${match[2]}" with "${match[1]}" for higher band vocabulary`,
        severity: "important"
      });
    });

    return improvements;
  };

  const renderEnhancedImprovedText = () => {
    let processedText = improvedText;
    
    // Enhanced highlighting with better visual markers
    processedText = processedText.replace(/\[\+([^+\]]+)\+\]/g, '<span class="bg-green-200 text-green-900 px-2 py-1 rounded font-semibold border border-green-300">+$1</span>');
    processedText = processedText.replace(/\[-([^-\]]+)-\]/g, '<span class="bg-red-200 text-red-900 line-through px-2 py-1 rounded border border-red-300">$1</span>');
    processedText = processedText.replace(/\[~([^~\]]+)~\]/g, '<span class="bg-red-100 text-red-800 line-through px-1 rounded">$1</span>');
    processedText = processedText.replace(/\{([^|]+)\|([^}]+)\}/g, '<span class="bg-blue-200 text-blue-900 px-2 py-1 rounded font-semibold border border-blue-300">$1</span>');
    
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
        return 'Your Original Writing';
      case 'improved':
        return 'Marked Improvements & Corrections';
      case 'band9':
        return 'Band 9 Academic Transformation';
      default:
        return 'Text Version';
    }
  };

  const getViewIcon = () => {
    switch (viewMode) {
      case 'original':
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'improved':
        return <Target className="w-5 h-5 text-orange-500" />;
      case 'band9':
        return <Star className="w-5 h-5 text-purple-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getNextViewLabel = () => {
    if (viewMode === 'original') {
      return 'Show Marked Corrections';
    } else if (viewMode === 'improved') {
      return band9Version ? 'Show Band 9 Version' : 'Show Original';
    } else {
      return 'Show Original Text';
    }
  };

  const improvements = parseEnhancedImprovements();
  const criticalImprovements = improvements.filter(imp => imp.severity === 'critical');
  const importantImprovements = improvements.filter(imp => imp.severity === 'important');

  return (
    <div className="space-y-4">
      {/* Enhanced Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Badge 
            variant={viewMode === 'original' ? 'default' : 'outline'} 
            className="cursor-pointer hover:bg-blue-600 transition-colors" 
            onClick={() => setViewMode('original')}
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Original
          </Badge>
          <Badge 
            variant={viewMode === 'improved' ? 'default' : 'outline'} 
            className="cursor-pointer hover:bg-orange-600 transition-colors" 
            onClick={() => setViewMode('improved')}
          >
            <Target className="w-3 h-3 mr-1" />
            Marked Changes
          </Badge>
          {band9Version && (
            <Badge 
              variant={viewMode === 'band9' ? 'default' : 'outline'} 
              className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white transition-colors" 
              onClick={() => setViewMode('band9')}
            >
              <Star className="w-3 h-3 mr-1" />
              Band 9 Version
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={cycleViewMode}
          className="hover:bg-gray-100"
        >
          <FlipHorizontal className="w-4 h-4 mr-2" />
          {getNextViewLabel()}
        </Button>
      </div>

      {/* Enhanced Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getViewIcon()}
            {getViewTitle()}
          </CardTitle>
          {viewMode === 'improved' && (
            <div className="flex gap-2 text-sm flex-wrap">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Plus className="w-3 h-3 mr-1" />
                {improvements.filter(i => i.type === 'addition').length} additions
              </Badge>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                <Minus className="w-3 h-3 mr-1" />
                {improvements.filter(i => i.type === 'removal').length} removals
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <ArrowRight className="w-3 h-3 mr-1" />
                {improvements.filter(i => i.type === 'replacement').length} replacements
              </Badge>
            </div>
          )}
          {viewMode === 'band9' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Band 9 Excellence Features</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-purple-700 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <span>Sophisticated academic vocabulary</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <span>Complex grammatical structures</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <span>Advanced cohesive devices</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                    <span>Formal academic register</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className={`${viewMode === 'original' ? "bg-blue-50 border-blue-200" : viewMode === 'improved' ? "bg-gray-50 border-gray-200" : "bg-purple-50 border-purple-200"} p-5 rounded-lg border min-h-[200px]`}>
            {viewMode === 'original' && renderOriginalText()}
            {viewMode === 'improved' && renderEnhancedImprovedText()}
            {viewMode === 'band9' && renderBand9Text()}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Key Improvements - Only for improved view */}
      {viewMode === 'improved' && improvements.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {criticalImprovements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-500" />
                  Critical Corrections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {criticalImprovements.slice(0, 3).map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex-shrink-0 mt-1">
                        <Minus className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-red-900 mb-1">
                          "{improvement.text}"
                        </div>
                        <div className="text-sm text-red-700">
                          {improvement.suggestion}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {importantImprovements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Important Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {importantImprovements.slice(0, 3).map((improvement, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0 mt-1">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-900 mb-1">
                          {improvement.text}
                        </div>
                        <div className="text-sm text-blue-700">
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
      )}

      {/* Band 9 Analysis - Only for band9 view */}
      {viewMode === 'band9' && band9Version && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              Academic Excellence Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-900">Vocabulary Sophistication</h4>
                <div className="text-sm text-purple-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Precise academic lexicon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Advanced collocations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Formal register consistency</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-900">Grammatical Complexity</h4>
                <div className="text-sm text-purple-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Complex sentence structures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Varied syntactic patterns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Error-free accuracy</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-purple-900">Coherence Excellence</h4>
                <div className="text-sm text-purple-700 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Sophisticated linking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Seamless progression</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Clear referencing</span>
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
