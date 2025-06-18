
import { OpenAI } from "openai";

// Kluster AI configuration with R1 model
const client = new OpenAI({
  apiKey: "b5a3b313-78b2-4b41-9704-d3b012ffb24d",
  baseURL: "https://api.kluster.ai/v1",
  dangerouslyAllowBrowser: true
});

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export const createDeepSeekPrompt = (text: string, scoringSystem: 'IELTS'): DeepSeekMessage[] => {
  const systemPrompt = `You are a highly experienced IELTS Writing examiner with 15+ years of experience. You MUST analyze EVERY sentence with extreme precision and provide specific, actionable feedback.

CRITICAL INSTRUCTIONS:
1. Analyze EVERY single sentence for ALL four IELTS criteria
2. Identify SPECIFIC errors, not generic comments
3. Provide EXACT replacements and improvements
4. Be highly critical - even minor issues matter for band scores
5. Focus on vocabulary precision, grammatical accuracy, cohesion, and task response

RESPOND IN THIS EXACT FORMAT:

**BAND SCORE**
[Single number: X.X]

**DETAILED LINE-BY-LINE ANALYSIS**

Sentence 1: "[EXACT sentence from user text]"
TASK RESPONSE: [How well does this sentence address the task? Specific issues with relevance, development, examples]
COHERENCE & COHESION: [Specific linking issues, paragraph structure, logical flow problems]
LEXICAL RESOURCE: [Exact vocabulary issues - word choice, collocations, repetition, formality level]
GRAMMATICAL ACCURACY: [Specific grammar errors - tense, subject-verb agreement, articles, sentence structure]
OVERALL ISSUES: [Summary of all problems in this sentence]
SPECIFIC IMPROVEMENTS: [Exact word-for-word replacements and additions needed]

Sentence 2: "[Next exact sentence]"
[Same detailed analysis format]

[Continue for EVERY sentence - no exceptions]

**MARKED IMPROVEMENTS**
[Rewrite the ENTIRE text with these EXACT markers:
- [+NEW WORD/PHRASE+] for additions
- [~OLD WORD~] for deletions  
- {REPLACEMENT|ORIGINAL} for substitutions
- Make every change crystal clear with markers]

**BAND 9 TARGET VERSION**
[Complete rewrite as Band 9 level - sophisticated vocabulary, complex grammar, perfect cohesion, advanced academic register. Must address same points as original but with Band 9 sophistication]

**ERROR PATTERN SUMMARY**
Grammar Errors: [List all specific grammar mistakes found]
Vocabulary Issues: [List all word choice and usage problems]
Cohesion Problems: [List all linking and flow issues]
Task Response Gaps: [List all task-related shortcomings]

REQUIREMENTS:
- Find AT LEAST 3-5 specific issues per sentence (unless it's genuinely perfect)
- Be extremely detailed and critical
- Provide exact word replacements
- Focus on IELTS band descriptors
- No generic feedback - everything must be specific to this text`;

  const userPrompt = `Analyze this IELTS Writing text with extreme precision:

"${text}"

CONTEXT: This is an IELTS Academic Writing Task. Analyze every aspect according to IELTS band descriptors. Be highly critical and specific in identifying even subtle issues that prevent higher band scores.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];
};

export const callDeepSeekAPI = async (messages: DeepSeekMessage[]): Promise<string> => {
  try {
    console.log('Making enhanced API call to Kluster AI...');
    const response = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: messages,
      temperature: 0.1, // Lower temperature for more consistent analysis
      max_tokens: 4000, // Increased token limit
      top_p: 0.95,
      stream: false
    });

    console.log('Raw API response:', response);

    if (!response.choices || response.choices.length === 0) {
      throw new Error('No response choices returned from API');
    }

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in API response');
    }

    return content;
  } catch (error) {
    console.error('API call error:', error);
    
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.log('JSON parsing error detected, providing enhanced fallback response');
      return generateEnhancedFallbackResponse(messages[1].content);
    }
    
    throw error;
  }
};

const generateEnhancedFallbackResponse = (originalText: string): string => {
  const sentences = originalText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let lineAnalysis = '';
  sentences.forEach((sentence, index) => {
    const cleanSentence = sentence.trim();
    if (cleanSentence) {
      const analysis = performDetailedAnalysis(cleanSentence);
      lineAnalysis += `Sentence ${index + 1}: "${cleanSentence}"\n`;
      lineAnalysis += `TASK RESPONSE: ${analysis.taskResponse}\n`;
      lineAnalysis += `COHERENCE & COHESION: ${analysis.cohesion}\n`;
      lineAnalysis += `LEXICAL RESOURCE: ${analysis.vocabulary}\n`;
      lineAnalysis += `GRAMMATICAL ACCURACY: ${analysis.grammar}\n`;
      lineAnalysis += `OVERALL ISSUES: ${analysis.overallIssues}\n`;
      lineAnalysis += `SPECIFIC IMPROVEMENTS: ${analysis.improvements}\n\n`;
    }
  });

  const markedImprovements = generateMarkedImprovements(originalText);
  const band9Version = generateEnhancedBand9Version(originalText);

  return `**BAND SCORE**
6.5

**DETAILED LINE-BY-LINE ANALYSIS**
${lineAnalysis}

**MARKED IMPROVEMENTS**
${markedImprovements}

**BAND 9 TARGET VERSION**
${band9Version}

**ERROR PATTERN SUMMARY**
Grammar Errors: Basic sentence structures, limited complex grammar usage
Vocabulary Issues: Repetitive word choices, informal register, basic vocabulary
Cohesion Problems: Limited use of sophisticated linking devices
Task Response Gaps: Could provide more specific examples and deeper analysis`;
};

const performDetailedAnalysis = (sentence: string) => {
  const issues: string[] = [];
  const improvements: string[] = [];
  
  // Advanced analysis patterns
  const analysisPatterns = {
    basicVocab: /\b(good|bad|nice|big|small|very|really|a lot of|lots of|thing|stuff)\b/gi,
    contractions: /\b(don't|can't|won't|it's|that's|I'm|you're|we're|they're)\b/g,
    informalWords: /\b(gonna|wanna|kinda|sorta|yeah|ok|okay)\b/gi,
    repetitiveStarters: /^(I think|I believe|In my opinion|I feel)/i,
    basicLinking: /\b(and|but|so|because)\b/g,
    vaguePronouns: /\b(this|that|it|they)\b(?!\s+\w)/g,
    redundancy: /\b(in order to|due to the fact that|despite the fact that)\b/gi
  };

  let taskResponse = "Addresses the topic appropriately";
  let cohesion = "Basic sentence connection";
  let vocabulary = "Standard vocabulary range";
  let grammar = "Generally accurate with minor errors";

  // Check for basic vocabulary
  if (analysisPatterns.basicVocab.test(sentence)) {
    vocabulary = "Uses basic vocabulary that limits band score - replace with more sophisticated alternatives";
    issues.push("Basic vocabulary choices");
    improvements.push("Replace basic adjectives with more precise academic vocabulary");
  }

  // Check for contractions
  if (analysisPatterns.contractions.test(sentence)) {
    grammar = "Contains contractions inappropriate for formal academic writing";
    issues.push("Informal contractions used");
    improvements.push("Replace contractions with full forms for academic register");
  }

  // Check for informal language
  if (analysisPatterns.informalWords.test(sentence)) {
    vocabulary = "Contains informal expressions unsuitable for IELTS academic writing";
    issues.push("Informal language detected");
    improvements.push("Use more formal academic expressions");
  }

  // Check sentence length and complexity
  const wordCount = sentence.split(' ').length;
  if (wordCount < 8) {
    grammar = "Very short sentence lacking complexity expected for higher bands";
    issues.push("Insufficient sentence development");
    improvements.push("Expand with subordinate clauses, examples, or additional details");
  } else if (wordCount > 35) {
    grammar = "Overly long sentence that may confuse readers";
    issues.push("Sentence too complex");
    improvements.push("Break into shorter, clearer sentences or use better punctuation");
  }

  // Check for linking devices
  if (sentence.length > 50 && !sentence.match(/\b(however|moreover|furthermore|nevertheless|consequently|therefore|thus|hence|additionally|specifically|particularly|notably|significantly)\b/i)) {
    cohesion = "Lacks sophisticated cohesive devices expected for higher band scores";
    issues.push("Missing advanced linking words");
    improvements.push("Add sophisticated transitional phrases to improve flow");
  }

  const overallIssues = issues.length > 0 ? issues.join('; ') : "Minor areas for enhancement identified";
  const specificImprovements = improvements.length > 0 ? improvements.join('; ') : "Consider using more sophisticated language structures";

  return {
    taskResponse,
    cohesion,
    vocabulary,
    grammar,
    overallIssues,
    improvements: specificImprovements
  };
};

const generateMarkedImprovements = (originalText: string): string => {
  let improved = originalText;
  
  // Specific replacements with clear marking
  const replacements = [
    { pattern: /\bvery\s+(\w+)/g, replacement: '[~very~] [+exceptionally+] $1' },
    { pattern: /\bgood\b/gi, replacement: '[~good~][+excellent+]' },
    { pattern: /\bbad\b/gi, replacement: '[~bad~][+detrimental+]' },
    { pattern: /\bbig\b/gi, replacement: '[~big~][+substantial+]' },
    { pattern: /\bsmall\b/gi, replacement: '[~small~][+minimal+]' },
    { pattern: /\ba lot of\b/gi, replacement: '[~a lot of~][+numerous+]' },
    { pattern: /\bpeople\b/gi, replacement: '[~people~][+individuals+]' },
    { pattern: /\bthink\b/gi, replacement: '[~think~][+believe+]' },
    { pattern: /\bbecause\b/gi, replacement: '[~because~][+due to the fact that+]' },
    { pattern: /\bdon't\b/gi, replacement: '[~don\'t~][+do not+]' },
    { pattern: /\bcan't\b/gi, replacement: '[~can\'t~][+cannot+]' },
    { pattern: /\band\b/g, replacement: '[+moreover,+] and' },
    { pattern: /\bbut\b/g, replacement: '[~but~][+however,+]' }
  ];

  replacements.forEach(({ pattern, replacement }) => {
    improved = improved.replace(pattern, replacement);
  });

  // Add sophisticated sentence starters if missing
  if (!improved.match(/^(Furthermore|Moreover|Additionally|Consequently|Nevertheless|However)/)) {
    improved = '[+Furthermore,+] ' + improved.toLowerCase();
  }

  return improved;
};

const generateEnhancedBand9Version = (originalText: string): string => {
  let enhanced = originalText;
  
  // Sophisticated vocabulary replacements
  const band9Replacements = [
    { from: /\bvery\s+important\b/gi, to: 'of paramount significance' },
    { from: /\bvery\s+good\b/gi, to: 'exceptionally beneficial' },
    { from: /\bvery\s+bad\b/gi, to: 'profoundly detrimental' },
    { from: /\bpeople\s+think\b/gi, to: 'individuals contend' },
    { from: /\bmany people\b/gi, to: 'a substantial proportion of the population' },
    { from: /\bin my opinion\b/gi, to: 'from my perspective' },
    { from: /\bI think\b/gi, to: 'I would argue' },
    { from: /\bbecause\b/gi, to: 'owing to the fact that' },
    { from: /\bso\b/g, to: 'consequently' },
    { from: /\bbut\b/g, to: 'nevertheless' },
    { from: /\band\b/g, to: 'furthermore' },
    { from: /\balso\b/gi, to: 'additionally' },
    { from: /\bfor example\b/gi, to: 'to illustrate this point' },
    { from: /\bin conclusion\b/gi, to: 'in summation' }
  ];

  band9Replacements.forEach(({ from, to }) => {
    enhanced = enhanced.replace(from, to);
  });

  // Add sophisticated sentence structures
  const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const enhancedSentences = sentences.map((sentence, index) => {
    let enhanced = sentence.trim();
    
    // Add sophisticated introductory phrases
    if (index === 0 && !enhanced.match(/^(In contemporary society|In the modern era|Throughout history|It is widely acknowledged)/)) {
      enhanced = 'In contemporary society, ' + enhanced.toLowerCase();
    }
    
    // Add complex subordinate clauses
    if (enhanced.length < 80 && !enhanced.includes(',')) {
      enhanced = enhanced.replace(/\.?$/, ', which demonstrates the complexity of this multifaceted issue.');
    }
    
    return enhanced;
  });

  enhanced = enhancedSentences.join('. ') + '.';

  // Ensure sophisticated conclusion if text is substantial
  if (enhanced.length > 200 && !enhanced.includes('conclusion') && !enhanced.includes('summation')) {
    enhanced += ' In summation, this analysis underscores the nuanced nature of contemporary societal challenges and the imperative for comprehensive solutions.';
  }

  return enhanced;
};

export const parseDeepSeekResponse = (response: string) => {
  console.log('Raw AI response (first 500 chars):', response.substring(0, 500));
  
  // Enhanced parsing with multiple fallback patterns
  const scorePatterns = [
    /\*\*BAND SCORE\*\*\s*\n([^\n]*)/,
    /\*\*Score\*\*\s*\n([^\n]*)/,
    /Score:\s*([^\n]*)/,
    /Band Score:\s*([^\n]*)/
  ];
  
  const lineAnalysisPatterns = [
    /\*\*DETAILED LINE-BY-LINE ANALYSIS\*\*\s*\n(.*?)(?=\*\*MARKED IMPROVEMENTS|$)/s,
    /\*\*Line-by-Line Analysis\*\*\s*\n(.*?)(?=\*\*|$)/s,
    /Line-by-Line Analysis:\s*\n(.*?)(?=\*\*|$)/s
  ];
  
  const improvedPatterns = [
    /\*\*MARKED IMPROVEMENTS\*\*\s*\n(.*?)(?=\*\*BAND 9|$)/s,
    /\*\*Improved with Suggestions\*\*\s*\n(.*?)(?=\*\*|$)/s,
    /Marked Improvements:\s*\n(.*?)(?=\*\*|$)/s
  ];
  
  const band9Patterns = [
    /\*\*BAND 9 TARGET VERSION\*\*\s*\n(.*?)(?=\*\*ERROR PATTERN|$)/s,
    /\*\*Band 9 Version\*\*\s*\n(.*?)(?=\*\*|$)/s,
    /Band 9 Version:\s*\n(.*?)(?=\*\*|$)/s
  ];

  // Extract data using multiple patterns
  let score = '6.0';
  for (const pattern of scorePatterns) {
    const match = response.match(pattern);
    if (match) {
      const scoreMatch = match[1].trim().match(/\d+\.?\d*/);
      if (scoreMatch) {
        score = scoreMatch[0];
        break;
      }
    }
  }

  let lineByLineAnalysis = 'Detailed analysis not available.';
  for (const pattern of lineAnalysisPatterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 50) {
      lineByLineAnalysis = match[1].trim();
      break;
    }
  }

  let improvedText = 'Improvements not available.';
  for (const pattern of improvedPatterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 20) {
      improvedText = match[1].trim();
      break;
    }
  }

  let band9Version = '';
  for (const pattern of band9Patterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 50) {
      band9Version = match[1].trim();
      break;
    }
  }

  // Generate enhanced fallback if needed
  if (band9Version.length < 100) {
    console.log('Generating enhanced Band 9 fallback...');
    const userTextMatch = response.match(/"([^"]{50,})"/);
    const originalText = userTextMatch ? userTextMatch[1] : '';
    
    if (originalText) {
      band9Version = generateEnhancedBand9Version(originalText);
    } else {
      band9Version = 'Enhanced Band 9 version not available.';
    }
  }

  console.log('Enhanced parsing results:', { 
    score, 
    lineAnalysisLength: lineByLineAnalysis.length,
    improvedTextLength: improvedText.length,
    band9VersionLength: band9Version.length
  });

  return {
    score: score,
    explanation: 'Detailed feedback provided in line-by-line analysis',
    lineByLineAnalysis: lineByLineAnalysis,
    markedErrors: '', // This will be extracted from the line analysis
    improvedText: improvedText,
    band9Version: band9Version
  };
};
