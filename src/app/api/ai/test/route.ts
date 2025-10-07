import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey, model } = await request.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Provider and API key required' },
        { status: 400 }
      );
    }

    // Test the provider with a simple prompt
    let result;
    
    switch (provider) {
      case 'gemini':
        result = await testGemini(apiKey, model);
        break;
      case 'openai':
        result = await testOpenAI(apiKey, model);
        break;
      case 'claude':
        result = await testClaude(apiKey, model);
        break;
      case 'mistral':
        result = await testMistral(apiKey, model);
        break;
      case 'groq':
        result = await testGroq(apiKey, model);
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Unsupported provider' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: result });
  } catch (error: any) {
    console.error('AI test error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function testGemini(apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Connection successful"' }] }],
          generationConfig: { maxOutputTokens: 10 }
        })
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

async function testOpenAI(apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say "Connection successful"' }],
        max_tokens: 10
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testClaude(apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Say "Connection successful"' }]
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testMistral(apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say "Connection successful"' }],
        max_tokens: 10
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function testGroq(apiKey: string, model: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Say "Connection successful"' }],
        max_tokens: 10
      })
    });
    return response.ok;
  } catch {
    return false;
  }
}
