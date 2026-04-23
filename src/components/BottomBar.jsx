import { Copy, Download, GitBranch, AlertCircle } from 'lucide-react';
import { copyToClipboard, downloadMarkdown } from '../utils/markdownHelpers';
import toast from 'react-hot-toast';

export default function BottomBar({ markdown, error }) {
  const handleCopy = async () => {
    if (!markdown) return;
    try {
      await copyToClipboard(markdown);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    if (!markdown) return;
    downloadMarkdown(markdown);
    toast.success('README.md downloaded!');
  };

  return (
    <div className="bg-slate-900 border-t border-slate-700/50 px-4 py-3 flex items-center gap-3 shrink-0">
      <button
        onClick={handleCopy}
        disabled={!markdown}
        className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        <Copy size={13} />
        Copy README
      </button>

      <button
        onClick={handleDownload}
        disabled={!markdown}
        className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-sm transition-colors"
      >
        <Download size={13} />
        Download .md
      </button>

      {markdown && (
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500">
          <GitBranch size={12} />
          <span>Paste into your <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-400 font-mono">username/username</code> repo on GitHub</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs px-3 py-2 rounded-lg">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1" />

      {markdown && (
        <span className="text-xs text-slate-500">
          {markdown.split('\n').length} lines · {markdown.length} chars
        </span>
      )}
    </div>
  );
}
