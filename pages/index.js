import React, { useState } from "react";
import axios from "axios";
import { TwitterIcon, Loader2 } from "lucide-react";

export default function BlueLockCharacterMatcher() {
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
      setResult(JSON.parse(response.data.result));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-['Inter',_sans-serif] relative overflow-hidden">
      {/* Gridded Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
            <TwitterIcon className="text-white w-16 h-16" />
          </div>

          <h1 className="text-3xl font-bold text-center tracking-tight">
            Blue Lock Character Matcher
          </h1>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Twitter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={matchCharacter}
              disabled={!username || loading}
              className="w-full bg-white text-black py-3 rounded-full font-bold hover:bg-zinc-200 transition-colors duration-300 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Find My Character"
              )}
            </button>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
                {error}
              </div>
            )}

            {result && (
              <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-lg space-y-3">
                <h3 className="text-xl font-semibold text-blue-400">Result</h3>
                <p><span className="text-zinc-400">Username:</span> {result.name}</p>
                <p><span className="text-zinc-400">Blue Lock Character:</span> {result.character}</p>
                <div>
                  <p className="text-zinc-400">Why {result.character}?</p>
                  <p className="text-zinc-500 italic">{result.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}