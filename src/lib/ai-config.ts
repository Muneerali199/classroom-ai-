export interface AIProvider {
  id: string;
  name: string;
  description: string;
  models: AIModel[];
  requiresApiKey: boolean;
  defaultModel?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  capabilities: ('text' | 'image' | 'code' | 'documents')[];
  maxTokens?: number;
  costPer1k?: number;
}

export interface AIConfig {
  providers: Record<string, AIProvider>;
  defaultProviders: {
    documents: string;
    general: string;
    images: string;
    code: string;
  };
  userApiKeys: Record<string, string>;
}

// Default AI providers configuration
export const AI_PROVIDERS: Record<string, AIProvider> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI model, excellent for general tasks and image understanding',
    requiresApiKey: true,
    defaultModel: 'gemini-1.5-flash',
    models: [
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: 'Fast and efficient for most tasks',
        capabilities: ['text', 'image', 'code', 'documents'],
        maxTokens: 1000000,
        costPer1k: 0.075
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: 'Most capable model for complex reasoning',
        capabilities: ['text', 'image', 'code', 'documents'],
        maxTokens: 2000000,
        costPer1k: 0.35
      }
    ]
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Excellent for document processing and text analysis',
    requiresApiKey: true,
    defaultModel: 'mistral-large-latest',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        description: 'Best for complex document analysis',
        capabilities: ['text', 'documents', 'code'],
        maxTokens: 128000,
        costPer1k: 0.4
      },
      {
        id: 'mistral-small-latest',
        name: 'Mistral Small',
        description: 'Fast and cost-effective for simple tasks',
        capabilities: ['text', 'documents'],
        maxTokens: 32000,
        costPer1k: 0.1
      }
    ]
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference for real-time applications',
    requiresApiKey: true,
    defaultModel: 'llama-3.1-70b-versatile',
    models: [
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B',
        description: 'Versatile model for various tasks',
        capabilities: ['text', 'code', 'documents'],
        maxTokens: 131072,
        costPer1k: 0.59
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        description: 'Lightning fast for simple tasks',
        capabilities: ['text', 'code'],
        maxTokens: 131072,
        costPer1k: 0.05
      }
    ]
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    description: 'Industry-leading AI models for various tasks',
    requiresApiKey: true,
    defaultModel: 'gpt-4o-mini',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: 'Most advanced multimodal model',
        capabilities: ['text', 'image', 'code', 'documents'],
        maxTokens: 128000,
        costPer1k: 5.0
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: 'Fast and cost-effective GPT-4 class model',
        capabilities: ['text', 'code', 'documents'],
        maxTokens: 128000,
        costPer1k: 0.15
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: 'Fast and efficient for most tasks',
        capabilities: ['text', 'code', 'documents'],
        maxTokens: 16385,
        costPer1k: 0.5
      }
    ]
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Advanced AI assistant with strong reasoning capabilities',
    requiresApiKey: true,
    defaultModel: 'claude-3-5-sonnet-20241022',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: 'Most intelligent model with vision capabilities',
        capabilities: ['text', 'image', 'code', 'documents'],
        maxTokens: 200000,
        costPer1k: 3.0
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: 'Fastest model for simple tasks',
        capabilities: ['text', 'documents'],
        maxTokens: 200000,
        costPer1k: 0.25
      }
    ]
  }
};

// Default configuration
export const DEFAULT_AI_CONFIG: AIConfig = {
  providers: AI_PROVIDERS,
  defaultProviders: {
    documents: 'mistral', // Mistral for document work as requested
    general: 'gemini',    // Gemini as default for general tasks
    images: 'gemini',     // Gemini for image understanding
    code: 'gemini'        // Gemini for code analysis
  },
  userApiKeys: {
    // API keys will be loaded from environment variables or user settings
    gemini: process.env.NEXT_PUBLIC_GEMINI_API_KEY || '',
    mistral: process.env.NEXT_PUBLIC_MISTRAL_API_KEY || '',
    groq: process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
    openai: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    claude: process.env.NEXT_PUBLIC_CLAUDE_API_KEY || ''
  }
};

// AI Configuration Manager
export class AIConfigManager {
  private static instance: AIConfigManager;
  private config: AIConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): AIConfigManager {
    if (!AIConfigManager.instance) {
      AIConfigManager.instance = new AIConfigManager();
    }
    return AIConfigManager.instance;
  }

  private loadConfig(): AIConfig {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ai-config');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_AI_CONFIG, ...parsed };
        } catch (error) {
          console.warn('Failed to parse stored AI config, using defaults');
        }
      }
    }
    return DEFAULT_AI_CONFIG;
  }

  public saveConfig(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai-config', JSON.stringify(this.config));
    }
  }

  public getConfig(): AIConfig {
    return this.config;
  }

  public updateApiKey(providerId: string, apiKey: string): void {
    this.config.userApiKeys[providerId] = apiKey;
    this.saveConfig();
  }

  public getApiKey(providerId: string): string | undefined {
    return this.config.userApiKeys[providerId];
  }

  public setDefaultProvider(task: keyof AIConfig['defaultProviders'], providerId: string): void {
    this.config.defaultProviders[task] = providerId;
    this.saveConfig();
  }

  public getDefaultProvider(task: keyof AIConfig['defaultProviders']): string {
    return this.config.defaultProviders[task];
  }

  public getProvider(providerId: string): AIProvider | undefined {
    return this.config.providers[providerId];
  }

  public getAllProviders(): AIProvider[] {
    return Object.values(this.config.providers);
  }

  public getAvailableModels(providerId: string): AIModel[] {
    const provider = this.getProvider(providerId);
    return provider?.models || [];
  }

  public hasValidApiKey(providerId: string): boolean {
    const apiKey = this.getApiKey(providerId);
    return !!(apiKey && apiKey.length > 10);
  }
}

// Utility functions for AI calls
export async function callAI(
  task: keyof AIConfig['defaultProviders'],
  prompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    providerId?: string;
  } = {}
): Promise<string> {
  const configManager = AIConfigManager.getInstance();
  const providerId = options.providerId || configManager.getDefaultProvider(task);
  const provider = configManager.getProvider(providerId);
  const apiKey = configManager.getApiKey(providerId);

  if (!provider || !apiKey) {
    throw new Error(`No valid configuration for provider: ${providerId}`);
  }

  const model = options.model || provider.defaultModel || provider.models[0]?.id;

  try {
    switch (providerId) {
      case 'gemini':
        return await callGemini(apiKey, model!, prompt, options);
      case 'mistral':
        return await callMistral(apiKey, model!, prompt, options);
      case 'groq':
        return await callGroq(apiKey, model!, prompt, options);
      case 'openai':
        return await callOpenAI(apiKey, model!, prompt, options);
      case 'claude':
        return await callClaude(apiKey, model!, prompt, options);
      default:
        throw new Error(`Unsupported provider: ${providerId}`);
    }
  } catch (error) {
    console.error(`AI call failed for ${providerId}:`, error);
    throw error;
  }
}

async function callGemini(apiKey: string, model: string, prompt: string, options: any): Promise<string> {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxTokens || 1000,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
}

async function callMistral(apiKey: string, model: string, prompt: string, options: any): Promise<string> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    })
  });

  if (!response.ok) {
    throw new Error(`Mistral API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
}

async function callGroq(apiKey: string, model: string, prompt: string, options: any): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    })
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
}

async function callOpenAI(apiKey: string, model: string, prompt: string, options: any): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated';
}

async function callClaude(apiKey: string, model: string, prompt: string, options: any): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'No response generated';
}
