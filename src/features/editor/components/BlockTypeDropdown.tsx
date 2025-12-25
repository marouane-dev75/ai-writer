import { useState, useCallback, useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, HeadingTagType } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from '@lexical/list';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import {
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdCheckBox,
  MdFormatQuote,
  MdCode,
} from 'react-icons/md';
import { useTranslation } from '@/shared/i18n';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';

type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'number'
  | 'bullet'
  | 'check'
  | 'quote'
  | 'code';

interface BlockTypeOption {
  type: BlockType;
  label: string;
  icon?: React.ReactNode;
  shortcut: string;
}

export const BlockTypeDropdown: React.FC = () => {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const blockTypeOptions: BlockTypeOption[] = [
    { type: 'paragraph', label: t('editor.blockTypes.normal'), shortcut: 'Ctrl+Alt+0' },
    { type: 'h1', label: t('editor.blockTypes.heading1'), shortcut: 'Ctrl+Alt+1' },
    { type: 'h2', label: t('editor.blockTypes.heading2'), shortcut: 'Ctrl+Alt+2' },
    { type: 'h3', label: t('editor.blockTypes.heading3'), shortcut: 'Ctrl+Alt+3' },
    {
      type: 'number',
      label: t('editor.blockTypes.numberedList'),
      icon: <MdFormatListNumbered />,
      shortcut: 'Ctrl+Shift+7',
    },
    {
      type: 'bullet',
      label: t('editor.blockTypes.bulletList'),
      icon: <MdFormatListBulleted />,
      shortcut: 'Ctrl+Shift+8',
    },
    {
      type: 'check',
      label: t('editor.blockTypes.checkList'),
      icon: <MdCheckBox />,
      shortcut: 'Ctrl+Shift+9',
    },
    {
      type: 'quote',
      label: t('editor.blockTypes.quote'),
      icon: <MdFormatQuote />,
      shortcut: 'Ctrl+Shift+Q',
    },
    {
      type: 'code',
      label: t('editor.blockTypes.codeBlock'),
      icon: <MdCode />,
      shortcut: 'Ctrl+Alt+C',
    },
  ];

  const updateBlockType = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e: any) => {
              const parent = e.getParent();
              return parent !== null && parent.getKey() === 'root';
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $findMatchingParent(anchorNode, $isListNode);
          const type = parentList
            ? (parentList as ListNode).getListType()
            : element.getListType();
          if (type === 'number') {
            setBlockType('number');
          } else if (type === 'bullet') {
            setBlockType('bullet');
          } else if (type === 'check') {
            setBlockType('check');
          }
        } else {
          const type = element.getType();
          if (type === 'h1' || type === 'h2' || type === 'h3') {
            setBlockType(type as BlockType);
          } else if (type === 'quote') {
            setBlockType('quote');
          } else if ($isCodeNode(element)) {
            setBlockType('code');
          } else {
            setBlockType('paragraph');
          }
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateBlockType();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateBlockType();
        });
      })
    );
  }, [editor, updateBlockType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode('p' as HeadingTagType));
      }
    });
  };

  const formatHeading = (headingType: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingType));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const handleBlockTypeChange = (type: BlockType) => {
    if (blockType === type) {
      setIsOpen(false);
      return;
    }

    switch (type) {
      case 'paragraph':
        if (blockType === 'number' || blockType === 'bullet' || blockType === 'check') {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          formatParagraph();
        }
        break;
      case 'h1':
        formatHeading('h1');
        break;
      case 'h2':
        formatHeading('h2');
        break;
      case 'h3':
        formatHeading('h3');
        break;
      case 'number':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case 'bullet':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case 'check':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        break;
      case 'quote':
        formatQuote();
        break;
      case 'code':
        formatCode();
        break;
    }

    setIsOpen(false);
  };

  const getCurrentLabel = () => {
    const option = blockTypeOptions.find((opt) => opt.type === blockType);
    return option?.label || t('editor.blockTypes.normal');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        title={t('editor.toolbar.blockType')}
      >
        <span className="text-base">☰</span>
        <span>{getCurrentLabel()}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 min-w-60">
          {blockTypeOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => handleBlockTypeChange(option.type)}
              className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 ${
                blockType === option.type
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : ''
              } first:rounded-t-lg last:rounded-b-lg`}
            >
              <span className="flex items-center gap-3">
                {option.icon && (
                  <span className="text-base text-gray-600 dark:text-gray-400">
                    {option.icon}
                  </span>
                )}
                {!option.icon && option.type.startsWith('h') && (
                  <span className="text-base font-bold text-gray-600 dark:text-gray-400">
                    {option.type.toUpperCase()}
                  </span>
                )}
                {!option.icon && option.type === 'paragraph' && (
                  <span className="text-base text-gray-600 dark:text-gray-400">☰</span>
                )}
                <span className="text-gray-900 dark:text-gray-100">{option.label}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {option.shortcut}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
