import React from 'react';
import {
  ExternalLink,
  Info,
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  ChevronRight
} from 'lucide-react';

/**
 * Helper to parse inline markdown tags:
 * **bold**, *italic*, `code`, ==highlight==, [Button / Link](url), ~~strike~~
 */
export function renderInlineMarkdown(text) {
  if (!text || typeof text !== 'string') return text;

  // Split text into tokens based on markdown patterns
  // Pattern matches:
  // 1. [Button/Link Text](url)
  // 2. **bold** or __bold__
  // 3. *italic* or _italic_
  // 4. `code`
  // 5. ==highlight==
  // 6. ~~strike~~
  const tokenRegex = /(\[.*?\]\(.*?\)|\*\*.*?\*\*|__.*?__|(?:\*|_)[^*_]+(?:\*|_)|`.*?`|==.*?==|~~.*?~~)/g;

  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // 1. Links / Buttons: [Text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];

      // If text starts with button indicator 🔘, render as an action button
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
 * Rich Markdown Renderer Component
 * Parses blocks: H1, H2, H3, Blockquotes, Tip/Warning Callouts, Bullet lists, Numbered lists, Dividers
 */
export default function RichMarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split by double newlines or single newlines into logical blocks
  const rawParagraphs = content.split(/\n\s*\n/);

  return (
    <div className={`space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed ${className}`}>
      {rawParagraphs.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // 1. Horizontal Divider: --- or ***
        if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
          return <hr key={bIdx} className="my-6 border-slate-200 dark:border-slate-800" />;
        }

        // 2. Heading 1: # Heading
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={bIdx} className="text-2xl sm:text-3xl font-extrabold font-sans text-slate-900 dark:text-white pt-5 pb-2 border-b border-slate-200 dark:border-slate-800">
              {renderInlineMarkdown(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        // 3. Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={bIdx} className="text-xl sm:text-2xl font-bold font-sans text-slate-900 dark:text-white pt-4 pb-1">
              {renderInlineMarkdown(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // 4. Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={bIdx} className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white pt-3 pb-1 flex items-center space-x-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full inline-block"></span>
              <span>{renderInlineMarkdown(trimmed.replace(/^###\s+/, ''))}</span>
            </h4>
          );
        }

        // 5. Callout Alert Boxes: > [!TIP], > [!NOTE], > [!WARNING], > [!IMPORTANT]
        if (trimmed.startsWith('> [!TIP]')) {
          const bodyText = trimmed.replace(/^>\s*\[!TIP\]\s*/i, '');
          return (
            <div key={bIdx} className="my-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-start space-x-3 shadow-xs">
              <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                <strong className="block font-bold text-emerald-800 dark:text-emerald-300 mb-1">PRO TIP</strong>
                {renderInlineMarkdown(bodyText)}
              </div>
            </div>
          );
        }

        if (trimmed.startsWith('> [!WARNING]')) {
          const bodyText = trimmed.replace(/^>\s*\[!WARNING\]\s*/i, '');
          return (
            <div key={bIdx} className="my-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200 flex items-start space-x-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                <strong className="block font-bold text-rose-800 dark:text-rose-300 mb-1">WARNING / CAUTION</strong>
                {renderInlineMarkdown(bodyText)}
              </div>
            </div>
          );
        }

        if (trimmed.startsWith('> [!NOTE]') || trimmed.startsWith('> [!INFO]')) {
          const bodyText = trimmed.replace(/^>\s*\[!(NOTE|INFO)\]\s*/i, '');
          return (
            <div key={bIdx} className="my-4 p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 flex items-start space-x-3 shadow-xs">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium leading-relaxed">
                <strong className="block font-bold text-blue-800 dark:text-blue-300 mb-1">NOTE</strong>
                {renderInlineMarkdown(bodyText)}
              </div>
            </div>
          );
        }

        // 6. Standard Blockquote: > Quote text
        if (trimmed.startsWith('> ')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s*/, '')).join(' ');
          return (
            <blockquote key={bIdx} className="my-4 pl-4 py-2 border-l-4 border-indigo-600 dark:border-indigo-400 bg-indigo-50/40 dark:bg-slate-800/50 rounded-r-2xl text-slate-700 dark:text-slate-300 italic font-sans text-sm sm:text-base">
              {renderInlineMarkdown(quoteLines)}
            </blockquote>
          );
        }

        // 7. Check if block contains lines (lists or linebreaks)
        const lines = trimmed.split('\n');

        // Check if all lines (or most) are a Numbered List: 1. Item, 2. Item
        const isNumberedList = lines.length > 0 && lines.every(l => /^\d+\.\s+/.test(l.trim()));
        if (isNumberedList) {
          return (
            <ol key={bIdx} className="space-y-2.5 my-3 pl-1 font-sans">
              {lines.map((line, lIdx) => {
                const match = line.trim().match(/^(\d+)\.\s+(.*)$/);
                if (!match) return null;
                const num = match[1];
                const itemText = match[2];
                return (
                  <li key={lIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-200 dark:border-indigo-800">
                      {num}
                    </span>
                    <span className="flex-1 leading-relaxed">{renderInlineMarkdown(itemText)}</span>
                  </li>
                );
              })}
            </ol>
          );
        }

        // Check if all lines are a Bullet List: - Item, * Item, • Item
        const isBulletList = lines.length > 0 && lines.every(l => /^[-*•]\s+/.test(l.trim()));
        if (isBulletList) {
          return (
            <ul key={bIdx} className="space-y-2 my-3 pl-1 font-sans">
              {lines.map((line, lIdx) => {
                const itemText = line.trim().replace(/^[-*•]\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 flex-shrink-0 mt-2"></span>
                    <span className="flex-1 leading-relaxed">{renderInlineMarkdown(itemText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // 8. General Paragraph with possible multiple lines
        return (
          <p key={bIdx} className="leading-relaxed text-slate-800 dark:text-slate-200">
            {lines.map((l, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInlineMarkdown(l)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
