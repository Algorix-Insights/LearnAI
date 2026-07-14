import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownMessageProps = {
  content: string;
};

function safeUrl(url: string) {
  if (/^(https?:|mailto:)/i.test(url)) return url;
  return '';
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      urlTransform={safeUrl}
      components={{
        h1: ({ children }) => <h1 className="mb-2 mt-4 text-lg font-semibold tracking-tight text-slate-900 first:mt-0">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-2 mt-4 text-base font-semibold tracking-tight text-slate-900 first:mt-0">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 mt-3 text-sm font-semibold text-slate-900 first:mt-0">{children}</h3>,
        p: ({ children }) => <p className="my-2 break-words first:mt-0 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
        ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-5 marker:text-[#7452F5]">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-5 marker:text-[#7452F5]">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-2 border-[#7452F5]/50 bg-[#7452F5]/[0.04] px-4 py-2 italic text-slate-600">
            {children}
          </blockquote>
        ),
        a: ({ href = '', children }) => {
          const safeHref = safeUrl(href);
          if (!safeHref) return <span>{children}</span>;
          return (
            <a
              href={safeHref}
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-[#6545da] underline decoration-[#7452F5]/30 underline-offset-4 hover:decoration-[#7452F5]"
            >
              {children}
            </a>
          );
        },
        img: () => null,
        code: ({ className, children, ...props }) => {
          const isBlock = Boolean(className?.startsWith('language-'));
          if (!isBlock) {
            return (
              <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.86em] text-[#5f43cf]" {...props}>
                {children}
              </code>
            );
          }
          return <code className={`${className ?? ''} font-mono text-xs leading-6`} {...props}>{children}</code>;
        },
        pre: ({ children }) => (
          <pre className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-[#111827] p-4 text-slate-100 [&>code]:bg-transparent [&>code]:p-0 [&>code]:font-mono [&>code]:text-xs [&>code]:leading-6 [&>code]:text-inherit">
            {children}
          </pre>
        ),
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[420px] border-collapse text-left text-xs">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-slate-50 text-slate-700">{children}</thead>,
        th: ({ children }) => <th className="border-b border-slate-200 px-3 py-2.5 font-semibold">{children}</th>,
        tr: ({ children }) => <tr className="border-b border-slate-100 last:border-0">{children}</tr>,
        td: ({ children }) => <td className="px-3 py-2.5 align-top">{children}</td>,
        hr: () => <hr className="my-4 border-slate-200" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
