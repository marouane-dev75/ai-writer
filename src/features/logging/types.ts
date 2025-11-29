export interface LogEntry {
  timestamp: string;
  level: string;
  target: string;
  message: string;
}

export interface LogResponse {
  entries: LogEntry[];
  cursor: number;
}

export type LogLevel = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogFilterOptions {
  level: LogLevel;
  searchTerm: string;
}
