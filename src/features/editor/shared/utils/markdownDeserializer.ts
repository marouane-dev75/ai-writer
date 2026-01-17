import {
  $createParagraphNode,
  $createTextNode,
  type ParagraphNode,
  type TextNode,
  type LexicalNode,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  type HeadingNode,
  type QuoteNode,
} from '@lexical/rich-text';
import {
  $createListNode,
  $createListItemNode,
  type ListNode,
  type ListItemNode,
} from '@lexical/list';
import {
  $createCodeNode,
  type CodeNode,
} from '@lexical/code';

/**
 * Deserializes markdown string to Lexical nodes
 */
export class MarkdownDeserializer {
  private lines: string[] = [];
  private currentIndex = 0;

  /**
   * Parse markdown string into an array of Lexical nodes
   */
  deserialize(markdown: string): LexicalNode[] {
    this.lines = markdown.split('\n');
    this.currentIndex = 0;
    const nodes: LexicalNode[] = [];

    while (this.currentIndex < this.lines.length) {
      const node = this.parseNextNode();
      if (node) {
        nodes.push(node);
      }
      this.currentIndex++;
    }

    return nodes;
  }

  private parseNextNode(): LexicalNode | null {
    const line = this.lines[this.currentIndex];
    if (!line || line.trim() === '') {
      // Create empty paragraph nodes to preserve line breaks
      return $createParagraphNode();
    }

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      return this.createHeadingNode(level, text);
    }

    // Check for blockquotes
    if (line.startsWith('> ')) {
      return this.parseBlockquote();
    }

    // Check for lists
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      return this.parseList(listMatch);
    }

    // Check for code blocks
    if (line.startsWith('```')) {
      return this.parseCodeBlock();
    }

    // Default to paragraph
    return this.createParagraphNode(line);
  }

  private createHeadingNode(level: number, text: string): HeadingNode {
    const headingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const node = $createHeadingNode(headingTag);
    this.parseInlineFormatting(text).forEach(child => node.append(child));
    return node;
  }

  private parseBlockquote(): QuoteNode {
    const quoteNode = $createQuoteNode();

    // Collect all consecutive blockquote lines
    let content = '';
    while (this.currentIndex < this.lines.length &&
           this.lines[this.currentIndex].startsWith('> ')) {
      content += this.lines[this.currentIndex].substring(2) + '\n';
      this.currentIndex++;
    }
    this.currentIndex--; // Adjust for the outer loop increment

    this.parseInlineFormatting(content.trim()).forEach(child => quoteNode.append(child));
    return quoteNode;
  }

  private parseList(match: RegExpMatchArray): ListNode | ListItemNode {
    const indent = match[1].length;
    const marker = match[2];
    const content = match[3];
    const isOrdered = /^\d+\.$/.test(marker);

    if (indent === 0) {
      // Start of a new list
      const listNode = $createListNode(isOrdered ? 'number' : 'bullet');
      const listItemNode = $createListItemNode();
      this.parseInlineFormatting(content).forEach(child => listItemNode.append(child));
      listNode.append(listItemNode);

      // Parse subsequent list items at the same level
      this.currentIndex++;
      while (this.currentIndex < this.lines.length) {
        const nextLine = this.lines[this.currentIndex];
        const nextMatch = nextLine.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);

        if (!nextMatch || nextMatch[1].length > indent) {
          // Nested item or different structure
          if (nextMatch && nextMatch[1].length > indent) {
            // Parse nested list
            const nestedNode = this.parseList(nextMatch);
            if (nestedNode) {
              listItemNode.append(nestedNode);
            }
          } else {
            break;
          }
        } else if (nextMatch[1].length === indent) {
          // Same level item
          const nextItem = $createListItemNode();
          nextItem.append(this.createTextNode(nextMatch[3]));
          listNode.append(nextItem);
        } else {
          // Previous level
          this.currentIndex--;
          break;
        }
        this.currentIndex++;
      }
      this.currentIndex--; // Adjust for outer loop

      return listNode;
    } else {
      // Nested list item
      const listItemNode = $createListItemNode();
      this.parseInlineFormatting(content).forEach(child => listItemNode.append(child));
      return listItemNode;
    }
  }

  private parseCodeBlock(): CodeNode {
    const language = this.lines[this.currentIndex].substring(3).trim() || '';
    const codeNode = $createCodeNode(language);

    this.currentIndex++;
    let codeContent = '';
    while (this.currentIndex < this.lines.length &&
           !this.lines[this.currentIndex].startsWith('```')) {
      codeContent += this.lines[this.currentIndex] + '\n';
      this.currentIndex++;
    }

    codeNode.append(this.createTextNode(codeContent.trim()));
    return codeNode;
  }

  private createParagraphNode(text: string): ParagraphNode {
    const node = $createParagraphNode();
    this.parseInlineFormatting(text).forEach(child => node.append(child));
    return node;
  }

  private createTextNode(text: string): TextNode {
    return $createTextNode(text);
  }

  /**
   * Parse inline markdown formatting and return formatted text nodes
   */
  private parseInlineFormatting(text: string): TextNode[] {
    interface FormatMatch {
      start: number;
      end: number;
      content: string;
      format: 'bold' | 'italic' | 'code' | 'strikethrough';
    }

    const matches: FormatMatch[] = [];

    // Find all bold matches (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        format: 'bold',
      });
    }

    // Find all italic matches (*text*) - but avoid matching bold markers
    const italicRegex = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g;
    while ((match = italicRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        format: 'italic',
      });
    }

    // Find all inline code matches (`text`)
    const codeRegex = /`(.*?)`/g;
    while ((match = codeRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        format: 'code',
      });
    }

    // Find all strikethrough matches (~~text~~)
    const strikethroughRegex = /~~(.*?)~~/g;
    while ((match = strikethroughRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        content: match[1],
        format: 'strikethrough',
      });
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start);

    // Build nodes by walking through the text
    const nodes: TextNode[] = [];
    let currentPos = 0;

    for (const formatMatch of matches) {
      // Add plain text before this match
      if (currentPos < formatMatch.start) {
        const plainText = text.substring(currentPos, formatMatch.start);
        nodes.push(this.createTextNode(plainText));
      }

      // Add the formatted text
      const formattedNode = $createTextNode(formatMatch.content);
      formattedNode.toggleFormat(formatMatch.format);
      nodes.push(formattedNode);

      // Update current position
      currentPos = formatMatch.end;
    }

    // Add any remaining plain text
    if (currentPos < text.length) {
      const remainingText = text.substring(currentPos);
      nodes.push(this.createTextNode(remainingText));
    }

    // If no formatting was found, return the original text as a single node
    if (nodes.length === 0) {
      nodes.push(this.createTextNode(text));
    }

    return nodes;
  }
}

/**
 * Convenience function to deserialize markdown to nodes
 */
export function deserializeFromMarkdown(markdown: string): LexicalNode[] {
  const deserializer = new MarkdownDeserializer();
  return deserializer.deserialize(markdown);
}
