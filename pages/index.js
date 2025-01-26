import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Home() {
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const matchCharacter = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("/api/match-character", { username });
      console.log("DATA",response.data);
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-2xl border-2 border-blue-200">
        <CardHeader className="text-center bg-blue-500 text-white py-6">
          <div className="flex justify-center mb-4">
            <UserCircle2 size={64} />
          </div>
          <CardTitle className="text-2xl font-bold">
            Which Blue Lock Character Are You?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center border-b-2 border-blue-300 pb-2">
              {/* <Twitter className="mr-3 text-blue-500" /> */}
              <Input
                placeholder="Enter Twitter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-none focus:outline-none"
              />
            </div>

            <Button
              onClick={matchCharacter}
              disabled={!username || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Find My Character"
              )}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-lg text-blue-800">{result}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
