import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';

interface SelectionState {
  hasSelection: boolean;
  isSingleNode: boolean;
  selectedText: string;
}

export const useSelectionState = (): SelectionState => {
  const [editor] = useLexicalComposerContext();
  const [selectionState, setSelectionState] = useState<SelectionState>({
    hasSelection: false,
    isSingleNode: false,
    selectedText: '',
  });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          setSelectionState({
            hasSelection: false,
            isSingleNode: false,
            selectedText: '',
          });
          return;
        }

        const selectedText = selection.getTextContent();
        const hasSelection = selectedText.length > 0;

        if (!hasSelection) {
          setSelectionState({
            hasSelection: false,
            isSingleNode: false,
            selectedText: '',
          });
          return;
        }

        // Get all nodes in the selection
        const nodes = selection.getNodes();
        const isSingleNode = nodes.length === 1;

        setSelectionState({
          hasSelection,
          isSingleNode,
          selectedText,
        });
      });
    });
  }, [editor]);

  return selectionState;
};
