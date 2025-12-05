import type { AIProvider } from '../types';

/**
 * Service interface for AI provider operations
 */
export interface AIProviderService {
  getActiveProvider(): AIProvider;
  setActiveProvider(provider: AIProvider): void;
}

/**
 * In-memory implementation of AIProviderService
 * Stores the active provider in memory (will be replaced with backend later)
 */
class InMemoryAIProviderService implements AIProviderService {
  private activeProvider: AIProvider = 'localQwen';

  getActiveProvider(): AIProvider {
    return this.activeProvider;
  }

  setActiveProvider(provider: AIProvider): void {
    this.activeProvider = provider;
  }
}

// Export singleton instance
export const aiProviderService: AIProviderService = new InMemoryAIProviderService();
