/**
 * AI Runtime types - model status and streaming
 */

export type ModelStatusType = 'Unloaded' | 'Loading' | 'Loaded' | 'Error';

export interface ModelStatusUnloaded {
  status: 'Unloaded';
}

export interface ModelStatusLoading {
  status: 'Loading';
  provider: string;
}

export interface ModelStatusLoaded {
  status: 'Loaded';
  provider: string;
  model: string;
}

export interface ModelStatusError {
  status: 'Error';
  provider: string;
  error: string;
}

export type ModelStatus =
  | ModelStatusUnloaded
  | ModelStatusLoading
  | ModelStatusLoaded
  | ModelStatusError;

export type StreamEventType = 'Started' | 'Chunk' | 'Completed' | 'Error' | 'Cancelled';

export interface StreamEventStarted {
  type: 'Started';
  request_id: number;
  provider: string;
  model: string;
}

export interface StreamEventChunk {
  type: 'Chunk';
  request_id: number;
  content: string;
}

export interface StreamEventCompleted {
  type: 'Completed';
  request_id: number;
}

export interface StreamEventError {
  type: 'Error';
  request_id: number;
  error: {
    type: string;
    message?: string;
  };
}

export interface StreamEventCancelled {
  type: 'Cancelled';
  request_id: number;
}

export type StreamEvent =
  | StreamEventStarted
  | StreamEventChunk
  | StreamEventCompleted
  | StreamEventError
  | StreamEventCancelled;
