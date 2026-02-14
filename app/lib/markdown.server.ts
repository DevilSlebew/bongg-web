import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";

export async function parseMarkdown(content: string) {
  return content;
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      className="prose prose-invert prose-cyan max-w-none"
    >
      {content}
    </ReactMarkdown>
  );
}
