/**
 * System information types
 */

export interface SystemInfo {
  cpuCores: number;
  cpuName: string;
  totalMemoryGb: number;
  availableMemoryGb: number;
  osName: string;
  osVersion: string;
  architecture: string;
  totalDiskGb: number;
  availableDiskGb: number;
  gpuInfo: string[];
}
