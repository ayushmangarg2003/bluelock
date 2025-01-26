import React, { useState } from "react";
import axios from "axios";
import { TwitterIcon, Loader2, Star, Sparkles, UserCheck } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-blue-900 to-black text-white font-['Inter',_sans-serif] relative overflow-hidden p-4">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.2)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px] opacity-50"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full ${result ? "max-w-5xl" : "max-w-md"}`}
      >
        <div className="backdrop-blur-xl bg-black/60 p-4 md:p-8 rounded-2xl border border-blue-900/50 shadow-2xl space-y-8">
          <div className="flex justify-center items-center space-x-4">
            <TwitterIcon className="text-blue-500 w-12 h-12" />
            <Sparkles className="text-yellow-400 w-8 h-8 animate-pulse" />
            <UserCheck className="text-green-500 w-12 h-12" />
          </div>

          <h1 className="text-4xl font-bold text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Blue Lock Character Matcher
          </h1>

          <div className="space-y-5">
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Twitter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-blue-900/30 border border-blue-700/50 text-white px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={matchCharacter}
              disabled={!username || loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-full font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                "Find My Character"
              )}
            </motion.button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-900/30 border border-blue-700/50 p-4 md:p-6 rounded-xl space-y-4"
              >
                <h3 className="text-2xl font-bold text-blue-400 flex items-center space-x-2">
                  <Star className="text-yellow-400" />
                  <span>Your Result</span>
                </h3>
                <div className="space-y-2">
                  <p className="flex items-center space-x-2">
                    <UserCheck className="text-green-500" />
                    <span className="text-zinc-300">Username:</span>
                    <span className="font-semibold text-white">
                      {result.name}
                    </span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Sparkles className="text-purple-500" />
                    <span className="text-zinc-300">Blue Lock Character:</span>
                    <span className="font-semibold text-white">
                      {result.character}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-zinc-300 mb-2">Why {result.character}?</p>
                  <p className="text-zinc-300 italic bg-blue-900/50 p-3 rounded-lg">
                    {result.explanation}
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
