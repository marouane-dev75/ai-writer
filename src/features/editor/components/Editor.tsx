import { useEditor } from '../hooks/useEditor';
import '../editor.css'

interface EditorProps {
  placeholder?: string;
  minHeight?: number;
}

export const Editor: React.FC<EditorProps> = ({
  placeholder,
  minHeight,
}) => {
  const { isReady, clear } = useEditor({
    holder: 'editorjs',
    placeholder,
    minHeight,
  });

  const handleClear = async () => {
    await clear();
    console.log('Editor cleared');
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Editor
          </h2>
          <button
            onClick={handleClear}
            disabled={!isReady}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Clear
          </button>
        </div>

        <div
          id="editorjs"
          className="prose dark:prose-invert max-w-none border border-gray-200 dark:border-gray-700 rounded-lg p-4 min-h-[300px] bg-white dark:bg-gray-900"
        />
      </div>
    </div>
  );
};
