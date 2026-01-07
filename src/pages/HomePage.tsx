import { useAIRuntime } from "@/features/ai-runtime";
import { Editor } from "@/features/editor";

export const HomePage = () => {  
  // Separate AI runtime instances for Editor component
  const transformerRuntime = useAIRuntime();
  const generatorRuntime = useAIRuntime();

  return (
    <div className="h-[calc(100vh-10rem)] overflow-hidden">      
      {/* Text Editor */}
      <Editor 
        transformerRuntime={transformerRuntime}
        generatorRuntime={generatorRuntime}
      />
    </div>
  );
};
