import { Tier } from './types';

// Available groups for tier assignment
export const mockGroups = [
  { id: 'dev-team', name: 'Development Team' },
  { id: 'premium-customers', name: 'Premium Customers' },
  { id: 'research-team', name: 'Research Team' },
  { id: 'data-science-team', name: 'Data Science Team' },
  { id: 'enterprise-users', name: 'Enterprise Users' },
  { id: 'standard-users', name: 'Standard Users' },
  { id: 'no-tier-users', name: 'No Tier Users' }, // For testing empty states
];

// Available MaaS models (AI Assets only)
export const mockMaaSModels = [
  { id: 'granite-3.1b-maas', name: 'Granite 3.1B (MaaS)' },
  { id: 'llama-7b-maas', name: 'Llama 7B (MaaS)' },
  { id: 'gpt-oss-20b-maas', name: 'GPT-OSS 20B (MaaS)' },
  { id: 'mistral-7b-maas', name: 'Mistral 7B (MaaS)' },
  { id: 'codellama-13b-maas', name: 'CodeLlama 13B (MaaS)' },
  { id: 'falcon-40b-maas', name: 'Falcon 40B (MaaS)' },
];

// Mock tiers
export const mockTiers: Tier[] = [
  {
    id: 'default-tier',
    name: 'Default Tier',
    description: 'Standard tier with access to MaaS models and baseline rate limits',
    level: 100,
    status: 'Active',
    isReadOnly: false,
    groups: ['standard-users'],
    models: ['granite-3.1b-maas', 'llama-7b-maas'],
    limits: {
      tokenLimit: {
        amount: 10000,
        period: 'hour',
      },
      rateLimit: {
        amount: 100,
        period: 'minute',
      },
      apiKeyExpirationDays: 90,
    },
    dateCreated: new Date('2025-01-01T10:00:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: default-tier
spec:
  level: 100
  groups:
    - standard-users
  models:
    - granite-3.1b-maas
    - llama-7b-maas
  limits:
    tokenLimit:
      amount: 10000
      period: hour
    rateLimit:
      amount: 100
      period: minute
    apiKeyExpirationDays: 90`,
  },
  {
    id: 'standard-tier',
    name: 'Standard Tier',
    description: 'Standard tier for development teams with moderate rate limits',
    level: 200,
    status: 'Active',
    isReadOnly: false,
    groups: ['dev-team', 'data-science-team'],
    models: ['granite-3.1b-maas', 'llama-7b-maas', 'mistral-7b-maas'],
    limits: {
      tokenLimit: {
        amount: 50000,
        period: 'hour',
      },
      rateLimit: {
        amount: 1000,
        period: 'minute',
      },
      apiKeyExpirationDays: 90,
    },
    dateCreated: new Date('2025-01-05T14:30:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: standard-tier
spec:
  level: 200
  groups:
    - dev-team
    - data-science-team
  models:
    - granite-3.1b-maas
    - llama-7b-maas
    - mistral-7b-maas
  limits:
    tokenLimit:
      amount: 50000
      period: hour
    rateLimit:
      amount: 1000
      period: minute
    apiKeyExpirationDays: 90`,
  },
  {
    id: 'premium-tier',
    name: 'Premium Tier',
    description: 'High-throughput tier for premium customers with access to all models',
    level: 300,
    status: 'Active',
    gitSource: 'https://github.com/company/tiers/blob/main/premium-tier.yaml',
    isReadOnly: true,
    groups: ['premium-customers'],
    models: ['granite-3.1b-maas', 'llama-7b-maas', 'mistral-7b-maas', 'gpt-oss-20b-maas', 'codellama-13b-maas'],
    limits: {
      tokenLimit: {
        amount: 500000,
        period: 'hour',
      },
      rateLimit: {
        amount: 10000,
        period: 'minute',
      },
      apiKeyExpirationDays: 365,
    },
    dateCreated: new Date('2025-01-10T09:15:00Z'),
    createdBy: 'platform-admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: premium-tier
  annotations:
    argocd.argoproj.io/sync-wave: "1"
spec:
  level: 300
  groups:
    - premium-customers
  models:
    - granite-3.1b-maas
    - llama-7b-maas
    - mistral-7b-maas
    - gpt-oss-20b-maas
    - codellama-13b-maas
  limits:
    tokenLimit:
      amount: 500000
      period: hour
    rateLimit:
      amount: 10000
      period: minute
    apiKeyExpirationDays: 365`,
  },
  {
    id: 'enterprise-tier',
    name: 'Enterprise Tier',
    description: 'Unlimited access for enterprise users with all models and no expiration',
    level: 400,
    status: 'Active',
    isReadOnly: false,
    groups: ['enterprise-users', 'research-team'],
    models: ['granite-3.1b-maas', 'llama-7b-maas', 'mistral-7b-maas', 'gpt-oss-20b-maas', 'codellama-13b-maas', 'falcon-40b-maas'],
    limits: {
      tokenLimit: {
        amount: 1000000,
        period: 'day',
      },
      rateLimit: {
        amount: 100000,
        period: 'minute',
      },
      apiKeyExpirationDays: 0, // Never expires
    },
    dateCreated: new Date('2025-01-15T11:20:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: enterprise-tier
spec:
  level: 400
  groups:
    - enterprise-users
    - research-team
  models:
    - granite-3.1b-maas
    - llama-7b-maas
    - mistral-7b-maas
    - gpt-oss-20b-maas
    - codellama-13b-maas
    - falcon-40b-maas
  limits:
    tokenLimit:
      amount: 1000000
      period: day
    rateLimit:
      amount: 100000
      period: minute
    apiKeyExpirationDays: 0`,
  },
  {
    id: 'inactive-tier',
    name: 'Inactive Test Tier',
    description: 'Inactive tier for testing deleted tier scenarios',
    level: 50,
    status: 'Inactive',
    isReadOnly: false,
    groups: [],
    models: ['granite-3.1b-maas'],
    limits: {
      tokenLimit: {
        amount: 5000,
        period: 'hour',
      },
      rateLimit: {
        amount: 50,
        period: 'minute',
      },
      apiKeyExpirationDays: 30,
    },
    dateCreated: new Date('2024-12-01T10:00:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: inactive-test-tier
spec:
  level: 50
  groups: []
  models:
    - granite-3.1b-maas
  limits:
    tokenLimit:
      amount: 5000
      period: hour
    rateLimit:
      amount: 50
      period: minute
    apiKeyExpirationDays: 30`,
  },
];

// Utility functions
export const getTierById = (id: string): Tier | undefined => 
  mockTiers.find(t => t.id === id);

export const getGroupById = (id: string) => 
  mockGroups.find(g => g.id === id);

export const getModelById = (id: string) => 
  mockMaaSModels.find(m => m.id === id);

// Get tier by user's group membership (returns highest tier)
export const getTierByGroups = (userGroups: string[]): Tier | undefined => {
  const userTiers = mockTiers.filter(tier => 
    tier.status === 'Active' && 
    tier.groups.some(group => userGroups.includes(group))
  );
  
  if (userTiers.length === 0) return undefined;
  
  // Return tier with highest level
  return userTiers.reduce((highest, current) => 
    current.level > highest.level ? current : highest
  );
};

