'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Key, 
  Sparkles, 
  Save, 
  RefreshCw, 
  Check, 
  X,
  Eye,
  EyeOff,
  Brain,
  Zap,
  MessageSquare,
  User,
  Bell,
  Shield,
  Palette,
  Globe
} from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AIProvider {
  id: string;
  name: string;
  description: string;
  icon: string;
  models: string[];
  defaultModel: string;
  requiresKey: boolean;
  websiteUrl: string;
}

const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Fast and powerful AI from Google',
    icon: '🔷',
    models: ['gemini-2.0-flash-exp', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    defaultModel: 'gemini-2.0-flash-exp',
    requiresKey: true,
    websiteUrl: 'https://aistudio.google.com/apikey'
  },
  {
    id: 'openai',
    name: 'OpenAI GPT',
    description: 'Industry-leading language models',
    icon: '🤖',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o-mini',
    requiresKey: true,
    websiteUrl: 'https://platform.openai.com/api-keys'
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    description: 'Advanced reasoning and analysis',
    icon: '🧠',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    requiresKey: true,
    websiteUrl: 'https://console.anthropic.com/settings/keys'
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: 'Efficient European AI models',
    icon: '⚡',
    models: ['mistral-large-latest', 'mistral-medium-latest', 'mistral-small-latest'],
    defaultModel: 'mistral-small-latest',
    requiresKey: true,
    websiteUrl: 'https://console.mistral.ai/api-keys'
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference',
    icon: '🚀',
    models: ['llama-3.1-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    defaultModel: 'llama-3.1-8b-instant',
    requiresKey: true,
    websiteUrl: 'https://console.groq.com/keys'
  }
];

interface AISettings {
  selectedProvider: string;
  selectedModel: string;
  apiKeys: Record<string, string>;
  responseMode: 'detailed' | 'compact';
  useCards: boolean;
  temperature: number;
  maxTokens: number;
}

export default function SettingsPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'ai' | 'profile' | 'notifications' | 'appearance'>('ai');
  
  const [settings, setSettings] = useState<AISettings>({
    selectedProvider: 'gemini',
    selectedModel: 'gemini-2.0-flash-exp',
    apiKeys: {},
    responseMode: 'detailed',
    useCards: true,
    temperature: 0.7,
    maxTokens: 512
  });

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem('ai-settings');
    if (stored) {
      setSettings(JSON.parse(stored));
    }
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('ai-settings', JSON.stringify(settings));
      
      // Also save to user preferences in database if needed
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiSettings: settings })
      }).catch(() => {}); // Ignore if API doesn't exist yet

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const testProvider = async (providerId: string) => {
    setTestingProvider(providerId);
    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: providerId,
          apiKey: settings.apiKeys[providerId],
          model: settings.selectedModel
        })
      });

      const result = await response.json();
      setTestResults({ ...testResults, [providerId]: result.success });
    } catch (error) {
      setTestResults({ ...testResults, [providerId]: false });
    } finally {
      setTestingProvider(null);
    }
  };

  const updateApiKey = (providerId: string, key: string) => {
    setSettings({
      ...settings,
      apiKeys: { ...settings.apiKeys, [providerId]: key }
    });
  };

  const selectedProviderData = AI_PROVIDERS.find(p => p.id === settings.selectedProvider);

  const tabs = [
    { id: 'ai', label: 'AI Settings', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-white/60">Manage your preferences and configurations</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* AI Settings Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-8">
            {/* Provider Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                Select AI Provider
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AI_PROVIDERS.map((provider) => (
                  <motion.button
                    key={provider.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSettings({
                        ...settings,
                        selectedProvider: provider.id,
                        selectedModel: provider.defaultModel
                      });
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      settings.selectedProvider === provider.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-3xl">{provider.icon}</span>
                      {settings.selectedProvider === provider.id && (
                        <Check className="w-5 h-5 text-cyan-500" />
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-1">{provider.name}</h3>
                    <p className="text-sm text-white/60">{provider.description}</p>
                    
                    {testResults[provider.id] !== undefined && (
                      <div className={`mt-2 text-xs flex items-center gap-1 ${
                        testResults[provider.id] ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {testResults[provider.id] ? (
                          <><Check className="w-3 h-3" /> Connected</>
                        ) : (
                          <><X className="w-3 h-3" /> Failed</>
                        )}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* API Keys Configuration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-500" />
                API Keys
              </h2>

              <div className="space-y-4">
                {AI_PROVIDERS.map((provider) => (
                  <div
                    key={provider.id}
                    className="p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <h3 className="font-semibold">{provider.name}</h3>
                          <a
                            href={provider.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-cyan-500 hover:underline"
                          >
                            Get API Key →
                          </a>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => testProvider(provider.id)}
                        disabled={!settings.apiKeys[provider.id] || testingProvider === provider.id}
                        className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {testingProvider === provider.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                        Test
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showKeys[provider.id] ? 'text' : 'password'}
                        value={settings.apiKeys[provider.id] || ''}
                        onChange={(e) => updateApiKey(provider.id, e.target.value)}
                        placeholder={`Enter your ${provider.name} API key...`}
                        className="w-full px-4 py-3 pr-12 bg-black/30 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white placeholder:text-white/40"
                      />
                      <button
                        onClick={() => setShowKeys({ ...showKeys, [provider.id]: !showKeys[provider.id] })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                      >
                        {showKeys[provider.id] ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Model Selection */}
            {selectedProviderData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-cyan-500" />
                  Model Selection
                </h2>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Choose {selectedProviderData.name} Model
                  </label>
                  <select
                    value={settings.selectedModel}
                    onChange={(e) => setSettings({ ...settings, selectedModel: e.target.value })}
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-white"
                  >
                    {selectedProviderData.models.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Response Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-500" />
                Response Preferences
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Response Mode */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm text-white/70 mb-3">Response Mode</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSettings({ ...settings, responseMode: 'detailed' })}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                        settings.responseMode === 'detailed'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Detailed
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, responseMode: 'compact' })}
                      className={`flex-1 px-4 py-2 rounded-lg transition-all ${
                        settings.responseMode === 'compact'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      Compact
                    </button>
                  </div>
                </div>

                {/* Use Cards */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm text-white/70 mb-3">Display Style</label>
                  <div className="flex items-center justify-between">
                    <span className="text-white/90">Use Interactive Cards</span>
                    <button
                      onClick={() => setSettings({ ...settings, useCards: !settings.useCards })}
                      className={`relative w-14 h-7 rounded-full transition-colors ${
                        settings.useCards ? 'bg-cyan-500' : 'bg-white/20'
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          settings.useCards ? 'translate-x-7' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Temperature */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Temperature: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>Precise</span>
                    <span>Creative</span>
                  </div>
                </div>

                {/* Max Tokens */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Max Tokens: {settings.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="2048"
                    step="128"
                    value={settings.maxTokens}
                    onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>Fast</span>
                    <span>Comprehensive</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-end gap-4"
            >
              <button
                onClick={() => {
                  setSettings({
                    selectedProvider: 'gemini',
                    selectedModel: 'gemini-2.0-flash-exp',
                    apiKeys: {},
                    responseMode: 'detailed',
                    useCards: true,
                    temperature: 0.7,
                    maxTokens: 512
                  });
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Reset to Defaults
              </button>

              <button
                onClick={saveSettings}
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  saved
                    ? 'bg-green-500 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90'
                }`}
              >
                {saving ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : saved ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
            </motion.div>
          </div>
        )}

        {/* Other Tabs - Coming Soon */}
        {activeTab !== 'ai' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-96"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-white/60">This section is under development</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
