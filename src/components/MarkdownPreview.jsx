import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code2, Eye, Columns2, PenLine } from 'lucide-react';

const VIEW_MODES = [
  { id: 'split', icon: Columns2, label: 'Split' },
  { id: 'raw', icon: Code2, label: 'Raw' },
  { id: 'preview', icon: Eye, label: 'Preview' },
];

function RawPanel({ markdown, onChange }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <textarea
        value={markdown}
        onChange={e => onChange(e.target.value)}
        spellCheck={false}
        placeholder={'# Your README will appear here\n\nFill in the form on the left — preview updates live.\nYou can also type or paste directly here.'}
        className="flex-1 w-full h-full resize-none bg-transparent text-slate-200 font-mono text-[12.5px] leading-relaxed p-4 focus:outline-none placeholder-slate-600"
        style={{ tabSize: 2 }}
      />
    </div>
  );
}

function PreviewPanel({ markdown }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-900 p-6">
      <div className="markdown-body max-w-3xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
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
      </div>
    </div>
  );
}

export default function MarkdownPreview({ markdown, onChange }) {
  const [viewMode, setViewMode] = useState('split');

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Toolbar */}
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
          <span className="hidden sm:flex items-center gap-1 text-slate-600">
            <PenLine size={11} />
            Raw is editable
          </span>
          {markdown && (
            <>
              <span>{markdown.split('\n').length} lines</span>
              <span>{markdown.length} chars</span>
            </>
          )}
        </div>
      </div>

      {/* Panels */}
      <div className="flex-1 flex overflow-hidden">
        {(viewMode === 'split' || viewMode === 'raw') && (
          <div className={[
            viewMode === 'split' ? 'w-1/2 border-r border-slate-700/50' : 'w-full',
            'flex flex-col overflow-hidden',
          ].join(' ')}>
            <div className="bg-slate-900/50 px-4 py-1.5 border-b border-slate-700/30 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">README.md</span>
              <span className="text-xs text-violet-400/70 flex items-center gap-1">
                <PenLine size={10} /> editable
              </span>
            </div>
            <RawPanel markdown={markdown} onChange={onChange} />
          </div>
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={[
            viewMode === 'split' ? 'w-1/2' : 'w-full',
            'flex flex-col overflow-hidden',
          ].join(' ')}>
            <div className="bg-slate-900/50 px-4 py-1.5 border-b border-slate-700/30">
              <span className="text-xs text-slate-500">Preview</span>
            </div>
            <PreviewPanel markdown={markdown} />
          </div>
        )}
      </div>
    </div>
  );
}
