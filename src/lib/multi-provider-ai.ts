import { GoogleGenerativeAI } from '@google/generative-ai';

interface AIProviderConfig {
  provider: string;
  model: string;
  apiKey: string;
  temperature?: number;
  maxTokens?: number;
}

interface AIResponse {
  text: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

/**
 * Universal AI caller that works with multiple providers
 */
export async function callAIProvider(
  prompt: string,
  config: AIProviderConfig
): Promise<AIResponse> {
  const { provider, model, apiKey, temperature = 0.7, maxTokens = 512 } = config;

  switch (provider) {
    case 'gemini':
      return await callGemini(prompt, model, apiKey, temperature, maxTokens);
    case 'openai':
      return await callOpenAI(prompt, model, apiKey, temperature, maxTokens);
    case 'claude':
      return await callClaude(prompt, model, apiKey, temperature, maxTokens);
    case 'mistral':
      return await callMistral(prompt, model, apiKey, temperature, maxTokens);
    case 'groq':
      return await callGroq(prompt, model, apiKey, temperature, maxTokens);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Google Gemini
 */
async function callGemini(
  prompt: string,
  model: string,
  apiKey: string,
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({
    model: model,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
    },
  });

  const result = await geminiModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return {
    text,
    provider: 'gemini',
    model,
  };
}

/**
 * OpenAI GPT
 */
async function callOpenAI(
  prompt: string,
  model: string,
  apiKey: string,
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0].message.content,
    provider: 'openai',
    model,
    usage: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}

/**
 * Anthropic Claude
 */
async function callClaude(
  prompt: string,
  model: string,
  apiKey: string,
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.content[0].text,
    provider: 'claude',
    model,
    usage: {
      promptTokens: data.usage?.input_tokens,
      completionTokens: data.usage?.output_tokens,
    },
  };
}

/**
 * Mistral AI
 */
async function callMistral(
  prompt: string,
  model: string,
  apiKey: string,
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Mistral error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0].message.content,
    provider: 'mistral',
    model,
    usage: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}

/**
 * Groq
 */
async function callGroq(
  prompt: string,
  model: string,
  apiKey: string,
  temperature: number,
  maxTokens: number
): Promise<AIResponse> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return {
    text: data.choices[0].message.content,
    provider: 'groq',
    model,
    usage: {
      promptTokens: data.usage?.prompt_tokens,
      completionTokens: data.usage?.completion_tokens,
      totalTokens: data.usage?.total_tokens,
    },
  };
}

/**
 * Get AI settings from localStorage or use defaults
 */
export function getAISettings(): AIProviderConfig {
  if (typeof window === 'undefined') {
    // Server-side: use environment variables
    return {
      provider: 'gemini',
      model: 'gemini-2.0-flash-exp',
      apiKey: process.env.GOOGLE_GEMINI_API_KEY || '',
      temperature: 0.7,
      maxTokens: 512,
    };
  }

  // Client-side: use localStorage
  const stored = localStorage.getItem('ai-settings');
  if (stored) {
    const settings = JSON.parse(stored);
    return {
      provider: settings.selectedProvider || 'gemini',
      model: settings.selectedModel || 'gemini-2.0-flash-exp',
      apiKey: settings.apiKeys[settings.selectedProvider] || '',
      temperature: settings.temperature || 0.7,
      maxTokens: settings.maxTokens || 512,
    };
  }

  // Fallback to defaults
  return {
    provider: 'gemini',
    model: 'gemini-2.0-flash-exp',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 512,
  };
}

/**
 * Parse AI response and extract structured data for cards
 */
export function parseResponseForCards(text: string): {
  summary: string;
  keyPoints: string[];
  metrics: Record<string, string | number>;
  recommendations: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }>;
} {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Extract summary (first paragraph)
  const summary = lines.slice(0, 3).join(' ').substring(0, 200);
  
  // Extract key points (lines with bullets or numbers)
  const keyPoints = lines
    .filter(line => /^[\-\*\d]/.test(line.trim()))
    .map(line => line.replace(/^[\-\*\d\.]\s*/, ''))
    .slice(0, 5);
  
  // Extract metrics (numbers with labels)
  const metrics: Record<string, string | number> = {};
  lines.forEach(line => {
    const match = line.match(/(\w+):\s*(\d+\.?\d*%?)/i);
    if (match) {
      metrics[match[1]] = match[2];
    }
  });
  
  // Extract recommendations
  const recommendations: Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low' }> = [];
  lines.forEach((line, i) => {
    if (line.toLowerCase().includes('recommend') || line.toLowerCase().includes('should')) {
      const priority = line.toLowerCase().includes('urgent') || line.toLowerCase().includes('important') 
        ? 'high' 
        : line.toLowerCase().includes('consider') ? 'low' : 'medium';
      
      recommendations.push({
        title: line.substring(0, 50),
        description: lines[i + 1] || line,
        priority
      });
    }
  });

  return {
    summary,
    keyPoints: keyPoints.length > 0 ? keyPoints : [summary],
    metrics,
    recommendations: recommendations.slice(0, 3)
  };
}
