
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyInput = ({ onApiKeySet, currentApiKey }: ApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      localStorage.setItem('deepseek_api_key', apiKey.trim());
      onApiKeySet(apiKey.trim());
    }
  };

  const clearApiKey = () => {
    localStorage.removeItem('deepseek_api_key');
    setApiKey('');
    onApiKeySet('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          DeepSeek API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertDescription>
            To use AI analysis, you need a DeepSeek API key. Get yours at{' '}
            <a 
              href="https://platform.deepseek.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline inline-flex items-center gap-1"
            >
              platform.deepseek.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="api-key">DeepSeek API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSubmit} disabled={!apiKey.trim()}>
              Save
            </Button>
            {currentApiKey && (
              <Button variant="outline" onClick={clearApiKey}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {currentApiKey && (
          <div className="text-sm text-green-600">
            ✓ API key configured and ready to use
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;
