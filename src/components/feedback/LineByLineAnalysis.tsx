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
        
        // Extract specific error categories
        const spellingGrammarMatch = lineContent.match(/•\s*SPELLING\/GRAMMAR ERRORS:\s*([^\n•]+)/i);
        const vocabMatch = lineContent.match(/•\s*VOCABULARY ISSUES:\s*([^\n•]+)/i);
        const grammarMatch = lineContent.match(/•\s*GRAMMAR CORRECTIONS:\s*([^\n•]+)/i);
        const coherenceMatch = lineContent.match(/•\s*COHERENCE PROBLEMS:\s*([^\n•]+)/i);
        const taskMatch = lineContent.match(/•\s*TASK RELEVANCE:\s*([^\n•]+)/i);
        const severityMatch = lineContent.match(/•\s*SEVERITY:\s*([^\n•]+)/i);
        const fixesMatch = lineContent.match(/•\s*SPECIFIC FIXES:\s*([^\n•]+)/i);
        
        // Process extracted content
        const spellingGrammar = spellingGrammarMatch ? spellingGrammarMatch[1].trim() : '';
        vocabulary = vocabMatch ? vocabMatch[1].trim() : '';
        grammar = grammarMatch ? grammarMatch[1].trim() : '';
        cohesion = coherenceMatch ? coherenceMatch[1].trim() : '';
        taskResponse = taskMatch ? taskMatch[1].trim() : '';
        
        if (severityMatch) {
          const severityText = severityMatch[1].trim().toUpperCase();
          if (severityText.includes('HIGH')) severity = 'HIGH';
          else if (severityText.includes('MEDIUM')) severity = 'MEDIUM';
          else if (severityText.includes('LOW')) severity = 'LOW';
        }
        
        fixes = fixesMatch ? fixesMatch[1].trim() : '';
        
        // Combine spelling/grammar with grammar corrections
        if (spellingGrammar && grammar) {
          grammar = `${spellingGrammar}; ${grammar}`;
        } else if (spellingGrammar) {
          grammar = spellingGrammar;
        }
        
        // Determine if there are real issues
        hasIssues = severity !== 'NONE' || 
                   (spellingGrammar && !spellingGrammar.toLowerCase().includes('no')) ||
                   (vocabulary && vocabulary.toLowerCase().includes('upgrade')) ||
                   (grammar && !grammar.toLowerCase().includes('accurate')) ||
                   (cohesion && cohesion.toLowerCase().includes('lack'));
      }
      
      // Enhanced fallback analysis if AI analysis not found
      if (!taskResponse && !cohesion && !vocabulary && !grammar) {
        console.log(`Using enhanced fallback for line ${lineNumber}`);
        const fallbackAnalysis = performSpecificAnalysis(sentence.trim());
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

  const performSpecificAnalysis = (sentence: string) => {
    const errors: string[] = [];
    const criticalIssues: string[] = [];
    let severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE' = 'NONE';

    // Specific error detection patterns
    const specificErrors = {
      spelling: [
        { wrong: /\brecieve\b/gi, correct: 'receive' },
        { wrong: /\boccured\b/gi, correct: 'occurred' },
        { wrong: /\bseperate\b/gi, correct: 'separate' },
        { wrong: /\bdefinately\b/gi, correct: 'definitely' }
      ],
      grammar: [
        { pattern: /\ban university\b/gi, fix: 'Change "an university" to "a university"' },
        { pattern: /\bpeople is\b/gi, fix: 'Change "people is" to "people are"' },
        { pattern: /\bmuch people\b/gi, fix: 'Change "much people" to "many people"' },
        { pattern: /\bdepends of\b/gi, fix: 'Change "depends of" to "depends on"' }
      ],
      vocabulary: [
        { basic: /\bvery good\b/gi, better: 'excellent/outstanding' },
        { basic: /\bvery bad\b/gi, better: 'detrimental/problematic' },
        { basic: /\ba lot of\b/gi, better: 'numerous/substantial' },
        { basic: /\bbig\b/gi, better: 'significant/substantial' }
      ]
    };

    // Check for specific spelling errors
    let spellingErrors = [];
    specificErrors.spelling.forEach(({ wrong, correct }) => {
      if (wrong.test(sentence)) {
        spellingErrors.push(`Spelling: "${sentence.match(wrong)?.[0]}" → "${correct}"`);
        severity = 'HIGH';
      }
    });

    // Check for specific grammar errors
    let grammarErrors = [];
    specificErrors.grammar.forEach(({ pattern, fix }) => {
      if (pattern.test(sentence)) {
        grammarErrors.push(fix);
        severity = 'HIGH';
      }
    });

    // Check for basic vocabulary
    let vocabIssues = [];
    specificErrors.vocabulary.forEach(({ basic, better }) => {
      if (basic.test(sentence)) {
        const match = sentence.match(basic)?.[0];
        vocabIssues.push(`Replace "${match}" with ${better}`);
        if (severity === 'NONE') severity = 'MEDIUM';
      }
    });

    // Combine all specific issues
    const allSpecificIssues = [...spellingErrors, ...grammarErrors, ...vocabIssues];
    
    let taskResponse = "Addresses the topic appropriately";
    let cohesion = "Adequate sentence structure and flow";
    let vocabulary = "Standard vocabulary for academic writing";
    let grammar = "Generally accurate with minor issues";

    if (allSpecificIssues.length > 0) {
      if (spellingErrors.length > 0) {
        grammar = `Critical spelling errors found: ${spellingErrors.join(', ')}`;
      } else if (grammarErrors.length > 0) {
        grammar = `Grammar errors detected: ${grammarErrors.join(', ')}`;
      }
      
      if (vocabIssues.length > 0) {
        vocabulary = `Basic vocabulary limiting band score: ${vocabIssues.join(', ')}`;
      }
    }

    const wordCount = sentence.split(' ').length;
    if (wordCount < 6) {
      taskResponse = "Too brief - needs more development and supporting details";
      if (severity === 'NONE') severity = 'MEDIUM';
    }

    return {
      taskResponse,
      cohesion,
      vocabulary,
      grammar,
      severity,
      fixes: allSpecificIssues.join('; ') || 'Consider enhancing language sophistication',
      hasIssues: allSpecificIssues.length > 0 || wordCount < 6
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
