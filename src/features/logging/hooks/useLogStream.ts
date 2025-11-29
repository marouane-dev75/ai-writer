import { useState, useEffect, useCallback, useRef } from 'react';
import { logService } from '../services/log.service';
import type { LogEntry, LogLevel } from '../types';

interface UseLogStreamOptions {
  pollInterval?: number;
  autoScroll?: boolean;
  filterLevel?: LogLevel;
}

interface UseLogStreamReturn {
  logs: LogEntry[];
  isLoading: boolean;
  error: string | null;
  clearLogs: () => void;
  setFilterLevel: (level: LogLevel) => void;
  setSearchTerm: (term: string) => void;
  filteredLogs: LogEntry[];
  autoScroll: boolean;
  toggleAutoScroll: () => void;
}

export const useLogStream = (options: UseLogStreamOptions = {}): UseLogStreamReturn => {
  const {
    pollInterval = 1000,
    autoScroll: initialAutoScroll = true,
    filterLevel: initialFilterLevel = 'ALL',
  } = options;

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState(0);
  const [filterLevel, setFilterLevel] = useState<LogLevel>(initialFilterLevel);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(initialAutoScroll);
  const intervalRef = useRef<number | null>(null);

  const fetchLogs = useCallback(async (currentCursor: number) => {
    try {
      const response = await logService.getLogs(currentCursor);
      
      if (response.entries.length > 0) {
        setLogs((prevLogs) => [...prevLogs, ...response.entries]);
        setCursor(response.cursor);
      }
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setCursor(0);
  }, []);

  const toggleAutoScroll = useCallback(() => {
    setAutoScroll((prev) => !prev);
  }, []);

  // Filter logs based on level and search term
  const filteredLogs = logs.filter((log) => {
    const levelMatch = filterLevel === 'ALL' || log.level === filterLevel;
    const searchMatch =
      searchTerm === '' ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    
    return levelMatch && searchMatch;
  });

  // Initial load
  useEffect(() => {
    const loadInitialLogs = async () => {
      try {
        const response = await logService.getAllLogs();
        setLogs(response.entries);
        setCursor(response.cursor);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load logs');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialLogs();
  }, []);

  // Polling for new logs
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      fetchLogs(cursor);
    }, pollInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [cursor, pollInterval, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    clearLogs,
    setFilterLevel,
    setSearchTerm,
    filteredLogs,
    autoScroll,
    toggleAutoScroll,
  };
};
