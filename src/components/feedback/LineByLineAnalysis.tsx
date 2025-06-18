
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { List, ChevronDown, ChevronRight, AlertCircle, CheckCircle, Lightbulb, Target, Zap } from "lucide-react";

interface LineByLineAnalysisProps {
  originalText: string;
  lineByLineAnalysis: string;
}

interface LineAnalysis {
  lineNumber: number;
  sentence: string;
  taskResponse: string;
  cohesion: string;
  vocabulary: string;
  grammar: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  fixes: string;
  hasIssues: boolean;
}

const LineByLineAnalysis = ({ originalText, lineByLineAnalysis }: LineByLineAnalysisProps) => {
  const [expandedLines, setExpandedLines] = useState<number[]>([]);

  const parseEnhancedLineAnalysis = (): LineAnalysis[] => {
    const lines: LineAnalysis[] = [];
    const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    console.log('Parsing enhanced analysis:', lineByLineAnalysis);
    
    sentences.forEach((sentence, index) => {
      const lineNumber = index + 1;
      let taskResponse = '';
      let cohesion = '';
      let vocabulary = '';
      let grammar = '';
      let severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';
      let fixes = '';
      let hasIssues = false;
      
      // Enhanced pattern matching for detailed analysis
      const linePatterns = [
        new RegExp(`Sentence ${lineNumber}:.*?(?=Sentence ${lineNumber + 1}:|\\*\\*|$)`, 's'),
        new RegExp(`${lineNumber}\\..*?(?=${lineNumber + 1}\\.|\\*\\*|$)`, 's')
      ];
      
      let lineMatch = null;
      for (const pattern of linePatterns) {
        lineMatch = lineByLineAnalysis.match(pattern);
        if (lineMatch) break;
      }
      
      if (lineMatch) {
        const lineContent = lineMatch[0];
        
        // Extract each criterion with robust patterns
        const taskResponseMatch = lineContent.match(/•\s*TASK RESPONSE:\s*([^\n•]+)/i);
        taskResponse = taskResponseMatch ? taskResponseMatch[1].trim() : '';
        
        const cohesionMatch = lineContent.match(/•\s*COHERENCE & COHESION:\s*([^\n•]+)/i);
        cohesion = cohesionMatch ? cohesionMatch[1].trim() : '';
        
        const vocabularyMatch = lineContent.match(/•\s*LEXICAL RESOURCE:\s*([^\n•]+)/i);
        vocabulary = vocabularyMatch ? vocabularyMatch[1].trim() : '';
        
        const grammarMatch = lineContent.match(/•\s*GRAMMATICAL ACCURACY:\s*([^\n•]+)/i);
        grammar = grammarMatch ? grammarMatch[1].trim() : '';
        
        const severityMatch = lineContent.match(/•\s*SEVERITY:\s*([^\n•]+)/i);
        if (severityMatch) {
          const severityText = severityMatch[1].trim().toUpperCase();
          if (severityText.includes('HIGH')) severity = 'HIGH';
          else if (severityText.includes('MEDIUM')) severity = 'MEDIUM';
          else if (severityText.includes('LOW')) severity = 'LOW';
        }
        
        const fixesMatch = lineContent.match(/•\s*SPECIFIC FIXES:\s*([^\n•]+)/i);
        fixes = fixesMatch ? fixesMatch[1].trim() : '';
        
        // Determine if there are real issues
        hasIssues = severity !== 'NONE' || 
                   (taskResponse && !taskResponse.toLowerCase().includes('adequate')) ||
                   (cohesion && cohesion.toLowerCase().includes('basic')) ||
                   (vocabulary && vocabulary.toLowerCase().includes('basic')) ||
                   (grammar && !grammar.toLowerCase().includes('accurate'));
      }
      
      // Enhanced fallback analysis if AI analysis not found
      if (!taskResponse && !cohesion && !vocabulary && !grammar) {
        console.log(`Using enhanced fallback for line ${lineNumber}`);
        const fallbackAnalysis = performRobustAnalysis(sentence.trim());
        taskResponse = fallbackAnalysis.taskResponse;
        cohesion = fallbackAnalysis.cohesion;
        vocabulary = fallbackAnalysis.vocabulary;
        grammar = fallbackAnalysis.grammar;
        severity = fallbackAnalysis.severity;
        fixes = fallbackAnalysis.fixes;
        hasIssues = fallbackAnalysis.hasIssues;
      }
      
      lines.push({
        lineNumber,
        sentence: sentence.trim(),
        taskResponse: taskResponse || 'Addresses topic adequately',
        cohesion: cohesion || 'Basic sentence connection established',
        vocabulary: vocabulary || 'Standard vocabulary usage',
        grammar: grammar || 'Generally accurate structure',
        severity,
        fixes: fixes || 'Consider enhancing sophistication and precision',
        hasIssues
      });
    });
    
    return lines;
  };

  const performRobustAnalysis = (sentence: string) => {
    const issues: string[] = [];
    const criticalIssues: string[] = [];
    let severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'LOW';

    // Critical grammar patterns
    const criticalPatterns = {
      contractions: /\b(don't|can't|won't|it's|that's|I'm|you're|we're|they're|isn't|aren't)\b/g,
      articlesErrors: /\b(a|an)\s+(university|unique|honest|hour|European)/gi,
      subjectVerb: /\b(people|children|students)\s+(is|was|has)\b/gi,
      doubleNegative: /\b(don't|can't|won't)\s+no\b/gi
    };

    // Vocabulary issues
    const vocabPatterns = {
      basic: /\b(good|bad|nice|big|small|very|really|thing|stuff|people|get|make|do)\b/gi,
      informal: /\b(gonna|wanna|kinda|sorta|yeah|ok|okay|cool|awesome|amazing)\b/gi,
      repetitive: /\b(\w+)\b.*\b\1\b/gi,
      vague: /\b(some|many|lots of|a lot of|things|ways|aspects)\b/gi
    };

    // Task response analysis
    let taskResponse = "Addresses the topic appropriately";
    const wordCount = sentence.split(' ').length;
    if (wordCount < 8) {
      taskResponse = "Too brief - lacks sufficient development for the task requirements";
      issues.push("insufficient development");
      severity = 'MEDIUM';
    } else if (wordCount > 40) {
      taskResponse = "Overly complex - may confuse rather than clarify the point";
      issues.push("excessive complexity");
      severity = 'MEDIUM';
    }

    // Coherence analysis
    let cohesion = "Basic sentence structure with adequate flow";
    if (!sentence.match(/\b(however|moreover|furthermore|nevertheless|consequently|therefore|thus|hence|additionally|specifically|particularly|notably)\b/i) && wordCount > 15) {
      cohesion = "Lacks sophisticated cohesive devices expected for higher band scores";
      issues.push("basic linking");
      severity = severity === 'HIGH' ? 'HIGH' : 'MEDIUM';
    }

    // Vocabulary analysis
    let vocabulary = "Standard vocabulary range for academic writing";
    if (vocabPatterns.basic.test(sentence)) {
      vocabulary = "Contains basic vocabulary that significantly limits band score potential";
      criticalIssues.push("basic vocabulary");
      severity = 'HIGH';
    }
    if (vocabPatterns.informal.test(sentence)) {
      vocabulary = "Inappropriate informal register completely unsuitable for IELTS academic writing";
      criticalIssues.push("informal language");
      severity = 'HIGH';
    }

    // Grammar analysis
    let grammar = "Generally accurate with appropriate complexity";
    if (criticalPatterns.contractions.test(sentence)) {
      grammar = "Contains contractions which are completely inappropriate for formal academic writing";
      criticalIssues.push("contractions");
      severity = 'HIGH';
    }
    if (criticalPatterns.articlesErrors.test(sentence)) {
      grammar = "Article usage errors that significantly impact comprehension";
      criticalIssues.push("article errors");
      severity = 'HIGH';
    }
    if (criticalPatterns.subjectVerb.test(sentence)) {
      grammar = "Subject-verb agreement errors - major grammatical mistakes";
      criticalIssues.push("subject-verb disagreement");
      severity = 'HIGH';
    }

    // Generate specific fixes
    const allIssues = [...criticalIssues, ...issues];
    let fixes = "Consider enhancing language sophistication";
    
    if (allIssues.length > 0) {
      const fixSuggestions = [];
      if (allIssues.includes("basic vocabulary")) {
        fixSuggestions.push("Replace 'good'→'beneficial/advantageous', 'big'→'substantial/significant'");
      }
      if (allIssues.includes("contractions")) {
        fixSuggestions.push("Change 'don't'→'do not', 'can't'→'cannot'");
      }
      if (allIssues.includes("basic linking")) {
        fixSuggestions.push("Add sophisticated connectors: 'furthermore', 'consequently', 'nevertheless'");
      }
      if (allIssues.includes("insufficient development")) {
        fixSuggestions.push("Expand with specific examples, explanations, or supporting details");
      }
      fixes = fixSuggestions.join('; ');
    }

    return {
      taskResponse,
      cohesion,
      vocabulary,
      grammar,
      severity: criticalIssues.length > 0 ? 'HIGH' : severity,
      fixes,
      hasIssues: allIssues.length > 0
    };
  };

  const toggleLine = (lineNumber: number) => {
    setExpandedLines(prev => 
      prev.includes(lineNumber) 
        ? prev.filter(n => n !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  const lines = parseEnhancedLineAnalysis();
  const totalIssues = lines.filter(line => line.hasIssues).length;
  const highSeverityIssues = lines.filter(line => line.severity === 'HIGH').length;
  const mediumSeverityIssues = lines.filter(line => line.severity === 'MEDIUM').length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-orange-600';
      case 'LOW': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getSeverityIcon = (severity: string, hasIssues: boolean) => {
    if (!hasIssues) return <CheckCircle className="w-4 h-4 text-green-500" />;
    
    switch (severity) {
      case 'HIGH': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'MEDIUM': return <Zap className="w-4 h-4 text-orange-500" />;
      case 'LOW': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="w-5 h-5 text-blue-500" />
          Enhanced Line-by-Line Analysis
        </CardTitle>
        <div className="flex flex-wrap gap-2 text-sm">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {lines.length} sentences analyzed
          </Badge>
          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
            {totalIssues} issues detected
          </Badge>
          {highSeverityIssues > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {highSeverityIssues} critical errors
            </Badge>
          )}
          {mediumSeverityIssues > 0 && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              {mediumSeverityIssues} moderate issues
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
                        Sentence {line.lineNumber}
                      </span>
                      {getSeverityIcon(line.severity, line.hasIssues)}
                      {line.hasIssues && (
                        <span className={`text-xs font-medium ${getSeverityColor(line.severity)}`}>
                          {line.severity}
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
              {/* Task Response */}
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="font-medium text-purple-800">Task Response</span>
                </div>
                <p className="text-sm text-purple-700">{line.taskResponse}</p>
              </div>

              {/* Coherence & Cohesion */}
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span className="font-medium text-indigo-800">Coherence & Cohesion</span>
                </div>
                <p className="text-sm text-indigo-700">{line.cohesion}</p>
              </div>

              {/* Lexical Resource */}
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-800">Lexical Resource</span>
                </div>
                <p className="text-sm text-emerald-700">{line.vocabulary}</p>
              </div>

              {/* Grammatical Accuracy */}
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                  <span className="font-medium text-teal-800">Grammatical Accuracy</span>
                </div>
                <p className="text-sm text-teal-700">{line.grammar}</p>
              </div>

              {/* Specific Improvements */}
              <div className={`${line.severity === 'HIGH' ? 'bg-red-50 border-red-100' : line.severity === 'MEDIUM' ? 'bg-orange-50 border-orange-100' : 'bg-blue-50 border-blue-100'} p-3 rounded-lg border`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${getSeverityColor(line.severity)}`} />
                  <span className={`font-medium ${getSeverityColor(line.severity).replace('text-', 'text-').replace('600', '800')}`}>
                    Specific Improvements
                  </span>
                </div>
                <p className={`text-sm ${getSeverityColor(line.severity).replace('600', '700')}`}>
                  {line.fixes}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        {lines.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No analysis available - please try submitting your text again</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LineByLineAnalysis;
