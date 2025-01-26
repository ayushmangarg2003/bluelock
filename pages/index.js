import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const matchCharacter = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('https://app.wordware.ai/api/released-app/c1950e07-b9d5-408d-9ddb-32c37e7f564f/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ww-Jv7KCtylsgEtNjj4ecDdU7nSVfVxmgDO38k1Ez42DlVAOFpJWDkUqr`
        },
        body: JSON.stringify({
          inputs: {
            "Twitter Handle": username
          },
          version: "^1.0"
        })
      });

      // Log full response for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Which Blue Lock Character Are You?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input 
              placeholder="Enter Twitter Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full"
            />
            <Button 
              onClick={matchCharacter} 
              disabled={!username || loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Find My Character'
              )}
            </Button>

            {error && (
              <div className="text-red-500 text-center">
                Error: {error}
              </div>
            )}

            {result && (
              <div className="text-center mt-4">
                <p className="text-lg">{result}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}