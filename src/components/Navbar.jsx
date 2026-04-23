import { useState } from 'react';
import { GitBranch, Loader2, Sparkles, Download } from 'lucide-react';

export default function Navbar({ onFetch, loading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) onFetch(username.trim());
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700/50 px-4 py-3">
      <div className="max-w-screen-2xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-base hidden sm:block leading-none">ReadmeAI</span>
            <span className="text-xs text-slate-500 hidden sm:block leading-none">GitHub Profile Generator</span>
          </div>
        </div>

        {/* GitHub pre-fill */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <div className="relative">
            <GitBranch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="GitHub username to pre-fill..."
              className="bg-slate-800 border border-slate-600 rounded-lg pl-8 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition w-64"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <GitBranch size={13} />}
            Pre-fill
          </button>
        </form>

        <span className="text-xs text-slate-500 hidden lg:block">
          ✏️ Fill the form on the left — preview updates live on the right
        </span>
      </div>
    </header>
  );
}
