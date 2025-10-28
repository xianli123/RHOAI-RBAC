# Tasks

This file is continuously updated to include suggested and queued tasks.

## Remaining tasks

- Add the ability to Delete an API key with a caution that this is irreversible and make them type the name again
- Add the ability to connect an external model provider's API endpoint as an AI Asset potentially
- Column for "last used" in the API Keys list to show the last time it was used
- Column for "status" of the key, whether it's active or revoked or suspended or throttled or whatever
- Add a show/eye icon to reveal the API key, copy icon too
- Integration of multiple API Keys in the AI Assets area
- Add baseline Tiers out of the box (e.g. Tier 0, Tier 1)
- Add "Make available as AI Asset" to the Model Deployments area
- Show quota total remaining for a key
- Add support for throttling after the quota
- In the Endpoints popover

## Tasks from Jira

Based on Jira issues RHOAISTRAT-638, RHOAIUX-996, RHOAISTRAT-639, RHAIRFE-151, RHAIRFE-608, RHOAISTRAT-703, RHAIRFE-244, RHAIRFE-138, and RHOAISTRAT-650:

### Platform Admin Experience (RHOAISTRAT-638, RHAIRFE-138, RHOAIUX-996)
1. **Tenant/User Management Dashboard** - Interface to onboard tenants, assign quotas, and manage user access
2. **Model Catalog Management** - Add, remove, and update models in the public catalog with immediate availability
3. **System-Wide Monitoring Dashboard** - Real-time view of platform health, total requests, token consumption, error rates
4. **System-Level Policies Configuration** - Interface for default quota limits, access controls, and system policies
5. **RBAC Management Interface** - Create/manage roles (model-consumer, model-owner), assign users/groups to roles, visualize permissions per model
6. **Audit Trail Visualization** - Clear audit trail of changes to model permissions and system configurations

### AI Engineer Experience - AI Available Assets (RHAIRFE-151, RHAIRFE-608)
1. **AI Available Assets Page** - Unified discovery page for models and MCP servers with tabs for each asset type
2. **Model Endpoint Discovery** - Display internal/external API endpoints, service tokens, LLS registration status, use cases, and actions
3. **MCP Server Endpoint Discovery** - Display MCP server name, source, endpoints, tools, registration status, use cases
4. **LLS Registration Workflow** - Register models/MCP servers with Llama Stack Server, wizard to configure LLS in project namespace
5. **AI Playground Integration** - Token pass-through from assets to playground for seamless interaction
6. **MaaS Model Toggle in Deployments** - Admin toggle to make model available as MaaS (globally accessible across projects)
7. **Project/Namespace Scoping** - Filter assets by selected project, with future support for global cluster-wide view
8. **Add Asset Functionality** - "Add Asset" button to add external models, model deployments, or MCP servers

### API Keys Management (RHAIRFE-244, RHAIRFE-138)
1. **API Keys List Page** - Table with columns for Name, Status, API Key (masked), Assets, Owner, Last Used, Expiration Date
2. **Create API Key Modal** - Form with Name, Description, Owner selection, Limits/Policies section (token/rate limits, budget, expiration)
3. **API Key Details Page** - Five tabs: Details, Assets, Metrics, Policies, Settings
4. **Details Tab** - Display key metadata (name, description, dates, key value with copy)
5. **Assets Tab** - Collapsible sections for Models, MCP Servers, Vector Databases, Agents with endpoints
6. **Metrics Tab** - Charts for Total Requests, Success Rate, Total Tokens, Total Cost with time range selector and Perses link
7. **Policies Tab** - Table of applied policies with Name, ID, Description, and Type columns (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)
8. **Settings Tab** - Danger zone with delete functionality and confirmation modal
9. **API Key Actions** - Dropdown menu with "View details" and "Delete API key" options
10. **Status Labels** - Active (green), Expired (red), Disabled (grey)
11. **ISV Key Storage** - Store third-party ISV keys for MCP server authentication (GitHub, Atlassian, Asana, etc.)

### Policies Management (RHAIRFE-244, RHOAISTRAT-639)
1. **Policies List Page** - Table with Name, Description, Status, Targets, Rules columns
2. **Create Policy Modal** - Fields for Name, Description, Available Assets (Models/MCP dropdowns), Limits (Token/Rate/Time), Targets (Groups/Users/Service Accounts)
3. **Policy Details Page** - Details tab displaying all policy configuration
4. **Policy Actions** - View, Edit, Activate/Deactivate, Delete
5. **Policy Types** - Support for AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy (Kuadrant.io types)
6. **Rate Limiting Enforcement** - Token-based rate limiting, request-based rate limiting
7. **RBAC Integration** - Model-level RBAC, user/group access controls

### Observability & Monitoring (RHOAISTRAT-650)
1. **Unified Platform Dashboard** - Cluster-level and model-level metrics with cross-runtime consistency
2. **Model Inventory Overview** - Table showing all deployed models with status, resources, performance metrics
3. **Model-Level Performance Analysis** - Per-model request volumes, latency distributions, error rates, resource consumption
4. **Platform Health Summary** - Overall error rates, service availability, performance KPIs, alert status
5. **API Key-Filtered Dashboard** - AI Engineer view filtered by specific API keys showing performance and usage
6. **Usage Tracking Metrics** - Requests per time period, tokens per user/group/key, top consumers
7. **Reference Grafana Implementation** - Initial delivery as Grafana dashboards, future embedded UI
8. **Perses Dashboard Integration** - Link to view detailed dashboards in Perses

### MaaS Integration (RHOAISTRAT-639, RHAIRFE-608)
1. **API Gateway Support** - Token validation, rate limiting, security enforcement through RHCL or alternative gateways
2. **MaaS Dev Preview Toggle** - Checkbox in Deploy Model Wizard: "Make this deployment available globally for models as a service"
3. **External Model Provider Support** - Ability to add external AI providers (OpenAI, Anthropic) as AI Assets
4. **Usage Quota Management** - Track and enforce token consumption limits per user/key
5. **Global vs Project Scope** - MaaS models visible globally across all projects, non-MaaS scoped to namespace
6. **Generate/Regenerate API Keys** - Feature flag for API key generation in model endpoint modals
7. **Chargeback/Cost Tracking** - Track costs per token, per user, per model for billing purposes

## Remaining Jira-based Design TODOs

### ✅ IMPLEMENTED (Present in Prototype)

#### AI Available Assets Page (RHAIRFE-151, RHAIRFE-608)
- ✅ AI Available Assets page with Models and MCP Servers tabs (`/gen-ai-studio/asset-endpoints`)
- ✅ Model endpoint discovery with internal/external endpoints, tokens, and copyable values
- ✅ MCP server endpoint discovery with tools and descriptions
- ✅ Project/namespace scoping with project selector dropdown
- ✅ "Add Asset" button functionality
- ✅ Search and filter capabilities for models and MCP servers
- ✅ Integration with AI Playground (token pass-through)
- ✅ Status indicators (registered vs not-registered for LLS)

#### API Keys Management (RHAIRFE-244, RHAIRFE-138)
- ✅ API Keys list page (`/gen-ai-studio/api-keys`) with proper column structure
- ✅ Status column with Active/Expired/Disabled labels (green/red/grey)
- ✅ Last Used column with relative time display
- ✅ Expiration Date column
- ✅ API Key column with masked values (sk-1234...)
- ✅ Assets column showing badge counts for Models, MCP, Vector DBs, Agents
- ✅ Owner column displaying owner type (User/Group/Service Account)
- ✅ Actions dropdown with "View details" and "Delete API key" options
- ✅ Create API Key modal with Name, Description, Owner, Limits, AI Asset Access sections
- ✅ API Key Details page with five tabs (Details, Assets, Metrics, Policies, Settings)
- ✅ Details tab with description list of key metadata
- ✅ Assets tab with collapsible sections for Models, MCP Servers, Vector DBs, Agents
- ✅ Metrics tab with usage cards (Total Requests, Success Rate, Total Tokens, Total Cost) and time range selector
- ✅ Policies tab with table showing Policy Name, ID, Description, Type
- ✅ Settings tab with Danger Zone and delete confirmation modal
- ✅ Delete API Key modal following PatternFly 6 patterns with name confirmation

#### Policies Management (RHAIRFE-244, RHOAISTRAT-639)
- ✅ Policies list page (`/settings/policies`) with proper table structure
- ✅ Columns for Name, Status, Targets (Groups/Users/Service Accounts), Rules
- ✅ Create Policy modal with Name, Description, Available Assets, Limits, Targets sections
- ✅ Policy Details page (`/settings/policies/:id`) with Details tab
- ✅ Policy actions: View details, Edit, Activate/Deactivate, Delete
- ✅ Badge displays for target counts and rule summaries

#### Model Deployments (RHOAISTRAT-639, RHAIRFE-608)
- ✅ Deploy Model Wizard (`/ai-hub/deployments/deploy`)
- ✅ "Make available as AI asset" checkbox (Tech Preview label)
- ✅ "Make available globally for models as a service" checkbox (Developer Preview label)
- ✅ Advanced settings section in wizard
- ✅ Deployments list page (`/ai-hub/deployments`)

#### Observability (RHOAISTRAT-650)
- ✅ Observe & Monitor Dashboard (`/observe-monitor/dashboard`) with multiple tabs
- ✅ Usage (MaaS) tab with model deployment table
- ✅ Model-level metrics display (requests, latency, error rates)
- ✅ Charts for usage trends and top consumers
- ✅ API Key column in model deployment table
- ✅ MaaS badge/tag on deployments
- ✅ Platform health metrics (Total Requests, Error Rate, Avg Latency, Total Cost, Total Tokens)

### ✅ Completed work items (All items completed!)

#### API Keys (4/4 - RHAIRFE-244)
- ✅ Added "Personal Key" as first item in API Keys List  
- ✅ Added expired status key to API keys list
- ✅ Added "Disable/Enable API key" action to kebab menu
- ✅ Added "Usage Example" section with curl sample in API Key Details

#### AI Playground (1/1)
- ✅ Added "API key" dropdown to AI Playground sidebar with "Playground key (free)" as default

#### Policies (11/11 - RHAIRFE-244, RHOAISTRAT-639)
- ✅ Added "Type" column to Policies table with Kuadrant.io types (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)
- ✅ Added "Git source" field to Policy Details tab with hyperlink or "None"
- ✅ Added info alert for git-managed policies  
- ✅ Made action kebab menu openable with "View details", "Disable/Enable policy", "Edit policy", and "Delete policy" options
- ✅ Added "Edit policy" modal (editing disabled for git-managed policies)
- ✅ Added "Delete policy" confirmation modal with name verification
- ✅ Displayed number of keys that the policy applies to in Details page
- ✅ Added "YAML" tab to Policy Details page displaying full Kuadrant.io YAML
- ✅ Displayed rate limit and quota for RateLimitPolicy on Details page
- ✅ Added "Quota renewal schedule" setting for RateLimitPolicies with modal for configuration
- ✅ Added "Over-limit behavior" setting for RateLimitPolicies (Hard/Soft with throttle percentage)

#### AI Assets (6/6)
- ✅ Changed column from "Model deployment name" to "Model name"
- ✅ Added "Model ID" column after "Model name"
- ✅ Added action kebabs with "Remove asset" option to AI Assets list
- ✅ Updated "Add asset" modal to support Internal (on-cluster) or External model providers
- ✅ External providers include OpenAI and Anthropic with API key input and model selection
- ✅ Removed numbers from AI Assets tab titles (Models, MCP servers)
- ✅ Removed "Models as a service" tab entirely along with its list

#### Model Deployments (2/2 - RHAIRFE-151)
- ✅ Added "Publish as AI Asset" option to Model Deployments kebab menu
- ✅ Removed "Make this deployment available globally for models as a service" option and "Tech Preview" badge from Deploy wizard

### Summary
**All 24 work items have been successfully completed!**

#### Later
- ❌ **Micro UI for Quick Key Creation** - No embedded key creation widget in AI Playground or AI Available Assets
- ❌ **Per-Asset Key Generation** - No quick "Generate Key for this Asset" action on asset cards
- ❌ **Quality Tiers Implementation** - No tier-based policies (Tier 0, Tier 1, etc.)
- ❌ **Rate Limiting Enforcement** - Rate limits displayed but not enforced
- ❌ **Chargeback/Cost Calculation** - Cost metrics shown but no actual cost calculation engine
- ❌ **Quota Management UI** - No interface to set/view/manage quotas for users/groups/keys
- ❌ **Admin "Make Available as MaaS" Toggle** - Toggle exists in wizard but no way to edit existing deployments
