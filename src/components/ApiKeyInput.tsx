
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  // Update to use your latest provided OpenRouter key
  const HARDCODED_API_KEY = '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';

  // Set the API key on component mount or on change
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
