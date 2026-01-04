import { z } from 'zod';

/**
 * Zod schema for OpenAI configuration
 */
export const openAIConfigSchema = z.object({
  apiKey: z.string()
    .min(1, 'validation.apiKeyRequired')
    .min(10, 'validation.apiKeyTooShort'),
  model: z.string()
    .min(1, 'validation.modelRequired'),
  temperature: z.number()
    .min(0, 'validation.temperatureRange')
    .max(2, 'validation.temperatureRange'),
  maxTokens: z.number()
    .min(100, 'validation.maxTokensMin'),
});

/**
 * Zod schema for Anthropic configuration
 */
export const anthropicConfigSchema = z.object({
  apiKey: z.string()
    .min(1, 'validation.apiKeyRequired')
    .min(10, 'validation.apiKeyTooShort'),
  model: z.string()
    .min(1, 'validation.modelRequired'),
  temperature: z.number()
    .min(0, 'validation.temperatureRange')
    .max(1, 'validation.temperatureRange'),
  maxTokens: z.number()
    .min(100, 'validation.maxTokensMin'),
});

/**
 * Zod schema for Local Qwen configuration
 */
export const localQwenConfigSchema = z.object({
  modelPath: z.string()
    .min(1, 'validation.modelPathRequired'),
  selectedModelId: z.string()
    .min(1, 'validation.selectedModelRequired'),
  contextSize: z.number()
    .int()
    .min(512, 'validation.contextSizeMin'),
  temperature: z.number()
    .min(0, 'validation.temperatureRange')
    .max(2, 'validation.temperatureRange'),
  seed: z.number()
    .int(),
  repeatPenalty: z.number()
    .min(1, 'validation.repeatPenaltyRange')
    .max(2, 'validation.repeatPenaltyRange'),
  repeatLastN: z.number()
    .int()
    .positive('validation.repeatLastNPositive'),
  useThinkingMode: z.boolean(),
  useGpu: z.boolean(),
});

export type OpenAIConfigSchema = z.infer<typeof openAIConfigSchema>;
export type AnthropicConfigSchema = z.infer<typeof anthropicConfigSchema>;
export type LocalQwenConfigSchema = z.infer<typeof localQwenConfigSchema>;
