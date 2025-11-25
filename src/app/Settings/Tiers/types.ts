export interface Tier {
  id: string;
  name: string;
  description: string;
  level: number; // Priority: higher number = higher tier (e.g., 100, 200, 300)
  status: 'Active' | 'Inactive';
  isDefault?: boolean; // True if this is the default tier
  gitSource?: string; // For GitOps-managed tiers
  isReadOnly: boolean; // True for GitOps-managed tiers
  groups: string[]; // Kubernetes groups assigned to this tier
  models: string[]; // Model IDs (must be AI Assets / MaaS models)
  limits: {
    tokenLimits?: Array<{
      id: string;
      amount: number;
      quantity: number;
      unit: 'minute' | 'hour' | 'day';
    }>;
    rateLimits?: Array<{
      id: string;
      amount: number;
      quantity: number;
      unit: 'minute' | 'hour' | 'day';
    }>;
    apiKeyExpirationDays?: number; // Default expiration for API keys
  };
  dateCreated: Date;
  createdBy: string;
  yaml?: string;
}

export interface CreateTierForm {
  name: string;
  description: string;
  level: number;
  groups: string[];
  models: string[];
  limits: {
    tokenLimits?: Array<{
      id: string;
      amount: number;
      quantity: number;
      unit: 'minute' | 'hour' | 'day';
    }>;
    rateLimits?: Array<{
      id: string;
      amount: number;
      quantity: number;
      unit: 'minute' | 'hour' | 'day';
    }>;
    apiKeyExpirationDays?: number;
  };
}

