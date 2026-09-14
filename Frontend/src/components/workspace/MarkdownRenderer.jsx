import React, { useState } from 'react';
import { Copy, Check, Terminal, Info, AlertTriangle, Lightbulb } from 'lucide-react';

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl border border-white/10 bg-[#111216] overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#16181d] text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-mono font-semibold text-slate-300 uppercase text-[11px]">{language || 'code'}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors text-[11px] cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-white/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Inline formatting parser: **bold**, *italic*, `code`, [link](url)
function renderInline(text) {
  if (!text) return null;

  const parts = [];
  let remaining = text;
  let key = 0;

  const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
    }

    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-[#111216] border border-white/10 text-slate-200 font-mono text-[11px]">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(<strong key={key++} className="font-bold text-white">{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(<em key={key++} className="italic text-slate-300">{token.slice(1, -1)}</em>);
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      const label = token.substring(1, token.indexOf(']('));
      const url = token.substring(token.indexOf('](') + 2, token.length - 1);
      parts.push(
        <a key={key++} href={url} target="_blank" rel="noreferrer" className="text-white hover:text-slate-300 underline underline-offset-2 transition-colors">
          {label}
        </a>
      );
    }

    lastIndex = inlineRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : text;
}

export default function MarkdownRenderer({ content = '' }) {
  if (!content) {
    return <div className="text-xs text-slate-500 italic">No content to display.</div>;
  }

  const lines = content.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLanguage = '';
  let inTable = false;
  let tableRows = [];

  const flushTable = () => {
    if (tableRows.length === 0) return;

    const headers = tableRows[0];
    const dataRows = tableRows.slice(1);

    elements.push(
      <div key={`table-${elements.length}`} className="my-4 overflow-x-auto rounded-xl border border-white/10 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#111216] border-b border-white/10 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              {headers.map((cell, cIdx) => (
                <th key={cIdx} className="px-4 py-2.5">
                  {renderInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-[#16181d]">
            {dataRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 text-slate-300">
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block check
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBuffer.join('\n')}
            language={codeLanguage}
          />
        );
        codeBuffer = [];
        codeLanguage = '';
        inCodeBlock = false;
      } else {
        if (inTable) flushTable();
        inCodeBlock = true;
        codeLanguage = line.trim().slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Table row detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').slice(1, -1);
      const isSeparator = cells.every((c) => /^\s*[:-]+[-| :]*$/.test(c));
      if (!isSeparator) {
        inTable = true;
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`blank-${i}`} className="h-2" />);
      continue;
    }

    // Divider
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      elements.push(<hr key={`hr-${i}`} className="my-5 border-white/10" />);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl sm:text-2xl font-black text-white mt-5 mb-2.5 tracking-tight">
          {renderInline(line.slice(2))}
        </h1>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-base sm:text-lg font-bold text-white mt-4 mb-2 tracking-tight border-b border-white/5 pb-1">
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-semibold text-slate-200 mt-3 mb-1.5">
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // Callouts / Alerts
    if (line.startsWith('> [!NOTE]') || line.startsWith('> [!TIP]') || line.startsWith('> [!IMPORTANT]') || line.startsWith('> [!WARNING]')) {
      const type = line.includes('NOTE') ? 'note' : line.includes('TIP') ? 'tip' : line.includes('WARNING') ? 'warning' : 'important';
      const icon = type === 'warning' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : type === 'tip' ? <Lightbulb className="w-4 h-4 text-emerald-400" /> : <Info className="w-4 h-4 text-slate-400" />;
      const border = type === 'warning' ? 'border-amber-500/30 bg-amber-500/10' : type === 'tip' ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-[#111216]';
      
      elements.push(
        <div key={`callout-${i}`} className={`my-3 p-3.5 rounded-xl border ${border} flex items-start gap-3`}>
          <div className="shrink-0 mt-0.5">{icon}</div>
          <div className="text-xs text-slate-200 leading-relaxed">
            {renderInline(line.replace(/>\s*\[!.*?\]\s*/, ''))}
          </div>
        </div>
      );
      continue;
    }

    // Standard Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${i}`} className="my-3 pl-4 border-l-2 border-slate-600 text-xs italic text-slate-400 leading-relaxed">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Checkbox items
    if (line.trim().startsWith('- [ ] ') || line.trim().startsWith('- [x] ') || line.trim().startsWith('- [X] ')) {
      const isChecked = line.trim().startsWith('- [x] ') || line.trim().startsWith('- [X] ');
      const label = line.trim().slice(6);
      elements.push(
        <div key={`check-${i}`} className="flex items-center gap-2.5 my-1 text-xs text-slate-200">
          <input
            type="checkbox"
            checked={isChecked}
            readOnly
            className="w-3.5 h-3.5 rounded bg-[#111216] border-white/20 text-white cursor-default"
          />
          <span className={isChecked ? 'line-through text-slate-500' : 'text-slate-200'}>
            {renderInline(label)}
          </span>
        </div>
      );
      continue;
    }

    // Unordered List item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      elements.push(
        <div key={`li-${i}`} className="flex items-start gap-2 my-1 text-xs text-slate-300">
          <span className="text-slate-500 mt-0.5 font-bold">•</span>
          <span className="leading-relaxed">{renderInline(line.trim().slice(2))}</span>
        </div>
      );
      continue;
    }

    // Numbered list item
    const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
    if (numberedMatch) {
      elements.push(
        <div key={`nli-${i}`} className="flex items-start gap-2 my-1 text-xs text-slate-300">
          <span className="text-slate-500 font-mono text-[11px] shrink-0 mt-0.5">{numberedMatch[1]}.</span>
          <span className="leading-relaxed">{renderInline(numberedMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p key={`p-${i}`} className="my-1.5 text-xs text-slate-300 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-1">{elements}</div>;
}
