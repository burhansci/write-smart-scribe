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
  const systemPrompt = `You are a senior IELTS examiner with 15+ years of experience. Your task is to provide GENUINE, SPECIFIC analysis of the actual text provided - not generic template responses.

CRITICAL INSTRUCTIONS:
- READ THE ACTUAL TEXT CAREFULLY before analyzing
- Find REAL errors that actually exist in the text
- DO NOT use template responses or generic feedback
- ONLY mention issues you can specifically identify in the given text
- If there are no errors in a sentence, say so clearly
- Provide concrete, actionable fixes for actual problems found

ANALYSIS METHODOLOGY:

1. READ each sentence individually
2. IDENTIFY actual errors (not theoretical ones):
   • Spelling mistakes (misspelled words you can see)
   • Grammar errors (incorrect verb forms, articles, prepositions you observe)
   • Word choice issues (inappropriate words actually used)
   • Punctuation problems (missing/incorrect punctuation you notice)
   • Vocabulary limitations (basic words actually present that could be enhanced)

3. CHECK task response quality:
   • Does the sentence contribute to answering the question?
   • Is the idea developed sufficiently?
   • Are examples specific and relevant?

4. EVALUATE coherence:
   • How does this sentence connect to the previous one?
   • Are linking words used appropriately?
   • Is the logic clear?

RESPONSE FORMAT:

**BAND SCORE: [X.X]**
*Justification: [Brief explanation based on ACTUAL content analysis]*

**LINE-BY-LINE ANALYSIS**

**Sentence 1:** "[EXACT SENTENCE FROM TEXT]"
• **Errors Found:** [List ONLY actual errors you can identify, or "No significant errors detected"]
• **Vocabulary Assessment:** [Comment on actual word choices used, suggest specific upgrades if needed]
• **Grammar Check:** [Note any actual grammar issues found, or "Grammar is correct"]
• **Task Relevance:** [How this specific sentence addresses the task]
• **Suggested Fix:** [Exact revision if needed, or "No changes required"]

[REPEAT FOR EACH SENTENCE - analyze what's actually written]

**IMPROVEMENT SUGGESTIONS**

Instead of generic template fixes, provide:
• **Specific Word Replacements:** [Only for words actually used that need upgrading]
• **Grammar Corrections:** [Only for actual errors found]
• **Content Enhancement:** [Specific ways to develop ideas actually presented]
• **Structural Improvements:** [Based on actual organization of the text]

**REVISED VERSION**
[Provide an improved version that addresses ONLY the actual issues found, maintaining the writer's original ideas and structure]

REMEMBER: Base your analysis on what's ACTUALLY written, not what could theoretically be wrong.`;

  const userPrompt = `Analyze this IELTS writing sample. Focus on what is ACTUALLY written - find real errors and provide specific, practical improvements:

TEXT TO ANALYZE:
"${text}"

TASK: Provide line-by-line analysis of the actual content above. Identify genuine issues that exist in the text and suggest realistic improvements. Do not use template responses - analyze what is actually written.`;

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
      temperature: 0.1,
      max_tokens: 4000,
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
      return generateRobustFallbackResponse(messages[1].content);
    }
    
    throw error;
  }
};

const generateRobustFallbackResponse = (originalText: string): string => {
  const userText = originalText.replace(/^Analyze this IELTS writing.*?"/, '').replace(/".*$/, '');
  const sentences = userText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let lineAnalysis = '';
  sentences.forEach((sentence, index) => {
    const cleanSentence = sentence.trim();
    if (cleanSentence) {
      const analysis = performDetailedSentenceAnalysis(cleanSentence);
      lineAnalysis += `Sentence ${index + 1}: "${cleanSentence}"\n`;
      lineAnalysis += `• SPELLING/GRAMMAR ERRORS: ${analysis.spellingGrammar}\n`;
      lineAnalysis += `• VOCABULARY ISSUES: ${analysis.vocabulary}\n`;
      lineAnalysis += `• GRAMMAR CORRECTIONS: ${analysis.grammar}\n`;
      lineAnalysis += `• COHERENCE PROBLEMS: ${analysis.coherence}\n`;
      lineAnalysis += `• TASK RELEVANCE: ${analysis.taskRelevance}\n`;
      lineAnalysis += `• SEVERITY: ${analysis.severity}\n`;
      lineAnalysis += `• SPECIFIC FIXES: ${analysis.fixes}\n\n`;
    }
  });

  const markedImprovements = generatePreciseMarkedText(userText);
  const band9Version = generateSophisticatedBand9(userText);

  return `**BAND SCORE**
${calculateBandScore(userText)}

**DETAILED LINE-BY-LINE ANALYSIS**
${lineAnalysis}

**MARKED IMPROVEMENTS**
${markedImprovements}

**BAND 9 TRANSFORMATION**
${band9Version}

**ERROR SUMMARY**
Spelling Errors: ${countSpellingErrors(userText)}
Grammar Errors: ${countGrammarErrors(userText)}
Vocabulary Issues: ${countVocabIssues(userText)}
Coherence Problems: ${countCohesionIssues(userText)}`;
};

const performDetailedSentenceAnalysis = (sentence: string) => {
  const errors: string[] = [];
  const fixes: string[] = [];
  let severity = 'LOW';

  // Common spelling mistakes
  const spellingErrors = [
    { wrong: /\brecieve\b/gi, correct: 'receive' },
    { wrong: /\bachieve\b/gi, correct: 'achieve' },
    { wrong: /\boccured\b/gi, correct: 'occurred' },
    { wrong: /\bbeggining\b/gi, correct: 'beginning' },
    { wrong: /\bdefinately\b/gi, correct: 'definitely' },
    { wrong: /\bseperate\b/gi, correct: 'separate' },
    { wrong: /\benvironment\b/gi, correct: 'environment' },
    { wrong: /\bgovernment\b/gi, correct: 'government' }
  ];

  // Grammar patterns
  const grammarErrors = [
    { pattern: /\ba university\b/gi, issue: 'Correct: "a university"', severity: 'LOW' },
    { pattern: /\ban university\b/gi, issue: 'Should be "a university"', severity: 'HIGH' },
    { pattern: /\bpeople is\b/gi, issue: 'Should be "people are"', severity: 'HIGH' },
    { pattern: /\bmuch people\b/gi, issue: 'Should be "many people"', severity: 'HIGH' },
    { pattern: /\bless people\b/gi, issue: 'Should be "fewer people"', severity: 'MEDIUM' },
    { pattern: /\bin the other hand\b/gi, issue: 'Should be "on the other hand"', severity: 'MEDIUM' },
    { pattern: /\bdepends of\b/gi, issue: 'Should be "depends on"', severity: 'HIGH' }
  ];

  // Basic vocabulary that needs upgrading
  const basicVocab = [
    { basic: /\bvery good\b/gi, better: 'excellent/outstanding' },
    { basic: /\bvery bad\b/gi, better: 'terrible/detrimental' },
    { basic: /\bbig problem\b/gi, better: 'significant issue/major concern' },
    { basic: /\ba lot of\b/gi, better: 'numerous/substantial' },
    { basic: /\bget\b/gi, better: 'obtain/acquire/receive' },
    { basic: /\bmake\b/gi, better: 'create/establish/generate' },
    { basic: /\bthing\b/gi, better: 'aspect/factor/element' }
  ];

  // Check for spelling errors
  let spellingIssues = [];
  spellingErrors.forEach(({ wrong, correct }) => {
    if (wrong.test(sentence)) {
      spellingIssues.push(`"${sentence.match(wrong)?.[0]}" → "${correct}"`);
      severity = 'HIGH';
    }
  });

  // Check for grammar errors
  let grammarIssues = [];
  grammarErrors.forEach(({ pattern, issue, severity: errSeverity }) => {
    if (pattern.test(sentence)) {
      grammarIssues.push(issue);
      if (errSeverity === 'HIGH') severity = 'HIGH';
      else if (errSeverity === 'MEDIUM' && severity === 'LOW') severity = 'MEDIUM';
    }
  });

  // Check for basic vocabulary
  let vocabIssues = [];
  basicVocab.forEach(({ basic, better }) => {
    if (basic.test(sentence)) {
      const match = sentence.match(basic)?.[0];
      vocabIssues.push(`"${match}" → ${better}`);
      if (severity === 'LOW') severity = 'MEDIUM';
    }
  });

  // Additional checks
  const wordCount = sentence.split(' ').length;
  let taskRelevance = 'Addresses topic appropriately';
  let coherence = 'Adequate sentence flow';

  if (wordCount < 5) {
    taskRelevance = 'Too brief - needs more development';
    severity = 'MEDIUM';
  }

  if (!sentence.match(/\b(however|moreover|furthermore|therefore|consequently|nevertheless)\b/i) && wordCount > 15) {
    coherence = 'Lacks sophisticated linking words';
    fixes.push('Add advanced connectors like "furthermore", "consequently"');
  }

  return {
    spellingGrammar: spellingIssues.length > 0 ? spellingIssues.join(', ') : grammarIssues.length > 0 ? grammarIssues.join(', ') : 'No major errors detected',
    vocabulary: vocabIssues.length > 0 ? vocabIssues.join(', ') : 'Vocabulary adequate for task',
    grammar: grammarIssues.length > 0 ? grammarIssues.join(', ') : 'Grammar generally accurate',
    coherence,
    taskRelevance,
    severity,
    fixes: fixes.length > 0 ? fixes.join('; ') : spellingIssues.concat(grammarIssues, vocabIssues).join('; ') || 'Consider enhancing sophistication'
  };
};

const calculateBandScore = (text: string): string => {
  let score = 7.0;
  
  // Deduct for basic vocabulary
  if (text.match(/\b(good|bad|big|small|very|thing|stuff|get|make)\b/gi)) score -= 0.5;
  
  // Deduct for grammar errors
  if (text.match(/\b(people is|much people|an university|depends of)\b/gi)) score -= 1.0;
  
  // Deduct for spelling errors
  if (text.match(/\b(recieve|occured|seperate|definately)\b/gi)) score -= 0.5;
  
  // Deduct for contractions
  if (text.match(/\b(don't|can't|won't|it's)\b/gi)) score -= 0.5;
  
  return Math.max(5.0, score).toFixed(1);
};

const countSpellingErrors = (text: string): string => {
  const commonMistakes = text.match(/\b(recieve|occured|seperate|definately|beggining|achive|enviroment|goverment)\b/gi);
  return commonMistakes ? `${commonMistakes.length} found: ${commonMistakes.join(', ')}` : 'None detected';
};

const countGrammarErrors = (text: string): string => {
  const grammarPatterns = [
    /\ban university\b/gi,
    /\bpeople is\b/gi,
    /\bmuch people\b/gi,
    /\bless people\b/gi,
    /\bin the other hand\b/gi,
    /\bdepends of\b/gi,
    /\bmore better\b/gi,
    /\bmore faster\b/gi,
    /\bdidn't went\b/gi,
    /\bdidn't saw\b/gi
  ];

  const issues = [];
  grammarPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      issues.push(...matches.map(match => match.toLowerCase()));
    }
  });

  return issues.length > 0 ? `${issues.length} found: ${issues.join(', ')}` : 'None detected';
};

const countVocabIssues = (text: string): string => {
  const issues = [];
  if (text.match(/\b(good|bad|big|small|very)\b/gi)) issues.push("Basic vocabulary");
  if (text.match(/\b(thing|stuff|people|get)\b/gi)) issues.push("Vague terms");
  return issues.length > 0 ? `${issues.length} found: ${issues.join(', ')}` : "Vocabulary adequate";
};

const countCohesionIssues = (text: string): string => {
  const issues = [];
  if (!text.match(/\b(however|moreover|furthermore|consequently)\b/gi)) issues.push("Limited cohesive devices");
  if (text.split(/[.!?]+/).length > 3 && !text.includes(',')) issues.push("Poor sentence linking");
  return issues.length > 0 ? `${issues.length} found: ${issues.join(', ')}` : "Coherence maintained";
};

export const parseDeepSeekResponse = (response: string) => {
  console.log('Parsing enhanced AI response...');
  
  // Enhanced parsing with multiple fallback patterns
  const scorePatterns = [
    /\*\*BAND SCORE\*\*\s*\n([^\n]*)/,
    /Band Score:\s*([^\n]*)/,
    /Score:\s*([^\n]*)/
  ];
  
  const lineAnalysisPatterns = [
    /\*\*DETAILED LINE-BY-LINE ANALYSIS\*\*\s*\n(.*?)(?=\*\*MARKED IMPROVEMENTS|$)/s,
    /DETAILED LINE-BY-LINE ANALYSIS:\s*\n(.*?)(?=\*\*|$)/s
  ];
  
  const improvedPatterns = [
    /\*\*MARKED IMPROVEMENTS\*\*\s*\n(.*?)(?=\*\*BAND 9|$)/s,
    /MARKED IMPROVEMENTS:\s*\n(.*?)(?=\*\*|$)/s
  ];
  
  const band9Patterns = [
    /\*\*BAND 9 TRANSFORMATION\*\*\s*\n(.*?)(?=\*\*ERROR SUMMARY|$)/s,
    /BAND 9 TRANSFORMATION:\s*\n(.*?)(?=\*\*|$)/s
  ];

  // Extract with robust fallbacks
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

  let lineByLineAnalysis = 'Enhanced analysis not available.';
  for (const pattern of lineAnalysisPatterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 100) {
      lineByLineAnalysis = match[1].trim();
      break;
    }
  }

  let improvedText = 'Marked improvements not available.';
  for (const pattern of improvedPatterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 50) {
      improvedText = match[1].trim();
      break;
    }
  }

  let band9Version = '';
  for (const pattern of band9Patterns) {
    const match = response.match(pattern);
    if (match && match[1].trim().length > 100) {
      band9Version = match[1].trim();
      break;
    }
  }

  // Enhanced fallback generation
  if (band9Version.length < 50) {
    const userTextMatch = response.match(/"([^"]{30,})"/);
    const originalText = userTextMatch ? userTextMatch[1] : '';
    
    if (originalText) {
      band9Version = generateSophisticatedBand9(originalText);
    }
  }

  console.log('Enhanced parsing complete:', { 
    score, 
    analysisLength: lineByLineAnalysis.length,
    improvedLength: improvedText.length,
    band9Length: band9Version.length
  });

  return {
    score: score,
    explanation: 'Comprehensive feedback provided with detailed analysis',
    lineByLineAnalysis: lineByLineAnalysis,
    markedErrors: '',
    improvedText: improvedText,
    band9Version: band9Version
  };
};

const generatePreciseMarkedText = (originalText: string): string => {
  let improved = originalText;
  
  // Precise replacements with clear marking
  const replacements = [
    { pattern: /\bvery\s+(\w+)/g, replacement: '[-very-] [+exceptionally+] $1' },
    { pattern: /\bgood\b/gi, replacement: '[-good-] [+beneficial+]' },
    { pattern: /\bbad\b/gi, replacement: '[-bad-] [+detrimental+]' },
    { pattern: /\bbig\b/gi, replacement: '[-big-] [+substantial+]' },
    { pattern: /\bsmall\b/gi, replacement: '[-small-] [+minimal+]' },
    { pattern: /\ba lot of\b/gi, replacement: '[-a lot of-] [+numerous+]' },
    { pattern: /\bpeople\b/gi, replacement: '[-people-] [+individuals+]' },
    { pattern: /\bthink\b/gi, replacement: '[-think-] [+contend+]' },
    { pattern: /\bbecause\b/gi, replacement: '[-because-] [+owing to the fact that+]' },
    { pattern: /\bdon't\b/gi, replacement: '[-don\'t-] [+do not+]' },
    { pattern: /\bcan't\b/gi, replacement: '[-can\'t-] [+cannot+]' },
    { pattern: /\band\b/g, replacement: '{furthermore|and}' },
    { pattern: /\bbut\b/g, replacement: '{however|but}' },
    { pattern: /\bso\b/g, replacement: '{consequently|so}' }
  ];

  replacements.forEach(({ pattern, replacement }) => {
    improved = improved.replace(pattern, replacement);
  });

  return improved;
};

const generateSophisticatedBand9 = (originalText: string): string => {
  let enhanced = originalText;
  
  // Advanced Band 9 transformations
  const band9Replacements = [
    { from: /\bvery\s+important\b/gi, to: 'of paramount significance' },
    { from: /\bvery\s+good\b/gi, to: 'exceptionally advantageous' },
    { from: /\bvery\s+bad\b/gi, to: 'profoundly detrimental' },
    { from: /\bpeople\s+think\b/gi, to: 'individuals maintain' },
    { from: /\bmany people\b/gi, to: 'a considerable proportion of the populace' },
    { from: /\bin my opinion\b/gi, to: 'from my perspective' },
    { from: /\bI think\b/gi, to: 'I would contend' },
    { from: /\bbecause\b/gi, to: 'attributable to' },
    { from: /\bso\b/g, to: 'consequently' },
    { from: /\bbut\b/g, to: 'nevertheless' },
    { from: /\band\b/g, to: 'moreover' },
    { from: /\balso\b/gi, to: 'furthermore' },
    { from: /\bfor example\b/gi, to: 'to exemplify this notion' },
    { from: /\bin conclusion\b/gi, to: 'in synthesis' }
  ];

  band9Replacements.forEach(({ from, to }) => {
    enhanced = enhanced.replace(from, to);
  });

  // Add sophisticated academic phrases
  const sentences = enhanced.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const enhancedSentences = sentences.map((sentence, index) => {
    let enhanced = sentence.trim();
    
    if (index === 0 && !enhanced.match(/^(In contemporary discourse|Throughout the annals of|It is widely postulated)/)) {
      enhanced = 'In contemporary discourse, ' + enhanced.toLowerCase();
    }
    
    if (enhanced.length < 100 && !enhanced.includes(',')) {
      enhanced = enhanced.replace(/\.?$/, ', thereby illuminating the multifaceted nature of this phenomenon.');
    }
    
    return enhanced;
  });

  return enhancedSentences.join('. ') + '.';
};
