import { APIKey, Model, Policy, APIKeyMetrics } from './types';

// Available models
export const mockModels: Model[] = [
  { id: 'gpt-oss-20b', name: 'GPT-OSS 20B', endpoint: 'https://api.example.com/models/gpt-oss-20b/v1' },
  { id: 'granite-3.1b', name: 'Granite 3.1B', endpoint: 'https://api.example.com/models/granite-3.1b/v1' },
  { id: 'llama-7b', name: 'Llama 7B', endpoint: 'https://api.example.com/models/llama-7b/v1' },
  { id: 'codellama-13b', name: 'CodeLlama 13B', endpoint: 'https://api.example.com/models/codellama-13b/v1' },
  { id: 'mistral-7b', name: 'Mistral 7B', endpoint: 'https://api.example.com/models/mistral-7b/v1' },
];

// Available policies
export const mockPolicies: Policy[] = [
  { id: 'devs-rate-limit-standard', name: 'Developer Rate Limit Standard', description: 'Standard rate limiting for development teams: 1000 requests/minute, 50K tokens/minute', type: 'RateLimitPolicy' },
  { id: 'devs-budget-standard', name: 'Developer Budget Standard', description: 'Monthly budget cap of $500 for development API usage', type: 'RateLimitPolicy' },
  { id: 'prod-rate-limit-high', name: 'Production Rate Limit High', description: 'High throughput for production workloads: 10K requests/minute, 500K tokens/minute', type: 'RateLimitPolicy' },
  { id: 'security-data-classification', name: 'Security Data Classification', description: 'Restricts access to models based on data classification levels', type: 'AuthPolicy' },
  { id: 'compliance-audit-logging', name: 'Compliance Audit Logging', description: 'Enhanced logging for compliance and audit requirements', type: 'AuthPolicy' },
  { id: 'cost-optimization', name: 'Cost Optimization Policy', description: 'Automatic model selection based on cost-effectiveness for the task', type: 'DNSPolicy' },
];

// Mock API keys
export const mockAPIKeys: APIKey[] = [
  {
    id: 'key-0',
    name: 'personal-key',
    description: '',
    apiKey: 'sk-personal0123456789abcdefghijklmn',
    status: 'Active',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2025-10-01T08:00:00Z'),
    dateLastUsed: new Date('2025-10-14T09:15:00Z'),
    limits: {
      tokenRateLimit: 10000,
      requestRateLimit: 100,
      budgetLimit: 100,
      expirationDate: new Date('2026-01-20T08:00:00Z'),
    },
    assets: {
      modelEndpoints: ['gpt-oss-20b'],
    },
  },
  {
    id: 'key-2',
    name: 'production-workload-key',
    description: '',
    apiKey: 'sk-abcdef1234567890abcdef1234567890',
    status: 'Active',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2025-10-12T10:30:00Z'),
    dateLastUsed: new Date('2025-10-12T10:30:00Z'),
    limits: {
      tokenRateLimit: 500000,
      requestRateLimit: 10000,
      budgetLimit: 2000,
      expirationDate: new Date('2026-01-10T08:15:00Z'),
    },
    assets: {
      modelEndpoints: ['gpt-oss-20b', 'granite-3.1b', 'mistral-7b'],
    },
  },
  {
    id: 'key-3',
    name: 'research-project-key',
    description: '',
    apiKey: 'sk-fedcba0987654321fedcba0987654321',
    status: 'Disabled',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2025-10-12T10:30:00Z'),
    dateLastUsed: new Date('2025-10-12T10:30:00Z'),
    limits: {
      tokenRateLimit: 25000,
      requestRateLimit: 500,
      budgetLimit: 200,
      expirationDate: new Date('2026-01-18T14:20:00Z'),
    },
    assets: {
      modelEndpoints: ['codellama-13b', 'mistral-7b'],
    },
  },
  {
    id: 'key-4',
    name: 'legacy-integration-key',
    description: '',
    apiKey: 'sk-expired123456789abcdefghijklmno',
    status: 'Expired',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2024-08-10T10:00:00Z'),
    dateLastUsed: new Date('2025-01-15T08:45:00Z'),
    limits: {
      tokenRateLimit: 15000,
      requestRateLimit: 300,
      budgetLimit: 150,
      expirationDate: new Date('2024-09-10T10:00:00Z'),
    },
    assets: {
      modelEndpoints: ['llama-7b'],
    },
  },
  {
    id: 'key-5',
    name: 'playground-free',
    description: '',
    apiKey: 'sk-playground0987654321fedcbafedcba',
    status: 'Active',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2025-10-10T14:00:00Z'),
    dateLastUsed: new Date(Date.now() - 30000), // 30 seconds ago
    limits: {
      tokenRateLimit: 100000,
      requestRateLimit: 2000,
      budgetLimit: 1000,
      expirationDate: undefined, // No expiration
    },
    assets: {
      modelEndpoints: ['gpt-oss-20b', 'granite-3.1b', 'llama-7b'],
    },
  },
  {
    id: 'key-6',
    name: 'orphaned-key',
    description: '',
    apiKey: 'sk-orphaned0987654321abcdefghijklmn',
    status: 'Inactive',
    owner: { type: 'User', name: 'username-here' },
    dateCreated: new Date('2025-09-15T10:00:00Z'),
    dateLastUsed: new Date('2025-10-01T14:30:00Z'),
    limits: {
      tokenRateLimit: 30000,
      requestRateLimit: 600,
      budgetLimit: 300,
      expirationDate: new Date('2026-03-15T10:00:00Z'),
    },
    assets: {
      modelEndpoints: ['granite-3.1b'],
    },
  },
];

// Generate mock metrics data
const generateMetricsOverTime = (days: number): { timestamp: Date; value: number }[] => {
  const data: { timestamp: Date; value: number }[] = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const value = Math.floor(Math.random() * 1000) + 100; // Random requests between 100-1100
    data.push({ timestamp, value });
  }
  return data;
};

// Mock metrics for each API key
export const mockMetrics: Record<string, APIKeyMetrics> = {
  'key-0': {
    totalRequests: 5423,
    successRate: 99.1,
    totalTokens: 234890,
    totalCost: 23.49,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-1': {
    totalRequests: 45892,
    successRate: 98.2,
    totalTokens: 2340567,
    totalCost: 234.56,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-2': {
    totalRequests: 158234,
    successRate: 99.7,
    totalTokens: 8923456,
    totalCost: 892.34,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-3': {
    totalRequests: 12456,
    successRate: 97.8,
    totalTokens: 567890,
    totalCost: 56.79,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-4': {
    totalRequests: 8234,
    successRate: 96.5,
    totalTokens: 423456,
    totalCost: 42.34,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-5': {
    totalRequests: 15678,
    successRate: 99.5,
    totalTokens: 789234,
    totalCost: 78.92,
    requestsOverTime: generateMetricsOverTime(30),
  },
  'key-6': {
    totalRequests: 3421,
    successRate: 98.8,
    totalTokens: 145678,
    totalCost: 14.57,
    requestsOverTime: generateMetricsOverTime(30),
  },
};

// Get policies applied to an API key
export const getAPIKeyPolicies = (keyId: string): Policy[] => {
  switch (keyId) {
    case 'key-0':
      return [mockPolicies[0]]; // dev-rate-limit
    case 'key-1':
      return [mockPolicies[0], mockPolicies[1], mockPolicies[3]]; // dev-rate-limit, dev-budget, security
    case 'key-2':
      return [mockPolicies[2], mockPolicies[4], mockPolicies[5]]; // prod-rate-limit, audit-logging, cost-optimization
    case 'key-3':
      return [mockPolicies[0], mockPolicies[1]]; // dev-rate-limit, dev-budget
    case 'key-4':
      return []; // no policies (expired)
    case 'key-5':
      return [mockPolicies[0]]; // dev-rate-limit
    case 'key-6':
      return []; // no policies (orphaned)
    default:
      return [];
  }
};

// Utility functions for getting data by ID
export const getModelById = (id: string): Model | undefined => mockModels.find(m => m.id === id);
export const getAPIKeyById = (id: string): APIKey | undefined => mockAPIKeys.find(k => k.id === id);
