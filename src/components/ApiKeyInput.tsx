
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  // Use the hardcoded Kluster AI API key
  const HARDCODED_API_KEY = 'b5a3b313-78b2-4b41-9704-d3b012ffb24d';

  // Set the API key on component mount
  useState(() => {
    onApiKeySet(HARDCODED_API_KEY);
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Kluster AI Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            Kluster AI is configured and ready to use. Powered by{' '}
            <a 
              href="https://api.kluster.ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              kluster.ai
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="text-sm text-green-600">
          ✓ API key configured and ready to use with DeepSeek-V3 model
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
