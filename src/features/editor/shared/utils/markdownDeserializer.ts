import {
  $isParagraphNode,
  $isTextNode,
  $createParagraphNode,
  $createTextNode,
  type ParagraphNode,
  type TextNode,
  type LexicalNode,
} from 'lexical';
import {
  $isHeadingNode,
  $isQuoteNode,
  $createHeadingNode,
  $createQuoteNode,
  type HeadingNode,
  type QuoteNode,
} from '@lexical/rich-text';
import {
  $isListNode,
  $isListItemNode,
  $createListNode,
  $createListItemNode,
  type ListNode,
  type ListItemNode,
} from '@lexical/list';
import {
  $isCodeNode,
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
      return null;
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
    const nodes: TextNode[] = [];
    let remaining = text;
    let match;

    // Process bold (**text**)
    const boldRegex = /\*\*(.*?)\*\*/g;
    while ((match = boldRegex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > 0) {
        const beforeText = remaining.substring(0, match.index);
        if (beforeText) {
          nodes.push(this.createTextNode(beforeText));
        }
      }

      // Add the bold text
      const boldText = match[1];
      const boldNode = $createTextNode(boldText);
      boldNode.toggleFormat('bold');
      nodes.push(boldNode);

      // Update remaining text
      remaining = remaining.substring(match.index + match[0].length);
      boldRegex.lastIndex = 0; // Reset regex state
    }

    // Process italic (*text*)
    const italicRegex = /\*(.*?)\*/g;
    while ((match = italicRegex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > 0) {
        const beforeText = remaining.substring(0, match.index);
        if (beforeText) {
          nodes.push(this.createTextNode(beforeText));
        }
      }

      // Add the italic text
      const italicText = match[1];
      const italicNode = $createTextNode(italicText);
      italicNode.toggleFormat('italic');
      nodes.push(italicNode);

      // Update remaining text
      remaining = remaining.substring(match.index + match[0].length);
      italicRegex.lastIndex = 0; // Reset regex state
    }

    // Process inline code (`text`)
    const codeRegex = /`(.*?)`/g;
    while ((match = codeRegex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > 0) {
        const beforeText = remaining.substring(0, match.index);
        if (beforeText) {
          nodes.push(this.createTextNode(beforeText));
        }
      }

      // Add the code text
      const codeText = match[1];
      const codeNode = $createTextNode(codeText);
      codeNode.toggleFormat('code');
      nodes.push(codeNode);

      // Update remaining text
      remaining = remaining.substring(match.index + match[0].length);
      codeRegex.lastIndex = 0; // Reset regex state
    }

    // Process strikethrough (~~text~~)
    const strikethroughRegex = /~~(.*?)~~/g;
    while ((match = strikethroughRegex.exec(remaining)) !== null) {
      // Add text before the match
      if (match.index > 0) {
        const beforeText = remaining.substring(0, match.index);
        if (beforeText) {
          nodes.push(this.createTextNode(beforeText));
        }
      }

      // Add the strikethrough text
      const strikethroughText = match[1];
      const strikethroughNode = $createTextNode(strikethroughText);
      strikethroughNode.toggleFormat('strikethrough');
      nodes.push(strikethroughNode);

      // Update remaining text
      remaining = remaining.substring(match.index + match[0].length);
      strikethroughRegex.lastIndex = 0; // Reset regex state
    }

    // Add any remaining text
    if (remaining) {
      nodes.push(this.createTextNode(remaining));
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
