"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Key, 
  Brain, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Zap,
  FileText,
  Image,
  Code,
  Sparkles
} from "lucide-react";
import { AIConfigManager, AIProvider, AIModel } from "@/lib/ai-config";

export default function AISettings() {
  const { toast } = useToast();
  const [configManager] = useState(() => AIConfigManager.getInstance());
  const [config, setConfig] = useState(configManager.getConfig());
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [tempApiKeys, setTempApiKeys] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});

  useEffect(() => {
    // Initialize temp API keys with current values
    const currentKeys: Record<string, string> = {};
    Object.keys(config.providers).forEach(providerId => {
      currentKeys[providerId] = configManager.getApiKey(providerId) || '';
    });
    setTempApiKeys(currentKeys);
  }, [config, configManager]);

  const handleApiKeyChange = (providerId: string, value: string) => {
    setTempApiKeys(prev => ({
      ...prev,
      [providerId]: value
    }));
  };

  const saveApiKey = (providerId: string) => {
    const apiKey = tempApiKeys[providerId];
    if (apiKey && apiKey.length > 10) {
      configManager.updateApiKey(providerId, apiKey);
      setConfig(configManager.getConfig());
      toast({
        title: "API Key Saved",
        description: `${config.providers[providerId].name} API key has been saved securely.`
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid API key (minimum 10 characters).",
        variant: "destructive"
      });
    }
  };

  const testApiKey = async (providerId: string) => {
    const apiKey = tempApiKeys[providerId];
    if (!apiKey) {
      toast({
        title: "No API Key",
        description: "Please enter an API key first.",
        variant: "destructive"
      });
      return;
    }

    setTesting(prev => ({ ...prev, [providerId]: true }));
    setTestResults(prev => ({ ...prev, [providerId]: null }));

    try {
      // Test the API key with a simple prompt
      const testPrompt = "Hello! Please respond with 'API key is working correctly.'";
      
      // Temporarily save the key for testing
      const originalKey = configManager.getApiKey(providerId);
      configManager.updateApiKey(providerId, apiKey);
      
      const { callAI } = await import('@/lib/ai-config');
      const response = await callAI('general', testPrompt, { 
        providerId,
        maxTokens: 50,
        temperature: 0.1
      });

      if (response && response.length > 0) {
        setTestResults(prev => ({ ...prev, [providerId]: 'success' }));
        toast({
          title: "API Key Valid",
          description: `${config.providers[providerId].name} is working correctly!`
        });
      } else {
        throw new Error('Empty response');
      }
    } catch (error: any) {
      setTestResults(prev => ({ ...prev, [providerId]: 'error' }));
      toast({
        title: "API Key Test Failed",
        description: error.message || "Failed to connect to the AI provider.",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, [providerId]: false }));
    }
  };

  const setDefaultProvider = (task: keyof typeof config.defaultProviders, providerId: string) => {
    configManager.setDefaultProvider(task, providerId);
    setConfig(configManager.getConfig());
    toast({
      title: "Default Provider Updated",
      description: `${config.providers[providerId].name} is now the default for ${task} tasks.`
    });
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  const getTaskIcon = (task: string) => {
    switch (task) {
      case 'documents': return <FileText className="w-4 h-4" />;
      case 'images': return <Image className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (providerId: string) => {
    if (testing[providerId]) {
      return <RefreshCw className="w-4 h-4 animate-spin" />;
    }
    if (testResults[providerId] === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (testResults[providerId] === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (configManager.hasValidApiKey(providerId)) {
      return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      <Card className="neumorphic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Configuration & Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="providers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="providers">AI Providers</TabsTrigger>
              <TabsTrigger value="defaults">Default Models</TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="space-y-4">
              {Object.values(config.providers).map((provider: AIProvider) => (
                <Card key={provider.id} className="neumorphic-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{provider.name}</h3>
                          {getStatusIcon(provider.id)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {provider.models.map((model: AIModel) => (
                            <Badge key={model.id} variant="secondary" className="text-xs">
                              {model.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor={`api-key-${provider.id}`} className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        API Key
                      </Label>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`api-key-${provider.id}`}
                            type={showApiKeys[provider.id] ? "text" : "password"}
                            placeholder={`Enter your ${provider.name} API key`}
                            value={tempApiKeys[provider.id] || ''}
                            onChange={(e) => handleApiKeyChange(provider.id, e.target.value)}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                            onClick={() => toggleApiKeyVisibility(provider.id)}
                          >
                            {showApiKeys[provider.id] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => saveApiKey(provider.id)}
                          size="sm"
                          disabled={!tempApiKeys[provider.id] || tempApiKeys[provider.id].length < 10}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        
                        <Button
                          onClick={() => testApiKey(provider.id)}
                          variant="outline"
                          size="sm"
                          disabled={testing[provider.id] || !tempApiKeys[provider.id]}
                        >
                          <Zap className="w-4 h-4 mr-1" />
                          Test
                        </Button>
                      </div>

                      {testResults[provider.id] === 'success' && (
                        <div className="text-sm text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          API key is working correctly
                        </div>
                      )}
                      
                      {testResults[provider.id] === 'error' && (
                        <div className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          API key test failed - please check your key
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="defaults" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(config.defaultProviders).map(([task, currentProviderId]) => (
                  <Card key={task} className="neumorphic-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        {getTaskIcon(task)}
                        <h3 className="font-medium capitalize">{task} Tasks</h3>
                      </div>
                      
                      <Select
                        value={currentProviderId}
                        onValueChange={(value) => setDefaultProvider(task as keyof typeof config.defaultProviders, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(config.providers).map((provider: AIProvider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              <div className="flex items-center gap-2">
                                <span>{provider.name}</span>
                                {configManager.hasValidApiKey(provider.id) ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <p className="text-xs text-gray-500 mt-2">
                        Current: {config.providers[currentProviderId]?.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="neumorphic-sm">
                <CardContent className="p-4">
                  <h3 className="font-medium mb-3">Current Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>📄 Document Processing:</span>
                      <span className="font-medium">{config.providers[config.defaultProviders.documents]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🧠 General AI Tasks:</span>
                      <span className="font-medium">{config.providers[config.defaultProviders.general]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🖼️ Image Understanding:</span>
                      <span className="font-medium">{config.providers[config.defaultProviders.images]?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💻 Code Analysis:</span>
                      <span className="font-medium">{config.providers[config.defaultProviders.code]?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
