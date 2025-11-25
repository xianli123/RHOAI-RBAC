import { Tier } from './types';

// Available groups for tier assignment
export const mockGroups = [
  { id: 'dev-team', name: 'system:dev-team' },
  { id: 'premium-customers', name: 'premium-users' },
  { id: 'research-team', name: 'cluster-admins' },
  { id: 'data-science-team', name: 'data-science-users' },
  { id: 'enterprise-users', name: 'enterprise-users' },
  { id: 'standard-users', name: 'system:authenticated' },
  { id: 'no-tier-users', name: 'basic-users' }, // For testing empty states
];

// Available MaaS models (AI Assets only)
// These must match the AI Asset models defined in AIAssets/Models/ModelDetails.tsx
export const mockMaaSModels = [
  { id: 'llama-3-1-8b-instruct', name: 'llama-3.1-8b-instruct', slug: 'llama-3-1-8b-instruct' },
  { id: 'granite-7b-code', name: 'granite-7b-code', slug: 'granite-7b-code' },
  { id: 'mistral-7b-instruct', name: 'mistral-7b-instruct', slug: 'mistral-7b-instruct' },
];

// Mock tiers
export const mockTiers: Tier[] = [
  {
    id: 'free-tier',
    name: 'Free Tier',
    description: 'Free tier with access to all AI asset models and baseline rate limits',
    level: 1,
    status: 'Active',
    isDefault: true,
    isReadOnly: false,
    groups: ['standard-users'],
    models: ['llama-3-1-8b-instruct', 'granite-7b-code', 'mistral-7b-instruct'],
    limits: {
      tokenLimits: [
        {
          id: 'token-limit-1',
          amount: 10000,
          quantity: 1,
          unit: 'hour',
        },
      ],
      rateLimits: [
        {
          id: 'rate-limit-1',
          amount: 100,
          quantity: 1,
          unit: 'minute',
        },
      ],
      apiKeyExpirationDays: 4 / 24, // 4 hours
    },
    dateCreated: new Date('2025-01-01T10:00:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: free-tier
spec:
  level: 1
  groups:
    - standard-users
  models:
    - llama-3-1-8b-instruct
    - granite-7b-code
    - mistral-7b-instruct
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
    id: 'premium-tier',
    name: 'Premium Tier',
    description: 'High-throughput tier for premium customers with access to all models',
    level: 10,
    status: 'Active',
    gitSource: 'https://github.com/company/tiers/blob/main/premium-tier.yaml',
    isReadOnly: true,
    groups: ['premium-customers'],
    models: ['llama-3-1-8b-instruct', 'granite-7b-code', 'mistral-7b-instruct'],
    limits: {
      tokenLimits: [
        {
          id: 'token-limit-2',
          amount: 500000,
          quantity: 1,
          unit: 'hour',
        },
      ],
      rateLimits: [
        {
          id: 'rate-limit-2',
          amount: 10000,
          quantity: 1,
          unit: 'minute',
        },
      ],
      apiKeyExpirationDays: 4 / 24, // 4 hours
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
  level: 10
  groups:
    - premium-customers
  models:
    - llama-3-1-8b-instruct
    - granite-7b-code
    - mistral-7b-instruct
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
    level: 20,
    status: 'Active',
    isReadOnly: false,
    groups: ['enterprise-users', 'research-team'],
    models: ['llama-3-1-8b-instruct', 'granite-7b-code', 'mistral-7b-instruct'],
    limits: {
      tokenLimits: [
        {
          id: 'token-limit-3',
          amount: 1000000,
          quantity: 1,
          unit: 'hour',
        },
      ],
      rateLimits: [
        {
          id: 'rate-limit-3',
          amount: 10000,
          quantity: 1,
          unit: 'minute',
        },
      ],
      apiKeyExpirationDays: 4 / 24, // 4 hours
    },
    dateCreated: new Date('2025-01-15T11:20:00Z'),
    createdBy: 'admin',
    yaml: `apiVersion: maas.openshift.io/v1alpha1
kind: Tier
metadata:
  name: enterprise-tier
spec:
  level: 20
  groups:
    - enterprise-users
    - research-team
  models:
    - llama-3-1-8b-instruct
    - granite-7b-code
    - mistral-7b-instruct
  limits:
    tokenLimit:
      amount: 1000000
      period: hour
    rateLimit:
      amount: 10000
      period: minute
    apiKeyExpirationDays: 0`,
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

