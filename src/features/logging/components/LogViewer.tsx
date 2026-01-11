import React, { useEffect, useRef } from 'react';
import { useLogStream } from '../hooks/useLogStream';
import type { LogLevel } from '../types';
import { useTranslation } from "@/shared/i18n";
import { Select, type SelectOption } from '@/shared/ui';

const LOG_LEVELS: LogLevel[] = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

const LOG_LEVEL_OPTIONS: SelectOption[] = LOG_LEVELS.map((level) => ({
  value: level,
  label: level,
}));

const getLogLevelColor = (level: string): string => {
  switch (level) {
    case 'ERROR':
      return '#ef4444';
    case 'WARN':
      return '#f59e0b';
    case 'INFO':
      return '#3b82f6';
    case 'DEBUG':
      return '#8b5cf6';
    case 'TRACE':
      return '#6b7280';
    default:
      return '#9ca3af';
  }
};

const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    const time = date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${time}.${ms}`;
  } catch {
    return timestamp;
  }
};

export const LogViewer: React.FC = () => {
  const { t } = useTranslation();
  const {
    filteredLogs,
    isLoading,
    error,
    clearLogs,
    setFilterLevel,
    setSearchTerm,
    autoScroll,
    toggleAutoScroll,
  } = useLogStream();

  const logContainerRef = useRef<HTMLDivElement>(null);
  const [selectedLevel, setSelectedLevel] = React.useState<LogLevel>('ALL');
  const [search, setSearch] = React.useState('');

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  const handleLevelChange = (level: LogLevel) => {
    setSelectedLevel(level);
    setFilterLevel(level);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setSearchTerm(value);
  };

  const handleCopyLogs = () => {
    const logsText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level}] [${log.target}] ${log.message}`)
      .join('\n');
    navigator.clipboard.writeText(logsText);
  };

  const handleDownloadLogs = () => {
    const logsText = filteredLogs
      .map((log) => `[${log.timestamp}] [${log.level}] [${log.target}] ${log.message}`)
      .join('\n');
    const blob = new Blob([logsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full p-5">
      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-2.5 text-gray-900 dark:text-gray-100">
          {t('logs.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('logs.description')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-2.5 mb-5 flex-wrap items-center">
        {/* Level Filter */}
        <Select
          options={LOG_LEVEL_OPTIONS}
          value={selectedLevel}
          onChange={(value) => handleLevelChange(value as LogLevel)}
          placeholder="Filter by level"
          className="min-w-[140px]"
        />

        {/* Search */}
        <input
          type="text"
          placeholder={t('logs.search')}
          value={search}
          onChange={handleSearchChange}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Auto-scroll Toggle */}
        <button
          onClick={toggleAutoScroll}
          className={`px-4 py-2 rounded-md border font-medium cursor-pointer transition-colors ${
            autoScroll
              ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {autoScroll ? '📌 ' : '📍 '}
          {t('logs.autoScroll')}
        </button>

        {/* Clear */}
        <button
          onClick={clearLogs}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          🗑️ {t('logs.clear')}
        </button>

        {/* Copy */}
        <button
          onClick={handleCopyLogs}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          📋 {t('logs.copy')}
        </button>

        {/* Download */}
        <button
          onClick={handleDownloadLogs}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 cursor-pointer font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          💾 {t('logs.download')}
        </button>
      </div>

      {/* Log Count */}
      <div className="mb-2.5 text-gray-600 dark:text-gray-400 text-sm">
        {t('logs.showing')} {filteredLogs.length} {t('logs.entries')}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 mb-2.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && filteredLogs.length === 0 && (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          {t('logs.loading')}
        </div>
      )}

      {/* Logs Container */}
      <div
        ref={logContainerRef}
        className="flex-1 overflow-auto bg-gray-900 dark:bg-gray-950 rounded-lg p-4 font-mono text-[13px] leading-relaxed"
      >
        {filteredLogs.length === 0 && !isLoading ? (
          <div className="text-gray-400 dark:text-gray-500 text-center py-5">
            {t('logs.noLogs')}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              className="mb-1 py-1 border-b border-gray-700 dark:border-gray-800"
            >
              <span className="text-gray-400 dark:text-gray-500">[{formatTimestamp(log.timestamp)}]</span>
              {' '}
              <span style={{ color: getLogLevelColor(log.level) }} className="font-bold">
                [{log.level}]
              </span>
              {' '}
              <span className="text-blue-400 dark:text-blue-500">[{log.target}]</span>
              {' '}
              <span className="text-gray-200 dark:text-gray-300">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
