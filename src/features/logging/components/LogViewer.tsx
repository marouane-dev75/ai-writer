import React, { useEffect, useRef } from 'react';
import { useLogStream } from '../hooks/useLogStream';
import type { LogLevel } from '../types';
import { useTranslation } from 'react-i18next';

const LOG_LEVELS: LogLevel[] = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'];

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          {t('logs.title', 'Application Logs')}
        </h1>
        <p style={{ color: '#6b7280' }}>
          {t('logs.description', 'Real-time application logs with filtering and search')}
        </p>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => handleLevelChange(e.target.value as LogLevel)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {LOG_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        {/* Search */}
        <input
          type="text"
          placeholder={t('logs.search', 'Search logs...')}
          value={search}
          onChange={handleSearchChange}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
          }}
        />

        {/* Auto-scroll Toggle */}
        <button
          onClick={toggleAutoScroll}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: autoScroll ? '#3b82f6' : 'white',
            color: autoScroll ? 'white' : '#374151',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          {autoScroll ? '📌 ' : '📍 '}
          {t('logs.autoScroll', 'Auto-scroll')}
        </button>

        {/* Clear */}
        <button
          onClick={clearLogs}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          🗑️ {t('logs.clear', 'Clear')}
        </button>

        {/* Copy */}
        <button
          onClick={handleCopyLogs}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          📋 {t('logs.copy', 'Copy')}
        </button>

        {/* Download */}
        <button
          onClick={handleDownloadLogs}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          💾 {t('logs.download', 'Download')}
        </button>
      </div>

      {/* Log Count */}
      <div style={{ marginBottom: '10px', color: '#6b7280', fontSize: '14px' }}>
        {t('logs.showing', 'Showing')} {filteredLogs.length} {t('logs.entries', 'entries')}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '12px',
          marginBottom: '10px',
          backgroundColor: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          border: '1px solid #fecaca',
        }}>
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && filteredLogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          {t('logs.loading', 'Loading logs...')}
        </div>
      )}

      {/* Logs Container */}
      <div
        ref={logContainerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          padding: '16px',
          fontFamily: 'monospace',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
      >
        {filteredLogs.length === 0 && !isLoading ? (
          <div style={{ color: '#9ca3af', textAlign: 'center', padding: '20px' }}>
            {t('logs.noLogs', 'No logs to display')}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={index}
              style={{
                marginBottom: '4px',
                padding: '4px 0',
                borderBottom: '1px solid #374151',
              }}
            >
              <span style={{ color: '#9ca3af' }}>[{formatTimestamp(log.timestamp)}]</span>
              {' '}
              <span style={{ color: getLogLevelColor(log.level), fontWeight: 'bold' }}>
                [{log.level}]
              </span>
              {' '}
              <span style={{ color: '#60a5fa' }}>[{log.target}]</span>
              {' '}
              <span style={{ color: '#e5e7eb' }}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
