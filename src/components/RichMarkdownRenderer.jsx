import React from 'react';
import {
  ExternalLink,
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

/**
 * Helper to parse inline markdown tags:
 * **bold**, *italic*, `code`, ==highlight==, [Button / Link](url), ~~strike~~
 */
export function renderInlineMarkdown(text) {
  if (!text || typeof text !== 'string') return text;

  // Split text into tokens based on markdown patterns
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|(?:\*|_)[^*_]+(?:\*|_)|`.*?`|==.*?==|~~.*?~~)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // 1. Links / Buttons: [Text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];

      const isButton = linkText.startsWith('🔘') || linkText.startsWith('[Button]') || linkText.startsWith('Button:');
      const cleanText = linkText.replace(/^(🔘\s*|\[Button\]\s*|Button:\s*)/, '');

      if (isButton) {
        return (
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 px-4 py-2 my-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 no-underline cursor-pointer"
          >
            <span>{cleanText}</span>
            <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        );
      }

      return (
        <a
          key={i}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold inline-flex items-center space-x-0.5"
        >
          <span>{cleanText}</span>
          <ExternalLink className="w-3 h-3 inline-block ml-0.5 opacity-70" />
        </a>
      );
    }

    // 2. Bold: **text** or __text__
    if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
      const inner = part.slice(2, -2);
      return (
        <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
          {renderInlineMarkdown(inner)}
        </strong>
      );
    }

    // 3. Highlight: ==text==
    if (part.startsWith('==') && part.endsWith('==')) {
      const inner = part.slice(2, -2);
      return (
        <mark key={i} className="bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded-md font-semibold border border-amber-300 dark:border-amber-700">
          {renderInlineMarkdown(inner)}
        </mark>
      );
    }

    // 4. Inline Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      const inner = part.slice(1, -1);
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-[12px] border border-slate-200 dark:border-slate-700 font-semibold">
          {inner}
        </code>
      );
    }

    // 5. Italic: *text* or _text_
    if ((part.startsWith('*') && part.endsWith('*') && part.length > 2) || (part.startsWith('_') && part.endsWith('_') && part.length > 2)) {
      const inner = part.slice(1, -1);
      return (
        <em key={i} className="italic text-slate-800 dark:text-slate-200">
          {renderInlineMarkdown(inner)}
        </em>
      );
    }

    // 6. Strikethrough: ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~')) {
      const inner = part.slice(2, -2);
      return (
        <del key={i} className="line-through text-slate-400">
          {renderInlineMarkdown(inner)}
        </del>
      );
    }

    return part;
  });
}

/**
 * Line-by-Line AST Parser for Markdown Blocks
 */
export function parseMarkdownBlocks(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const blocks = [];
  let currentParagraph = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }
  let currentCallout = null; // { type: 'callout', variant: 'tip'|'warning'|'note', lines: [] }
  let currentQuote = null; // { type: 'quote', lines: [] }

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'p', lines: currentParagraph });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList) {
      blocks.push(currentList);
      currentList = null;
    }
  };

  const flushCallout = () => {
    if (currentCallout) {
      blocks.push(currentCallout);
      currentCallout = null;
    }
  };

  const flushQuote = () => {
    if (currentQuote) {
      blocks.push(currentQuote);
      currentQuote = null;
    }
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushCallout();
    flushQuote();
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Blank line
    if (!trimmed) {
      flushAll();
      continue;
    }

    // 1. Horizontal Divider: ---, ***, ___
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      flushAll();
      blocks.push({ type: 'hr' });
      continue;
    }

    // 2. Heading 1: # Heading
    if (trimmed.startsWith('# ')) {
      flushAll();
      blocks.push({ type: 'h1', text: trimmed.replace(/^#\s+/, '') });
      continue;
    }

    // 3. Heading 2: ## Heading
    if (trimmed.startsWith('## ')) {
      flushAll();
      blocks.push({ type: 'h2', text: trimmed.replace(/^##\s+/, '') });
      continue;
    }

    // 4. Heading 3: ### Heading
    if (trimmed.startsWith('### ')) {
      flushAll();
      blocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') });
      continue;
    }

    // 5. Callout Alert Boxes: > [!TIP], > [!WARNING], > [!NOTE], > [!INFO]
    const calloutMatch = trimmed.match(/^>\s*\[!(TIP|WARNING|NOTE|INFO|IMPORTANT|CAUTION)\]\s*(.*)$/i);
    if (calloutMatch) {
      flushAll();
      const variant = calloutMatch[1].toLowerCase();
      const rest = calloutMatch[2];
      currentCallout = {
        type: 'callout',
        variant,
        lines: rest ? [rest] : []
      };
      continue;
    }

    // Continuation of callout: > text
    if (currentCallout && trimmed.startsWith('>')) {
      const rest = trimmed.replace(/^>\s*/, '');
      if (rest) currentCallout.lines.push(rest);
      continue;
    } else if (currentCallout) {
      flushCallout();
    }

    // 6. Standard Blockquote: > Quote text
    if (trimmed.startsWith('>')) {
      flushParagraph();
      flushList();
      flushCallout();
      const quoteText = trimmed.replace(/^>\s*/, '');
      if (!currentQuote) {
        currentQuote = { type: 'quote', lines: [quoteText] };
      } else {
        currentQuote.lines.push(quoteText);
      }
      continue;
    } else {
      flushQuote();
    }

    // 7. Numbered List: 1. Item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      flushParagraph();
      flushCallout();
      flushQuote();
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({ num: numMatch[1], text: numMatch[2] });
      continue;
    }

    // 8. Bullet List: - Item, * Item, • Item
    const bulletMatch = trimmed.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      flushCallout();
      flushQuote();
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({ text: bulletMatch[1] });
      continue;
    }

    // End list if this line is normal text
    flushList();

    // 9. Standalone Action Button: [🔘 Button Text](url)
    const buttonMatch = trimmed.match(/^\[(🔘.*?|\[Button\].*?|Button:.*?)\]\((.*?)\)$/);
    if (buttonMatch) {
      flushParagraph();
      const cleanBtnText = buttonMatch[1].replace(/^(🔘\s*|\[Button\]\s*|Button:\s*)/, '');
      blocks.push({
        type: 'button',
        text: cleanBtnText,
        url: buttonMatch[2]
      });
      continue;
    }

    // 10. Normal Paragraph
    currentParagraph.push(rawLine);
  }

  flushAll();
  return blocks;
}

/**
 * Rich Markdown Renderer Component
 */
export default function RichMarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className={`space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'hr':
            return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;

          case 'h1':
            return (
              <h2 key={idx} className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 dark:text-white pt-5 pb-2 border-b border-slate-200 dark:border-slate-800">
                {renderInlineMarkdown(block.text)}
              </h2>
            );

          case 'h2':
            return (
              <h3 key={idx} className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white pt-4 pb-1">
                {renderInlineMarkdown(block.text)}
              </h3>
            );

          case 'h3':
            return (
              <h4 key={idx} className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-3 pb-1 flex items-center space-x-2">
                <span className="w-1.5 h-4 bg-indigo-600 dark:bg-indigo-400 rounded-full inline-block flex-shrink-0"></span>
                <span>{renderInlineMarkdown(block.text)}</span>
              </h4>
            );

          case 'callout': {
            const bodyText = block.lines.join(' ');
            if (block.variant === 'warning' || block.variant === 'caution') {
              return (
                <div key={idx} className="my-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start space-x-3 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    <strong className="block font-bold text-rose-800 dark:text-rose-300 mb-1 uppercase tracking-wider text-[11px]">
                      Warning / Caution
                    </strong>
                    {renderInlineMarkdown(bodyText)}
                  </div>
                </div>
              );
            }
            if (block.variant === 'tip') {
              return (
                <div key={idx} className="my-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start space-x-3 shadow-xs">
                  <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    <strong className="block font-bold text-emerald-800 dark:text-emerald-300 mb-1 uppercase tracking-wider text-[11px]">
                      Pro Tip
                    </strong>
                    {renderInlineMarkdown(bodyText)}
                  </div>
                </div>
              );
            }
            // Note / Info
            return (
              <div key={idx} className="my-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-start space-x-3 shadow-xs">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                  <strong className="block font-bold text-blue-800 dark:text-blue-300 mb-1 uppercase tracking-wider text-[11px]">
                    Note
                  </strong>
                  {renderInlineMarkdown(bodyText)}
                </div>
              </div>
            );
          }

          case 'quote':
            return (
              <blockquote key={idx} className="my-4 pl-4 py-2 border-l-4 border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-slate-800/50 rounded-r-2xl text-slate-700 dark:text-slate-300 italic font-sans text-sm sm:text-base">
                {renderInlineMarkdown(block.lines.join(' '))}
              </blockquote>
            );

          case 'ol':
            return (
              <ol key={idx} className="space-y-2.5 my-3 pl-1 font-sans">
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                      {item.num}
                    </span>
                    <span className="flex-1 leading-relaxed">{renderInlineMarkdown(item.text)}</span>
                  </li>
                ))}
              </ol>
            );

          case 'ul':
            return (
              <ul key={idx} className="space-y-2 my-3 pl-1 font-sans">
                {block.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0 mt-2"></span>
                    <span className="flex-1 leading-relaxed">{renderInlineMarkdown(item.text)}</span>
                  </li>
                ))}
              </ul>
            );

          case 'button':
            return (
              <div key={idx} className="my-3">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 no-underline cursor-pointer"
                >
                  <span>{block.text}</span>
                  <ExternalLink className="w-4 h-4 stroke-[2.5]" />
                </a>
              </div>
            );

          case 'p':
          default:
            return (
              <p key={idx} className="leading-relaxed text-slate-800 dark:text-slate-200">
                {block.lines.map((line, lIdx) => (
                  <React.Fragment key={lIdx}>
                    {renderInlineMarkdown(line)}
                    {lIdx < block.lines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
