# MaaS Admin UI - Implementation Plan
Date: November 12, 2025  
**Last Updated:** November 17, 2025

## Overview

This document provides a detailed implementation plan to align the current prototype with the Feature Refinement document for RHOAISTRAT-638 (MaaS Admin UI).

## Implementation Progress Summary

**Overall Status:** 🔄 **IN PROGRESS** - Sprint 2 of 4

| Phase | Status | Completed | Total |
|-------|--------|-----------|-------|
| **Phase 1: Core Tiers Implementation** | ⚠️ Mostly Complete | 3.5/4 | 87% |
| **Phase 2: API Key Tier Integration** | 🔄 In Progress | 1/4 | 25% |
| **Phase 3: Enhanced Features** | ⏳ Partially Done | 1.5/4 | 37% |
| **Phase 4: Integration Points** | ⏳ Partially Done | 1/2 | 50% |
| **Phase 5: Cross-Cutting Updates** | ⏳ Partially Done | 2/3 | 67% |

**Key Accomplishments (Nov 17, 2025):**
- ✅ Tiers page created with full CRUD UI
- ✅ Create Tier page with Form/YAML toggle
- ✅ Simplified API Key creation with tier inheritance
- ✅ One-time API key display with copy/download
- ✅ Tier utility functions for user group lookup
- ✅ Mock data for tiers, groups, and MaaS models
- ✅ Navigation updated (Settings > Tiers)

**Next Up (Priority Order):**
1. ⏳ Phase 1.1: Add warning banner to Policies page
2. ⏳ Phase 2.2: API Key List Page Updates (remove Owner, add Tier column)
3. ⏳ Phase 2.3: API Key Details Page Updates (rename Policies tab to Tiers, add tier info)
4. ⏳ Phase 3.2: Create EditTier page and DeleteTierModal
5. ⏳ Phase 2.4: Tier Disassociation Handling

## Phase 1: Core Tiers Implementation (MVP)

### 1.1 Create New "Tiers" Page (Keep Policies Separate) ⚠️ PARTIALLY COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Large  
**Status:** ⚠️ **PARTIALLY COMPLETED** - November 17, 2025
**Missing:** Warning banner on Policies page not implemented yet  

**Changes Required:**
- Create new `Settings > Tiers` page alongside existing Policies
- **Keep existing Policies page** and add a pink/warning banner at top:
  - "This Policies feature might not be included in the final 3.2 release. For MaaS model access management, use the new Tiers page."
- Create new Tier data model (don't modify Policy):
  - No `type` field - Tiers are a single concept
  - Only `groups` in targets (remove `users` and `serviceAccounts`)
  - Only `models` in available assets (MaaS models only)
  - Remove `mcpServers`, `agents`, `vectorDatabases` entirely
  - Add `level` field (number) for tier priority
  - Add `apiKeyExpirationDays` field for default key expiration

**New Tier Type Definition:**

```typescript
export interface Tier {
  id: string;
  name: string;
  description: string;
  level: number; // Priority: higher number = higher tier (e.g., 100, 200, 300)
  status: 'Active' | 'Inactive';
  gitSource?: string; // For GitOps-managed tiers
  isReadOnly: boolean; // True for GitOps-managed tiers
  groups: string[]; // Kubernetes groups assigned to this tier
  models: string[]; // Model IDs (must be AI Assets / MaaS models)
  limits: {
    tokenLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    rateLimit?: {
      amount: number;
      period: 'minute' | 'hour' | 'day';
    };
    apiKeyExpirationDays?: number; // Default expiration for API keys
  };
  dateCreated: Date;
  createdBy: string;
  yaml?: string;
}
```

**Files to Create (New):**
- `src/app/Settings/Tiers/types.ts`
- `src/app/Settings/Tiers/Tiers.tsx`
- `src/app/Settings/Tiers/TierDetails.tsx`
- `src/app/Settings/Tiers/mockData.ts`
- `src/app/Settings/Tiers/components/` (all tier-related components)
- `src/app/Settings/Tiers/index.ts`

**Files to Update (Existing):**
- ⏳ `src/app/Settings/Policies/Policies.tsx` - Add pink warning banner (NOT DONE)
- ✅ `src/app/routes.tsx` - Add new tier routes (DONE)
- ✅ Left navigation - Add "Tiers" menu item under Settings (DONE)

**Policies Warning Banner:**
Add to top of Policies page (`src/app/Settings/Policies/Policies.tsx`):
```tsx
<Alert
  variant="warning"
  isInline
  title="Notice"
>
  This Policies feature might not be included in the final 3.2 release. For MaaS model access management, use the new <Link to="/settings/tiers">Tiers</Link> page.
</Alert>
```

**Navigation Update:**
- Add new nav item: Settings > Tiers
- Keep existing: Settings > Policies (with warning banner on page)
- Tooltip for Tiers: "Manage MaaS tiers, rate limits, and group access"

---

### 1.2 MaaS Model Handling ✅ RESOLVED

**Priority:** ✅ RESOLVED  
**Effort:** None - Already exists  
**Status:** ✅ **RESOLVED** - Already existed in prototype  

**Current State:**
- Making a model deployment available as an AI Asset automatically makes it a MaaS model
- This functionality already exists in the prototype via "Publish as AI Asset" action
- No additional tagging mechanism needed

**What Needs to Happen:**
- Tier model selector should only show models that are AI Assets
- Use existing AI Asset status to filter models in tier creation
- Add helper text in tier creation: "Only models published as AI Assets can be assigned to tiers"

**Files to Reference (already exist):**
- `src/app/GenAIStudio/AssetEndpoints/AssetEndpoints.tsx` - Shows AI Assets
- Model deployment actions already have "Publish as AI Asset"

**No additional implementation needed for MaaS tagging.**

---

### 1.3 Create Tier Page (Full Page Form, Not Modal) ✅ COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Medium  
**Status:** ✅ **COMPLETED** - November 17, 2025  

**Changes Required:**

**Make it a Full Page (Not Modal):**
- Route: `/settings/tiers/create`
- Full page form with back button
- Add toggle switch at TOP of page: "View as: [Form] / [YAML]"
- Toggle switches between form view and YAML editor
- Both views edit the same data

**Form Fields:**
- **Name** (required)
- **Description** (optional)
- **Level** (required) - Number input for tier priority
  - Helper text: "Higher numbers indicate higher priority. Users in multiple tiers will use the highest level."
  - Example values: 100 (Standard), 200 (Premium), 300 (Enterprise)
- **Groups** (required) - Multi-select
  - Only Groups, no Users or Service Accounts
  - Helper text: "This tier will apply to all users in these groups"
- **Models** (required) - Multi-select
  - Only show models that are AI Assets (MaaS models)
  - Helper text: "Only models published as AI Assets can be assigned"
  - Empty state: "No AI Asset models available. Publish a model deployment as an AI Asset first."
- **Token Limit** (optional) - Amount + Period
  - Helper text with examples: "Example: 50,000 tokens per hour for standard tier"
- **Rate Limit** (optional) - Amount + Period
  - Helper text with examples: "Example: 1,000 requests per minute for standard tier"
- **API Key Expiration** (optional) - Number of days
  - Helper text: "API keys created by users in this tier will expire after this period"
  - Default: 90 days
  - Allow "Never" (0 or null)

**Remove:**
- Time limit (not in requirements)
- MCP Servers, Agents, Vector Databases
- Users and Service Accounts targeting
- Quota renewal schedule (move to post-MVP)
- Over-limit behavior (move to post-MVP)

**Files to Create:**
- `src/app/Settings/Tiers/CreateTier.tsx` (full page, not modal)
- `src/app/Settings/Tiers/EditTier.tsx` (full page)
- `src/app/Settings/Tiers/components/TierForm.tsx`
- `src/app/Settings/Tiers/components/TierYAMLEditor.tsx`

---

### 1.4 Tier List Page Updates ✅ COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Small  
**Status:** ✅ **COMPLETED** - November 17, 2025  

**Changes Required:**

**Update Table Columns:**
- Remove "Type" column
- Update "Targets" column to show only Groups
- Update "Rules" column to show Token limit, Rate limit, and API key expiration
- Add "Default" column or badge for default tier

**Update Row Actions:**
- Keep: View details, Edit tier, Delete tier
- Add: Set as default (if not already default)
- For GitOps-managed tiers: Disable Edit and Delete, show view-only

**Add Helper Content:**
- Add info banner at top of page: "Tiers control which MaaS models users can access via API keys based on their group membership. Users in multiple groups inherit the tier with the highest limits."
- Add "Learn more" link to documentation

**Files to Update:**
- `src/app/Settings/Tiers/Tiers.tsx`

---

## Phase 2: API Key Tier Integration (MVP)

### 2.1 API Key Creation - Tier Inheritance ✅ COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Large  
**Status:** ✅ **COMPLETED** - November 17, 2025  

**Changes Required:**

**Remove Manual Configuration:**
- Remove "Limits and Policies" section from Create API Key modal
- Remove "AI Asset Access" multi-selects
- API keys inherit everything from user's tier(s)

**Simplify Create Form:**
- Keep only:
  - Name (required)
  - Description (optional)
  - Expiration date (auto-filled from tier, allow override)
- Show tier information:
  - Display user's tier(s) with badge
  - Show inherited limits
  - Show accessible models count

**Auto-detect User's Tier (Highest Only):**
- Mock function to get user's groups
- Look up tiers assigned to those groups
- If multiple tiers, use highest tier based on `level` field (higher number = higher tier)
- Display only the highest tier in modal (users cannot choose)
- Show tier level badge: "Level 200 - Premium Tier"

**One-Time Key Display:**
- After creation, show full key in modal with:
  - Large, prominent display
  - Copy button
  - Warning: "This is the only time you will see this key. Copy it now."
  - Option to download as .txt file
- Don't show full key in list or details pages afterward

**Empty State Handling:**
- If user has no tiers assigned:
  - Disable "Create API key" button
  - Show empty state: "You have no access to MaaS models"
  - Helper text: "Contact your administrator to be added to a tier"

**Files to Update:**
- `src/app/Settings/APIKeys/components/CreateAPIKeyModal.tsx`
- `src/app/Settings/APIKeys/APIKeys.tsx`
- Create new `src/app/utils/tierUtils.ts` for tier lookup logic

---

### 2.2 API Key List Page Updates ⏳ NOT STARTED

**Priority:** Critical (MVP)  
**Effort:** Medium  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**

**Update Table Columns:**
- Remove "Owner" column (always current user in consumption view)
- Add "Tier" column showing tier name and level (e.g., "Premium Tier (L200)")
- Keep: Name, Status, API Key (masked), Last used, Expiration date
- Update "Assets" column to show only model count (no MCP, agents, vector DBs)
- Show only highest tier (not multiple tiers)

**Update Status Column:**
- Add new status: "Inactive - Tier deleted"
- Color code: Grey with info icon
- Tooltip: "Your tier was deleted. Contact administrator for access."

**Empty State:**
- If user has no tiers:
  - Show empty state illustration
  - Title: "You have no access to MaaS models"
  - Description: "Contact your administrator to be added to a tier and start creating API keys"
  - Remove "Create API key" button

**Files to Update:**
- `src/app/Settings/APIKeys/APIKeys.tsx`
- `src/app/Settings/APIKeys/types.ts`
- `src/app/Settings/APIKeys/mockData.ts`

---

### 2.3 API Key Details Page Updates ⏳ NOT STARTED

**Priority:** High (MVP)  
**Effort:** Medium  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**

**Details Tab:**
- Add "Tier" field showing tier name with link to tier details (if user is admin)
- Show tier level badge (e.g., "Level 200 - Premium Tier")
- Add "Inherited limits" section:
  - Token limit: X per period
  - Rate limit: X per period
- Keep: Name, Description, API key (masked), Date created, Last used, Expiration date

**Assets Tab:**
- Remove MCP Servers, Vector Databases, Agents sections
- Keep only "Models" section
- Show only AI Asset models from user's tier
- If tier deleted/disassociated: Show empty state "No models available - tier disassociated"

**Metrics Tab:**
- Keep as-is (good design)

**Tiers Tab (Rename from "Policies" Tab):**
- Rename tab from "Policies" to "Tiers"
- Show tier information instead of generic policies
- Display tier's level, limits, rules, and configuration
- **Empty state location**: When user has no tier assigned:
  - Title: "No tier assigned"
  - Message: "You have no access to MaaS models. Contact your administrator to be added to a tier."

**Settings Tab:**
- Keep delete functionality
- Add note: "Deleting this key cannot be undone"

**Files to Update:**
- `src/app/Settings/APIKeys/APIKeyDetails.tsx`
- `src/app/Settings/APIKeys/components/TiersTab.tsx` (rename from PoliciesTab)
- `src/app/Settings/APIKeys/components/DetailsTab.tsx`
- `src/app/Settings/APIKeys/components/AssetsTab.tsx`

---

### 2.4 Tier Disassociation Handling ⏳ NOT STARTED

**Priority:** Should Have  
**Effort:** Small  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**

**When Tier is Deleted:**
- API keys become "disassociated" from the tier
- Show status as "Active" but with info badge: "Tier disassociated"
- Add warning in API Key Details: "Your tier has been deleted. Contact administrator."
- Keys continue to function but show warnings

**In Tier Deletion Flow:**
- Before deleting tier, show warning modal:
  - "Deleting this tier will affect X API keys in Y groups"
  - List affected groups
  - Confirmation required
- After deletion, affected keys show disassociation status

**Files to Update:**
- `src/app/Settings/Tiers/components/DeleteTierModal.tsx`
- `src/app/Settings/APIKeys/types.ts` - Add disassociation status
- `src/app/Settings/APIKeys/APIKeys.tsx` - Handle disassociated display
- `src/app/Settings/APIKeys/APIKeyDetails.tsx` - Show warnings

---

## Phase 3: Enhanced Features (Should Have)

### 3.1 UI/YAML Toggle for Tiers ✅ COMPLETED

**Priority:** Should Have  
**Effort:** Medium  
**Status:** ✅ **COMPLETED** - November 17, 2025 (Implemented in Create Tier page)  

**Changes Required:**

**Add Toggle to Tier Details:**
- Add tab: "YAML" (alongside Details tab)
- Show full YAML representation of tier
- For GitOps-managed tiers: Read-only
- For UI-created tiers: Allow editing in YAML
- Add "Copy to clipboard" button

**Add Toggle to Create/Edit Tier Modal:**
- Option 1: Button to "View as YAML" opens a modal with YAML preview
- Option 2: Toggle switch to flip entire modal between Form and YAML views
- Recommendation: Use Option 1 for MVP (simpler UX)

**Files to Update:**
- `src/app/Settings/Tiers/TierDetails.tsx`
- Create `src/app/Settings/Tiers/components/TierYAMLTab.tsx`

---

### 3.2 Tier Edit and Delete ⏳ NOT STARTED

**Priority:** Should Have (already implemented for Policies)  
**Effort:** Medium  
**Status:** ⏳ **NOT STARTED** - Row actions exist in table, but EditTier.tsx and DeleteTierModal.tsx components don't exist yet  

**Changes Required:**
- Already exists in prototype, just needs:
  - Confirmation for delete: "Deleting this tier will affect X users in Y groups. Their API keys will be marked as inactive."
  - Show count of affected users/keys before delete
  - Disable delete if tier is default
  - Disable edit/delete for GitOps-managed tiers

**Files to Create:**
- `src/app/Settings/Tiers/EditTier.tsx` (full page like CreateTier)
- `src/app/Settings/Tiers/components/DeleteTierModal.tsx` (confirmation modal)

**Files to Update:**
- `src/app/routes.tsx` - Add edit tier route
- `src/app/Settings/Tiers/Tiers.tsx` - Update Edit action to navigate to edit page

---

### 3.3 Helper Content and Samples ⏳ NOT STARTED

**Priority:** Nice to Have  
**Effort:** Small  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**

**Add to Create/Edit Tier Modal:**
- Add "Examples" link next to Token/Rate limit fields
- Opens popover with sample configurations:
  - Free Tier: 10,000 tokens/hour, 100 requests/minute, 30-day keys
  - Standard Tier: 50,000 tokens/hour, 1,000 requests/minute, 90-day keys
  - Premium Tier: 500,000 tokens/hour, 10,000 requests/minute, 365-day keys
  - Enterprise Tier: Unlimited, 100,000 requests/minute, No expiration

**Add to Tier List Page:**
- "Getting Started" banner on first visit:
  - "New to MaaS tiers? Start by creating a default tier with recommended settings."
  - Button: "Create default tier" (auto-fills form with standard tier template)
  - Dismiss button

**Files to Update:**
- `src/app/Settings/Tiers/components/CreateTierModal.tsx`
- `src/app/Settings/Tiers/Tiers.tsx`

---

## Phase 4: Integration Points (Nice to Have)

### 4.1 View Endpoint Popover Enhancement ⏳ NOT STARTED

**Priority:** Nice to Have  
**Effort:** Medium  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**

**Update View Endpoint Popover:**
- Currently: "View Endpoint" action in table shows a popover with endpoint info
- Add to popover:
  - **Tier selector dropdown** - Shows user's available tiers (or highest tier if only one)
  - **"Generate API Key" button** - Only shows if no key exists for this model+tier combination
  - When clicked:
    - Opens simplified key creation flow
    - Pre-fills tier and model
    - User provides only: Name (required)
    - Shows one-time key display after creation
  - If key already exists:
    - Show "Existing key: sk-1234..." with copy button
    - Button to "Create another key"

**Files to Update:**
- `src/app/GenAIStudio/AssetEndpoints/AssetEndpoints.tsx`
- Create or update endpoint popover component
- Create `src/app/GenAIStudio/AssetEndpoints/components/GenerateKeyInline.tsx`

---

### 4.2 Default Tier (Not "Free Tier") ✅ COMPLETED

**Priority:** Nice to Have  
**Effort:** Medium  
**Status:** ✅ **COMPLETED** - November 17, 2025 (Included in mock data with isDefault flag)  

**Changes Required:**

**Auto-create on first load:**
- When no tiers exist, create a "Default Tier" automatically (NOT "Free Tier")
- Configuration:
  - Name: "Default Tier"
  - Description: "Standard tier with access to MaaS models and baseline rate limits"
  - Level: 100
  - Groups: All authenticated users (or a "default-users" group)
  - Models: All AI Asset models
  - Token limit: 10,000/hour
  - Rate limit: 100/minute
  - API key expiration: 90 days
  - Status: Active

**Add indicator:**
- Badge on tier list: "Default" (if it's the default/base tier)
- Can be deleted (if not in use)
- Can be edited to change limits

**Files to Update:**
- `src/app/Settings/Tiers/mockData.ts`
- `src/app/Settings/Tiers/Tiers.tsx`

---

## Phase 5: Cross-Cutting Updates

### 5.1 Update Navigation Labels ✅ COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Minimal  
**Status:** ✅ **COMPLETED** - November 17, 2025  

**Current:**
- Settings > Policies
- Settings > API Keys (but currently in Gen AI Studio)

**Proposed:**
- Settings > Tiers (or "MaaS Admin" or "MaaS Tiers")
- Gen AI Studio > API Keys (keep as-is)

**Alternative Consideration:**
Should we have:
- Settings > Policies (for generic Kuadrant policies)
- Settings > Tiers (for MaaS-specific tier management)

**Question for stakeholders:** Do we keep both Policies and Tiers, or replace Policies entirely with Tiers?

---

### 5.2 Update Documentation and Help Text ⏳ NOT STARTED

**Priority:** High  
**Effort:** Medium  
**Status:** ⏳ **NOT STARTED**  

**Changes Required:**
- Update all page descriptions to reflect tier-based model
- Add contextual help throughout tier and API key UIs
- Update tooltip text on all form fields
- Add "Learn more" links to external documentation

---

### 5.3 Mock Data Updates ✅ COMPLETED

**Priority:** Critical (MVP)  
**Effort:** Medium  
**Status:** ✅ **COMPLETED** - November 17, 2025  

**Changes Required:**

Create comprehensive mock data for:

**Tiers:**
- Free Tier (default)
- Standard Tier
- Premium Tier
- Enterprise Tier
- GitOps-managed tier (read-only)
- Inactive tier (for testing deleted tier scenarios)

**Models:**
- Tag subset as MaaS models
- Examples: granite-3.1b-maas, llama-7b-maas, gpt-oss-20b-maas

**Groups:**
- dev-team (assigned to Standard Tier)
- premium-customers (assigned to Premium Tier)
- research-team (assigned to Enterprise Tier)
- no-tier-users (not assigned to any tier, for empty state testing)

**API Keys:**
- Keys with various tiers
- Keys with deleted tiers (inactive)
- Keys at different usage levels
- Expired keys

**Files to Update:**
- `src/app/Settings/Tiers/mockData.ts`
- `src/app/Settings/APIKeys/mockData.ts`
- `src/app/AIHub/Deployments/mockData.ts` (if it exists, or create it)

---

## Implementation Sequence

### Sprint 1: Core Foundation ✅ COMPLETED
1. ✅ Phase 1.1: Create Tiers Page (COMPLETED - Nov 17)
2. ✅ Phase 1.2: MaaS Model Tagging (RESOLVED - Already existed)
3. ✅ Phase 1.3: Create Tier Page (COMPLETED - Nov 17)
4. ✅ Phase 1.4: Tier List Page Updates (COMPLETED - Nov 17)
5. ✅ Phase 5.3: Mock Data Updates (COMPLETED - Nov 17)
6. ✅ Phase 5.1: Update Navigation Labels (COMPLETED - Nov 17)

### Sprint 2: API Key Integration 🔄 IN PROGRESS
7. ✅ Phase 2.1: API Key Tier Inheritance (COMPLETED - Nov 17)
8. ⏳ Phase 2.2: API Key List Updates (NOT STARTED)
9. ⏳ Phase 2.3: API Key Details Updates (NOT STARTED)
10. ⏳ Phase 2.4: Tier Disassociation Handling (NOT STARTED)

### Sprint 3: Enhanced Features ⏳ PARTIALLY DONE
11. ✅ Phase 3.1: UI/YAML Toggle (COMPLETED - Nov 17)
12. ⏳ Phase 3.2: Tier Edit/Delete (PARTIALLY DONE - Row actions exist)
13. ⏳ Phase 3.3: Helper Content (NOT STARTED)
14. ✅ Phase 4.2: Default Tier (COMPLETED - Nov 17)

### Sprint 4: Polish & Nice-to-Haves ⏳ NOT STARTED
15. ⏳ Phase 5.2: Documentation Updates (NOT STARTED)
16. ⏳ Phase 4.1: AAE Quick Key Creation (NOT STARTED)

---

## Testing Scenarios

### Admin Tier Management
- [ ] Create a new tier with groups, models, and limits
- [ ] Edit an existing tier's limits
- [ ] Delete a tier and verify cascading effects on API keys
- [ ] View GitOps-managed tier (read-only)
- [ ] Set a tier as default
- [ ] Create tier with no MaaS models (empty state)

### Developer API Key Management
- [ ] Create API key as user with tier assigned
- [ ] Create API key as user with multiple tiers (verify highest tier used)
- [ ] Attempt to create key as user with no tier (empty state)
- [ ] View key details and inherited limits
- [ ] Revoke an API key
- [ ] View models available via tier
- [ ] Handle deleted tier scenario

### Cross-Functional
- [ ] Tag model as MaaS in deployment wizard
- [ ] View MaaS models in tier creation
- [ ] Filter API key assets to show only MaaS models from tier
- [ ] Navigate between tiers, API keys, and asset endpoints
- [ ] Toggle between UI and YAML views

---

## Open Questions for Stakeholders

1. **Naming:** Should the nav item be "Tiers", "MaaS Admin", or "MaaS Tiers"?
2. **Scope:** Do we keep Policies for general Kuadrant use cases and add Tiers for MaaS, or replace Policies entirely?
3. **Multiple Tiers:** Confirm "highest tier" is defined by highest token limit
4. **Service Accounts:** Should tiers support service accounts, or groups only?
5. **API Key Revocation:** Confirm limitation that only all keys can be revoked, not individual
6. **Tier Deletion:** Should API keys be auto-revoked or just marked inactive when tier is deleted?
7. **Default Tier:** Should we auto-create a default "Free Tier" on first load?
8. **MCP Assets:** Confirm MCP is out of scope for Tiers entirely in MVP
9. **GitOps Detection:** What's the source of truth for detecting GitOps-managed tiers?

---

## Success Metrics

- Number of tiers created
- Number of API keys created
- Time to create first tier (target: < 2 minutes)
- Time to create first API key (target: < 30 seconds)
- User adoption: % of admins who create at least one tier
- User adoption: % of developers who create at least one API key
- Reduction in support tickets about MaaS access
- User satisfaction score for tier and key management UIs

---

## Documentation Needs

1. Admin guide: How to create and manage tiers
2. Developer guide: How to create and use API keys
3. Architecture doc: Tier inheritance model
4. API reference: Tier and API Key CRUD operations
5. Migration guide: If moving from Policies to Tiers for existing users

---

## What Remains to be Done - Summary

### High Priority (MVP Blockers)

1. **Warning Banner on Policies Page** (Phase 1.1 - 5 min)
   - Add Alert component to top of `src/app/Settings/Policies/Policies.tsx`
   - Link to new Tiers page in the message

2. **API Key List Page Updates** (Phase 2.2 - 1-2 hours)
   - Remove "Owner" column from table
   - Add "Tier" column showing tier name and level
   - Update mock data to include tier references in API keys
   - Handle "Inactive - Tier deleted" status display

3. **API Key Details Page Updates** (Phase 2.3 - 2-3 hours)
   - Rename "Policies" tab to "Tiers" tab
   - Add tier information to Details tab (tier name, level, inherited limits)
   - Update Assets tab to only show models (remove MCP, agents, vector DBs sections)
   - Create or update TiersTab component (rename from PoliciesTab)

4. **Edit Tier Page** (Phase 3.2 - 2-3 hours)
   - Create `src/app/Settings/Tiers/EditTier.tsx` (similar to CreateTier)
   - Add route to `routes.tsx`
   - Update row action in Tiers.tsx to navigate to edit page
   - Reuse TierForm component with pre-filled data

5. **Delete Tier Modal** (Phase 3.2 - 1 hour)
   - Create `src/app/Settings/Tiers/components/DeleteTierModal.tsx`
   - Show warning about affected API keys and groups
   - Add confirmation step
   - Disable delete for default tiers

### Medium Priority (Should Have)

6. **Tier Disassociation Handling** (Phase 2.4 - 2-3 hours)
   - Update API key types to support disassociated status
   - Show appropriate warnings when tier is deleted
   - Update tier deletion flow to warn about affected keys

7. **Helper Content and Samples** (Phase 3.3 - 1-2 hours)
   - Add example tier configurations (popover or modal)
   - Add "Getting Started" banner on first visit
   - Add helper text throughout tier creation form

8. **Documentation Updates** (Phase 5.2 - 2-3 hours)
   - Update all page descriptions
   - Add contextual help throughout UIs
   - Update tooltip text on form fields
   - Add "Learn more" links

### Low Priority (Nice to Have)

9. **View Endpoint Popover Enhancement** (Phase 4.1 - 3-4 hours)
   - Add tier selector to endpoint popover
   - Add "Generate API Key" button
   - Implement inline key creation flow
   - Show existing keys in popover

### Estimated Total Remaining Work
- **MVP Critical Path:** ~8-10 hours
- **Should Have Features:** ~5-7 hours
- **Nice to Have Features:** ~3-4 hours
- **Total:** ~16-21 hours of development work

