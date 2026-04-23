import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code2, Eye, Columns2 } from 'lucide-react';

const VIEW_MODES = [
  { id: 'split', icon: Columns2, label: 'Split' },
  { id: 'raw', icon: Code2, label: 'Raw' },
  { id: 'preview', icon: Eye, label: 'Preview' },
];

function RawPanel({ markdown, generating }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-950 relative">
      <SyntaxHighlighter
        language="markdown"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '1rem',
          background: 'transparent',
          fontSize: '12.5px',
          lineHeight: '1.6',
          minHeight: '100%',
        }}
        showLineNumbers
        lineNumberStyle={{ color: '#4b5563', minWidth: '2.5em', paddingRight: '1em' }}
      >
        {markdown || '# Your README will appear here\n\nFetch a GitHub profile and click **Generate with AI** to get started.'}
      </SyntaxHighlighter>
      {generating && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Streaming...
        </div>
      )}
    </div>
  );
}

function PreviewPanel({ markdown, generating }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-900 p-6 relative">
      <div className="markdown-body max-w-3xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ fontSize: '12px' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>{children}</code>
              );
            },
            img({ src, alt, ...props }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  loading="lazy"
                  onError={e => { e.target.style.opacity = '0.3'; }}
                  {...props}
                />
              );
            },
          }}
        >
          {markdown || '*Your rendered README will appear here...*'}
        </ReactMarkdown>
        {generating && <span className="streaming-cursor ml-1" />}
      </div>
    </div>
  );
}

export default function MarkdownPreview({ markdown, generating }) {
  const [viewMode, setViewMode] = useState('split');

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="bg-slate-800/80 border-b border-slate-700/50 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          {VIEW_MODES.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                viewMode === id
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
              ].join(' ')}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {markdown && (
            <>
              <span>{markdown.split('\n').length} lines</span>
              <span>{markdown.length} chars</span>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'split' || viewMode === 'raw') && (
          <div className={[viewMode === 'split' ? 'w-1/2 border-r border-slate-700/50' : 'w-full', 'flex flex-col overflow-hidden'].join(' ')}>
            <div className="bg-slate-900/50 px-4 py-1.5 border-b border-slate-700/30">
              <span className="text-xs text-slate-500 font-mono">README.md</span>
            </div>
            <RawPanel markdown={markdown} generating={generating} />
          </div>
        )}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={[viewMode === 'split' ? 'w-1/2' : 'w-full', 'flex flex-col overflow-hidden'].join(' ')}>
            <div className="bg-slate-900/50 px-4 py-1.5 border-b border-slate-700/30">
              <span className="text-xs text-slate-500">Preview</span>
            </div>
            <PreviewPanel markdown={markdown} generating={generating} />
          </div>
        )}
      </div>
    </div>
  );
}
