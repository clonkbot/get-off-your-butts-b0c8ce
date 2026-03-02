import { useConvexAuth, useQuery, useAction } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Zap,
  Target,
  Skull,
  TrendingUp,
  AlertTriangle,
  Send,
  Globe,
  Briefcase,
  LogOut,
  Coffee,
  Clock,
  Trophy
} from "lucide-react";
import { api } from "../convex/_generated/api";

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(flow === "signIn" ? "Invalid credentials. Try harder!" : "Sign up failed. Even this is too hard for you?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTEiPjwvcmVjdD4KPC9zdmc+')] opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            animate={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block"
          >
            <Flame className="w-16 h-16 md:w-20 md:h-20 mx-auto text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.5)]" />
          </motion.div>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter">
            GET OFF YOUR <span className="text-red-500">BUTTS</span>
          </h1>
          <p className="mt-2 text-orange-400/80 font-mono text-sm">for 2 minutes</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-6 md:p-8 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">
              {flow === "signIn" ? "Welcome back, slacker" : "Join the motivated"}
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              {flow === "signIn"
                ? "Time to face the music"
                : "First step: Actually signing up"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="lazy@example.com"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-sm flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.span>
                  Processing...
                </span>
              ) : (
                flow === "signIn" ? "Face the Scolding" : "Sign Up for Pain"
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-800/50">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="w-full text-center text-zinc-400 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn"
                ? "No account? Sign up (if you can manage it)"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => signIn("anonymous")}
              className="w-full py-3 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 font-medium rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Skull className="w-4 h-4" />
              Continue as Coward (Anonymous)
            </button>
          </div>
        </motion.div>

        <p className="text-center text-zinc-600 text-xs mt-6">
          Warning: This app will hurt your feelings (productively)
        </p>
      </motion.div>
    </div>
  );
}

function ScoldingSection() {
  const [message, setMessage] = useState("");
  const [currentScolding, setCurrentScolding] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const generateScolding = useAction(api.scolding.generateScolding);
  const history = useQuery(api.scolding.getHistory);
  const stats = useQuery(api.scolding.getStats);

  const handleScold = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await generateScolding({ userMessage: message || "I'm being lazy" });
      setCurrentScolding(response);
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Bar */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-3 gap-3 md:gap-4"
        >
          <div className="bg-gradient-to-br from-red-950/50 to-red-900/30 rounded-xl p-3 md:p-4 border border-red-800/30">
            <div className="flex items-center gap-2 text-red-400 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Scolds</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">{stats.totalScolds}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-950/50 to-orange-900/30 rounded-xl p-3 md:p-4 border border-orange-800/30">
            <div className="flex items-center gap-2 text-orange-400 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Streak</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">{stats.lazyStreak}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-950/50 to-amber-900/30 rounded-xl p-3 md:p-4 border border-amber-800/30">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-xs uppercase tracking-wider">Active</span>
            </div>
            <p className="text-xl md:text-2xl font-black text-white">
              {Math.floor((Date.now() - stats.lastActiveAt) / 60000)}m
            </p>
          </div>
        </motion.div>
      )}

      {/* Scolding Input */}
      <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-800/50 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-bold text-white">Confess Your Laziness</h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What excuse do you have today?"
            onKeyDown={(e) => e.key === "Enter" && handleScold()}
            className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
          />
          <motion.button
            onClick={handleScold}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.span>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Scold Me
              </>
            )}
          </motion.button>
        </div>

        {/* Current Scolding Display */}
        <AnimatePresence mode="wait">
          {currentScolding && (
            <motion.div
              key={currentScolding}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mt-6 p-4 md:p-6 bg-gradient-to-br from-red-950/40 to-orange-950/40 rounded-xl border border-red-800/30"
            >
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <Flame className="w-8 h-8 text-red-500 flex-shrink-0" />
                </motion.div>
                <p className="text-white text-base md:text-lg font-medium leading-relaxed">
                  {currentScolding}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* History */}
      {history && history.length > 0 && (
        <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-800/50 p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Coffee className="w-5 h-5 text-orange-400" />
            Your Hall of Shame
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-700">
            {history.map((record: { _id: string; message: string; scoldingResponse: string }, index: number) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30"
              >
                <p className="text-zinc-400 text-sm mb-1">"{record.message}"</p>
                <p className="text-orange-300 text-sm">{record.scoldingResponse}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function JobsSection() {
  const [url, setUrl] = useState("");
  const [interests, setInterests] = useState("");
  const [isScrapingLoading, setIsScrapingLoading] = useState(false);
  const [isJobsLoading, setIsJobsLoading] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{title: string; description: string; content?: string | null} | null>(null);
  const [jobIdeas, setJobIdeas] = useState<{jobs: Array<{title: string; description: string; insult: string}>; roast: string} | null>(null);

  const scrapeJobSite = useAction(api.jobs.scrapeJobSite);
  const generateJobIdeas = useAction(api.jobs.generateJobIdeas);
  const suggestions = useQuery(api.jobs.getSuggestions);

  const handleScrape = async () => {
    if (!url || isScrapingLoading) return;
    setIsScrapingLoading(true);
    try {
      const result = await scrapeJobSite({ url });
      setScrapeResult(result);
    } finally {
      setIsScrapingLoading(false);
    }
  };

  const handleGenerateJobs = async () => {
    if (!interests || isJobsLoading) return;
    setIsJobsLoading(true);
    try {
      const result = await generateJobIdeas({ interests });
      setJobIdeas(result);
      setInterests("");
    } finally {
      setIsJobsLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Job Site Scraper */}
      <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-800/50 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-cyan-500" />
          <h2 className="text-lg font-bold text-white">Analyze a Job Site</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-4">
          Paste a URL to a job board or company careers page. We'll scrape it and roast you.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/careers"
            className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
          <motion.button
            onClick={handleScrape}
            disabled={isScrapingLoading || !url}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isScrapingLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="w-5 h-5" />
              </motion.span>
            ) : (
              <>
                <Target className="w-5 h-5" />
                Scrape
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {scrapeResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-4 bg-cyan-950/30 rounded-xl border border-cyan-800/30"
            >
              <h4 className="font-bold text-cyan-400 mb-2">{scrapeResult.title}</h4>
              <p className="text-zinc-300 text-sm">{scrapeResult.description}</p>
              {scrapeResult.content && (
                <details className="mt-3">
                  <summary className="text-cyan-500 text-sm cursor-pointer hover:text-cyan-400">
                    View scraped content
                  </summary>
                  <pre className="mt-2 p-3 bg-zinc-900/50 rounded-lg text-xs text-zinc-400 overflow-x-auto max-h-40">
                    {scrapeResult.content}
                  </pre>
                </details>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Job Ideas Generator */}
      <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-800/50 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-emerald-500" />
          <h2 className="text-lg font-bold text-white">Generate Job Ideas</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-4">
          Tell us your "interests" and we'll suggest jobs you should probably apply for.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="sleeping, watching Netflix, avoiding responsibility..."
            className="flex-1 px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <motion.button
            onClick={handleGenerateJobs}
            disabled={isJobsLoading || !interests}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 transition-all disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px]"
          >
            {isJobsLoading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5" />
              </motion.span>
            ) : (
              <>
                <TrendingUp className="w-5 h-5" />
                Generate
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {jobIdeas && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 space-y-3"
            >
              {jobIdeas.jobs.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-emerald-950/30 rounded-xl border border-emerald-800/30"
                >
                  <h4 className="font-bold text-emerald-400">{job.title}</h4>
                  <p className="text-zinc-300 text-sm mt-1">{job.description}</p>
                  <p className="text-orange-400 text-xs mt-2 italic">{job.insult}</p>
                </motion.div>
              ))}
              <div className="p-3 bg-orange-950/30 rounded-xl border border-orange-800/30">
                <p className="text-orange-300 font-medium">{jobIdeas.roast}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Previous Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 rounded-2xl border border-zinc-800/50 p-4 md:p-6">
          <h3 className="text-lg font-bold text-white mb-4">Previous Suggestions</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {suggestions.map((suggestion: { _id: string; title: string; description: string }) => (
              <div
                key={suggestion._id}
                className="p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30"
              >
                <p className="text-white font-medium text-sm">{suggestion.title}</p>
                <p className="text-zinc-500 text-xs mt-1">{suggestion.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

function Dashboard() {
  const { signOut } = useAuthActions();
  const [activeTab, setActiveTab] = useState<"scold" | "jobs">("scold");

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTEiPjwvcmVjdD4KPC9zdmc+')] opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10 pb-24">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-3 text-center sm:text-left">
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Flame className="w-10 h-10 text-red-500" />
            </motion.div>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                GET OFF YOUR <span className="text-red-500">BUTTS</span>
              </h1>
              <p className="text-orange-400/70 font-mono text-xs">for 2 minutes</p>
            </div>
          </div>
          <motion.button
            onClick={() => signOut()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Escape
          </motion.button>
        </motion.header>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800/50"
        >
          <button
            onClick={() => setActiveTab("scold")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "scold"
                ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Flame className="w-4 h-4" />
            Get Scolded
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              activeTab === "jobs"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Find Work
          </button>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "scold" ? (
            <motion.div
              key="scold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ScoldingSection />
            </motion.div>
          ) : (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <JobsSection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 px-4 bg-gradient-to-t from-[#0a0a0f] to-transparent">
        <p className="text-center text-zinc-600 text-xs">
          Requested by <span className="text-zinc-500">@web-user</span> · Built by <span className="text-zinc-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Flame className="w-16 h-16 text-red-500" />
        </motion.div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <AuthScreen />;
}
