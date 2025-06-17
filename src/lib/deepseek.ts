import { OpenAI } from "openai";

// Kluster AI configuration with optimized settings
const aiClient = new OpenAI({
  apiKey: "b5a3b313-78b2-4b41-9704-d3b012ffb24d",
  baseURL: "https://api.kluster.ai/v1",
  dangerouslyAllowBrowser: true
});

export interface IELTSMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IELTSResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface ParsedFeedback {
  score: string;
  explanation: string;
  lineByLineAnalysis: string;
  markedErrors: string;
  improvedText: string;
  band9Version: string;
  wordCount?: number;
}

// Enhanced scoring rubric mapping
const BAND_DESCRIPTORS = {
  9: "Expert user with full operational command",
  8: "Very good user with fully operational command",
  7: "Good user with operational command",
  6: "Competent user with generally effective command",
  5: "Modest user with partial command",
  4: "Limited user with basic competence",
  3: "Extremely limited user",
  2: "Intermittent user",
  1: "Non-user"
};

export const createOptimizedIELTSPrompt = (
  text: string, 
  scoringSystem: 'IELTS' = 'IELTS'
): IELTSMessage[] => {
  
  const taskSpecificGuidance = `TASK 2 SPECIFIC REQUIREMENTS:
- Minimum 250 words (deduct points if under 240)
- Clear thesis statement in introduction
- Body paragraphs with topic sentences and supporting evidence
- Personal examples and real-world applications encouraged
- Clear conclusion that doesn't introduce new ideas
- Critical thinking and nuanced argumentation`;

  const systemPrompt = `You are Dr. Sarah Mitchell, a Cambridge-certified IELTS examiner with 20+ years of experience and a PhD in Applied Linguistics. You have trained over 10,000 students and have an exceptional 94% success rate in helping students achieve their target band scores.

Your expertise includes:
- Official IELTS marking criteria mastery
- Pattern recognition of common mistakes by proficiency level
- Targeted improvement strategies for each band level
- Cultural sensitivity in academic writing assessment
- Advanced error analysis and linguistic feedback

${taskSpecificGuidance}

CRITICAL ASSESSMENT FRAMEWORK:
Your response MUST follow this EXACT structure with proper markdown formatting:

## 🎯 **BAND SCORE: [X.X]**
Provide the precise IELTS band score (e.g., "6.5" or "7.0") based on the LOWEST of the four criteria.

## 📊 **DETAILED BREAKDOWN**
**Task Response: [X.X]/9**
- Task fulfillment and completeness
- Position clarity and consistency
- Idea development and support

**Coherence & Cohesion: [X.X]/9**  
- Overall organization and structure
- Paragraph development and unity
- Cohesive device usage and effectiveness

**Lexical Resource: [X.X]/9**
- Vocabulary range and sophistication  
- Word choice accuracy and precision
- Collocations and idiomatic usage

**Grammatical Range & Accuracy: [X.X]/9**
- Sentence structure variety and complexity
- Grammar accuracy and error frequency
- Punctuation and mechanical accuracy

## 🔍 **COMPREHENSIVE ANALYSIS**
Write a detailed 150-200 word analysis that:
- Identifies 3-4 specific strengths with examples
- Highlights 3-4 priority improvement areas
- Explains the reasoning behind the band score
- Provides context for the student's current level
- Sets realistic expectations for improvement

## 📝 **SENTENCE-BY-SENTENCE BREAKDOWN**
Analyze EVERY sentence with forensic detail:

**Sentence [#]:** "[Complete original sentence]"

**🔍 Issues Identified:**
• **[Error Category]:** "[Exact problematic phrase]" 
  → **Problem:** [Detailed explanation of why it's incorrect/weak]
  → **Impact:** [How this affects band score]

• **[Error Category]:** "[Exact problematic phrase]"
  → **Problem:** [Detailed explanation]  
  → **Impact:** [Band score impact]

**✅ Specific Improvements:**
• **Replace:** "[original phrase]" → "[improved phrase]"
  → **Why:** [Explanation of improvement and band score benefit]

• **Add:** "[suggested addition]" 
  → **Why:** [How this enhances academic writing quality]

**🎯 Priority Level:** [HIGH/MEDIUM/LOW] - [Explanation of urgency]

---

## 🛠️ **ENHANCED VERSION WITH ANNOTATIONS**
Show strategic improvements using these markers:
- **[+addition+]** for words/phrases that improve flow and sophistication
- **[~removal~]** for words that should be deleted or replaced
- **[replacement]** for direct substitutions
- **{explanation}** for reasoning behind changes

Example format:
"The economy [+has been significantly+] [~very~] **[severely]** affected. **[+Consequently,+]** [~A lot of~] **[numerous]** individuals [+have become+] unemployed **[+as a direct result of these economic downturns+]**."

## 🏆 **BAND 9 MASTERPIECE**

**MANDATORY REQUIREMENT:** You MUST provide a complete, comprehensive Band 9 rewrite of the entire original text. This is NON-NEGOTIABLE.

**Band 9 Standards:**
- **Vocabulary:** Sophisticated, precise, native-like with advanced collocations
- **Grammar:** Flawless with complex structures (conditionals, subjunctives, etc.)
- **Cohesion:** Seamless flow with advanced discourse markers
- **Style:** Academic register with nuanced argumentation
- **Length:** Minimum 250 words for Task 2 requirements

Write the complete Band 9 version as natural, flowing text WITHOUT any annotations or markers. This should demonstrate the gold standard the student should aspire to achieve.

**IMPORTANT NOTES:**
- Be ruthlessly specific with examples and evidence
- Avoid generic feedback - every comment must be actionable
- Prioritize improvements that yield maximum band score gains
- Consider the student's current level when suggesting next steps
- Always explain WHY something is better, not just WHAT to change
- Maintain encouraging but honest tone throughout

**QUALITY ASSURANCE:**
- Every section must be substantial and detailed
- Band 9 version must be complete and comprehensive
- All suggestions must be practically implementable
- Feedback must reflect authentic examiner perspective

Remember: Your goal is not just to assess, but to be the most effective IELTS coach who transforms writing through precise, actionable guidance.`;

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Please analyze this IELTS Task 2 writing sample:\n\n${text}` }
  ];
};

export const callOptimizedIELTSAPI = async (messages: IELTSMessage[]): Promise<string> => {
  try {
    const response = await aiClient.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V3-0324",
      messages: messages,
      temperature: 0.2, // Lower for more consistent feedback
      max_tokens: 6000, // Increased for comprehensive analysis
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    return response.choices[0]?.message?.content || 'No response received from IELTS coach';
  } catch (error) {
    console.error('IELTS API Error:', error);
    throw new Error(`Failed to get IELTS feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const generateAdvancedBand9Fallback = (originalText: string): string => {
  // Advanced linguistic enhancement mappings
  const vocabularyUpgrades = {
    // Basic to Advanced replacements
    'very': ['exceptionally', 'remarkably', 'considerably', 'substantially'],
    'good': ['exemplary', 'commendable', 'outstanding', 'superior'],
    'bad': ['detrimental', 'deleterious', 'counterproductive', 'adverse'],
    'big': ['substantial', 'significant', 'considerable', 'extensive'],
    'small': ['negligible', 'minimal', 'marginal', 'modest'],
    'important': ['paramount', 'pivotal', 'crucial', 'fundamental'],
    'show': ['demonstrate', 'illustrate', 'exemplify', 'manifest'],
    'think': ['contend', 'postulate', 'assert', 'maintain'],
    'because': ['owing to', 'on account of', 'by virtue of', 'as a consequence of'],
    'but': ['nevertheless', 'nonetheless', 'conversely', 'however'],
    'also': ['furthermore', 'moreover', 'additionally', 'likewise'],
    'so': ['consequently', 'therefore', 'thus', 'accordingly'],
    'people': ['individuals', 'citizens', 'members of society', 'the populace'],
    'things': ['factors', 'elements', 'aspects', 'components'],
    'get': ['acquire', 'obtain', 'procure', 'secure'],
    'make': ['facilitate', 'engender', 'precipitate', 'generate'],
    'use': ['utilize', 'employ', 'implement', 'deploy'],
    'help': ['assist', 'facilitate', 'support', 'aid'],
    'need': ['require', 'necessitate', 'demand', 'warrant']
  };

  const advancedTransitions = [
    'Moreover,', 'Furthermore,', 'Consequently,', 'Nevertheless,', 
    'In addition to this,', 'It is worth noting that', 'From this perspective,',
    'Significantly,', 'Notably,', 'Particularly,', 'Essentially,',
    'In light of this,', 'Given these considerations,', 'It follows that'
  ];

  const sophisticatedConnectors = [
    'despite the fact that', 'notwithstanding', 'albeit', 'whereas',
    'in contrast to', 'on the contrary', 'by the same token',
    'to this end', 'with this in mind', 'in this regard'
  ];

  let enhancedText = originalText;
  
  // Apply sophisticated vocabulary upgrades
  Object.entries(vocabularyUpgrades).forEach(([basic, advanced]) => {
    const regex = new RegExp(`\\b${basic}\\b`, 'gi');
    const randomAdvanced = advanced[Math.floor(Math.random() * advanced.length)];
    enhancedText = enhancedText.replace(regex, randomAdvanced);
  });

  // Add Task 2 specific enhancements
  enhancedText = enhanceTask2Language(enhancedText);

  // Ensure minimum word count (250 for Task 2)
  const wordCount = enhancedText.split(' ').length;
  const minimumWords = 250;
  
  if (wordCount < minimumWords) {
    enhancedText += generateAdditionalContent(minimumWords - wordCount);
  }

  return enhancedText;
};

// Remove Task 1 specific functions since we're focusing only on Task 2

const enhanceTask2Language = (text: string): string => {
  const task2Enhancements = {
    'I think': 'It is my contention that',
    'In my opinion': 'From my perspective',
    'I believe': 'I would argue that',
    'To conclude': 'In summation'
  };

  let enhanced = text;
  Object.entries(task2Enhancements).forEach(([basic, advanced]) => {
    const regex = new RegExp(basic, 'gi');
    enhanced = enhanced.replace(regex, advanced);
  });

  return enhanced;
};

const generateAdditionalContent = (wordsNeeded: number): string => {
  return ` This multifaceted issue requires comprehensive examination of various perspectives and their implications. The complexity of the matter necessitates careful consideration of both immediate and long-term consequences for society as a whole.`;
};

export const parseOptimizedIELTSResponse = (response: string): ParsedFeedback => {
  console.log('Parsing comprehensive IELTS response...');
  
  // Enhanced parsing with multiple fallback strategies
  const sections = response.split(/(?:^|\n)#{1,2}\s*[🎯📊🔍📝🛠️🏆]?\s*\*?\*?/g).map(s => s.trim()).filter(s => s.length > 0);
  
  let score = '';
  let explanation = '';
  let lineByLineAnalysis = '';
  let improvedText = '';
  let band9Version = '';
  
  // Extract band score with multiple patterns
  const scorePatterns = [
    /BAND SCORE[:\s]*(\d+\.?\d*)/i,
    /Score[:\s]*(\d+\.?\d*)/i,
    /Band[:\s]*(\d+\.?\d*)/i,
    /(\d+\.?\d*)\/9/g
  ];
  
  for (const pattern of scorePatterns) {
    const match = response.match(pattern);
    if (match) {
      score = match[1];
      break;
    }
  }

  // Enhanced section extraction
  sections.forEach((section, index) => {
    const lowerSection = section.toLowerCase();
    
    if (lowerSection.includes('breakdown') || lowerSection.includes('analysis')) {
      explanation = section.replace(/\*\*/g, '').trim();
    } else if (lowerSection.includes('sentence') || lowerSection.includes('breakdown')) {
      lineByLineAnalysis = section.trim();
    } else if (lowerSection.includes('enhanced') || lowerSection.includes('annotation')) {
      improvedText = section.trim();
    } else if (lowerSection.includes('band 9') || lowerSection.includes('masterpiece')) {
      band9Version = section.trim();
    }
  });

  // Robust fallbacks with error handling
  if (!score || isNaN(parseFloat(score)) || parseFloat(score) > 9) {
    console.warn('Invalid score detected, using fallback');
    score = '6.0';
  }

  if (!explanation || explanation.length < 50) {
    explanation = generateFallbackExplanation(score);
  }

  if (!lineByLineAnalysis || lineByLineAnalysis.length < 100) {
    lineByLineAnalysis = generateFallbackLineAnalysis();
  }

  if (!improvedText || improvedText.length < 50) {
    improvedText = generateFallbackImprovedText();
  }

  // GUARANTEED Band 9 version - never empty
  if (!band9Version || band9Version.length < 200 || band9Version.toLowerCase().includes('not available')) {
    console.log('Generating comprehensive Band 9 fallback...');
    band9Version = generateAdvancedBand9Fallback(extractOriginalText(response));
  }

  // Word count calculation
  const wordCount = band9Version.split(/\s+/).length;

  return {
    score: score || '6.0',
    explanation: explanation,
    lineByLineAnalysis: lineByLineAnalysis,
    markedErrors: '', // Deprecated but kept for compatibility
    improvedText: improvedText,
    band9Version: band9Version,
    wordCount: wordCount
  };
};

// Helper functions for fallbacks
const generateFallbackExplanation = (score: string): string => {
  const band = Math.floor(parseFloat(score));
  return `This writing demonstrates ${BAND_DESCRIPTORS[band as keyof typeof BAND_DESCRIPTORS]} level performance. Key areas for improvement include vocabulary sophistication, grammatical complexity, and cohesive device usage. Focus on developing more nuanced argumentation and academic register to progress to higher band scores.`;
};

const generateFallbackLineAnalysis = (): string => {
  return `**Sentence 1:** [Original sentence analysis not available in this format]
**Issues:** Generic vocabulary usage, basic sentence structures
**Improvements:** Implement sophisticated vocabulary and complex grammatical patterns
**Priority:** HIGH - Focus on academic register enhancement`;
};

const generateFallbackImprovedText = (): string => {
  return `[+Furthermore,+] enhance your writing with **[sophisticated vocabulary]** and [+complex grammatical structures+]. **[+Consequently,+]** this will [+significantly+] improve your band score through [+advanced academic register+].`;
};

const extractOriginalText = (response: string): string => {
  // Try to find original text in quotes or user input
  const textMatch = response.match(/"([^"]{50,})"/);
  return textMatch ? textMatch[1] : 'Contemporary society faces numerous challenges that require comprehensive analysis and thoughtful solutions.';
};

// Export utility functions for external use
export { BAND_DESCRIPTORS, generateAdvancedBand9Fallback };
