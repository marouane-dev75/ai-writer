import {
  $isParagraphNode,
  $isTextNode,
  type ParagraphNode,
  type TextNode,
  type LexicalNode,
} from 'lexical';
import {
  $isHeadingNode,
  $isQuoteNode,
  type HeadingNode,
  type QuoteNode,
} from '@lexical/rich-text';
import {
  $isListNode,
  $isListItemNode,
  type ListNode,
  type ListItemNode,
} from '@lexical/list';
import {
  $isCodeNode,
  type CodeNode,
} from '@lexical/code';

/**
 * Serializes selected Lexical nodes to markdown format
 */
export class MarkdownSerializer {
  private output: string[] = [];
  private indentLevel = 0;

  /**
   * Convert an array of Lexical nodes to markdown
   */
  serialize(nodes: LexicalNode[]): string {
    this.output = [];
    this.indentLevel = 0;

    for (const node of nodes) {
      this.serializeNode(node);
    }

    return this.output.join('\n').trim();
  }

  private serializeNode(node: LexicalNode): void {
    if ($isHeadingNode(node)) {
      this.serializeHeading(node);
    } else if ($isQuoteNode(node)) {
      this.serializeQuote(node);
    } else if ($isListNode(node)) {
      this.serializeList(node);
    } else if ($isListItemNode(node)) {
      this.serializeListItem(node);
    } else if ($isCodeNode(node)) {
      this.serializeCode(node);
    } else if ($isParagraphNode(node)) {
      this.serializeParagraph(node);
    } else if ($isTextNode(node)) {
      this.serializeText(node);
    } else {
      // For unknown node types, try to get text content
      const textContent = node.getTextContent();
      if (textContent) {
        this.output.push(textContent);
      }
    }
  }

  private serializeHeading(node: HeadingNode): void {
    const tag = node.getTag();
    const level = parseInt(tag.charAt(1)); // h1, h2, etc.
    const prefix = '#'.repeat(level) + ' ';
    const text = this.getNodeTextContent(node);
    this.output.push(prefix + text);
  }

  private serializeQuote(node: QuoteNode): void {
    const lines = this.getNodeTextContent(node).split('\n');
    const quotedLines = lines.map(line => `> ${line}`);
    this.output.push(...quotedLines);
  }

  private serializeList(node: ListNode): void {
    // Lists are handled by their list items
    // This method mainly sets up the list context
    const listType = node.getListType();
    const children = node.getChildren();

    for (const child of children) {
      if ($isListItemNode(child)) {
        this.serializeListItem(child, listType);
      }
    }
  }

  private serializeListItem(node: ListItemNode, listType?: string): void {
    const indent = '  '.repeat(this.indentLevel);
    const children = node.getChildren();

    // Check if this is a nested list
    const hasNestedList = children.some(child => $isListNode(child));

    if (hasNestedList) {
      this.indentLevel++;
    }

    // Get the list marker
    const marker = this.getListMarker(listType || 'bullet');

    // Collect text content from children
    let textContent = '';
    for (const child of children) {
      if ($isTextNode(child)) {
        textContent += this.getTextNodeContent(child);
      } else if ($isListNode(child)) {
        // Nested list will be handled separately
        continue;
      } else {
        textContent += (child as LexicalNode).getTextContent();
      }
    }

    this.output.push(`${indent}${marker} ${textContent.trim()}`);

    // Handle nested lists
    for (const child of children) {
      if ($isListNode(child)) {
        this.serializeList(child);
      }
    }

    if (hasNestedList) {
      this.indentLevel--;
    }
  }

  private serializeCode(node: CodeNode): void {
    const language = node.getLanguage() || '';
    const code = this.getNodeTextContent(node);
    const backticks = '```';

    this.output.push(`${backticks}${language}`);
    this.output.push(code);
    this.output.push(backticks);
  }

  private serializeParagraph(node: ParagraphNode): void {
    const text = this.getNodeTextContent(node);
    if (text.trim()) {
      this.output.push(text);
    }
  }

  private serializeText(node: TextNode): void {
    const text = this.getTextNodeContent(node);
    if (text.trim()) {
      this.output.push(text);
    }
  }

  private getNodeTextContent(node: LexicalNode): string {
    return node.getTextContent();
  }

  private getTextNodeContent(node: TextNode): string {
    let text = node.getTextContent();

    // Apply formatting
    if (node.hasFormat('bold')) {
      text = `**${text}**`;
    }
    if (node.hasFormat('italic')) {
      text = `*${text}*`;
    }
    if (node.hasFormat('underline')) {
      text = `<u>${text}</u>`; // Markdown doesn't have underline, use HTML
    }
    if (node.hasFormat('strikethrough')) {
      text = `~~${text}~~`;
    }
    if (node.hasFormat('code')) {
      text = `\`${text}\``;
    }

    return text;
  }

  private getListMarker(listType: string): string {
    switch (listType) {
      case 'number':
        // For simplicity, always use 1. for ordered lists
        // In a real implementation, you'd track the actual numbering
        return '1.';
      case 'bullet':
      default:
        return '-';
    }
  }
}

/**
 * Convenience function to serialize nodes to markdown
 */
export function serializeToMarkdown(nodes: LexicalNode[]): string {
  const serializer = new MarkdownSerializer();
  return serializer.serialize(nodes);
}
