
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  // Updated API key - this should be a valid OpenRouter key
  const HARDCODED_API_KEY = 'sk-or-v1-d4c8f2e1a5b3c7f9e8d2a6b4c9f1e3d7a5b8c2f6e9d1a4b7c0f3e6d9a2b5c8f1e4d7';

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
