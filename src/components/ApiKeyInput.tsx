
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  // Use the hardcoded API key
  const HARDCODED_API_KEY = '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';

  // Set the API key on component mount
  useState(() => {
    onApiKeySet(HARDCODED_API_KEY);
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          OpenRouter API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            OpenRouter API is configured and ready to use. Powered by{' '}
            <a 
              href="https://openrouter.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              openrouter.ai
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="text-sm text-green-600">
          ✓ API key configured and ready to use
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
