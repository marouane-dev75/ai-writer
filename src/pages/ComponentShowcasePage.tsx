import { useState } from "react";
import { useTranslation } from "@/shared/i18n";
import { Button, LoadingSpinner } from "@/shared/ui";
import { ModelStatusIndicator, useAIRuntime, useAiStatus } from "@/features/ai-runtime";
import { Editor } from "@/features/editor";

export const ComponentShowcasePage = () => {
  const { t } = useTranslation();
  const { isStreaming, currentStream, error, startStream, cancelStream, clearStream } = useAIRuntime();
  const { status } = useAiStatus();
  
  const [systemPrompt, setSystemPrompt] = useState(t("showcase.aiStreaming.defaultSystemPrompt"));
  const [userPrompt, setUserPrompt] = useState(t("showcase.aiStreaming.defaultUserPrompt"));

  const isModelLoaded = status?.status === 'Loaded';
  const canStartStream = isModelLoaded && !isStreaming;

  const handleStartStream = async () => {
    await startStream(systemPrompt, userPrompt);
  };

  const handleCancelStream = async () => {
    await cancelStream();
  };

  const handleClearOutput = () => {
    clearStream();
  };

  return (
    <>
      {/* Text Editor */}
      <Editor/>

      {/* AI Streaming Test */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t("showcase.aiStreaming.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("showcase.aiStreaming.description")}
        </p>

        {/* Model Status Indicator */}
        <div className="mb-6">
          <ModelStatusIndicator status={status} />
        </div>

        {/* Model Status Warning */}
        {!status && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              {t("showcase.aiStreaming.modelNotLoaded")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("showcase.aiStreaming.systemPrompt")}
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                disabled={isStreaming}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={3}
              />
            </div>

            {/* User Prompt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("showcase.aiStreaming.userPrompt")}
              </label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                disabled={isStreaming}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                rows={4}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleStartStream}
                disabled={!canStartStream}
              >
                {t("showcase.aiStreaming.startStream")}
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelStream}
                disabled={!isStreaming}
              >
                {t("showcase.aiStreaming.cancelStream")}
              </Button>
              <Button
                variant="secondary"
                onClick={handleClearOutput}
                disabled={isStreaming}
              >
                {t("showcase.aiStreaming.clearOutput")}
              </Button>
            </div>
          </div>

          {/* Output Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("showcase.aiStreaming.output")}
              {isStreaming && (
                <span className="ml-2 text-blue-600 dark:text-blue-400 text-xs">
                  {t("showcase.aiStreaming.streaming")}
                </span>
              )}
            </label>
            <div className="relative">
              <div className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                {error ? (
                  <p className="text-red-600 dark:text-red-400 text-sm font-mono">
                    Error: {error}
                  </p>
                ) : currentStream ? (
                  <p className="text-gray-900 dark:text-gray-100 text-sm font-mono whitespace-pre-wrap">
                    {currentStream}
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                    {t("showcase.aiStreaming.noOutput")}
                  </p>
                )}
              </div>
              {isStreaming && (
                <div className="absolute bottom-2 right-2">
                  <LoadingSpinner size="small" className="min-h-0" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          {t("showcase.buttons.title")}
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">
            {t("showcase.buttons.primary")}
          </Button>
          <Button variant="secondary">
            {t("showcase.buttons.secondary")}
          </Button>
          <Button variant="success">
            {t("showcase.buttons.success")}
          </Button>
          <Button variant="danger">
            {t("showcase.buttons.danger")}
          </Button>
          <Button variant="outline">
            {t("showcase.buttons.outline")}
          </Button>
        </div>
      </div>

      {/* Loading Spinners */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:ring-gray-700 p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {t("showcase.loading.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {t("showcase.loading.description")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Small Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="small" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.small")}
            </p>
          </div>

          {/* Medium Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="medium" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.medium")}
            </p>
          </div>

          {/* Large Spinner */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner size="large" className="min-h-0" />
            <p className="mt-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
              {t("showcase.loading.large")}
            </p>
          </div>

          {/* Spinner with Text */}
          <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <LoadingSpinner
              size="medium"
              text={t("showcase.loading.withText")}
              className="min-h-0"
            />
          </div>
        </div>
      </div>
    </>
  );
};
