import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { serializeToMarkdown } from '../../shared';

interface SelectionState {
  hasSelection: boolean;
  selectedText: string;
  selectedMarkdown: string;
}

export const useSelectionState = (): SelectionState => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = useState<SelectionState>({
    hasSelection: false,
    selectedText: '',
    selectedMarkdown: '',
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          setSelectionState({
            hasSelection: false,
            selectedText: '',
            selectedMarkdown: '',
          });
          return;
        }

        const selectedText = selection.getTextContent();
        const hasSelection = selectedText.length > 0;

        if (!hasSelection) {
          setSelectionState({
            hasSelection: false,
            selectedText: '',
            selectedMarkdown: '',
          });
          return;
        }

        // Get all nodes in the selection and serialize to markdown
        const nodes = selection.getNodes();

        // Filter to only top-level nodes to avoid duplicates
        // (exclude nodes whose parent is also in the selection)
        const topLevelNodes = nodes.filter((node) => {
          const parent = node.getParent();
          return !parent || !nodes.includes(parent);
        });

        const selectedMarkdown = serializeToMarkdown(topLevelNodes);

        setSelectionState({
          hasSelection,
          selectedText,
          selectedMarkdown,
        });
      });
    });
  }, [editor]);

  return selectionState;
};
